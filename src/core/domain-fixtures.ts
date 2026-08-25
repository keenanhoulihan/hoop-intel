import type {
  Contract,
  Game,
  Market,
  MarketPricePoint,
  Player,
  Season,
  StoryEvent,
  Team,
  Transaction,
} from './domain';
import type { SourceRef } from './league';
import { millions, usd } from './league';
import { ORGS } from './fixtures';

/**
 * Deterministic sample data for the entities `fixtures.ts` doesn't cover yet
 * (Player, Game, Contract, Transaction, Market, StoryEvent). Scoped to the
 * three NBA orgs already in `ORGS` — v1 player-centric features are
 * NBA-only per the brief, so NFL/NCAAM stay economics-only for now. This is
 * a representative slice (12 players, not 450) meant to exercise every field
 * in the schema, not a full-roster dataset — that's a generation-script job,
 * not hand-authored fixtures.
 */

const FIXTURE: SourceRef = {
  provider: 'fixture',
  retrievedAt: '2026-01-01T00:00:00.000Z',
  confidence: 'fixture',
};

/* ============================================================
   SEASONS
   ============================================================ */

export const SEASONS: Season[] = [
  { id: '2024-25', league: 'nba', label: '2024-25 season', startDate: '2024-10-22', endDate: '2025-06-22', phase: 'offseason', gameCount: 82 },
  { id: '2025-26', league: 'nba', label: '2025-26 season', startDate: '2025-10-21', endDate: '2026-06-21', phase: 'regular', gameCount: 82 },
];

/* ============================================================
   PLAYERS
   ============================================================ */

