import type { RumorCard } from '@/core/queries';
import { EmptyState } from './EmptyState';
import { HeatMeter, elapsedLabel } from './HeatMeter';

/**
 * Explicitly unconfirmed — the design says so before the copy does.
 * 2px oak-dark LEFT border only (no box), tighter density, no team-chip
 * footer: deliberately unlike both News (bordered box, category pill) and
 * the Transactions ledger (ruled rows, type badge), so the two are never
 * visually confusable.
 */
export function RumorMill({ data }: { data: RumorCard[] }) {
  if (data.length === 0) return <EmptyState label="Nothing circulating right now." />;

  return (
    <ul className="flex flex-col gap-5">
      {data.map((rumor) => (
        <li key={rumor.id} className="border-l-2 border-oak-dark pl-4">
          <h3 className="font-serif text-[15px] font-semibold leading-snug text-ink">{rumor.headline}</h3>
          <p className="mt-1 text-[12.5px] text-muted">{rumor.body}</p>
          <div className="mt-2 flex items-center gap-3 text-[11px]">
            <HeatMeter heat={rumor.heat} />
            <span className="italic text-bark-light">{rumor.source}</span>
            <span className="font-mono tabular-nums text-bark-light">{elapsedLabel(rumor.elapsedMinutes)}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
