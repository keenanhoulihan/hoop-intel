import type { CapPathway } from '@/core/queries';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { PathwayRail } from './PathwayRail';

const TONE_CLASS: Record<'ok' | 'limited' | 'blocked', string> = {
  ok: 'text-moss',
  limited: 'text-bark',
  blocked: 'text-clay',
};

/**
 * Reuses the same `EconomicsModule.constraints()` output the rail's own
 * legend renders — real mechanics, not fabricated team-specific advice.
 * Each pathway states its cost as a general league rule, framed as
 * mechanics and consequences, never as a scheme.
 */
export function CapPathwaysSection({ data }: { data: CapPathway[] }) {
  if (data.length === 0) return <EmptyState label="No cap mechanics on file for this league." />;

  return (
    <ul className="flex flex-col gap-4">
      {data.map((p) => (
        <li key={p.id} className="border-b border-rule-soft pb-4 last:border-0">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[13.5px] font-semibold text-ink">{p.label}</span>
            <span className={`font-mono text-[13px] tabular-nums ${TONE_CLASS[p.tone]}`}>{p.value}</span>
          </div>
          <p className="mt-1 text-[12px] text-muted">{p.cost}</p>
          {p.projectedPct !== null && (
            <>
              <PathwayRail pct={p.projectedPct} />
              <p className="mt-1 text-[10.5px] text-bark-light">Projected position if fully used</p>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