export const PLAYERS: Player[] = [
  { id: 'tatum', league: 'nba', sport: 'basketball', firstName: 'Jayson', lastName: 'Tatum', fullName: 'Jayson Tatum', teamId: 'BOS', position: 'SF', jerseyNumber: 0, heightInches: 80, weightLbs: 210, birthDate: '1998-03-03', draft: { year: 2017, round: 1, pick: 3, college: 'Duke', country: 'USA' }, status: 'active', source: FIXTURE },
  { id: 'brown', league: 'nba', sport: 'basketball', firstName: 'Jaylen', lastName: 'Brown', fullName: 'Jaylen Brown', teamId: 'BOS', position: 'SG', jerseyNumber: 7, heightInches: 78, weightLbs: 223, birthDate: '1996-10-24', draft: { year: 2016, round: 1, pick: 3, college: 'California', country: 'USA' }, status: 'active', source: FIXTURE },
  { id: 'white', league: 'nba', sport: 'basketball', firstName: 'Derrick', lastName: 'White', fullName: 'Derrick White', teamId: 'BOS', position: 'PG', jerseyNumber: 9, heightInches: 76, weightLbs: 190, birthDate: '1994-07-02', draft: { year: 2017, round: 1, pick: 29, college: 'Colorado', country: 'USA' }, status: 'active', source: FIXTURE },
  { id: 'porzingis', league: 'nba', sport: 'basketball', firstName: 'Kristaps', lastName: 'Porzingis', fullName: 'Kristaps Porzingis', teamId: 'BOS', position: 'C', jerseyNumber: 8, heightInches: 87, weightLbs: 240, birthDate: '1995-08-02', draft: { year: 2015, round: 1, pick: 4, country: 'Latvia' }, status: 'injured', source: FIXTURE },

  { id: 'sga', league: 'nba', sport: 'basketball', firstName: 'Shai', lastName: 'Gilgeous-Alexander', fullName: 'Shai Gilgeous-Alexander', teamId: 'OKC', position: 'PG', jerseyNumber: 2, heightInches: 78, weightLbs: 195, birthDate: '1998-07-12', draft: { year: 2018, round: 1, pick: 11, college: 'Kentucky', country: 'Canada' }, status: 'active', source: FIXTURE },
  { id: 'holmgren', league: 'nba', sport: 'basketball', firstName: 'Chet', lastName: 'Holmgren', fullName: 'Chet Holmgren', teamId: 'OKC', position: 'C', jerseyNumber: 7, heightInches: 84, weightLbs: 208, birthDate: '2002-05-01', draft: { year: 2022, round: 1, pick: 2, college: 'Gonzaga', country: 'USA' }, status: 'active', source: FIXTURE },
  { id: 'jwilliams', league: 'nba', sport: 'basketball', firstName: 'Jalen', lastName: 'Williams', fullName: 'Jalen Williams', teamId: 'OKC', position: 'SF', jerseyNumber: 8, heightInches: 78, weightLbs: 211, birthDate: '2001-05-14', draft: { year: 2022, round: 1, pick: 12, college: 'Santa Clara', country: 'USA' }, status: 'active', source: FIXTURE },
  { id: 'dort', league: 'nba', sport: 'basketball', firstName: 'Luguentz', lastName: 'Dort', fullName: 'Luguentz Dort', teamId: 'OKC', position: 'SG', jerseyNumber: 5, heightInches: 76, weightLbs: 220, birthDate: '1999-04-19', draft: { year: null, round: null, pick: null, college: 'Arizona State', country: 'Canada' }, status: 'active', source: FIXTURE },

  { id: 'cunningham', league: 'nba', sport: 'basketball', firstName: 'Cade', lastName: 'Cunningham', fullName: 'Cade Cunningham', teamId: 'DET', position: 'PG', jerseyNumber: 2, heightInches: 78, weightLbs: 220, birthDate: '2001-09-25', draft: { year: 2021, round: 1, pick: 1, college: 'Oklahoma State', country: 'USA' }, status: 'active', source: FIXTURE },
  { id: 'ivey', league: 'nba', sport: 'basketball', firstName: 'Jaden', lastName: 'Ivey', fullName: 'Jaden Ivey', teamId: 'DET', position: 'SG', jerseyNumber: 23, heightInches: 76, weightLbs: 195, birthDate: '2002-02-13', draft: { year: 2022, round: 1, pick: 5, college: 'Purdue', country: 'USA' }, status: 'active', source: FIXTURE },
  { id: 'duren', league: 'nba', sport: 'basketball', firstName: 'Jalen', lastName: 'Duren', fullName: 'Jalen Duren', teamId: 'DET', position: 'C', jerseyNumber: 0, heightInches: 82, weightLbs: 250, birthDate: '2003-11-18', draft: { year: 2022, round: 1, pick: 13, college: 'Memphis', country: 'USA' }, status: 'active', source: FIXTURE },
  { id: 'athompson', league: 'nba', sport: 'basketball', firstName: 'Ausar', lastName: 'Thompson', fullName: 'Ausar Thompson', teamId: 'DET', position: 'SF', jerseyNumber: 9, heightInches: 79, weightLbs: 200, birthDate: '2003-01-30', draft: { year: 2023, round: 1, pick: 5, country: 'USA' }, status: 'injured', source: FIXTURE },
];

export function playersForTeam(teamId: string): Player[] {
  return PLAYERS.filter((p) => p.teamId === teamId);
}

export function playerById(id: string): Player | null {
  return PLAYERS.find((p) => p.id === id) ?? null;
}

/* ============================================================
   TEAMS — Org + roster
   ============================================================ */

export const TEAMS: Team[] = ORGS.nba.map((org) => ({
  ...org,
  roster: playersForTeam(org.id).map((p) => p.id),
}));

/* ============================================================
   GAMES
   ============================================================ */

export const GAMES: Game[] = [
  { id: 'g1', league: 'nba', season: '2025-26', date: '2025-11-14T00:00:00.000Z', phase: 'regular', homeTeamId: 'BOS', awayTeamId: 'OKC', homeScore: 108, awayScore: 114, status: 'final', source: FIXTURE },
  { id: 'g2', league: 'nba', season: '2025-26', date: '2025-11-16T00:00:00.000Z', phase: 'regular', homeTeamId: 'DET', awayTeamId: 'BOS', homeScore: 101, awayScore: 112, status: 'final', source: FIXTURE },
  { id: 'g3', league: 'nba', season: '2025-26', date: '2025-11-20T00:00:00.000Z', phase: 'regular', homeTeamId: 'OKC', awayTeamId: 'DET', homeScore: null, awayScore: null, status: 'scheduled', source: FIXTURE },
];

