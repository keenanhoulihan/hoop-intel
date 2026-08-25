import type { ComponentType } from 'react';
import type { LeagueId, LeagueModule, SportId } from './league';
import type { UserProfile } from './profile';
import { getInjuries, getNews, getRecentTransactions, getRumors, getTeamDirectory } from './queries';
import { NewsSection } from '@/components/dashboard/NewsSection';
import { TransactionsLedger } from '@/components/dashboard/TransactionsLedger';
import { InjuryBoard } from '@/components/dashboard/InjuryBoard';
import { RumorMill } from '@/components/dashboard/RumorMill';
import { TeamGrid } from '@/components/dashboard/TeamGrid';

/**
 * Declarative dashboard modules for the main column, plus full-width
 * sections (Team directory) that span past it. Adding a sixth section later
 * is one entry here plus a component — nothing about the page changes. The
 * context rail (Apron watch / Room available / AP 25) is separate, fixed
 * page furniture, not registry-driven — see ContextRail.tsx.
 */

export interface ModuleLoadCtx {
  league: LeagueId;
  leagueModule: LeagueModule;
  profile: UserProfile;
}

export interface DashboardModuleSpec<T = any> {
  id: string;
  title: string;
  /** 'full' spans the whole page width (main column + context rail), not just the main column. */
  size: 'primary' | 'secondary' | 'full';
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
    id: 'injuries',
    title: 'Injuries',
    size: 'secondary',
    priority: 2,
    sport: 'basketball',
    load: (ctx) => getInjuries(ctx.league),
    Component: InjuryBoard,
  },
  {
    id: 'rumors',
    title: 'Rumor mill',
    size: 'secondary',
    priority: 3,
    sport: 'basketball',
    load: (ctx) => getRumors(ctx.league),
    Component: RumorMill,
  },
  {
    id: 'team-directory',
    title: 'Team directory',
    size: 'full',
    priority: 4,
    sport: 'basketball',
    load: (ctx) => getTeamDirectory(ctx.leagueModule),
    Component: TeamGrid,
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
