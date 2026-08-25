import type { EconomicPosition, LeagueId, Org, SourceRef } from './league';
import { millions, usd } from './league';

/**
 * Deterministic sample data. The app must render fully with no API keys and no
 * database — that property is what lets you clone the repo, run one command,
 * and see the real UI. Live providers layer on top; they never gate the page.
 */

const FIXTURE: SourceRef = {
  provider: 'fixture',
  retrievedAt: '2026-01-01T00:00:00.000Z',
  confidence: 'fixture',
};

export const ORGS: Record<LeagueId, Org[]> = {
  nba: [
    // Eastern · Atlantic
    { id: 'BOS', league: 'nba', name: 'Boston Celtics', code: 'BOS', grouping: { conference: 'Eastern', division: 'Atlantic' }, venue: 'TD Garden' },
    { id: 'BKN', league: 'nba', name: 'Brooklyn Nets', code: 'BKN', grouping: { conference: 'Eastern', division: 'Atlantic' }, venue: 'Barclays Center' },
    { id: 'NY', league: 'nba', name: 'New York Knicks', code: 'NY', grouping: { conference: 'Eastern', division: 'Atlantic' }, venue: 'Madison Square Garden' },
    { id: 'PHI', league: 'nba', name: 'Philadelphia 76ers', code: 'PHI', grouping: { conference: 'Eastern', division: 'Atlantic' }, venue: 'Wells Fargo Center' },
    { id: 'TOR', league: 'nba', name: 'Toronto Raptors', code: 'TOR', grouping: { conference: 'Eastern', division: 'Atlantic' }, venue: 'Scotiabank Arena' },
    // Eastern · Central
    { id: 'CHI', league: 'nba', name: 'Chicago Bulls', code: 'CHI', grouping: { conference: 'Eastern', division: 'Central' }, venue: 'United Center' },
    { id: 'CLE', league: 'nba', name: 'Cleveland Cavaliers', code: 'CLE', grouping: { conference: 'Eastern', division: 'Central' }, venue: 'Rocket Mortgage FieldHouse' },
    { id: 'DET', league: 'nba', name: 'Detroit Pistons', code: 'DET', grouping: { conference: 'Eastern', division: 'Central' }, venue: 'Little Caesars Arena' },
    { id: 'IND', league: 'nba', name: 'Indiana Pacers', code: 'IND', grouping: { conference: 'Eastern', division: 'Central' }, venue: 'Gainbridge Fieldhouse' },
    { id: 'MIL', league: 'nba', name: 'Milwaukee Bucks', code: 'MIL', grouping: { conference: 'Eastern', division: 'Central' }, venue: 'Fiserv Forum' },
    // Eastern · Southeast
    { id: 'ATL', league: 'nba', name: 'Atlanta Hawks', code: 'ATL', grouping: { conference: 'Eastern', division: 'Southeast' }, venue: 'State Farm Arena' },
    { id: 'CHA', league: 'nba', name: 'Charlotte Hornets', code: 'CHA', grouping: { conference: 'Eastern', division: 'Southeast' }, venue: 'Spectrum Center' },
    { id: 'MIA', league: 'nba', name: 'Miami Heat', code: 'MIA', grouping: { conference: 'Eastern', division: 'Southeast' }, venue: 'Kaseya Center' },
    { id: 'ORL', league: 'nba', name: 'Orlando Magic', code: 'ORL', grouping: { conference: 'Eastern', division: 'Southeast' }, venue: 'Kia Center' },
    { id: 'WAS', league: 'nba', name: 'Washington Wizards', code: 'WAS', grouping: { conference: 'Eastern', division: 'Southeast' }, venue: 'Capital One Arena' },
    // Western · Northwest
    { id: 'DEN', league: 'nba', name: 'Denver Nuggets', code: 'DEN', grouping: { conference: 'Western', division: 'Northwest' }, venue: 'Ball Arena' },
    { id: 'MIN', league: 'nba', name: 'Minnesota Timberwolves', code: 'MIN', grouping: { conference: 'Western', division: 'Northwest' }, venue: 'Target Center' },
    { id: 'OKC', league: 'nba', name: 'Oklahoma City Thunder', code: 'OKC', grouping: { conference: 'Western', division: 'Northwest' }, venue: 'Paycom Center' },
    { id: 'POR', league: 'nba', name: 'Portland Trail Blazers', code: 'POR', grouping: { conference: 'Western', division: 'Northwest' }, venue: 'Moda Center' },
    { id: 'UTA', league: 'nba', name: 'Utah Jazz', code: 'UTA', grouping: { conference: 'Western', division: 'Northwest' }, venue: 'Delta Center' },
    // Western · Pacific
    { id: 'GSW', league: 'nba', name: 'Golden State Warriors', code: 'GSW', grouping: { conference: 'Western', division: 'Pacific' }, venue: 'Chase Center' },
    { id: 'LAC', league: 'nba', name: 'LA Clippers', code: 'LAC', grouping: { conference: 'Western', division: 'Pacific' }, venue: 'Intuit Dome' },
    { id: 'LAL', league: 'nba', name: 'Los Angeles Lakers', code: 'LAL', grouping: { conference: 'Western', division: 'Pacific' }, venue: 'Crypto.com Arena' },
    { id: 'PHX', league: 'nba', name: 'Phoenix Suns', code: 'PHX', grouping: { conference: 'Western', division: 'Pacific' }, venue: 'Footprint Center' },
    { id: 'SAC', league: 'nba', name: 'Sacramento Kings', code: 'SAC', grouping: { conference: 'Western', division: 'Pacific' }, venue: 'Golden 1 Center' },
    // Western · Southwest
    { id: 'DAL', league: 'nba', name: 'Dallas Mavericks', code: 'DAL', grouping: { conference: 'Western', division: 'Southwest' }, venue: 'American Airlines Center' },
    { id: 'HOU', league: 'nba', name: 'Houston Rockets', code: 'HOU', grouping: { conference: 'Western', division: 'Southwest' }, venue: 'Toyota Center' },
    { id: 'MEM', league: 'nba', name: 'Memphis Grizzlies', code: 'MEM', grouping: { conference: 'Western', division: 'Southwest' }, venue: 'FedExForum' },
    { id: 'NOP', league: 'nba', name: 'New Orleans Pelicans', code: 'NOP', grouping: { conference: 'Western', division: 'Southwest' }, venue: 'Smoothie King Center' },
    { id: 'SAS', league: 'nba', name: 'San Antonio Spurs', code: 'SAS', grouping: { conference: 'Western', division: 'Southwest' }, venue: 'Frost Bank Center' },
  ],
  nfl: [
    { id: 'NO', league: 'nfl', name: 'New Orleans Saints', code: 'NO', grouping: { conference: 'NFC', division: 'South' }, venue: 'Caesars Superdome' },
    { id: 'NE', league: 'nfl', name: 'New England Patriots', code: 'NE', grouping: { conference: 'AFC', division: 'East' }, venue: 'Gillette Stadium' },
  ],
  ncaam: [
    { id: 'kansas', league: 'ncaam', name: 'Kansas', code: 'KU', grouping: { conference: 'Big 12' }, venue: 'Allen Fieldhouse' },
    { id: 'gonzaga', league: 'ncaam', name: 'Gonzaga', code: 'GON', grouping: { conference: 'West Coast' }, venue: 'McCarthey Athletic Center' },
  ],
};

