import { bandOf, formatUSD, type EconomicPosition, type LeagueId, type LeagueModule, type Severity, type USD } from './league';
import { contractValueForSeason, type Contract, type ContractOption, type InjuryReport, type NewsItem, type Player, type Rumor, type StoryEvent, type Team, type Transaction } from './domain';
import { ORGS, TEAM_RECORDS, positionFor } from './fixtures';
import { FIXTURE_AS_OF, TEAMS, TRANSACTIONS, contractsForPlayer, playerById, playersForTeam, storyEventsForPlayer } from './domain-fixtures';
import { AP_TOP_25, RUMORS, newsForLeague, rumorsForLeague } from './news-fixtures';
import { injuriesForLeague, INJURIES } from './injury-fixtures';

/**
 * The provider-layer seam. Components call these, never `domain-fixtures` /
 * `news-fixtures` / `fixtures` directly — this is the file a live provider
 * replaces internals of later. Every function degrades to an empty result on
 * failure rather than throwing, matching `credentials.ts`'s "missing/broken
 * provider is a degraded feature, never a crashed page" rule.
 */

function teamById(id: string): Team | null {
  return TEAMS.find((t) => t.id === id) ?? null;
}

/* ============================================================
   NEWS + RUMORS
   ============================================================ */

export interface NewsCard extends NewsItem {
  team: Team | null;
}

export async function getNews(league: LeagueId): Promise<NewsCard[]> {
  try {
    return newsForLeague(league).map((n) => ({ ...n, team: n.teamId ? teamById(n.teamId) : null }));
  } catch {
    return [];
  }
}

export interface RumorCard extends Rumor {
  teams: Team[];
  players: Player[];
}

export async function getRumors(league: LeagueId): Promise<RumorCard[]> {
  try {
    return rumorsForLeague(league).map((r) => ({
      ...r,
      teams: r.teamIds.map(teamById).filter((x): x is Team => x !== null),
      players: r.playerIds.map(playerById).filter((x): x is Player => x !== null),
    }));
  } catch {
    return [];
  }
}

/* ============================================================
   TRANSACTIONS (ledger)
   ============================================================ */

export interface TransactionSummary {
  transaction: Transaction;
  teams: Team[];
  players: Player[];
}

export async function getRecentTransactions(league: LeagueId, limit = 6): Promise<TransactionSummary[]> {
  try {
    return TRANSACTIONS.filter((t) => t.league === league)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, limit)
      .map((t) => ({
        transaction: t,
        teams: t.teamIds.map(teamById).filter((x): x is Team => x !== null),
        players: t.playerIds.map(playerById).filter((x): x is Player => x !== null),
      }));
  } catch {
    return [];
  }
}

/* ============================================================
   CONTEXT RAIL — apron watch / room available (NBA), AP 25 (NCAAM)
   ============================================================ */

export interface ApronWatchEntry {
  team: Team;
  band: 'apron1' | 'apron2';
  committed: string;
}

