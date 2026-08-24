import {
  type EconomicPosition,
  type LeagueModule,
  type Severity,
  type Threshold,
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
 * Requires the palette vars from globals.css (--walnut, --oak, --clay, --bone…).
 */

const ZONE: Record<Severity, string> = {
  floor: '#DFE6DA',
  neutral: 'var(--oak)',
  caution: '#E6CDBD',
  warn: '#CFA089',
  hard: 'var(--clay)',
};

const TONE: Record<string, string> = {
  ok: 'text-[color:var(--moss)]',
  limited: 'text-[color:var(--bark)]',
  blocked: 'text-[color:var(--clay)]',
  good: 'text-[color:var(--moss)]',
  bad: 'text-[color:var(--clay)]',
  neutral: 'text-[color:var(--ink)]',
};

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

  return (
    <section className="mb-7 rounded-[3px] border border-[#D6C9B0] bg-[var(--bone-hi)] px-4 pb-4 pt-5 sm:px-6">
      {/* header */}
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[var(--bark-lo)]">
            {eco.title} · {league.season.label(position.season)}
          </div>
          <div className="font-[family-name:var(--serif)] text-[17px]">{status.label}</div>
        </div>
        <dl className="flex gap-5 sm:gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-right">
              <dt className="text-[9.5px] font-bold uppercase tracking-[0.13em] text-[var(--bark-lo)]">
                {s.label}
              </dt>
              <dd
                className={`mt-0.5 font-[family-name:var(--mono)] text-[19px] tabular-nums tracking-[-0.03em] sm:text-[22px] ${
                  TONE[s.tone ?? 'neutral']
                }`}
              >
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* rail */}
      <div
        role="img"
        aria-label={railLabel}
        className="relative mt-[54px] h-4 rounded-[2px] bg-[var(--bone-lo)] sm:mt-[34px]"
      >
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
          <Tick key={t.id} threshold={t} left={pct(t.value)} label={fmt(t.value)} />
        ))}

        <div
          className="absolute -inset-y-[15px] w-[3px] rounded-[2px] bg-[var(--walnut)]"
          style={{ left: `${pct(position.committed)}%` }}
        >
          <b className="absolute -top-[38px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[2px] bg-[var(--walnut)] px-2 py-[3px] font-[family-name:var(--mono)] text-[11px] font-normal text-[var(--bone)] after:absolute after:left-1/2 after:-bottom-1 after:-ml-1 after:border-4 after:border-b-0 after:border-transparent after:border-t-[var(--walnut)] after:content-['']">
            {fmt(position.committed)}
          </b>
        </div>
      </div>

      {/* constraints */}
      <ul className="mt-[58px] flex flex-wrap gap-x-5 gap-y-2 text-[11.5px] text-[var(--muted)] sm:mt-11">
        {constraints.map((c) => (
          <li key={c.id}>
            {c.label}{' '}
            <b className={`font-[family-name:var(--mono)] font-semibold ${TONE[c.tone]}`}>
              {c.value}
            </b>
          </li>
        ))}
      </ul>

      {/* obligations — money already spent, which the rail doesn't show */}
      {position.obligations.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 border-t border-[#E3D9C6] pt-3 text-[11.5px] text-[var(--bark-lo)]">
          {position.obligations.map((o) => (
            <li key={o.id} title={o.note}>
              {o.label}{' '}
              <b className="font-[family-name:var(--mono)] font-semibold text-[var(--ink)]">
                {fmt(o.amount)}
              </b>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-3 text-[11px] italic text-[var(--bark-lo)]">
        {position.source.confidence === 'fixture'
          ? 'Sample data.'
          : `${position.source.provider}, ${new Date(position.source.retrievedAt).toLocaleDateString()}.`}
      </p>
    </section>
  );
}

function Tick({
  threshold,
  left,
  label,
}: {
  threshold: Threshold;
  left: number;
  label: string;
}) {
  return (
    <div
      className="absolute -inset-y-[9px] w-px bg-[var(--bark)]"
      style={{ left: `${left}%` }}
      title={threshold.consequence}
    >
      <span className="absolute -top-6 left-0 hidden -translate-x-1/2 whitespace-nowrap text-[9.5px] font-bold uppercase tracking-[0.09em] text-[var(--bark)] sm:block">
        {threshold.label}
      </span>
      <i className="absolute -bottom-[19px] left-0 -translate-x-1/2 whitespace-nowrap font-[family-name:var(--mono)] text-[9px] not-italic text-[var(--bark-lo)] sm:text-[10px]">
        <span className="sm:hidden">{threshold.short}</span>
        <span className="hidden sm:inline">{label}</span>
      </i>
    </div>
  );
}
