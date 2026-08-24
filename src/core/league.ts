/**
 * The league contract.
 *
 * Nothing in this file knows what basketball is. Every league — NBA, NCAAM,
 * NFL, MLB, NHL, a European soccer league — implements `LeagueModule`, and the
 * app renders leagues it has never heard of.
 *
 * The rule: if you ever write `if (league === 'nba')` outside of /leagues,
 * something belongs in this contract that isn't here yet.
 */

/* ============================================================
   MONEY
   ============================================================ */

/**
 * Integer US dollars. Branded so a raw number can't be passed by accident.
 *
 * Cap math on floats drifts: the HTML prototype stores payroll as millions
 * with one decimal, and summing 15 of those against an apron line is already
 * off by enough to flip a team's status. Store dollars as integers, format at
 * the edge.
 */
export type USD = number & { readonly __brand: 'USD' };

export const usd = (n: number): USD => Math.round(n) as USD;
export const millions = (m: number): USD => usd(m * 1_000_000);
export const addUSD = (...xs: USD[]): USD => usd(xs.reduce((a, b) => a + b, 0));

/** "$154.6M" / "$14,105,000" / "-$8.2M" */
export function formatUSD(v: number, opts: { compact?: boolean } = {}): string {
  const compact = opts.compact ?? true;
  const sign = v < 0 ? '-' : '';
  const abs = Math.abs(v);
  if (!compact) return `${sign}$${abs.toLocaleString('en-US')}`;
  if (abs >= 1_000_000_000) return `${sign}$${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1_000_000) return `${sign}$${(abs / 1e6).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${Math.round(abs / 1e3)}K`;
  return `${sign}$${abs}`;
}

/* ============================================================
   IDENTITY
   ============================================================ */

export type SportId = 'basketball' | 'football' | 'baseball' | 'hockey' | 'soccer';

/** Registry-derived union lives in /leagues; core stays open. */
export type LeagueId = string;

/** Canonical season key. Single-year leagues use "2026"; split-year use "2025-26". */
export type SeasonId = string;

/** Where a figure came from. Required on anything shown as fact (§6.9). */
export interface SourceRef {
  provider: string;
  url?: string;
  retrievedAt: string;
  /** `fixture` renders with the sample-data stamp; never present it as reported. */
  confidence: 'fixture' | 'reported' | 'official';
}

/* ============================================================
   ECONOMICS — the part that generalizes
   ============================================================ */

/**
 * Every league's money system reduces to the same four pieces:
 *
 *   thresholds  ordered lines with consequences attached
 *   position    what this org has committed against them
 *   obligations money owed that isn't on the active roster
 *   constraints rules that switch on and off depending on the band you're in
 *
 * NBA: cap / tax / apron 1 / apron 2, with aggregation and the MLE gated by band.
 * NFL: one hard cap plus a cash spending floor, with dead money and void years
 *      doing most of the damage.
 * MLB: four escalating CBT tiers, all soft, with a draft-pick penalty at the top.
 * NCAAM: a rev-share cap plus disclosed NIL — which is why the same rail works.
 */

export type Severity = 'floor' | 'neutral' | 'caution' | 'warn' | 'hard';

export interface Threshold {
  id: string;
  /** Full label. "First apron" */
  label: string;
  /** Mobile label, ≤ 10 chars. "1st apron" */
  short: string;
  value: USD;
  severity: Severity;
  /** What crossing it costs, one clause. Shown on hover/tap. */
  consequence?: string;
}

export interface Obligation {
  id: string;
  /** "Dead money" / "Void years" / "Retained salary" / "Buyouts" */
  label: string;
  amount: USD;
  note?: string;
}

export interface EconomicPosition {
  /** The figure measured against the thresholds. */
  committed: USD;
  /** Contracts included in `committed`. */
  contractCount: number;
  obligations: Obligation[];
  season: SeasonId;
  source: SourceRef;
}

/** A rule that is on, restricted, or off given where the org sits. */
export interface Constraint {
  id: string;
  /** "Mid-level exception" */
  label: string;
  /** "$14.1M" | "Unavailable" | "Prohibited" | "2 remaining" */
  value: string;
  tone: 'ok' | 'limited' | 'blocked';
}

export interface QuickStat {
  label: string;
  value: string;
  tone?: 'neutral' | 'good' | 'bad';
}

export interface EconomicsModule {
  /** Heading over the rail. "Payroll position" / "Cap position" / "Squad cost" */
  title: string;
  /** `ratio` leagues (UEFA squad-cost) render the same rail with % ticks. */
  unit: 'usd' | 'ratio';

  thresholds(season: SeasonId): Threshold[];

  /** Rail bounds. Defaults to the threshold span padded 18% each side. */
  domain?(thresholds: Threshold[], position: EconomicPosition): [number, number];

  /** One-line verdict. "Over the first apron" */
  status(position: EconomicPosition, thresholds: Threshold[]): {
    label: string;
    severity: Severity;
  };

  /** Rules gated by band. Rendered as the rail legend. */
  constraints(position: EconomicPosition, thresholds: Threshold[]): Constraint[];

  /** Numbers beside the rail. Hard cap of 4 — see §3.5 information budget. */
  headline(position: EconomicPosition, thresholds: Threshold[]): QuickStat[];
}

/* ============================================================
   MOVEMENT — feeds the trade predictor (§6)
   ============================================================ */

export interface MovementMechanism {
  /** 'trade' | 'waivers' | 'free-agency' | 'portal' | 'transfer-window' | 'rule-5' */
  id: string;
  label: string;
  /** Whether outgoing and incoming money must match. Gates the §6.5 feasibility check. */
  requiresSalaryMatch: boolean;
  /**
   * Is this move mechanically possible for the receiving org?
   * Returned reasons are shown next to a market probability, which is the
   * whole point of pairing cap data with prediction market data.
   */
  feasibility?(args: {
    receiving: EconomicPosition;
    thresholds: Threshold[];
    incoming: USD;
    outgoing: USD;
  }): { possible: boolean; reasons: string[] };
}

export interface CalendarEvent {
  id: string;
  label: string;
  /** ISO date. */
  at: string;
  kind: 'deadline' | 'window-open' | 'window-close' | 'draft' | 'season';
}

export interface MovementSpec {
  mechanisms: MovementMechanism[];
  calendar(season: SeasonId): CalendarEvent[];
}

/* ============================================================
   ORG + PAGE SHAPE
   ============================================================ */

/** Team, club, program — the thing that holds a roster. */
export interface Org {
  id: string;
  league: LeagueId;
  name: string;
  /** Display code for the crest. "BOS" / "KC" / "KAN" */
  code: string;
  /** Values keyed to `LeagueModule.groupings`. { conference: 'Eastern', division: 'Atlantic' } */
  grouping: Record<string, string>;
  venue?: string;
}

export interface Grouping {
  /** 'conference' | 'division' | 'league' | 'confederation' */
  key: string;
  label: string;
  values: string[];
}

/**
 * Core ships a renderer for each `kind`. A league picks which tabs exist and
 * what they're called — NCAAM calls its money tab "NIL & rev-share", the NFL
 * calls it "Cap sheet" — and adding a league costs zero UI work.
 */
export interface TabSpec {
  id: string;
  label: string;
  kind: 'roster' | 'economics' | 'staff' | 'stats' | 'news' | 'rumors' | 'market';
}

export interface LeagueModule {
  id: LeagueId;
  sport: SportId;
  name: string;
  shortName: string;

  org: {
    singular: string;
    plural: string;
  };

  groupings: Grouping[];

  season: {
    current: SeasonId;
    /** "2025-26" -> "2025-26 season" */
    label(season: SeasonId): string;
    gameCount: number;
  };

  economics: EconomicsModule;
  movement: MovementSpec;
  tabs: TabSpec[];

  /** The three numbers in the org header. Keep it to three. */
  quickStats(org: Org, position: EconomicPosition): QuickStat[];
}

/* ============================================================
   SHARED HELPERS
   ============================================================ */

/** Highest threshold the position clears, or null if it's under all of them. */
export function bandOf(
  position: EconomicPosition,
  thresholds: Threshold[],
): Threshold | null {
  const sorted = [...thresholds].sort((a, b) => a.value - b.value);
  let hit: Threshold | null = null;
  for (const t of sorted) if (position.committed > t.value) hit = t;
  return hit;
}

export function isOver(
  position: EconomicPosition,
  thresholds: Threshold[],
  id: string,
): boolean {
  const t = thresholds.find((x) => x.id === id);
  return t ? position.committed > t.value : false;
}

export function defaultDomain(
  thresholds: Threshold[],
  position: EconomicPosition,
): [number, number] {
  const vals = [...thresholds.map((t) => t.value), position.committed];
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  const pad = (hi - lo) * 0.18 || hi * 0.1;
  return [Math.max(0, lo - pad), hi + pad];
}
