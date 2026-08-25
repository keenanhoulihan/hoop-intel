import type { StoryEvent } from '@/core/domain';
import { EmptyState } from './EmptyState';

const KIND_TONE: Record<StoryEvent['kind'], string> = {
  draft: 'bg-oak text-walnut',
  trade: 'bg-oak text-walnut',
  signing: 'bg-moss-wash text-moss',
  injury: 'bg-clay-wash text-clay',
  award: 'bg-moss-wash text-moss',
  milestone: 'bg-moss-wash text-moss',
  debut: 'bg-oak text-walnut',
  retirement: 'bg-oak text-walnut',
};

/**
 * Career journey — horizontal scrollable spine driven by StoryEvent. The
 * same table a team's management history will read from later; nothing
 * player-specific about the shape.
 */
export function CareerJourney({ events }: { events: StoryEvent[] }) {
  if (events.length === 0) return <EmptyState label="No career events on file yet." />;

  return (
    <div className="flex gap-5 overflow-x-auto pb-2" role="list" aria-label="Career journey">
      {events.map((e, i) => (
        <div key={e.id} role="listitem" className="relative flex w-[168px] shrink-0 flex-col gap-1.5 pt-4">
          <span
            aria-hidden
            className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-walnut"
          />
          {i < events.length - 1 && (
            <span aria-hidden className="absolute left-[6px] top-[6px] h-px w-[168px] bg-oak-dark" />
          )}
          <span className="font-mono text-[10.5px] tabular-nums text-bark-light">
            {new Date(e.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
          </span>
          <span className={`w-fit rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] ${KIND_TONE[e.kind]}`}>
            {e.kind}
          </span>
          <span className="text-[12.5px] leading-snug text-ink">{e.headline}</span>
          {e.detail && <span className="text-[11px] text-muted">{e.detail}</span>}
        </div>
      ))}
    </div>
  );
}
