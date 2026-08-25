/**
 * The sport domain contract — Player, Team, Game, Season, Contract,
 * Transaction, Market, StoryEvent.
 *
 * `league.ts` deliberately knows nothing about basketball; it's the
 * economics/threshold-rail contract. This file is the layer above it: the
 * entities every league-aware feature (player pages, the puzzle, the trade
 * predictor, the narrative layer) actually reads and writes. Same rule
 * applies — nothing here should ever branch on a specific league or sport.
 */

import type { LeagueId, Org, SeasonId, SourceRef, SportId, USD } from './league';

/* ============================================================
   TEAM + SEASON
   ============================================================ */

/** `Org` is the economics-facing shell; `Team` adds the roster relationship. */
export interface Team extends Org {
  roster: string[]; // Player ids
  headCoach?: string;
}

export type SeasonPhase = 'preseason' | 'regular' | 'postseason' | 'offseason';

export interface Season {
  id: SeasonId;
  league: LeagueId;
  /** "2025-26 season" */
  label: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
  phase: SeasonPhase;
  gameCount: number;
}

/* ============================================================
   PLAYER
   ============================================================ */

export type PlayerStatus = 'active' | 'inactive' | 'injured' | 'retired' | 'g-league' | 'two-way';

export interface DraftInfo {
  year: number | null;
  round: number | null;
  pick: number | null;
  college?: string;
  /** ISO 3166 country name or code — undrafted/international players still need this. */
  country: string;
}

export interface Player {
  id: string;
  league: LeagueId;
  sport: SportId;
  firstName: string;
  lastName: string;
  fullName: string;
  teamId: string | null;
  /** League-specific position code — 'PG' | 'C' | 'QB' etc. Not enumerated here on purpose. */
  position: string;
  jerseyNumber: number | null;
  heightInches: number;
  weightLbs: number;
  birthDate: string; // ISO date
  draft: DraftInfo;
  status: PlayerStatus;
  source: SourceRef;
}

/** Age as of a given date (defaults to now) — never store age, it goes stale. */
export function ageFromBirthDate(birthDate: string, asOf: Date = new Date()): number {
  const birth = new Date(birthDate);
  let age = asOf.getFullYear() - birth.getFullYear();
  const monthDiff = asOf.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && asOf.getDate() < birth.getDate())) age -= 1;
  return age;
}

/* ============================================================
   GAME
   ============================================================ */

export type GameStatus = 'scheduled' | 'live' | 'final' | 'postponed';

export interface Game {
  id: string;
  league: LeagueId;
  season: SeasonId;
  date: string; // ISO datetime
  phase: SeasonPhase;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  status: GameStatus;
  source: SourceRef;
}

/* ============================================================
   CONTRACT — per-player, distinct from the org-aggregate EconomicPosition
   ============================================================ */

export type ContractType = 'standard' | 'rookie-scale' | 'two-way' | 'ten-day' | 'exhibit-10';
export type ContractOption = 'player' | 'team' | 'none';

export interface ContractYear {
  season: SeasonId;
  salary: USD;
  guaranteed: boolean;
  option: ContractOption;
}

export interface Contract {
  id: string;
  playerId: string;
  teamId: string;
  type: ContractType;
  signedDate: string; // ISO date
  years: ContractYear[];
  totalValue: USD;
  /** How this contract ended, once it has — undefined while still active. Powers the career contract-history spine. */
  endedReason?: 'expired' | 'traded' | 'waived' | 'extended';
  source: SourceRef;
}

export function contractValueForSeason(contract: Contract, season: SeasonId): USD | null {
  return contract.years.find((y) => y.season === season)?.salary ?? null;
}

/* ============================================================
   TRANSACTION
   ============================================================ */

export type TransactionKind =
  | 'trade'
  | 'signing'
  | 'waiver'
  | 'draft'
  | 'release'
  | 'extension'
  | 'two-way-conversion';

