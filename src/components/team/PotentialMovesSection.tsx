import type { TeamRumorCard } from '@/core/queries';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { EntityCard } from '@/components/EntityCard';
import { HeatMeter, elapsedLabel } from '@/components/dashboard/HeatMeter';

/** Team-scoped rumors — same heat-meter treatment as the dashboard's Rumor mill, filtered to this team. */
export function PotentialMovesSection({ data }: { data: TeamRumorCard[] }) {
  if (data.length === 0) return <EmptyState label="Nothing circulating on this team right now." />;

  return (
    <ul className="flex flex-col gap-5">
      {data.map((rumor) => (
        <li key={rumor.id} className="border-l-2 border-oak-dark pl-4">
          <h3 className="font-serif text-[15px] font-semibold leading-snug text-ink">{rumor.headline}</h3>
          <p className="mt-1 text-[12.5px] text-muted">{rumor.body}</p>
          {rumor.players.length > 0 && (
            <div className="mt-2 flex flex-col gap-2">
              {rumor.players.map((p) => (
                <EntityCard key={p.id} player={p} team={null} />
              ))}
            </div>
          )}
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