const POSITIONS: Record<string, EconomicPosition> = {
  // Deep in the second apron — every constraint should read blocked.
  BOS: { committed: millions(221.4), contractCount: 15, season: '2025-26', source: FIXTURE, obligations: [{ id: 'dead', label: 'Dead money', amount: millions(3.1) }] },
  // Between the tax and the first apron.
  OKC: { committed: millions(191.2), contractCount: 15, season: '2025-26', source: FIXTURE, obligations: [] },
  // Cap room team.
  DET: { committed: millions(141.8), contractCount: 14, season: '2025-26', source: FIXTURE, obligations: [{ id: 'dead', label: 'Dead money', amount: millions(8.4) }] },

  BKN: { committed: millions(118.5), contractCount: 13, season: '2025-26', source: FIXTURE, obligations: [] },
  NY: { committed: millions(198.3), contractCount: 14, season: '2025-26', source: FIXTURE, obligations: [{ id: 'dead', label: 'Dead money', amount: millions(2.6) }] },
  PHI: { committed: millions(172.4), contractCount: 14, season: '2025-26', source: FIXTURE, obligations: [] },
  TOR: { committed: millions(129.7), contractCount: 13, season: '2025-26', source: FIXTURE, obligations: [] },
  CHI: { committed: millions(165.2), contractCount: 14, season: '2025-26', source: FIXTURE, obligations: [] },
  CLE: { committed: millions(205.9), contractCount: 15, season: '2025-26', source: FIXTURE, obligations: [{ id: 'dead', label: 'Dead money', amount: millions(4.4) }] },
  IND: { committed: millions(158.9), contractCount: 14, season: '2025-26', source: FIXTURE, obligations: [] },
  MIL: { committed: millions(210.4), contractCount: 14, season: '2025-26', source: FIXTURE, obligations: [{ id: 'dead', label: 'Dead money', amount: millions(6.9) }] },
  ATL: { committed: millions(176.3), contractCount: 14, season: '2025-26', source: FIXTURE, obligations: [] },
  CHA: { committed: millions(122.6), contractCount: 13, season: '2025-26', source: FIXTURE, obligations: [] },
  MIA: { committed: millions(189.7), contractCount: 14, season: '2025-26', source: FIXTURE, obligations: [] },
  ORL: { committed: millions(168.1), contractCount: 14, season: '2025-26', source: FIXTURE, obligations: [] },
  WAS: { committed: millions(115.2), contractCount: 13, season: '2025-26', source: FIXTURE, obligations: [] },
  DEN: { committed: millions(199.5), contractCount: 14, season: '2025-26', source: FIXTURE, obligations: [{ id: 'dead', label: 'Dead money', amount: millions(1.8) }] },
  MIN: { committed: millions(193.8), contractCount: 14, season: '2025-26', source: FIXTURE, obligations: [] },
  POR: { committed: millions(145.2), contractCount: 14, season: '2025-26', source: FIXTURE, obligations: [] },
  UTA: { committed: millions(108.7), contractCount: 13, season: '2025-26', source: FIXTURE, obligations: [] },
  GSW: { committed: millions(202.1), contractCount: 14, season: '2025-26', source: FIXTURE, obligations: [{ id: 'dead', label: 'Dead money', amount: millions(3.3) }] },
  LAC: { committed: millions(209.9), contractCount: 14, season: '2025-26', source: FIXTURE, obligations: [] },
  LAL: { committed: millions(196.4), contractCount: 14, season: '2025-26', source: FIXTURE, obligations: [] },
  PHX: { committed: millions(213.7), contractCount: 14, season: '2025-26', source: FIXTURE, obligations: [{ id: 'dead', label: 'Dead money', amount: millions(9.1) }] },
  SAC: { committed: millions(174.8), contractCount: 14, season: '2025-26', source: FIXTURE, obligations: [] },
  DAL: { committed: millions(183.6), contractCount: 14, season: '2025-26', source: FIXTURE, obligations: [] },
  HOU: { committed: millions(156.3), contractCount: 14, season: '2025-26', source: FIXTURE, obligations: [] },
  MEM: { committed: millions(148.9), contractCount: 14, season: '2025-26', source: FIXTURE, obligations: [] },
  NOP: { committed: millions(178.2), contractCount: 14, season: '2025-26', source: FIXTURE, obligations: [] },
  SAS: { committed: millions(142.5), contractCount: 14, season: '2025-26', source: FIXTURE, obligations: [] },

  // Void years doing the damage — the NFL's signature failure mode.
  NO: { committed: millions(274.9), contractCount: 51, season: '2025', source: FIXTURE, obligations: [
    { id: 'dead', label: 'Dead cap', amount: millions(41.2), note: 'Post-June 1 releases' },
    { id: 'void', label: 'Void years', amount: millions(28.7), note: 'Accelerates in 2026' },
  ] },
  NE: { committed: millions(212.6), contractCount: 51, season: '2025', source: FIXTURE, obligations: [{ id: 'dead', label: 'Dead cap', amount: millions(9.8) }] },

  kansas: { committed: millions(5.2), contractCount: 13, season: '2025-26', source: FIXTURE, obligations: [{ id: 'nil', label: 'Disclosed NIL', amount: usd(2_450_000) }] },
  gonzaga: { committed: millions(2.9), contractCount: 13, season: '2025-26', source: FIXTURE, obligations: [{ id: 'nil', label: 'Disclosed NIL', amount: usd(1_180_000) }] },
};