export interface Transaction {
  id: string;
  league: LeagueId;
  kind: TransactionKind;
  date: string; // ISO date
  teamIds: string[];
  playerIds: string[];
  /** One-line human-readable summary — this is what renders in the news/story feed. */
  description: string;
  /** The cap mechanism that made the move legal — exception used, salary matched, pick attached. What the transactions ledger is for. */
  mechanism?: string;
  source: SourceRef;
}

/* ============================================================
   MARKET — normalized Kalshi/Polymarket shape (§8)
   ============================================================ */

export type MarketProvider = 'kalshi' | 'polymarket';
export type MarketCategory =
  | 'player-destination'
  | 'trade-deadline'
  | 'award'
  | 'coaching-change'
  | 'futures'
  | 'other';
export type Liquidity = 'thin' | 'normal' | 'deep';

export interface MarketOutcome {
  id: string;
  label: string;
  /** 0-1, derived from the provider's price — never store price alone as "the" probability (§8: spread, related outcomes >100%, thin volume all distort it). */
  probability: number;
  lastPrice: number;
  volume: USD;
}

export interface Market {
  id: string;
  provider: MarketProvider;
  externalId: string;
  title: string;
  category: MarketCategory;
  relatedPlayerIds: string[];
  relatedTeamIds: string[];
  outcomes: MarketOutcome[];
  liquidity: Liquidity;
  closesAt: string | null; // ISO date
  lastUpdated: string; // ISO datetime
  source: SourceRef;
}

/** One tick of a time series — §8 requires storing history, never just the latest snapshot. */
export interface MarketPricePoint {
  marketId: string;
  outcomeId: string;
  at: string; // ISO datetime
  price: number;
  volume: USD;
}

/* ============================================================
   STORY EVENT — powers the narrative layer and career timeline
   ============================================================ */

export type StoryEventKind =
  | 'draft'
  | 'trade'
  | 'signing'
  | 'injury'
  | 'award'
  | 'milestone'
  | 'debut'
  | 'retirement';

export interface StoryEvent {
  id: string;
  playerId: string;
  teamId?: string;
  kind: StoryEventKind;
  date: string; // ISO date
  headline: string;
  detail?: string;
  source: SourceRef;
}

/* ============================================================
   NEWS + RUMORS — the dashboard's lead section
   ============================================================ */

/** League-dependent free string — 'trades' | 'injuries' for NBA, 'transfer-portal' for NCAAM, etc. */
export type NewsCategory = string;

export interface NewsItem {
  id: string;
  league: LeagueId;
  category: NewsCategory;
  headline: string;
  dek: string;
  teamId?: string;
  hot: boolean;
  source: string;
  publishedAt: string; // ISO datetime
  /**
   * Minutes old as of this fixture snapshot. This — not `Date.now() -
   * publishedAt` — is what recency sorting and the "12m ago" label read
   * from. A fixture's `publishedAt` is a fixed point in the past relative
   * to whenever the snapshot was authored; computing live elapsed time
   * against it would just show "9 months ago" once the fixture ages past
   * whatever "now" happens to be. A live provider replaces this with a
   * real clock-derived value; fixtures store the number directly.
   */
  elapsedMinutes: number;
}

/* ============================================================
   INJURIES — a status stream about people, not an event stream about
   assets. Deliberately separate from NewsItem/Transaction: a move is true
   forever, a designation is true until Thursday. Mixing them makes both
   harder to scan.
   ============================================================ */

export type InjuryDesignation = 'out' | 'doubtful' | 'questionable' | 'day-to-day' | 'cleared';

export interface InjuryReport {
  id: string;
  league: LeagueId;
  playerId: string;
  teamId: string;
  designation: InjuryDesignation;
  bodyArea: string;
  timeline: string;
  gamesMissed: number;
  updatedAt: string; // ISO datetime
  elapsedMinutes: number; // same reasoning as NewsItem.elapsedMinutes
}

export interface Rumor {
  id: string;
  league: LeagueId;
  headline: string;
  body: string;
  teamIds: string[];
  playerIds: string[];
  /** How many independent sources describe the same thing — 1 quiet, 4 hot. */
  heat: 1 | 2 | 3 | 4;
  source: string;
  publishedAt: string; // ISO datetime
  elapsedMinutes: number; // see NewsItem — same reasoning
}
