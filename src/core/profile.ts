import type { LeagueId } from './league';

/**
 * Portable preference profile. Every feature reads through this object, not
 * through onboarding state or inferred behavior directly — those are both
 * just future ways of producing one of these. No onboarding exists yet, so
 * `getProfile` always returns the default, but the read path is real.
 */

export type EngagementDepth = 'casual' | 'engaged' | 'obsessive';

export interface UserProfile {
  league: LeagueId;
  followedTeamIds: string[];
  followedPlayerIds: string[];
  depth: EngagementDepth;
  notificationsEnabled: boolean;
}

export function defaultProfile(league: LeagueId = 'nba'): UserProfile {
  return {
    league,
    followedTeamIds: [],
    followedPlayerIds: [],
    depth: 'casual',
    notificationsEnabled: false,
  };
}

/** Swap point: once onboarding/auth exist, this reads a stored profile and falls back to the default. */
export function getProfile(league: LeagueId = 'nba'): UserProfile {
  return defaultProfile(league);
}
