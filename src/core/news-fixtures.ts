import type { NewsItem, Rumor } from './domain';
import { ORGS } from './fixtures';

/**
 * News + rumor fixtures. Same "recent" rule as everywhere else in this file:
 * sorting and the "Xm/Xh ago" label both read `elapsedMinutes`, not a
 * `Date.now()` diff against `publishedAt` — see the field comment on
 * `NewsItem` for why. Generic `source: string` attribution — a wire item's
 * byline, not a data-provenance stamp.
 *
 * Fixture-naming guardrail: invented player names, invented sources
 * ("League sources", "Team release", "Wire report", "Beat reporter") —
 * never a real outlet or a real person attached to a generated story. Real
 * team names/divisions are fine; those are structural facts, not reporting.
 *
 * News = moves only. Injuries are a separate status stream — see
 * `injury-fixtures.ts` — never mixed in here.
 */

const NBA_CATEGORIES = ['trades', 'signings', 'waivers', 'claims', 'extensions', 'front-office', 'coaching'] as const;

const TEMPLATES: Record<(typeof NBA_CATEGORIES)[number], string[]> = {
  trades: [
    '{team} exploring the trade market for backcourt depth',
    '{team} fields calls on a rotation big ahead of the deadline',
    '{team} completes a low-value trade to shed a guaranteed salary',
    '{team} and a division rival discuss a third-team trade framework',
  ],
  signings: [
    '{team} signs a free agent to a two-way deal',
    '{team} adds veteran depth on a minimum contract',
    '{team} finalizes a training-camp deal with a returning player',
    '{team} fills its 15th roster spot before the deadline',
  ],
  waivers: [
    '{team} waives a non-guaranteed camp invite',
    '{team} clears a roster spot ahead of the regular-season deadline',
    '{team} releases a two-way player to open a G League slot',
    '{team} waives a player claimed earlier this month',
  ],
  claims: [
    '{team} claims a player off waivers',
    '{team} adds a wing off the waiver wire',
    '{team} claims a big man to fill an injury-related vacancy',
    '{team} picks up a guard on a rest-of-season contract',
  ],
  extensions: [
    "{team} opens extension talks with a core rotation piece",
    '{team} tables a rookie-scale extension before the October deadline',
    '{team} completes a below-market extension with a starter',
    '{team} confirms no extension progress before the deadline passed',
  ],
  'front-office': [
    '{team} promotes from within the front office',
    '{team} hires a new assistant general manager',
    '{team} restructures its scouting department',
    "{team} extends its general manager's contract",
  ],
  coaching: [
    '{team} adjusts its coaching staff midseason',
    '{team} adds a shooting-development assistant',
    "{team}'s head coach addresses rotation questions after practice",
    '{team} promotes an assistant to associate head coach',
  ],
};

const DEKS = [
  'Development continues to shape the race in a crowded division.',
  'Front-office sources describe the move as procedural, not strategic.',
  'No corresponding roster move has been announced yet.',
  'The club has not commented beyond a brief statement.',
];

const SOURCES = ['League sources', 'Team release', 'Wire report', 'Beat reporter'];

function generatedNews(): NewsItem[] {
  const orgs = ORGS.nba;
  return orgs.map((org, i) => {
    const category = NBA_CATEGORIES[i % NBA_CATEGORIES.length];
    const variant = Math.floor(i / NBA_CATEGORIES.length) % TEMPLATES[category].length;
    const elapsedMinutes = Math.round(8 * Math.pow(1.28, i));
    return {
      id: `gn-${org.id}`,
      league: 'nba',
      category,
      headline: TEMPLATES[category][variant].replace('{team}', org.name),
      dek: DEKS[i % DEKS.length],
      teamId: org.id,
      hot: i % 5 === 0,
      source: SOURCES[i % SOURCES.length],
      publishedAt: '2025-11-18T14:00:00.000Z',
      elapsedMinutes,
    };
  });
}

/** Hand-authored flavor items for the three teams with full player rosters modeled. */
const NEWS_FEATURED: NewsItem[] = [
  { id: 'n2', league: 'nba', category: 'trades', headline: 'Pistons, Celtics swap future second-rounders', dek: 'A minor cap-adjacent deal ahead of Thursday’s reporting deadline.', teamId: 'DET', hot: false, source: 'Wire report', publishedAt: '2025-11-18T12:40:00.000Z', elapsedMinutes: 47 },
  { id: 'n3', league: 'nba', category: 'extensions', headline: 'Marsh’s max extension kicks in next season', dek: 'Detroit locks in its cornerstone through 2030-31.', teamId: 'DET', hot: true, source: 'Team release', publishedAt: '2025-11-18T10:15:00.000Z', elapsedMinutes: 95 },
  { id: 'n4', league: 'nba', category: 'front-office', headline: 'Thunder extend front-office staff through the decade', dek: 'Continuity move for one of the league’s youngest cores.', teamId: 'OKC', hot: false, source: 'Team release', publishedAt: '2025-11-18T08:30:00.000Z', elapsedMinutes: 140 },
  { id: 'n5', league: 'nba', category: 'extensions', headline: 'Deng declines to discuss extension timeline', dek: '"That’s for the front office," he said after Tuesday’s win.', teamId: 'OKC', hot: false, source: 'Beat reporter', publishedAt: '2025-11-18T02:00:00.000Z', elapsedMinutes: 340 },
];

