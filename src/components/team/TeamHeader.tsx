import { formatUSD } from '@/core/league';
import type { TeamHeaderData } from '@/core/queries';

const TONE_CLASS: Record<'moss' | 'oak' | 'clay', string> = {
  moss: 'text-moss',
  oak: 'text-bark',
  clay: 'text-clay',
};

export function TeamHeader({ data, seasonLabel }: { data: TeamHeaderData; seasonLabel: string }) {
  const { team, record, seed, payrollTone, position } = data;
  return (
    <header className="mb-8 flex flex-wrap items-start justify-between gap-6 border-b-2 border-walnut pb-5">
      <div className="flex items-start gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded bg-walnut font-mono text-[15px] font-bold text-bone">
          {team.code}
        </span>
        <div>
          <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-bark-light">
            {team.grouping.conference} · {team.grouping.division}
          </div>
          <h1 className="font-serif text-[clamp(24px,3.2vw,34px)] font-semibold tracking-[-0.01em]">
            {team.name}
          </h1>
          <p className="mt-1 text-[12px] text-muted">
            {team.venue} · {team.code} · {seasonLabel}
          </p>
        </div>
      </div>

      <dl className="flex gap-6 text-right">
        <div>
          <dt className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-bark-light">Record</dt>
          <dd className="font-mono text-[19px] tabular-nums text-ink">{record}</dd>
        </div>
        <div>
          <dt className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-bark-light">Conf. seed</dt>
          <dd className="font-mono text-[19px] tabular-nums text-ink">{seed ?? '—'}</dd>
        </div>
        <div>
          <dt className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-bark-light">Payroll</dt>
          <dd className={`font-mono text-[19px] tabular-nums ${TONE_CLASS[payrollTone]}`}>
            {formatUSD(position.committed)}
          </dd>
        </div>
      </dl>
    </header>
  );
}
