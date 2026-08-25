import Link from 'next/link';
import type { TeamDirectoryEntry } from '@/core/queries';
import { EmptyState } from './EmptyState';

const TONE_CLASS: Record<'moss' | 'oak' | 'clay', string> = {
  moss: 'text-moss',
  oak: 'text-bark',
  clay: 'text-clay',
};

/**
 * The browse surface — a directory, not a module competing for attention.
 * Collapses column count at narrower widths rather than switching to a list
 * layout; tiles are small and information-light enough that a 1-2 column
 * grid reads fine down to phone width.
 */
export function TeamGrid({ data }: { data: TeamDirectoryEntry[] }) {
  if (data.length === 0) return <EmptyState label="No teams on file." />;

  const groups = new Map<string, TeamDirectoryEntry[]>();
  for (const entry of data) {
    const key = `${entry.conference} · ${entry.division}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(entry);
  }

  return (
    <div className="flex flex-col gap-8">
      {[...groups.entries()].map(([label, teams]) => (
        <div key={label}>
          <h3 className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.14em] text-bark-light">{label}</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {teams.map((entry) => (
              <Link
                key={entry.team.id}
                href={entry.team.league === 'nba' ? `/${entry.team.league}/${entry.team.id}` : `/${entry.team.league}/cap#${entry.team.id}`}
                className="flex flex-col gap-2 rounded-panel border border-rule bg-bone-hi p-3 hover:border-walnut"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded bg-walnut font-mono text-[11px] font-bold text-bone">
                  {entry.team.code}
                </span>
                <span className="text-[13px] font-semibold leading-tight text-ink">{entry.team.name}</span>
                <span className="font-mono text-[11px] tabular-nums text-bark-light">{entry.record}</span>
                <span className={`font-mono text-[11px] tabular-nums ${TONE_CLASS[entry.tone]}`}>{entry.payroll}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
