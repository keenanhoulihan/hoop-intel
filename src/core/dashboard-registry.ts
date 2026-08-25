import type { ComponentType } from 'react';
import type { LeagueId, SportId } from './league';
import type { UserProfile } from './profile';
import { getLiveGames, getRecentResults, getRecentTransactions, getUpcomingGames } from './queries';
import { ResultsModule } from '@/components/dashboard/ResultsModule';
import { LiveModule } from '@/components/dashboard/LiveModule';
import { UpcomingModule } from '@/components/dashboard/UpcomingModule';
import { TransactionsModule } from '@/components/dashboard/TransactionsModule';

/**
 * Declarative dashboard modules. Adding a module later (the puzzle, a market
 * movement card, a live-game ticker) is one entry here plus a component —
 * nothing about the page or the layout changes.
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
    id: 'results',
    title: 'Results',
    size: 'primary',
    priority: 0,
    sport: 'basketball',
    load: (ctx) => getRecentResults(ctx.league),
    Component: ResultsModule,
    seeMoreHref: (ctx) => `/${ctx.league}`,
  },
  {
    id: 'live',
    title: 'Live now',
    size: 'secondary',
    priority: 1,
    sport: 'basketball',
    load: (ctx) => getLiveGames(ctx.league),
    Component: LiveModule,
  },
  {
    id: 'upcoming',
    title: 'Coming up',
    size: 'secondary',
    priority: 2,
    sport: 'basketball',
    load: (ctx) => getUpcomingGames(ctx.league),
    Component: UpcomingModule,
  },
  {
    id: 'transactions',
    title: 'Transactions',
    size: 'secondary',
    priority: 3,
    sport: 'basketball',
    load: (ctx) => getRecentTransactions(ctx.league),
    Component: TransactionsModule,
  },
];

/**
 * Ordering input for the slot layout. Reordering/hiding/pinning later are
 * changes to this function's output (e.g. reading `profile` to re-sort or
 * filter) — the layout itself never needs to know where the order came from.
 */
export function resolveModules(ctx: ModuleLoadCtx): DashboardModuleSpec<any>[] {
  return REGISTRY.slice().sort((a, b) => a.priority - b.priority);
}
