import type { ComponentType } from 'react';
import type { LeagueId, SportId } from './league';
import type { UserProfile } from './profile';
import { getNews, getRecentTransactions, getRumors } from './queries';
import { NewsSection } from '@/components/dashboard/NewsSection';
import { TransactionsLedger } from '@/components/dashboard/TransactionsLedger';
import { RumorMill } from '@/components/dashboard/RumorMill';

/**
 * Declarative dashboard modules for the main column. Adding one later (the
 * puzzle, a market-movement card) is one entry here plus a component —
 * nothing about the page changes. The context rail (Apron watch / Room
 * available / AP 25) is separate, fixed page furniture, not registry-driven
 * — see ContextRail.tsx.
 */

export interface ModuleLoadCtx {
  league: LeagueId;
  profile: UserProfile;
}

export interface DashboardModuleSpec<T = any> {
  id: string;
  title: string;
  size: 'primary' | 'secondary';
  priority: number;
  /** Parameterized, not assumed — a future non-basketball league filters on this. */
  sport: SportId;
  seeMoreHref?: (ctx: ModuleLoadCtx) => string;
  load: (ctx: ModuleLoadCtx) => Promise<T>;
  Component: ComponentType<{ data: T }>;
}

// `any` is deliberate: this array is heterogeneous by design (each entry's T
// differs), so the registry trades per-entry type-checking for the ability
// to hold every module in one ordered list.
export const REGISTRY: DashboardModuleSpec<any>[] = [
  {
    id: 'news',
    title: 'News',
    size: 'primary',
    priority: 0,
    sport: 'basketball',
    load: (ctx) => getNews(ctx.league),
    Component: NewsSection,
  },
  {
    id: 'transactions',
    title: 'Recent transactions',
    size: 'secondary',
    priority: 1,
    sport: 'basketball',
    load: (ctx) => getRecentTransactions(ctx.league),
    Component: TransactionsLedger,
  },
  {
    id: 'rumors',
    title: 'Rumor mill',
    size: 'secondary',
    priority: 2,
    sport: 'basketball',
    load: (ctx) => getRumors(ctx.league),
    Component: RumorMill,
  },
];

/**
 * Ordering input for the main column. Reordering/hiding/pinning later are
 * changes to this function's output (e.g. reading `profile` to re-sort or
 * filter) — nothing that renders the list needs to know where the order
 * came from.
 */
export function resolveModules(ctx: ModuleLoadCtx): DashboardModuleSpec<any>[] {
  return REGISTRY.slice().sort((a, b) => a.priority - b.priority);
}
