import type { RumorCard } from '@/core/queries';
import { EmptyState } from './EmptyState';

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

function elapsedLabel(minutes: number): string {
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function HeatMeter({ heat }: { heat: 1 | 2 | 3 | 4 }) {
  return (
    <span className="flex items-center gap-1" aria-label={`Heat: ${heat} of 4 sources`}>
      <span className="flex gap-0.5" aria-hidden>
        {[1, 2, 3, 4].map((n) => (
          <span key={n} className={`h-2.5 w-1 rounded-sm ${n <= heat ? 'bg-clay' : 'bg-oak'}`} />
        ))}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-bark-light">
        {heat}/4 sources
      </span>
    </span>
  );
}
