import type { CSSProperties } from 'react';
import {
  type EconomicPosition,
  type LeagueModule,
  type Severity,
  defaultDomain,
  formatUSD,
} from '@/core/league';

/**
 * The apron rail, generalized.
 *
 * The prototype's `.aprail` hard-coded four NBA lines. This takes whatever
 * thresholds a league hands it — two for the NFL, three for NCAAM, five for the
 * NBA — and renders the same object. That is what keeps the UI identical across
 * leagues: the component has no idea which sport it's showing.
 *
 * Every color here is a named Tailwind token or a CSS var, never raw hex.
 */

const ZONE: Record<Severity, string> = {
  floor: 'var(--rail-floor)',
  neutral: 'var(--oak)',
  caution: 'var(--rail-caution)',
  warn: 'var(--rail-warn)',
  hard: 'var(--clay)',
};

const TONE: Record<string, string> = {
  ok: 'text-moss',
  limited: 'text-bark',
  blocked: 'text-clay',
  good: 'text-moss',
  bad: 'text-clay',
  neutral: 'text-ink',
};

/** Minimum gap (in % of rail width) between two labels before they'd visually run into each other — tuned for the narrowest tested viewport (375px), where a fixed-px label eats the most rail width. Wider viewports just get a bit of unused headroom on close ticks, never a regression. */
const MIN_GAP_PCT = 13;

/**
 * Which of two label rows each threshold's label renders in. A run of
 * closely-spaced thresholds (e.g. tax/1st apron/2nd apron all within a few
 * percent of each other) alternates rows so adjacent labels don't overlap;
 * isolated thresholds always get row 0. Same assignment feeds both the tick
 * name row (desktop) and the tick value/short row (both), since the
 * underlying spacing problem is identical — only the text differs.
 */
function assignLabelRows(sortedPcts: number[]): number[] {
  const rows: number[] = [];
  sortedPcts.forEach((p, i) => {
    let row = 0;
    for (let j = i - 1; j >= 0; j--) {
      if (rows[j] !== 0) continue;
      if (Math.abs(p - sortedPcts[j]) < MIN_GAP_PCT) row = 1;
      break;
    }
    rows.push(row);
  });
  return rows;
}