export function gamesForSeason(season: string): Game[] {
  return GAMES.filter((g) => g.season === season);
}

/* ============================================================
   CONTRACTS
   ============================================================ */

export const CONTRACTS: Contract[] = [
  { id: 'c-tatum', playerId: 'tatum', teamId: 'BOS', type: 'standard', signedDate: '2024-07-06', years: [
    { season: '2025-26', salary: millions(54.1), guaranteed: true, option: 'none' },
    { season: '2026-27', salary: millions(58.5), guaranteed: true, option: 'none' },
  ], totalValue: millions(314), source: FIXTURE },
  { id: 'c-brown', playerId: 'brown', teamId: 'BOS', type: 'standard', signedDate: '2023-07-25', years: [
    { season: '2025-26', salary: millions(53.1), guaranteed: true, option: 'none' },
  ], totalValue: millions(304), source: FIXTURE },
  { id: 'c-porzingis', playerId: 'porzingis', teamId: 'BOS', type: 'standard', signedDate: '2023-06-24', years: [
    { season: '2025-26', salary: millions(30.7), guaranteed: true, option: 'player' },
  ], totalValue: millions(60), source: FIXTURE },

  { id: 'c-sga', playerId: 'sga', teamId: 'OKC', type: 'standard', signedDate: '2024-07-06', years: [
    { season: '2025-26', salary: millions(38.3), guaranteed: true, option: 'none' },
  ], totalValue: millions(172), source: FIXTURE },
  { id: 'c-holmgren', playerId: 'holmgren', teamId: 'OKC', type: 'rookie-scale', signedDate: '2022-07-01', years: [
    { season: '2025-26', salary: millions(11.5), guaranteed: true, option: 'team' },
  ], totalValue: millions(46), source: FIXTURE },

  { id: 'c-cunningham', playerId: 'cunningham', teamId: 'DET', type: 'standard', signedDate: '2025-07-06', years: [
    { season: '2025-26', salary: millions(43.0), guaranteed: true, option: 'none' },
  ], totalValue: millions(224), source: FIXTURE },
  { id: 'c-duren', playerId: 'duren', teamId: 'DET', type: 'rookie-scale', signedDate: '2022-07-01', years: [
    { season: '2025-26', salary: millions(6.8), guaranteed: true, option: 'team' },
  ], totalValue: millions(27), source: FIXTURE },
];

export function contractsForPlayer(playerId: string): Contract[] {
  return CONTRACTS.filter((c) => c.playerId === playerId);
}

/* ============================================================
   TRANSACTIONS
   ============================================================ */

export const TRANSACTIONS: Transaction[] = [
  { id: 't1', league: 'nba', kind: 'trade', date: '2025-06-30', teamIds: ['BOS', 'DET'], playerIds: [], description: 'Celtics and Pistons swap future second-round picks.', source: FIXTURE },
  { id: 't2', league: 'nba', kind: 'extension', date: '2025-07-06', teamIds: ['DET'], playerIds: ['cunningham'], description: 'Cade Cunningham signs a 5-year maximum extension with Detroit.', source: FIXTURE },
  { id: 't3', league: 'nba', kind: 'draft', date: '2022-06-23', teamIds: ['OKC'], playerIds: ['holmgren'], description: 'Thunder select Chet Holmgren 2nd overall in the 2022 NBA Draft.', source: FIXTURE },
];

export function transactionsForLeague(league: string): Transaction[] {
  return TRANSACTIONS.filter((t) => t.league === league);
}

export function transactionsForPlayer(playerId: string): Transaction[] {
  return TRANSACTIONS.filter((t) => t.playerIds.includes(playerId));
}

/* ============================================================
   STORY EVENTS — narrative layer / career timeline
   ============================================================ */

