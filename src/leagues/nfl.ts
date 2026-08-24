import {
  type LeagueModule,
  type Threshold,
  type SeasonId,
  bandOf,
  formatUSD,
  millions,
} from '@/core/league';

/**
 * The NFL is the useful stress test: one hard cap instead of four soft bands,
 * and the interesting money is money already spent. Dead cap and void years go
 * in `position.obligations`, which the rail renders under the bar without any
 * league-specific UI.
 *
 * VERIFY BEFORE SHIP. 2025 figures. The 2026 cap was announced in March 2026.
 */
const CAP_TABLE: Record<SeasonId, Record<string, number>> = {
  '2025': {
    cap: 279.2,
    floorPct: 0.89, // 89% cash spend over a four-year window
    franchiseTagQb: 40.2,
    top51: 51,
  },
};

const table = (season: SeasonId) => CAP_TABLE[season] ?? CAP_TABLE['2025'];

function thresholds(season: SeasonId): Threshold[] {
  const c = table(season);
  return [
    {
      id: 'floor',
      label: 'Cash spending floor',
      short: 'Floor',
      value: millions(c.cap * c.floorPct),
      severity: 'floor',
      consequence: 'Shortfall over the four-year window is paid to the players association.',
    },
    {
      id: 'cap',
      label: 'Salary cap',
      short: 'Cap',
      value: millions(c.cap),
      severity: 'hard',
      consequence: 'Hard. No transaction may be processed that puts a club over.',
    },
  ];
}

export const nfl: LeagueModule = {
  id: 'nfl',
  sport: 'football',
  name: 'National Football League',
  shortName: 'NFL',
  org: { singular: 'team', plural: 'teams' },

  groupings: [
    { key: 'conference', label: 'Conference', values: ['AFC', 'NFC'] },
    { key: 'division', label: 'Division', values: ['East', 'North', 'South', 'West'] },
  ],

  season: { current: '2025', label: (s) => `${s} season`, gameCount: 17 },

  economics: {
    title: 'Cap position',
    unit: 'usd',
    thresholds,

    status(position, ts) {
      const band = bandOf(position, ts);
      if (band?.id === 'cap') return { label: 'Over the cap', severity: 'hard' };
      if (band?.id === 'floor') return { label: 'Compliant', severity: 'neutral' };
      return { label: 'Below the spending floor', severity: 'floor' };
    },

    constraints(position, ts) {
      const c = table(position.season);
      const cap = ts.find((t) => t.id === 'cap')!;
      const space = cap.value - position.committed;
      const dead = position.obligations.find((o) => o.id === 'dead')?.amount ?? 0;
      const void_ = position.obligations.find((o) => o.id === 'void')?.amount ?? 0;
      return [
        {
          id: 'space',
          label: 'Effective space',
          value: formatUSD(space),
          tone: space < 0 ? 'blocked' : space < millions(5) ? 'limited' : 'ok',
        },
        {
          id: 'tag',
          label: 'Franchise tag',
          value: space >= millions(c.franchiseTagQb) ? 'Affordable' : 'Requires restructure',
          tone: space >= millions(c.franchiseTagQb) ? 'ok' : 'limited',
        },
        { id: 'june1', label: 'June 1 designations', value: '2 available', tone: 'ok' },
        {
          id: 'dead',
          label: 'Dead + void',
          value: formatUSD(dead + void_),
          tone: dead + void_ > millions(30) ? 'blocked' : 'ok',
        },
      ];
    },

    headline(position, ts) {
      const cap = ts.find((t) => t.id === 'cap')!;
      const space = cap.value - position.committed;
      const dead = position.obligations.find((o) => o.id === 'dead')?.amount ?? 0;
      return [
        { label: 'Top-51 total', value: formatUSD(position.committed) },
        {
          label: space > 0 ? 'Cap space' : 'Over cap',
          value: formatUSD(Math.abs(space)),
          tone: space > 0 ? 'good' : 'bad',
        },
        { label: 'Dead cap', value: formatUSD(dead), tone: dead > millions(25) ? 'bad' : 'neutral' },
        { label: 'Contracts', value: String(position.contractCount) },
      ];
    },
  },

  movement: {
    mechanisms: [
      {
        id: 'trade',
        label: 'Trade',
        requiresSalaryMatch: false, // cap-space based, not matched
        feasibility({ receiving, thresholds: ts, incoming }) {
          const cap = ts.find((t) => t.id === 'cap')!;
          const space = cap.value - receiving.committed;
          return space >= incoming
            ? { possible: true, reasons: [`Fits in ${formatUSD(space)} of space.`] }
            : {
                possible: false,
                reasons: [
                  `Short by ${formatUSD(incoming - space)} — needs a restructure or a post-June 1 release.`,
                ],
              };
        },
      },
      { id: 'free-agency', label: 'Free agency', requiresSalaryMatch: false },
      { id: 'waivers', label: 'Waivers', requiresSalaryMatch: false },
      { id: 'tag', label: 'Franchise/transition tag', requiresSalaryMatch: false },
    ],
    calendar: () => [
      { id: 'deadline', label: 'Trade deadline', at: '2025-11-04', kind: 'deadline' },
      { id: 'tag-window', label: 'Tag window closes', at: '2026-03-03', kind: 'window-close' },
      { id: 'league-year', label: 'New league year', at: '2026-03-11', kind: 'window-open' },
    ],
  },

  tabs: [
    { id: 'roster', label: 'Roster', kind: 'roster' },
    { id: 'cap', label: 'Cap sheet', kind: 'economics' },
    { id: 'staff', label: 'Staff & front office', kind: 'staff' },
    { id: 'stats', label: 'Stats', kind: 'stats' },
    { id: 'market', label: 'Market', kind: 'market' },
    { id: 'news', label: 'News', kind: 'news' },
  ],

  quickStats(_org, position) {
    const cap = thresholds(position.season).find((t) => t.id === 'cap')!;
    const space = cap.value - position.committed;
    return [
      { label: 'Record', value: '—' },
      { label: 'Div rank', value: '—' },
      {
        label: 'Cap space',
        value: formatUSD(space),
        tone: space < 0 ? 'bad' : 'neutral',
      },
    ];
  },
};