export function positionFor(orgId: string): EconomicPosition {
  const p = POSITIONS[orgId];
  if (!p) throw new Error(`No fixture position for org "${orgId}"`);
  return p;
}

/** Win-loss record for the team directory grid. Decoupled from `Org`/`EconomicPosition` — a record isn't a cap-mechanics fact, no reason to overload either type with it. */
export const TEAM_RECORDS: Record<string, { wins: number; losses: number }> = {
  BOS: { wins: 12, losses: 5 }, BKN: { wins: 4, losses: 13 }, NY: { wins: 11, losses: 6 }, PHI: { wins: 8, losses: 9 }, TOR: { wins: 6, losses: 11 },
  CHI: { wins: 7, losses: 10 }, CLE: { wins: 13, losses: 4 }, DET: { wins: 10, losses: 7 }, IND: { wins: 8, losses: 9 }, MIL: { wins: 12, losses: 5 },
  ATL: { wins: 9, losses: 8 }, CHA: { wins: 5, losses: 12 }, MIA: { wins: 10, losses: 7 }, ORL: { wins: 9, losses: 8 }, WAS: { wins: 3, losses: 14 },
  DEN: { wins: 12, losses: 5 }, MIN: { wins: 10, losses: 7 }, OKC: { wins: 14, losses: 3 }, POR: { wins: 6, losses: 11 }, UTA: { wins: 4, losses: 13 },
  GSW: { wins: 11, losses: 6 }, LAC: { wins: 9, losses: 8 }, LAL: { wins: 10, losses: 7 }, PHX: { wins: 9, losses: 8 }, SAC: { wins: 7, losses: 10 },
  DAL: { wins: 8, losses: 9 }, HOU: { wins: 11, losses: 6 }, MEM: { wins: 6, losses: 11 }, NOP: { wins: 5, losses: 12 }, SAS: { wins: 9, losses: 8 },
};
