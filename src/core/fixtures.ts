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
    { id: 'BOS', league: 'nba', name: 'Boston Celtics', code: 'BOS', grouping: { conference: 'Eastern', division: 'Atlantic' }, venue: 'TD Garden' },
    { id: 'OKC', league: 'nba', name: 'Oklahoma City Thunder', code: 'OKC', grouping: { conference: 'Western', division: 'Northwest' }, venue: 'Paycom Center' },
    { id: 'DET', league: 'nba', name: 'Detroit Pistons', code: 'DET', grouping: { conference: 'Eastern', division: 'Central' }, venue: 'Little Caesars Arena' },
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
