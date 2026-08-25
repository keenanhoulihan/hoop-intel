import Link from 'next/link';
import type { ApronWatchEntry } from '@/core/queries';
import { PanelShell } from './PanelShell';

const BADGE: Record<'apron1' | 'apron2', string> = {
  apron1: 'bg-clay-wash text-clay',
  apron2: 'bg-clay text-bone',
};

export function ApronWatchPanel({ data }: { data: ApronWatchEntry[] }) {
  return (
    <PanelShell title="Apron watch" empty={data.length === 0} emptyLabel="No teams over the first apron.">
      <ul className="flex flex-col gap-2">
        {data.map(({ team, band, committed }) => (
          <li key={team.id}>
            <Link
              href={`/${team.league}/${team.id}`}
              className="flex items-center justify-between gap-2 text-[12.5px] hover:text-walnut"
            >
              <span className="flex items-center gap-2">
                <span className={`rounded px-1.5 py-0.5 text-[9.5px] font-bold ${BADGE[band]}`}>
                  {band === 'apron1' ? '1ST' : '2ND'}
                </span>
                <span className="text-ink">{team.name}</span>
              </span>
              <span className="font-mono text-[12px] tabular-nums text-bark-light">{committed}</span>
            </Link>
          </li>
        ))}
      </ul>
    </PanelShell>
  );
}