export const NEWS: NewsItem[] = [
  ...NEWS_FEATURED,
  ...generatedNews(),
  { id: 'nc1', league: 'ncaam', category: 'transfer-portal', headline: 'Portal window dates set for spring', dek: 'NCAA confirms the entry window for the 2026 cycle.', hot: false, source: 'Wire report', publishedAt: '2025-11-18T09:00:00.000Z', elapsedMinutes: 165 },
  { id: 'nc2', league: 'ncaam', category: 'nil', headline: 'Kansas discloses new third-party NIL deal', dek: 'Filing clears the clearinghouse review threshold.', teamId: 'kansas', hot: true, source: 'Team release', publishedAt: '2025-11-18T07:00:00.000Z', elapsedMinutes: 210 },
  { id: 'nc3', league: 'ncaam', category: 'coaching-carousel', headline: 'Gonzaga staff addition confirmed', dek: 'A returning assistant rejoins the bench.', teamId: 'gonzaga', hot: false, source: 'Wire report', publishedAt: '2025-11-17T18:00:00.000Z', elapsedMinutes: 720 },
].sort((a, b) => a.elapsedMinutes - b.elapsedMinutes);

export const RUMORS: Rumor[] = [
  { id: 'r1', league: 'nba', headline: 'Multiple teams monitoring Kovac’s market value ahead of the deadline', body: 'League sources describe early, informal calls to Boston about frontcourt depth — nothing formal, and Boston has given no indication it intends to move him. Worth tracking given the injury and his expiring option.', teamIds: ['BOS'], playerIds: ['porzingis'], heat: 2, source: 'League sources', publishedAt: '2025-11-18T11:00:00.000Z', elapsedMinutes: 90 },
  { id: 'r2', league: 'nba', headline: 'Detroit could pursue a veteran wing before the deadline', body: 'Three separate reports this week describe Detroit as an active call-maker for two-way wing depth, using the room created by this summer’s extension structuring.', teamIds: ['DET'], playerIds: [], heat: 4, source: 'Beat reporter', publishedAt: '2025-11-18T09:30:00.000Z', elapsedMinutes: 180 },
  { id: 'r3', league: 'nba', headline: 'Whispers of a Deng extension before opening night of free agency', body: 'A single source close to the player floated an extension conversation; nothing corroborated elsewhere yet.', teamIds: ['OKC'], playerIds: ['dort'], heat: 1, source: 'League sources', publishedAt: '2025-11-17T22:00:00.000Z', elapsedMinutes: 480 },
  { id: 'r4', league: 'nba', headline: 'Miami described as a "quiet buyer" ahead of the trade deadline', body: 'Two outlets independently describe Miami as monitoring the buyout and trade markets for frontcourt depth, without a specific target named yet.', teamIds: ['MIA'], playerIds: [], heat: 2, source: 'Wire report', publishedAt: '2025-11-18T06:00:00.000Z', elapsedMinutes: 250 },
  { id: 'r5', league: 'nba', headline: 'Golden State fields interest in a bench wing', body: 'A single report describes preliminary interest from a Western Conference rival; nothing further has surfaced.', teamIds: ['GSW'], playerIds: [], heat: 1, source: 'Beat reporter', publishedAt: '2025-11-17T14:00:00.000Z', elapsedMinutes: 900 },
  { id: 'r6', league: 'nba', headline: 'Knicks and Bulls floated as a possible third-team trade pairing', body: 'Three reports this week connect the two clubs to a broader trade framework involving a Western Conference team; none confirm specific names.', teamIds: ['NY', 'CHI'], playerIds: [], heat: 3, source: 'League sources', publishedAt: '2025-11-18T13:15:00.000Z', elapsedMinutes: 45 },
  { id: 'r7', league: 'nba', headline: 'Suns described as unlikely to stand pat before the deadline', body: 'A single source characterizes the front office as "active listeners" on most of the roster outside two names.', teamIds: ['PHX'], playerIds: [], heat: 1, source: 'Wire report', publishedAt: '2025-11-16T20:00:00.000Z', elapsedMinutes: 1080 },
  { id: 'rc1', league: 'ncaam', headline: 'Portal interest forming around a Kansas reserve', body: 'Two recruiting-adjacent accounts describe early portal interest in a bench piece — standard this time of year, unconfirmed by the program.', teamIds: ['kansas'], playerIds: [], heat: 2, source: 'League sources', publishedAt: '2025-11-18T06:00:00.000Z', elapsedMinutes: 250 },
];

export function newsForLeague(league: string): NewsItem[] {
  return NEWS.filter((n) => n.league === league).sort((a, b) => a.elapsedMinutes - b.elapsedMinutes);
}

export function rumorsForLeague(league: string): Rumor[] {
  return RUMORS.filter((r) => r.league === league).sort((a, b) => a.elapsedMinutes - b.elapsedMinutes);
}

/** AP Top 25 — standalone, deliberately decoupled from `ORGS`/`EconomicPosition` (ranking doesn't need cap data). */
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
