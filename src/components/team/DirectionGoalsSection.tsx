import type { DirectionGoals } from '@/core/queries';
import { EmptyState } from '@/components/dashboard/EmptyState';

const SEVERITY_TONE: Record<string, string> = {
  floor: 'text-moss',
  neutral: 'text-ink',
  caution: 'text-bark',
  warn: 'text-clay',
  hard: 'text-clay',
};

/**
 * The one honestly-derivable fact here is the cap band itself — everything
 * else (competitive posture, contract-driven timeline, roster-construction
 * constraints) needs real front-office reporting this repo doesn't model,
 * so those render as labeled empty slots rather than a guessed verdict.
 */
export function DirectionGoalsSection({ data }: { data: DirectionGoals | null }) {
  if (!data) return <EmptyState label="No direction data on file." />;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <dt className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-bark-light">Current cap band</dt>
        <dd className={`font-serif text-[16px] ${SEVERITY_TONE[data.bandSeverity] ?? 'text-ink'}`}>{data.bandLabel}</dd>
      </div>
      <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
        {['Competitive posture', 'Contention window', 'Roster-construction constraints'].map((label) => (
          <div key={label} className="border-b border-rule-soft pb-2">
            <dt className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-bark-light">{label}</dt>
            <dd className="mt-0.5 text-[13px] italic text-muted">Not yet on file</dd>
          </div>
        ))}
      </div>
    </div>
  );
}
