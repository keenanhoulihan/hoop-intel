import type { ComponentType } from 'react';
import type { LeagueModule, SportId } from './league';
import {
  getCapPathways,
  getDirectionGoals,
  getManagementHistory,
  getOwnership,
  getRoster,
  getTeamRumors,
} from './queries';
import { RosterTable } from '@/components/dashboard/RosterTable';
import { OwnershipSection } from '@/components/team/OwnershipSection';
import { ManagementHistorySection } from '@/components/team/ManagementHistorySection';
import { DirectionGoalsSection } from '@/components/team/DirectionGoalsSection';
import { CapPathwaysSection } from '@/components/team/CapPathwaysSection';
import { PotentialMovesSection } from '@/components/team/PotentialMovesSection';

/**
 * Team-page sections, registry-driven like the dashboard's modules —
 * adding a ninth section is one entry here plus a component. Header and
 * the cap rail are fixed page furniture (same precedent as the dashboard's
 * context rail), not registry entries: neither is an interchangeable
 * feed-like module, both are unique to this page's spine.
 */

export interface TeamSectionCtx {
  league: LeagueModule;
  teamId: string;
}

export interface TeamSectionSpec<T = any> {
  id: string;
  title: string;
  /** 'spine' renders always-visible beneath the rail; 'tab' sits behind the tab strip. */
  place: 'spine' | 'tab';
  sport: SportId;
  dataDependency: (ctx: TeamSectionCtx) => Promise<T>;
  Component: ComponentType<{ data: T }>;
}

// `any` is deliberate — see the same note on DashboardModuleSpec.
export const TEAM_SECTIONS: TeamSectionSpec<any>[] = [
  {
    id: 'roster',
    title: 'Roster & contracts',
    place: 'spine',
    sport: 'basketball',
    dataDependency: (ctx) => getRoster(ctx.league, ctx.teamId),
    Component: RosterTable,
  },
  {
    id: 'cap-pathways',
    title: 'Cap flexibility & pathways',
    place: 'tab',
    sport: 'basketball',
    dataDependency: (ctx) => getCapPathways(ctx.league, ctx.teamId),
    Component: CapPathwaysSection,
  },
  {
    id: 'potential-moves',
    title: 'Potential moves',
    place: 'tab',
    sport: 'basketball',
    dataDependency: (ctx) => getTeamRumors(ctx.teamId),
    Component: PotentialMovesSection,
  },
  {
    id: 'direction-goals',
    title: 'Direction & goals',
    place: 'tab',
    sport: 'basketball',
    dataDependency: (ctx) => getDirectionGoals(ctx.league, ctx.teamId),
    Component: DirectionGoalsSection,
  },
  {
    id: 'ownership',
    title: 'Ownership & front office',
    place: 'tab',
    sport: 'basketball',
    dataDependency: () => getOwnership(),
    Component: OwnershipSection,
  },
  {
    id: 'management-history',
    title: 'Management history',
    place: 'tab',
    sport: 'basketball',
    dataDependency: () => getManagementHistory(),
    Component: ManagementHistorySection,
  },
];

export function spineSections(): TeamSectionSpec<any>[] {
  return TEAM_SECTIONS.filter((s) => s.place === 'spine');
}

export function tabSections(): TeamSectionSpec<any>[] {
  return TEAM_SECTIONS.filter((s) => s.place === 'tab');
}
