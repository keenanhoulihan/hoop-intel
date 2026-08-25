'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { NewsCard as NewsCardData } from '@/core/queries';
import { EmptyState } from './EmptyState';

const CATEGORY_LABEL: Record<string, string> = {
  trades: 'Trades',
  signings: 'Signings',
  waivers: 'Waivers',
  claims: 'Claims',
  extensions: 'Extensions',
  'front-office': 'Front office',
  coaching: 'Coaching',
  'transfer-portal': 'Transfer portal',
  nil: 'NIL',
  commitments: 'Commitments',
  'coaching-carousel': 'Coaching carousel',
};

function label(category: string): string {
  return CATEGORY_LABEL[category] ?? category;
}

function elapsedLabel(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
}

/**
 * News is the one module with a bespoke layout — a filter rail beside its
 * cards, per the brief. Filter state lives here (not in the URL or a
 * server-shared store) since it's purely a client-side view of data already
 * fetched once; nothing about it needs to be linkable yet.
 */
export function NewsSection({ data }: { data: NewsCardData[] }) {
  const [active, setActive] = useState<string>('all');

  const counts = useMemo(() => {
    const c = new Map<string, number>();
    for (const item of data) c.set(item.category, (c.get(item.category) ?? 0) + 1);
    return c;
  }, [data]);

  const categories = useMemo(() => [...counts.keys()].sort(), [counts]);
  const filtered = active === 'all' ? data : data.filter((n) => n.category === active);

  if (data.length === 0) return <EmptyState label="No wire items yet." />;

  return (
    <div className="flex flex-col gap-4 min-[761px]:flex-row min-[761px]:items-start min-[761px]:gap-6">
      <nav
        aria-label="Filter news"
        className="flex gap-2 overflow-x-auto pb-1 min-[761px]:w-[174px] min-[761px]:shrink-0 min-[761px]:flex-col min-[761px]:gap-1 min-[761px]:overflow-visible min-[761px]:pb-0"
      >
        <FilterButton activeId={active} id="all" label="Everything" count={data.length} onClick={setActive} />
        {categories.map((c) => (
          <FilterButton key={c} activeId={active} id={c} label={label(c)} count={counts.get(c) ?? 0} onClick={setActive} />
        ))}
      </nav>

      <div className="min-w-0 flex-1">
        {filtered.length === 0 ? (
          <EmptyState
            label={`No ${label(active)} items right now.`}
            action={
              <button
                onClick={() => setActive('all')}
                className="text-[11.5px] font-semibold text-bark hover:text-walnut"
              >
                ← Back to the full wire
              </button>
            }
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {filtered.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function FilterButton({
  activeId,
  id,
  label: text,
  count,
  onClick,
}: {
  activeId: string;
  id: string;
  label: string;
  count: number;
  onClick: (id: string) => void;
}) {
  const isActive = activeId === id;
  return (
    <button
      onClick={() => onClick(id)}
      aria-pressed={isActive}
      className={`flex shrink-0 items-center justify-between gap-2 rounded px-2.5 py-1.5 text-left text-[12px] whitespace-nowrap min-[761px]:whitespace-normal ${
        isActive ? 'bg-oak text-walnut font-semibold' : 'text-bark hover:bg-bone-lo'
      }`}
    >
      <span>{text}</span>
      <span
        className={`rounded px-1.5 text-[10px] font-mono tabular-nums ${
          isActive ? 'bg-walnut text-bone' : 'bg-bone-lo text-bark-light'
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function NewsCard({ item }: { item: NewsCardData }) {
  return (
    <li className="flex flex-col gap-2 rounded-panel border border-rule bg-bone-hi p-4 sm:flex-row sm:gap-4">
      <div className="font-mono text-[11px] tabular-nums text-bark-light sm:w-[42px] sm:shrink-0 sm:pt-0.5">
        {elapsedLabel(item.elapsedMinutes)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-center gap-2">
          <span
            className={`rounded px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.1em] ${
              item.hot ? 'bg-clay text-bone' : 'bg-oak text-walnut'
            }`}
          >
            {label(item.category)}
          </span>
        </div>
        <h3 className="font-serif text-[15px] font-semibold leading-snug text-ink">{item.headline}</h3>
        <p className="mt-1 text-[12.5px] text-muted">{item.dek}</p>
        <div className="mt-2 flex items-center gap-2 text-[11px]">
          {item.team && (
            <Link
              href={item.league === 'nba' ? `/${item.league}/${item.team.id}` : `/${item.league}/cap#${item.team.id}`}
              className="rounded border border-oak-dark px-1.5 py-0.5 font-semibold text-bark hover:bg-oak"
            >
              {item.team.code}
            </Link>
          )}
          <span className="italic text-bark-light">{item.source}</span>
        </div>
      </div>
    </li>
  );
}
