import type { GameSummary } from '@/core/queries';
import { EmptyState } from './EmptyState';

export function UpcomingModule({ data }: { data: GameSummary[] }) {
  return (
    <div className="flex flex-col gap-3">
      {data.length === 0 ? (
        <EmptyState label="Nothing scheduled." />
      ) : (
        <ul className="flex flex-col gap-2">
          {data.map(({ game, home, away }) => (
            <li
              key={game.id}
              className="flex items-center justify-between rounded-[3px] border border-[#D6C9B0] bg-[var(--bone-hi)] px-3 py-2 text-[13px]"
            >
              <span>
                {away.code} @ {home.code}
              </span>
              <span className="font-[family-name:var(--mono)] text-[11px] text-[var(--muted)]">
                {new Date(game.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="rounded-[3px] border border-dashed border-[var(--oak-dk)] bg-[var(--bone)] p-3">
        <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[var(--bark-lo)]">
          Today&rsquo;s puzzle
        </div>
        <p className="mt-1 text-[12.5px] text-[var(--muted)]">Guess the player. Coming soon.</p>
      </div>
    </div>
  );
}
