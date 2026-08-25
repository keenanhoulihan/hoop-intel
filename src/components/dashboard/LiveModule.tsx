import type { GameSummary } from '@/core/queries';
import { EmptyState } from './EmptyState';

export function LiveModule({ data }: { data: GameSummary[] }) {
  if (data.length === 0) return <EmptyState label="No games live right now." />;

  return (
    <ul className="flex flex-col gap-3">
      {data.map(({ game, home, away }) => (
        <li key={game.id} className="rounded-[3px] border border-[#D6C9B0] bg-[var(--bone-hi)] p-4">
          <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-[var(--clay)]">
            <span aria-hidden className="h-[6px] w-[6px] rounded-full bg-[var(--clay)]" />
            Live
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-[15px]">{away.code}</span>
            <span className="font-[family-name:var(--mono)] text-[19px] tabular-nums">{game.awayScore}</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-[15px]">{home.code}</span>
            <span className="font-[family-name:var(--mono)] text-[19px] tabular-nums">{game.homeScore}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