export const STORY_EVENTS: StoryEvent[] = [
  { id: 's1', playerId: 'tatum', teamId: 'BOS', kind: 'draft', date: '2017-06-22', headline: 'Drafted 3rd overall by Boston', source: FIXTURE },
  { id: 's2', playerId: 'tatum', teamId: 'BOS', kind: 'award', date: '2024-06-17', headline: '2024 NBA champion', source: FIXTURE },
  { id: 's3', playerId: 'porzingis', teamId: 'BOS', kind: 'injury', date: '2025-05-12', headline: 'Sidelined with a calf strain', detail: 'Expected to miss multiple weeks.', source: FIXTURE },
  { id: 's4', playerId: 'holmgren', teamId: 'OKC', kind: 'draft', date: '2022-06-23', headline: 'Drafted 2nd overall by Oklahoma City', source: FIXTURE },
  { id: 's5', playerId: 'cunningham', teamId: 'DET', kind: 'signing', date: '2025-07-06', headline: 'Signs 5-year max extension with Detroit', source: FIXTURE },
  { id: 's6', playerId: 'cunningham', teamId: 'DET', kind: 'milestone', date: '2025-01-14', headline: 'First career triple-double season', source: FIXTURE },
];

export function storyEventsForPlayer(playerId: string): StoryEvent[] {
  return STORY_EVENTS.filter((e) => e.playerId === playerId).sort((a, b) => a.date.localeCompare(b.date));
}

/* ============================================================
   MARKETS — Kalshi/Polymarket normalized shape (§8)
   ============================================================ */

export const MARKETS: Market[] = [
  {
    id: 'm1', provider: 'kalshi', externalId: 'KXNBACHAMP-26', title: 'Which team wins the 2026 NBA championship?',
    category: 'futures', relatedPlayerIds: [], relatedTeamIds: ['BOS', 'OKC', 'DET'],
    outcomes: [
      { id: 'm1-okc', label: 'Thunder', probability: 0.28, lastPrice: 28, volume: usd(4_200_000) },
      { id: 'm1-bos', label: 'Celtics', probability: 0.19, lastPrice: 19, volume: usd(3_100_000) },
      { id: 'm1-det', label: 'Pistons', probability: 0.03, lastPrice: 3, volume: usd(210_000) },
    ],
    liquidity: 'deep', closesAt: '2026-06-01T00:00:00.000Z', lastUpdated: '2026-01-01T00:00:00.000Z', source: FIXTURE,
  },
  {
    id: 'm2', provider: 'polymarket', externalId: '0xporzingis-dest', title: 'Which team will Kristaps Porzingis be on by the trade deadline?',
    category: 'player-destination', relatedPlayerIds: ['porzingis'], relatedTeamIds: ['BOS'],
    outcomes: [
      { id: 'm2-bos', label: 'Stays with Celtics', probability: 0.62, lastPrice: 62, volume: usd(85_000) },
      { id: 'm2-traded', label: 'Traded elsewhere', probability: 0.34, lastPrice: 34, volume: usd(61_000) },
    ],
    liquidity: 'thin', closesAt: '2026-02-05T00:00:00.000Z', lastUpdated: '2026-01-01T00:00:00.000Z', source: FIXTURE,
  },
];

export function marketsForPlayer(playerId: string): Market[] {
  return MARKETS.filter((m) => m.relatedPlayerIds.includes(playerId));
}

export function marketsForTeam(teamId: string): Market[] {
  return MARKETS.filter((m) => m.relatedTeamIds.includes(teamId));
}

/** History for the "moved 8% -> 34% in the last hour" alert (§8) — a snapshot alone can't drive that. */
export const MARKET_PRICE_POINTS: MarketPricePoint[] = [
  { marketId: 'm2', outcomeId: 'm2-traded', at: '2025-12-30T00:00:00.000Z', price: 12, volume: usd(20_000) },
  { marketId: 'm2', outcomeId: 'm2-traded', at: '2025-12-31T12:00:00.000Z', price: 21, volume: usd(38_000) },
  { marketId: 'm2', outcomeId: 'm2-traded', at: '2026-01-01T00:00:00.000Z', price: 34, volume: usd(61_000) },
];

export function pricePointsForOutcome(marketId: string, outcomeId: string): MarketPricePoint[] {
  return MARKET_PRICE_POINTS.filter((p) => p.marketId === marketId && p.outcomeId === outcomeId)
    .sort((a, b) => a.at.localeCompare(b.at));
}