export async function getApronWatch(league: LeagueModule): Promise<ApronWatchEntry[]> {
  try {
    const orgs = ORGS[league.id] ?? [];
    const rows = orgs
      .map((org) => {
        const position = positionFor(org.id);
        const thresholds = league.economics.thresholds(position.season);
        const band = bandOf(position, thresholds);
        if (band?.id !== 'apron1' && band?.id !== 'apron2') return null;
        return {
          team: TEAMS.find((t) => t.id === org.id) ?? { ...org, roster: [] },
          band: band.id as 'apron1' | 'apron2',
          committed: formatUSD(position.committed),
          sort: position.committed,
        };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null)
      .sort((a, b) => b.sort - a.sort);
    return rows.map(({ sort: _sort, ...r }) => r);
  } catch {
    return [];
  }
}

export interface RoomAvailableEntry {
  team: Team;
  room: string;
}

export async function getRoomAvailable(league: LeagueModule): Promise<RoomAvailableEntry[]> {
  try {
    const orgs = ORGS[league.id] ?? [];
    const rows = orgs
      .map((org) => {
        const position = positionFor(org.id);
        const thresholds = league.economics.thresholds(position.season);
        const cap = thresholds.find((t) => t.id === 'cap' || t.id === 'hoops');
        if (!cap || position.committed >= cap.value) return null;
        return {
          team: TEAMS.find((t) => t.id === org.id) ?? { ...org, roster: [] },
          room: formatUSD(cap.value - position.committed),
          sort: cap.value - position.committed,
        };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null)
      .sort((a, b) => b.sort - a.sort);
    return rows.map(({ sort: _sort, ...r }) => r);
  } catch {
    return [];
  }
}

export async function getAP25(): Promise<typeof AP_TOP_25> {
  try {
    return AP_TOP_25;
  } catch {
    return [];
  }
}

/* ============================================================
   INJURIES
   ============================================================ */

export interface InjuryCard extends InjuryReport {
  player: Player | null;
  team: Team | null;
}

export async function getInjuries(league: LeagueId): Promise<InjuryCard[]> {
  try {
    return injuriesForLeague(league).map((i) => ({
      ...i,
      player: playerById(i.playerId),
      team: teamById(i.teamId),
    }));
  } catch {
    return [];
  }
}

/* ============================================================
   TEAM DIRECTORY — full-width grid, grouped by division
   ============================================================ */

export interface TeamDirectoryEntry {
  team: Team;
  division: string;
  conference: string;
  record: string;
  payroll: string;
  tone: 'moss' | 'oak' | 'clay';
}

export async function getTeamDirectory(league: LeagueModule): Promise<TeamDirectoryEntry[]> {
  try {
    const orgs = ORGS[league.id] ?? [];
    return orgs.map((org) => {
      const position = positionFor(org.id);
      const thresholds = league.economics.thresholds(position.season);
      const band = bandOf(position, thresholds);
      const tone = bandTone(band?.id);
      const record = TEAM_RECORDS[org.id];
      return {
        team: TEAMS.find((t) => t.id === org.id) ?? { ...org, roster: [] },
        division: org.grouping.division ?? '',
        conference: org.grouping.conference ?? '',
        record: record ? `${record.wins}-${record.losses}` : '—',
        payroll: formatUSD(position.committed),
        tone,
      };
    });
  } catch {
    return [];
  }
}

function bandTone(bandId: string | undefined): 'moss' | 'oak' | 'clay' {
  if (bandId === 'apron1' || bandId === 'apron2') return 'clay';
  if (bandId === 'cap' || bandId === 'tax' || bandId === 'hoops') return 'oak';
  return 'moss';
}

/* ============================================================
   TEAM PAGE
   ============================================================ */

export interface TeamHeaderData {
  team: Team;
  position: EconomicPosition;
  record: string;
  seed: number | null;
  payrollTone: 'moss' | 'oak' | 'clay';
}

export async function getTeamHeader(league: LeagueModule, teamId: string): Promise<TeamHeaderData | null> {
  try {
    const org = (ORGS[league.id] ?? []).find((o) => o.id === teamId);
    if (!org) return null;
    const position = positionFor(org.id);
    const thresholds = league.economics.thresholds(position.season);
    const band = bandOf(position, thresholds);
    const record = TEAM_RECORDS[org.id];

    const conferenceMates = (ORGS[league.id] ?? []).filter((o) => o.grouping.conference === org.grouping.conference);
    const ranked = conferenceMates
      .map((o) => ({ id: o.id, record: TEAM_RECORDS[o.id] }))
      .filter((r): r is { id: string; record: { wins: number; losses: number } } => !!r.record)
      .sort((a, b) => b.record.wins / (b.record.wins + b.record.losses) - a.record.wins / (a.record.wins + a.record.losses));
    const seed = ranked.findIndex((r) => r.id === org.id) + 1 || null;

    return {
      team: TEAMS.find((t) => t.id === org.id) ?? { ...org, roster: [] },
      position,
      record: record ? `${record.wins}-${record.losses}` : '—',
      seed,
      payrollTone: bandTone(band?.id),
    };
  } catch {
    return null;
  }
}

/** What the compact figure row above the rail shows — distances all read directly off the same thresholds the rail plots. */
export interface CapFigures {
  payroll: string;
  toTax: string | null;
  toApron1: string | null;
  toApron2: string | null;
  deadMoney: string;
}

export async function getCapFigures(league: LeagueModule, teamId: string): Promise<CapFigures | null> {
  try {
    const position = positionFor(teamId);
    const thresholds = league.economics.thresholds(position.season);
    const dist = (id: string) => {
      const t = thresholds.find((x) => x.id === id);
      return t ? formatUSD(t.value - position.committed) : null;
    };
    const deadMoney = position.obligations.find((o) => o.id === 'dead')?.amount ?? (0 as USD);
    return {
      payroll: formatUSD(position.committed),
      toTax: dist('tax'),
      toApron1: dist('apron1'),
      toApron2: dist('apron2'),
      deadMoney: formatUSD(deadMoney),
    };
  } catch {
    return null;
  }
}

export interface RosterRow {
  player: Player;
  contract: Contract | null;
  capHit: USD | null;
  through: string | null;
  option: ContractOption | null;
  experience: number;
  injury: InjuryReport | null;
  storyEvents: StoryEvent[];
  careerContracts: Contract[];
}

export interface RosterData {
  rows: RosterRow[];
  itemizedTotal: USD;
  otherContractsCount: number;
  otherContractsTotal: USD;
  deadMoney: USD;
  grandTotal: USD;
  /** Fixture snapshot date — pass to age calculations instead of real "now"; see FIXTURE_AS_OF. */
  asOf: Date;
}

/**
 * "If the roster's cap hits don't sum to the rail figure, the page is
 * lying." This repo doesn't model every contract on every real 15-man
 * roster (`EconomicPosition.contractCount` reflects the real number;
 * `CONTRACTS` only has entries for the players we've fully modeled). Rather
 * than fabricate the missing players or silently under-report the total,
 * the remainder is its own explicit, honestly-labeled line — the sum is
 * exact by construction, not by coincidence.
 */
export async function getRoster(league: LeagueModule, teamId: string): Promise<RosterData> {
  try {
    const position = positionFor(teamId);
    const season = league.season.current;
    const seasonYear = parseInt(season.slice(0, 4), 10);
    const players = playersForTeam(teamId);

    const rows: RosterRow[] = players
      .map((player) => {
        const contract = contractsForPlayer(player.id)[0] ?? null;
        const capHit = contract ? contractValueForSeason(contract, season) : null;
        const lastYear = contract?.years[contract.years.length - 1] ?? null;
        const injury = INJURIES.find((i) => i.playerId === player.id) ?? null;
        return {
          player,
          contract,
          capHit,
          through: lastYear?.season ?? null,
          option: lastYear?.option ?? null,
          experience: player.draft.year ? Math.max(0, seasonYear - player.draft.year) : 6,
          injury,
          storyEvents: storyEventsForPlayer(player.id),
          careerContracts: contractsForPlayer(player.id),
        };
      })
      .sort((a, b) => (b.capHit ?? 0) - (a.capHit ?? 0));

    const itemizedTotal = rows.reduce((sum, r) => sum + (r.capHit ?? 0), 0) as USD;
    const otherContractsCount = Math.max(0, position.contractCount - rows.length);
    const otherContractsTotal = (position.committed - itemizedTotal) as USD;
    const deadMoney = position.obligations.find((o) => o.id === 'dead')?.amount ?? (0 as USD);

    return {
      rows,
      itemizedTotal,
      otherContractsCount,
      otherContractsTotal,
      deadMoney,
      grandTotal: position.committed,
      asOf: FIXTURE_AS_OF,
    };
  } catch {
    return {
      rows: [],
      itemizedTotal: 0 as USD,
      otherContractsCount: 0,
      otherContractsTotal: 0 as USD,
      deadMoney: 0 as USD,
      grandTotal: 0 as USD,
      asOf: FIXTURE_AS_OF,
    };
  }
}

/* ============================================================
   TEAM PAGE — below-the-fold tabs
   ============================================================ */

export interface OwnershipRole {
  role: string;
  filled: boolean;
}

/** No ownership data is modeled anywhere in this repo — every role renders as an honest empty slot, not a fabricated name. */
export async function getOwnership(): Promise<OwnershipRole[]> {
  return [
    { role: 'Governor', filled: false },
    { role: 'Minority partners', filled: false },
    { role: 'President of basketball operations', filled: false },
    { role: 'General manager', filled: false },
    { role: 'Assistant general manager', filled: false },
    { role: 'VP, player personnel', filled: false },
  ];
}

/** No front-office/coaching regime data is modeled yet — validates the section's shape ahead of real data, per the brief. */
export async function getManagementHistory(): Promise<[]> {
  return [];
}

export interface DirectionGoals {
  bandLabel: string;
  bandSeverity: Severity;
}

export async function getDirectionGoals(league: LeagueModule, teamId: string): Promise<DirectionGoals | null> {
  try {
    const position = positionFor(teamId);
    const thresholds = league.economics.thresholds(position.season);
    const status = league.economics.status(position, thresholds);
    return { bandLabel: status.label, bandSeverity: status.severity };
  } catch {
    return null;
  }
}

export interface CapPathway {
  id: string;
  label: string;
  value: string;
  tone: 'ok' | 'limited' | 'blocked';
  cost: string;
  projectedPct: number | null;
}

const PATHWAY_COST: Record<string, string> = {
  mle: 'Using any part of it hard-caps the team at the first apron for the rest of the season.',
  bae: 'Counts toward the same limited pool as the mid-level; unavailable once a team clears the first apron.',
  aggregation: 'Combining outgoing salaries to match a bigger incoming contract — prohibited above the second apron.',
  buyout: 'Signing a recently-waived player for more than the room exception — restricted above the first apron.',
};

function parseUSDLabel(label: string): number | null {
  const m = label.match(/^\$([\d.]+)([BMK])?$/);
  if (!m) return null;
  const n = parseFloat(m[1]);
  const mult = m[2] === 'B' ? 1e9 : m[2] === 'M' ? 1e6 : m[2] === 'K' ? 1e3 : 1;
  return n * mult;
}

export async function getCapPathways(league: LeagueModule, teamId: string): Promise<CapPathway[]> {
  try {
    const position = positionFor(teamId);
    const thresholds = league.economics.thresholds(position.season);
    const constraints = league.economics.constraints(position, thresholds);
    const domain = (league.economics.domain ?? ((t, p) => [0, Math.max(...t.map((x) => x.value), p.committed) * 1.18]))(thresholds, position);
    const [lo, hi] = domain;

    return constraints.map((c) => {
      const amount = parseUSDLabel(c.value);
      const projectedPct =
        amount !== null && c.tone === 'ok'
          ? Math.max(0, Math.min(100, ((position.committed + amount - lo) / (hi - lo)) * 100))
          : null;
      return {
        id: c.id,
        label: c.label,
        value: c.value,
        tone: c.tone,
        cost: PATHWAY_COST[c.id] ?? 'League-rule mechanic — consequence depends on how it is used.',
        projectedPct,
      };
    });
  } catch {
    return [];
  }
}

export interface TeamRumorCard extends Rumor {
  players: Player[];
}

export async function getTeamRumors(teamId: string): Promise<TeamRumorCard[]> {
  try {
    return RUMORS.filter((r) => r.teamIds.includes(teamId))
      .sort((a, b) => a.elapsedMinutes - b.elapsedMinutes)
      .map((r) => ({ ...r, players: r.playerIds.map(playerById).filter((x): x is Player => x !== null) }));
  } catch {
    return [];
  }
}
