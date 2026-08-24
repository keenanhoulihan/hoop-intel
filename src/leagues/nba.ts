import {
  type EconomicPosition,
  type LeagueModule,
  type Threshold,
  type SeasonId,
  bandOf,
  formatUSD,
  isOver,
  millions,
} from '@/core/league';

/**
 * VERIFY BEFORE SHIP. These are 2025-26 figures carried over from the
 * prototype. The 2026-27 cap was set after this file was written — update the
 * table, not the code below it.
 */
const CAP_TABLE: Record<SeasonId, Record<string, number>> = {
  '2025-26': {
    cap: 154.6,
    tax: 187.9,
    apron1: 195.9,
    apron2: 207.8,
    mle: 14.1,
    taxpayerMle: 5.7,
    bae: 5.1,
    minimum: 139.1, // 90% of the cap
  },
};

const table = (season: SeasonId) => CAP_TABLE[season] ?? CAP_TABLE['2025-26'];

function thresholds(season: SeasonId): Threshold[] {
  const c = table(season);
  return [
    {
      id: 'minimum',
      label: 'Salary floor',
      short: 'Floor',
      value: millions(c.minimum),
      severity: 'floor',
      consequence: 'Shortfall is distributed to players on the roster.',
    },
    {
      id: 'cap',
      label: 'Salary cap',
      short: 'Cap',
      value: millions(c.cap),
      severity: 'neutral',
      consequence: 'No more room signings; exceptions only.',
    },
    {
      id: 'tax',
      label: 'Luxury tax',
      short: 'Tax',
      value: millions(c.tax),
      severity: 'caution',
      consequence: 'Escalating tax on every dollar above, repeater rates after three years in four.',
    },
    {
      id: 'apron1',
      label: 'First apron',
      short: '1st apron',
      value: millions(c.apron1),
      severity: 'warn',
      consequence: 'No sign-and-trade in, no bi-annual, no buyout signings above the non-taxpayer MLE.',
    },
    {
      id: 'apron2',
      label: 'Second apron',
      short: '2nd apron',
      value: millions(c.apron2),
      severity: 'hard',
      consequence: 'No salary aggregation in trades, no cash, and the first-rounder seven years out freezes.',
    },
  ];
}

export const nba: LeagueModule = {
  id: 'nba',
  sport: 'basketball',
  name: 'National Basketball Association',
  shortName: 'NBA',
  org: { singular: 'team', plural: 'teams' },

  groupings: [
    { key: 'conference', label: 'Conference', values: ['Eastern', 'Western'] },
    {
      key: 'division',
      label: 'Division',
      values: ['Atlantic', 'Central', 'Southeast', 'Northwest', 'Pacific', 'Southwest'],
    },
  ],

  season: {
    current: '2025-26',
    label: (s) => `${s} season`,
    gameCount: 82,
  },

  economics: {
    title: 'Payroll position',
    unit: 'usd',
    thresholds,

    status(position, ts) {
      const band = bandOf(position, ts);
      switch (band?.id) {
        case 'apron2':
          return { label: 'Hard-capped at the second apron', severity: 'hard' };
        case 'apron1':
          return { label: 'Over the first apron', severity: 'warn' };
        case 'tax':
          return { label: 'In the tax', severity: 'caution' };
        case 'cap':
          return { label: 'Over the cap, under the tax', severity: 'neutral' };
        case 'minimum':
          return { label: 'Cap room team', severity: 'neutral' };
        default:
          return { label: 'Below the salary floor', severity: 'floor' };
      }
    },

    constraints(position, ts) {
      const c = table(position.season);
      const over1 = isOver(position, ts, 'apron1');
      const over2 = isOver(position, ts, 'apron2');
      const overTax = isOver(position, ts, 'tax');
      return [
        {
          id: 'mle',
          label: 'Mid-level',
          value: over2
            ? 'Unavailable'
            : overTax
              ? formatUSD(millions(c.taxpayerMle))
              : formatUSD(millions(c.mle)),
          tone: over2 ? 'blocked' : overTax ? 'limited' : 'ok',
        },
        {
          id: 'bae',
          label: 'Bi-annual',
          value: over1 ? 'Unavailable' : formatUSD(millions(c.bae)),
          tone: over1 ? 'blocked' : 'ok',
        },
        {
          id: 'aggregation',
          label: 'Salary aggregation',
          value: over2 ? 'Prohibited' : 'Permitted',
          tone: over2 ? 'blocked' : 'ok',
        },
        {
          id: 'buyout',
          label: 'Buyout market',
          value: over1 ? 'Restricted' : 'Open',
          tone: over1 ? 'limited' : 'ok',
        },
      ];
    },

    headline(position, ts) {
      const cap = ts.find((t) => t.id === 'cap')!;
      const tax = ts.find((t) => t.id === 'tax')!;
      const apron2 = ts.find((t) => t.id === 'apron2')!;
      const space = cap.value - position.committed;
      return [
        { label: 'Payroll', value: formatUSD(position.committed) },
        {
          label: space > 0 ? 'Cap space' : 'Over cap',
          value: formatUSD(Math.abs(space)),
          tone: space > 0 ? 'good' : 'neutral',
        },
        {
          label: 'To tax',
          value: formatUSD(tax.value - position.committed),
          tone: position.committed > tax.value ? 'bad' : 'neutral',
        },
        {
          label: 'To 2nd apron',
          value: formatUSD(apron2.value - position.committed),
          tone: position.committed > apron2.value ? 'bad' : 'neutral',
        },
      ];
    },
  },

  movement: {
    mechanisms: [
      {
        id: 'trade',
        label: 'Trade',
        requiresSalaryMatch: true,
        feasibility({ receiving, thresholds: ts, incoming, outgoing }) {
          const reasons: string[] = [];
          const after = receiving.committed - outgoing + incoming;
          const apron1 = ts.find((t) => t.id === 'apron1')!;
          const apron2 = ts.find((t) => t.id === 'apron2')!;
          const cap = ts.find((t) => t.id === 'cap')!;
          const room = cap.value - receiving.committed;

          if (room >= incoming) {
            reasons.push(`Absorbs into ${formatUSD(room)} of room.`);
          } else if (incoming > outgoing * 2) {
            reasons.push('Incoming salary exceeds the matching band.');
          } else {
            reasons.push('Salary matches within the allowed band.');
          }
          if (after > apron2.value) {
            reasons.push('Lands above the second apron — cannot aggregate to get here.');
          } else if (after > apron1.value) {
            reasons.push('Hard-capped at the first apron for the rest of the year.');
          }
          return { possible: after <= apron2.value || room >= incoming, reasons };
        },
      },
      { id: 'free-agency', label: 'Free agency', requiresSalaryMatch: false },
      { id: 'waivers', label: 'Waivers', requiresSalaryMatch: false },
      { id: 'buyout', label: 'Buyout', requiresSalaryMatch: false },
    ],
    calendar: () => [
      // VERIFY: dates change annually.
      { id: 'deadline', label: 'Trade deadline', at: '2026-02-05', kind: 'deadline' },
      { id: 'fa-open', label: 'Free agency opens', at: '2026-06-30', kind: 'window-open' },
      { id: 'draft', label: 'Draft', at: '2026-06-24', kind: 'draft' },
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
    const ts = thresholds(position.season);
    const band = bandOf(position, ts);
    return [
      { label: 'Record', value: '—' },
      { label: 'Conf seed', value: '—' },
      {
        label: 'Payroll',
        value: formatUSD(position.committed),
        tone: band?.id === 'apron1' || band?.id === 'apron2' ? 'bad' : 'neutral',
      },
    ];
  },
};
