import { EntityCard } from '@/components/EntityCard';
import type { TransactionSummary } from '@/core/queries';
import { EmptyState } from './EmptyState';

export function TransactionsModule({ data }: { data: TransactionSummary[] }) {
  if (data.length === 0) return <EmptyState label="No recent moves." />;

  return (
    <ul className="flex flex-col gap-3">
      {data.map(({ transaction, teams, players }) => (
        <li key={transaction.id} className="rounded-[3px] border border-[#D6C9B0] bg-[var(--bone-hi)] p-4">
          <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[var(--bark-lo)]">
            {transaction.kind} · {teams.map((t) => t.code).join(' / ')}
          </div>
          <p className="mt-1 text-[13px] text-[var(--ink)]">{transaction.description}</p>
          {players.length > 0 && (
            <div className="mt-3 flex flex-col gap-2">
              {players.map((p) => (
                <EntityCard key={p.id} player={p} team={teams.find((t) => t.id === p.teamId) ?? null} />
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
