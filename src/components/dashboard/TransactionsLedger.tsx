import { EntityCard } from '@/components/EntityCard';
import type { TransactionSummary } from '@/core/queries';
import type { TransactionKind } from '@/core/domain';
import { EmptyState } from './EmptyState';

const TONE: Record<TransactionKind, 'moss' | 'clay' | 'oak'> = {
  signing: 'moss',
  draft: 'moss',
  extension: 'moss',
  waiver: 'clay',
  release: 'clay',
  trade: 'oak',
  'two-way-conversion': 'oak',
};

const TONE_CLASS: Record<'moss' | 'clay' | 'oak', string> = {
  moss: 'bg-moss-wash text-moss',
  clay: 'bg-clay-wash text-clay',
  oak: 'bg-oak text-walnut',
};

/**
 * A ledger, not a feed — structurally distinct from News on purpose. Fixed
 * column rhythm (date / type / detail / teams) at `sm:` and up so entries
 * read as rows in a record, not cards in a stream; a single stacked block
 * below that, since a true aligned ledger stops paying off at that width.
 */
export function TransactionsLedger({ data }: { data: TransactionSummary[] }) {
  if (data.length === 0) return <EmptyState label="No recent moves." />;

  return (
    <ul className="flex flex-col divide-y divide-rule-soft border-y border-rule">
      {data.map(({ transaction, teams, players }) => (
        <li
          key={transaction.id}
          className="grid gap-x-4 gap-y-2 py-3 sm:grid-cols-[88px_112px_1fr]"
        >
          <div className="font-mono text-[11px] tabular-nums text-bark-light">
            {new Date(transaction.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </div>
          <div>
            <span
              className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.06em] ${TONE_CLASS[TONE[transaction.kind]]}`}
            >
              {transaction.kind}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[13px] text-ink">
              <span className="font-semibold">{teams.map((t) => t.code).join(' / ')}</span>{' '}
              {transaction.description}
            </p>
            {transaction.mechanism && (
              <p className="mt-1 font-mono text-[11px] text-bark-light">{transaction.mechanism}</p>
            )}
            {players.length > 0 && (
              <div className="mt-2 flex flex-col gap-2">
                {players.map((p) => (
                  <EntityCard key={p.id} player={p} team={teams.find((t) => t.id === p.teamId) ?? null} />
                ))}
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
