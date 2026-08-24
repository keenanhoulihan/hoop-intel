import {
  type LeagueModule,
  type Threshold,
  type SeasonId,
  formatUSD,
  millions,
  usd,
} from '@/core/league';

/**
 * College used to be the argument against a shared economics contract — no cap,
 * no contracts, nothing to plot. The House settlement changed that: there is now
 * an institutional revenue-share pool per school, disclosed third-party NIL
 * above a dollar threshold, and a roster limit. That's a threshold set.
 *
 * Note the split: `committed` is the basketball allocation of the rev-share pool
 * (the thing with a hard line), and disclosed NIL sits in `obligations` because
 * it is real committed money that does not count against the pool. Rendering
 * both on one rail is the thing no competitor does.
 *
 * VERIFY BEFORE SHIP — settlement terms, the cap escalator, and the disclosure
 * threshold are all live issues and several are under appeal.
 */
const TABLE: Record<SeasonId, Record<string, number>> = {
  '2025-26': {
    poolTotal: 20.5, // institution-wide across all sports
    hoopsTypical: 4.0, // typical men's basketball allocation — school-specific in practice
    disclosureThreshold: 600, // dollars, third-party NIL requiring clearinghouse review
    rosterLimit: 15,
  },
};

const table = (season: SeasonId) => TABLE[season] ?? TABLE['2025-26'];

function thresholds(season: SeasonId): Threshold[] {
  const c = table(season);
  return [
    {
      id: 'typical',
      label: 'Peer median allocation',
      short: 'Median',
      value: millions(c.hoopsTypical * 0.6),
      severity: 'floor',
      consequence: 'Below the median for high-major programs.',
    },
    {
      id: 'hoops',
      label: 'Basketball allocation',
      short: 'Allocation',
      value: millions(c.hoopsTypical),
      severity: 'caution',
      consequence: 'Anything beyond comes out of another sport.',
    },
    {
      id: 'pool',
      label: 'Institutional cap',
      short: 'Cap',
      value: millions(c.poolTotal),
      severity: 'hard',
      consequence: 'Hard ceiling across every sport at the school.',
    },
  ];
}

export const ncaam: LeagueModule = {
  id: 'ncaam',
  sport: 'basketball',
  name: "NCAA Division I men's basketball",
  shortName: 'NCAAM',
  org: { singular: 'program', plural: 'programs' },

  groupings: [
    {
      key: 'conference',
      label: 'Conference',
      values: ['ACC', 'Big Ten', 'Big 12', 'SEC', 'Big East', 'Atlantic 10', 'Mountain West', 'West Coast', 'American'],
    },
  ],

  season: { current: '2025-26', label: (s) => `${s} season`, gameCount: 31 },

  economics: {
    title: 'Roster spend',
    unit: 'usd',
    thresholds,

    status(position, ts) {
      const hoops = ts.find((t) => t.id === 'hoops')!;
      const pool = ts.find((t) => t.id === 'pool')!;
      if (position.committed > pool.value)
        return { label: 'Above the institutional cap', severity: 'hard' };
      if (position.committed > hoops.value)
        return { label: 'Above the typical basketball allocation', severity: 'caution' };
      return { label: 'Within allocation', severity: 'neutral' };
    },

    constraints(position, ts) {
      const c = table(position.season);
      const pool = ts.find((t) => t.id === 'pool')!;
      const remaining = pool.value - position.committed;
      const nil = position.obligations.find((o) => o.id === 'nil')?.amount ?? 0;
      return [
        {
          id: 'remaining',
          label: 'Pool remaining',
          value: formatUSD(remaining),
          tone: remaining <= 0 ? 'blocked' : 'ok',
        },
        { id: 'roster', label: 'Roster limit', value: `${c.rosterLimit} scholarships`, tone: 'ok' },
        {
          id: 'nil',
          label: 'Disclosed third-party NIL',
          value: formatUSD(nil),
          tone: 'ok',
        },
        {
          id: 'clearinghouse',
          label: 'Clearinghouse review',
          value: `Deals over ${formatUSD(usd(c.disclosureThreshold), { compact: false })}`,
          tone: 'limited',
        },
      ];
    },

    headline(position, ts) {
      const pool = ts.find((t) => t.id === 'pool')!;
      const nil = position.obligations.find((o) => o.id === 'nil')?.amount ?? 0;
      return [
        { label: 'Rev-share', value: formatUSD(position.committed) },
        { label: 'Disclosed NIL', value: formatUSD(nil) },
        { label: 'Total commitments', value: formatUSD(position.committed + nil) },
        {
          label: 'Pool remaining',
          value: formatUSD(pool.value - position.committed),
          tone: pool.value - position.committed > 0 ? 'good' : 'bad',
        },
      ];
    },
  },

  movement: {
    mechanisms: [
      { id: 'portal', label: 'Transfer portal', requiresSalaryMatch: false },
      { id: 'signing', label: 'High school signing', requiresSalaryMatch: false },
      { id: 'draft', label: 'NBA draft declaration', requiresSalaryMatch: false },
    ],
    calendar: () => [
      { id: 'portal-open', label: 'Portal window opens', at: '2026-03-16', kind: 'window-open' },
      { id: 'portal-close', label: 'Portal window closes', at: '2026-04-14', kind: 'window-close' },
      { id: 'draft-withdraw', label: 'Draft withdrawal deadline', at: '2026-05-28', kind: 'deadline' },
    ],
  },

  tabs: [
    { id: 'roster', label: 'Roster', kind: 'roster' },
    { id: 'nil', label: 'NIL & rev-share', kind: 'economics' },
    { id: 'staff', label: 'Staff', kind: 'staff' },
    { id: 'stats', label: 'Stats', kind: 'stats' },
    { id: 'news', label: 'News', kind: 'news' },
  ],

  quickStats(_org, position) {
    const nil = position.obligations.find((o) => o.id === 'nil')?.amount ?? 0;
    return [
      { label: 'AP', value: '—' },
      { label: 'NET', value: '—' },
      { label: 'Roster spend', value: formatUSD(position.committed + nil), tone: 'neutral' },
    ];
  },
};
