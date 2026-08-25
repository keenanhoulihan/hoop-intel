import type { Contract } from '@/core/domain';
import { formatUSD } from '@/core/league';
import { EmptyState } from './EmptyState';

const ENDED_LABEL: Record<NonNullable<Contract['endedReason']>, string> = {
  expired: 'Expired',
  traded: 'Traded away',
  waived: 'Waived',
  extended: 'Extended',
};

/**
 * Accumulated contract history — every contract across the career, shown
 * as a value-over-time spine sharing the career journey's visual language,
 * plus a running career-earnings total. Genuinely built for N contracts;
 * this repo currently models one active contract per player, so most
 * players show a single node — that's the real extent of what's on file,
 * not a layout limitation.
 */
export function ContractHistorySpine({ contracts }: { contracts: Contract[] }) {
  if (contracts.length === 0) return <EmptyState label="No contract history on file." />;

  const ordered = [...contracts].sort((a, b) => a.signedDate.localeCompare(b.signedDate));
  const careerTotal = ordered.reduce((sum, c) => sum + c.totalValue, 0);
  const maxValue = Math.max(...ordered.map((c) => c.totalValue));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-5 overflow-x-auto pb-2" role="list" aria-label="Contract history">
        {ordered.map((c) => {
          const years = c.years.length;
          const aav = Math.round(c.totalValue / Math.max(1, years));
          const barPct = Math.max(8, Math.round((c.totalValue / maxValue) * 100));
          return (
            <div key={c.id} role="listitem" className="flex w-[188px] shrink-0 flex-col gap-1.5">
              <div className="h-2 rounded bg-bone-lo">
                <div className="h-2 rounded bg-oak-dark" style={{ width: `${barPct}%` }} />
              </div>
              <span className="font-mono text-[10.5px] tabular-nums text-bark-light">
                {new Date(c.signedDate).getFullYear()} · {c.type}
              </span>
              <span className="font-mono text-[15px] font-semibold tabular-nums text-ink">
                {formatUSD(c.totalValue)}
              </span>
              <span className="text-[11px] text-muted">
                {formatUSD(aav)} AAV · {years} yr{years === 1 ? '' : 's'}
              </span>
              <span className="w-fit rounded bg-oak px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.06em] text-walnut">
                {c.endedReason ? ENDED_LABEL[c.endedReason] : 'Active'}
              </span>
            </div>
          );
        })}
      </div>
      <p className="border-t border-rule-soft pt-2 text-[12px] text-bark-light">
        Career earnings on file:{' '}
        <span className="font-mono font-semibold tabular-nums text-ink">{formatUSD(careerTotal)}</span>
      </p>
    </div>
  );
}