export function ThresholdRail({
  league,
  position,
}: {
  league: LeagueModule;
  position: EconomicPosition;
}) {
  const eco = league.economics;
  const thresholds = [...eco.thresholds(position.season)].sort((a, b) => a.value - b.value);
  const [lo, hi] = (eco.domain ?? defaultDomain)(thresholds, position);
  const pct = (v: number) => Math.max(0, Math.min(100, ((v - lo) / (hi - lo)) * 100));

  const status = eco.status(position, thresholds);
  const stats = eco.headline(position, thresholds).slice(0, 4);
  const constraints = eco.constraints(position, thresholds);
  const fmt = (v: number) =>
    eco.unit === 'ratio' ? `${(v / 1_000_000).toFixed(0)}%` : formatUSD(v);

  // Segment i runs from thresholds[i-1] to thresholds[i] and takes the severity
  // of its left edge; below the first line is always `floor`.
  const segments = thresholds.map((t, i) => ({
    left: i === 0 ? 0 : pct(thresholds[i - 1].value),
    right: pct(t.value),
    severity: i === 0 ? ('floor' as Severity) : thresholds[i - 1].severity,
  }));
  segments.push({
    left: pct(thresholds[thresholds.length - 1].value),
    right: 100,
    severity: thresholds[thresholds.length - 1].severity,
  });

  const railLabel = `${eco.title}: ${fmt(position.committed)}, ${status.label}. ${thresholds
    .map((t) => `${t.label} ${fmt(t.value)}`)
    .join(', ')}.`;

  const markerPct = pct(position.committed);
  // The flag is a wide pill — centering it at the true marker % would hang
  // it off the panel edge for a team sitting near the bottom or top of the
  // domain. Clamp it to the container by anchoring to the edge instead of
  // centering once the marker gets close to 0%/100%.
  const flagAlign: 'start' | 'center' | 'end' = markerPct <= 6 ? 'start' : markerPct >= 94 ? 'end' : 'center';
  const flagStyle: CSSProperties =
    flagAlign === 'start'
      ? { left: 0, transform: 'translateX(0)' }
      : flagAlign === 'end'
        ? { left: '100%', transform: 'translateX(-100%)' }
        : { left: `${markerPct}%`, transform: 'translateX(-50%)' };

  // Bottom row only ever has ticks to declutter — the flag lives above the
  // track, so it can't collide with anything down here.
  const tickRows = assignLabelRows(thresholds.map((t) => pct(t.value)));

  // Top row also has to keep tick names clear of the flag above it. Folding
  // the marker into the same sequential assignment (rather than OR-ing a
  // separate "near the marker" check per tick) means a tick bumped for the
  // marker's sake can't then collide with a neighboring tick that also got
  // bumped for its own sake — they share one row budget, assigned in one pass.
  const topOrder = [
    ...thresholds.map((t, i) => ({ id: t.id, p: pct(t.value), tickIndex: i })),
    { id: '__marker', p: markerPct, tickIndex: -1 },
  ].sort((a, b) => a.p - b.p);
  const topOrderRows = assignLabelRows(topOrder.map((o) => o.p));
  const topRows = new Array<number>(thresholds.length);
  topOrder.forEach((o, i) => {
    if (o.tickIndex >= 0) topRows[o.tickIndex] = topOrderRows[i];
  });

  return (
    <section className="mb-7 rounded-panel border border-rule bg-bone-hi px-4 pb-4 pt-5 shadow-panel sm:px-6">
      {/* header */}
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-bark-light">
            {eco.title} · {league.season.label(position.season)}
          </div>
          <div className="font-serif text-[17px]">{status.label}</div>
        </div>
        <dl className="flex gap-5 sm:gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-right">
              <dt className="text-[9.5px] font-bold uppercase tracking-[0.13em] text-bark-light">
                {s.label}
              </dt>
              <dd
                className={`mt-0.5 font-mono text-[19px] tabular-nums tracking-[-0.03em] sm:text-[22px] ${
                  TONE[s.tone ?? 'neutral']
                }`}
              >
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/*
        Rail block — three fixed-height rows stacked around the track
        (tick names / flag / track / tick values) instead of margin patches
        pushing the header and legend out of the way. Every row reserves its
        own space up front, so nothing here can collide with the content
        above or below it regardless of viewport width or where the marker
        lands.
      */}
      <div className="mt-2">
        {/* tick name labels — desktop only. Two lines' worth of height is
            always reserved so a label crowded by a neighbor or the marker
            (topRows, computed above) has somewhere to go without growing
            the row. */}
        <div className="relative hidden h-9 sm:block" aria-hidden>
          {thresholds.map((t, i) => {
            const left = pct(t.value);
            return (
              <span
                key={t.id}
                className={`absolute -translate-x-1/2 whitespace-nowrap text-[9.5px] font-bold uppercase tracking-[0.09em] text-bark ${
                  topRows[i] === 1 ? 'top-0' : 'bottom-0.5'
                }`}
                style={{ left: `${left}%` }}
              >
                {t.label}
              </span>
            );
          })}
        </div>

        {/* marker flag — reserved row, clamped inside the panel at the edges */}
        <div className="relative h-8">
          <b
            className={`absolute bottom-0 whitespace-nowrap rounded bg-walnut px-2 py-[3px] font-mono text-[11px] font-normal text-bone ${
              flagAlign === 'center'
                ? "after:absolute after:left-1/2 after:-bottom-1 after:-ml-1 after:border-4 after:border-b-0 after:border-transparent after:border-t-walnut after:content-['']"
                : ''
            }`}
            style={flagStyle}
          >
            {fmt(position.committed)}
          </b>
        </div>

        {/* track */}
        <div role="img" aria-label={railLabel} className="relative h-4 rounded bg-bone-lo">
          {segments.map((s, i) => (
            <div
              key={i}
              className="absolute inset-y-0"
              style={{
                left: `${s.left}%`,
                width: `${Math.max(0, s.right - s.left)}%`,
                background: ZONE[s.severity],
              }}
            />
          ))}

          {thresholds.map((t) => (
            <div
              key={t.id}
              className="absolute -inset-y-2 w-px bg-bark"
              style={{ left: `${pct(t.value)}%` }}
              title={t.consequence}
            />
          ))}

          <div
            className="absolute -inset-y-2 w-[3px] rounded bg-walnut"
            style={{ left: `${markerPct}%`, transform: 'translateX(-50%)' }}
          />
        </div>

        {/* tick value/short labels below the track — reserved row, tall
            enough for the same second-row offset used above */}
        <div className="relative h-9" aria-hidden>
          {thresholds.map((t, i) => (
            <i
              key={t.id}
              className={`absolute left-0 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] not-italic text-bark-light sm:text-[10px] ${
                tickRows[i] === 1 ? 'top-5' : 'top-1.5'
              }`}
              style={{ left: `${pct(t.value)}%` }}
            >
              <span className="sm:hidden">{t.short}</span>
              <span className="hidden sm:inline">{fmt(t.value)}</span>
            </i>
          ))}
        </div>
      </div>

      {/* constraints */}
      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[11.5px] text-muted">
        {constraints.map((c) => (
          <li key={c.id}>
            {c.label}{' '}
            <b className={`font-mono font-semibold ${TONE[c.tone]}`}>{c.value}</b>
          </li>
        ))}
      </ul>

      {/* obligations — money already spent, which the rail doesn't show */}
      {position.obligations.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 border-t border-rule-soft pt-3 text-[11.5px] text-bark-light">
          {position.obligations.map((o) => (
            <li key={o.id} title={o.note}>
              {o.label} <b className="font-mono font-semibold text-ink">{fmt(o.amount)}</b>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-3 text-[11px] italic text-bark-light">
        {position.source.confidence === 'fixture'
          ? 'Sample data.'
          : `${position.source.provider}, ${new Date(position.source.retrievedAt).toLocaleDateString()}.`}
      </p>
    </section>
  );
}
