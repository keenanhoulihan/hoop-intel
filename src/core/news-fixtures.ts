import type { NewsItem, Rumor } from './domain';

/**
 * News + rumor fixtures. Same "recent" rule as everywhere else in this file:
 * sorting and the "Xm/Xh ago" label both read `elapsedMinutes`, not a
 * `Date.now()` diff against `publishedAt` — see the field comment on
 * `NewsItem` for why. These carry a lighter `source: string` attribution
 * rather than the full `SourceRef` used elsewhere — a wire item's byline,
 * not a data-provenance stamp.
 */

export const NEWS: NewsItem[] = [
  { id: 'n1', league: 'nba', category: 'injuries', headline: 'Porzingis (calf) out at least two weeks', dek: 'Boston rules out its starting center through the upcoming homestand.', teamId: 'BOS', hot: true, source: 'Celtics PR', publishedAt: '2025-11-18T14:00:00.000Z', elapsedMinutes: 12 },
  { id: 'n2', league: 'nba', category: 'trades', headline: 'Pistons, Celtics swap future second-rounders', dek: 'A minor cap-adjacent deal ahead of Thursday’s deadline for reporting.', teamId: 'DET', hot: false, source: 'The Athletic', publishedAt: '2025-11-18T12:40:00.000Z', elapsedMinutes: 47 },
  { id: 'n3', league: 'nba', category: 'extensions', headline: 'Cunningham’s max extension kicks in next season', dek: 'Detroit locks in its cornerstone through 2030-31.', teamId: 'DET', hot: true, source: 'ESPN', publishedAt: '2025-11-18T10:15:00.000Z', elapsedMinutes: 95 },
  { id: 'n4', league: 'nba', category: 'front-office', headline: 'Thunder extend front-office staff through the decade', dek: 'Continuity move for the league’s youngest core.', teamId: 'OKC', hot: false, source: 'The Oklahoman', publishedAt: '2025-11-18T08:30:00.000Z', elapsedMinutes: 140 },
  { id: 'n5', league: 'nba', category: 'free-agency', headline: 'Dort declines to discuss extension timeline', dek: '“That’s for the front office,” he said after Tuesday’s win.', teamId: 'OKC', hot: false, source: 'The Oklahoman', publishedAt: '2025-11-18T02:00:00.000Z', elapsedMinutes: 340 },
  { id: 'n6', league: 'nba', category: 'injuries', headline: 'Holmgren cleared from injury report, no restriction', dek: 'Full participation in Tuesday’s shootaround.', teamId: 'OKC', hot: false, source: 'Thunder PR', publishedAt: '2025-11-17T20:00:00.000Z', elapsedMinutes: 600 },
  { id: 'n7', league: 'nba', category: 'trades', headline: 'Around the league: second-apron teams staying quiet', dek: 'Front offices describe a slow start to trade-call season.', hot: false, source: 'Yahoo Sports', publishedAt: '2025-11-17T14:00:00.000Z', elapsedMinutes: 900 },
  { id: 'n8', league: 'ncaam', category: 'transfer-portal', headline: 'Portal window dates set for spring', dek: 'NCAA confirms the entry window for the 2026 cycle.', hot: false, source: 'CBS Sports', publishedAt: '2025-11-18T09:00:00.000Z', elapsedMinutes: 165 },
  { id: 'n9', league: 'ncaam', category: 'nil', headline: 'Kansas discloses new third-party NIL deal', dek: 'Filing clears the clearinghouse review threshold.', teamId: 'kansas', hot: true, source: 'On3', publishedAt: '2025-11-18T07:00:00.000Z', elapsedMinutes: 210 },
  { id: 'n10', league: 'ncaam', category: 'coaching-carousel', headline: 'Gonzaga staff addition confirmed', dek: 'A returning assistant rejoins the bench.', teamId: 'gonzaga', hot: false, source: 'Spokesman-Review', publishedAt: '2025-11-17T18:00:00.000Z', elapsedMinutes: 720 },
];

