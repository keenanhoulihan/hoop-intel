import type { RoomAvailableEntry } from '@/core/queries';
import { PanelShell } from './PanelShell';

export function RoomAvailablePanel({ data }: { data: RoomAvailableEntry[] }) {
  return (
    <PanelShell title="Room available" empty={data.length === 0} emptyLabel="No teams projecting cap room.">
      <ul className="flex flex-col gap-2">
        {data.map(({ team, room }) => (
          <li key={team.id} className="flex items-center justify-between gap-2 text-[12.5px]">
            <span className="text-ink">{team.name}</span>
            <span className="rounded bg-moss-wash px-1.5 py-0.5 font-mono text-[12px] tabular-nums text-moss">
              {room}
            </span>
          </li>
        ))}
      </ul>
    </PanelShell>
  );
}
