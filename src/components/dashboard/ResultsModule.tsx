import { EntityCard } from '@/components/EntityCard';
import type { GameSummary } from '@/core/queries';
import { EmptyState } from './EmptyState';

export function ResultsModule({ data }: { data: GameSummary[] }) {
  if (data.length === 0) return <EmptyState label="No results yet this season." />;

  return (
    <ul className="grid gap-4 sm:grid-cols-3">
      {data.map(({ game, home, away, highlight }) => {
        const homeWon = (game.homeScore ?? 0) > (game.awayScore ?? 0);
        return (
          <li key={game.id} className="rounded-[3px] border border-[#D6C9B0] bg-[var(--bone-hi)] p-4">
            <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[var(--bark-lo)]">
              Final
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className={`text-[15px] ${!homeWon ? 'font-bold text-[var(--ink)]' : 'text-[var(--muted)]'}`}>
                {away.code}
              </span>
              <span className={`font-[family-name:var(--mono)] text-[19px] tabular-nums ${!homeWon ? 'font-bold' : ''}`}>
                {game.awayScore}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className={`text-[15px] ${homeWon ? 'font-bold text-[var(--ink)]' : 'text-[var(--muted)]'}`}>
                {home.code}
              </span>
              <span className={`font-[family-name:var(--mono)] text-[19px] tabular-nums ${homeWon ? 'font-bold' : ''}`}>
                {game.homeScore}
              </span>
            </div>
            {highlight && (
              <div className="mt-3 border-t border-[#E3D9C6] pt-3">
                <EntityCard player={highlight.player} team={home.id === highlight.player.teamId ? home : away} heroStat={{ label: 'Line', value: highlight.line }} />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
