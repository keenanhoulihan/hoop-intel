import type { LeagueModule } from '@/core/league';
import { nba } from './nba';
import { ncaam } from './ncaam';
import { nfl } from './nfl';

/**
 * The only place a league is named. Adding one is a single import and a single
 * line here — routes, nav, the threshold rail, and the org page pick it up with
 * no further edits.
 */
export const LEAGUES = { nba, ncaam, nfl } satisfies Record<string, LeagueModule>;

export type KnownLeagueId = keyof typeof LEAGUES;

export const LEAGUE_IDS = Object.keys(LEAGUES) as KnownLeagueId[];

export function getLeague(id: string): LeagueModule | null {
  return (LEAGUES as Record<string, LeagueModule>)[id] ?? null;
}

/** For `generateStaticParams` on /[league]/... routes. */
export const leagueParams = () => LEAGUE_IDS.map((league) => ({ league }));

/** Grouped for the league switcher, so the header scales past two buttons. */
export function leaguesBySport() {
  const out = new Map<string, LeagueModule[]>();
  for (const l of Object.values(LEAGUES)) {
    const arr = out.get(l.sport) ?? [];
    arr.push(l);
    out.set(l.sport, arr);
  }
  return out;
}