export const RUMORS: Rumor[] = [
  { id: 'r1', league: 'nba', headline: 'Multiple teams monitoring Porzingis’s market value ahead of the deadline', body: 'League sources describe early, informal calls to Boston about frontcourt depth — nothing formal, and Boston has given no indication it intends to move him. Worth tracking given the injury and his expiring option.', teamIds: ['BOS'], playerIds: ['porzingis'], heat: 2, source: 'league sources', publishedAt: '2025-11-18T11:00:00.000Z', elapsedMinutes: 90 },
  { id: 'r2', league: 'nba', headline: 'Detroit could pursue a veteran wing before the deadline', body: 'Three separate reports this week describe Detroit as an active call-maker for two-way wing depth, using the room created by this summer’s extension structuring.', teamIds: ['DET'], playerIds: [], heat: 4, source: '3 outlets', publishedAt: '2025-11-18T09:30:00.000Z', elapsedMinutes: 180 },
  { id: 'r3', league: 'nba', headline: 'Whispers of a Dort extension before opening night of free agency', body: 'A single source close to the player floated an extension conversation; nothing corroborated elsewhere yet.', teamIds: ['OKC'], playerIds: ['dort'], heat: 1, source: '1 source', publishedAt: '2025-11-17T22:00:00.000Z', elapsedMinutes: 480 },
  { id: 'r4', league: 'ncaam', headline: 'Portal interest forming around a Kansas reserve', body: 'Two recruiting-adjacent accounts describe early portal interest in a bench piece — standard this time of year, unconfirmed by the program.', teamIds: ['kansas'], playerIds: [], heat: 2, source: '2 sources', publishedAt: '2025-11-18T06:00:00.000Z', elapsedMinutes: 250 },
];

export function newsForLeague(league: string): NewsItem[] {
  return NEWS.filter((n) => n.league === league).sort((a, b) => a.elapsedMinutes - b.elapsedMinutes);
}

export function rumorsForLeague(league: string): Rumor[] {
  return RUMORS.filter((r) => r.league === league).sort((a, b) => a.elapsedMinutes - b.elapsedMinutes);
}

/** AP Top 25 — standalone, deliberately decoupled from `ORGS`/`EconomicPosition` (see task summary: ranking doesn't need cap data, and coupling it would mean matching fixture cap data for all 25 programs). */
export const AP_TOP_25: { rank: number; team: string; conference: string }[] = [
  { rank: 1, team: 'Duke', conference: 'ACC' },
  { rank: 2, team: 'Houston', conference: 'Big 12' },
  { rank: 3, team: 'Kansas', conference: 'Big 12' },
  { rank: 4, team: 'UConn', conference: 'Big East' },
  { rank: 5, team: 'Alabama', conference: 'SEC' },
  { rank: 6, team: 'Auburn', conference: 'SEC' },
  { rank: 7, team: 'Arizona', conference: 'Big 12' },
  { rank: 8, team: 'Gonzaga', conference: 'West Coast' },
  { rank: 9, team: 'Tennessee', conference: 'SEC' },
  { rank: 10, team: 'Iowa State', conference: 'Big 12' },
  { rank: 11, team: 'Michigan State', conference: 'Big Ten' },
  { rank: 12, team: 'Purdue', conference: 'Big Ten' },
  { rank: 13, team: 'North Carolina', conference: 'ACC' },
  { rank: 14, team: 'Marquette', conference: 'Big East' },
  { rank: 15, team: 'Baylor', conference: 'Big 12' },
  { rank: 16, team: 'Illinois', conference: 'Big Ten' },
  { rank: 17, team: 'Texas A&M', conference: 'SEC' },
  { rank: 18, team: 'Creighton', conference: 'Big East' },
  { rank: 19, team: 'Kentucky', conference: 'SEC' },
  { rank: 20, team: 'St. John’s', conference: 'Big East' },
  { rank: 21, team: 'Wisconsin', conference: 'Big Ten' },
  { rank: 22, team: 'Memphis', conference: 'American' },
  { rank: 23, team: 'Mississippi State', conference: 'SEC' },
  { rank: 24, team: 'BYU', conference: 'Big 12' },
  { rank: 25, team: 'Clemson', conference: 'ACC' },
];
