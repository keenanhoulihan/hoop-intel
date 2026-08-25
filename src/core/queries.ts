import { bandOf, formatUSD, type LeagueId, type LeagueModule } from './league';
import type { InjuryReport, NewsItem, Player, Rumor, Team, Transaction } from './domain';
import { ORGS, TEAM_RECORDS, positionFor } from './fixtures';
import { TEAMS, TRANSACTIONS, playerById } from './domain-fixtures';
import { AP_TOP_25, newsForLeague, rumorsForLeague } from './news-fixtures';
import { injuriesForLeague } from './injury-fixtures';

/**
 * The provider-layer seam. Components call these, never `domain-fixtures` /
 * `news-fixtures` / `fixtures` directly — this is the file a live provider
 * replaces internals of later. Every function degrades to an empty result on
 * failure rather than throwing, matching `credentials.ts`'s "missing/broken
 * provider is a degraded feature, never a crashed page" rule.
 */

function teamById(id: string): Team | null {
  return TEAMS.find((t) => t.id === id) ?? null;
}

/* ============================================================
   NEWS + RUMORS
   ============================================================ */

export interface NewsCard extends NewsItem {
  team: Team | null;
}

export async function getNews(league: LeagueId): Promise<NewsCard[]> {
  try {
    return newsForLeague(league).map((n) => ({ ...n, team: n.teamId ? teamById(n.teamId) : null }));
  } catch {
    return [];
  }
}

export interface RumorCard extends Rumor {
  teams: Team[];
  players: Player[];
}

export async function getRumors(league: LeagueId): Promise<RumorCard[]> {
  try {
    return rumorsForLeague(league).map((r) => ({
      ...r,
      teams: r.teamIds.map(teamById).filter((x): x is Team => x !== null),
      players: r.playerIds.map(playerById).filter((x): x is Player => x !== null),
    }));
  } catch {
    return [];
  }
}

/* ============================================================
   TRANSACTIONS (ledger)
   ============================================================ */

export interface TransactionSummary {
  transaction: Transaction;
  teams: Team[];
  players: Player[];
}

export async function getRecentTransactions(league: LeagueId, limit = 6): Promise<TransactionSummary[]> {
  try {
    return TRANSACTIONS.filter((t) => t.league === league)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, limit)
      .map((t) => ({
        transaction: t,
        teams: t.teamIds.map(teamById).filter((x): x is Team => x !== null),
        players: t.playerIds.map(playerById).filter((x): x is Player => x !== null),
      }));
  } catch {
    return [];
  }
}

/* ============================================================
   CONTEXT RAIL — apron watch / room available (NBA), AP 25 (NCAAM)
   ============================================================ */

export interface ApronWatchEntry {
  team: Team;
  band: 'apron1' | 'apron2';
  committed: string;
}

export async function getApronWatch(league: LeagueModule): Promise<ApronWatchEntry[]> {
  try {
    const orgs = ORGS[league.id] ?? [];
    const rows = orgs
      .map((org) => {
        const position = positionFor(org.id);
        const thresholds = league.economics.thresholds(position.season);
        const band = bandOf(position, thresholds);
        if (band?.id !== 'apron1' && band?.id !== 'apron2') return null;
        return {
          team: TEAMS.find((t) => t.id === org.id) ?? { ...org, roster: [] },
          band: band.id as 'apron1' | 'apron2',
          committed: formatUSD(position.committed),
          sort: position.committed,
        };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null)
      .sort((a, b) => b.sort - a.sort);
    return rows.map(({ sort: _sort, ...r }) => r);
  } catch {
    return [];
  }
}

export interface RoomAvailableEntry {
  team: Team;
  room: string;
}

export async function getRoomAvailable(league: LeagueModule): Promise<RoomAvailableEntry[]> {
  try {
    const orgs = ORGS[league.id] ?? [];
    const rows = orgs
      .map((org) => {
        const position = positionFor(org.id);
        const thresholds = league.economics.thresholds(position.season);
        const cap = thresholds.find((t) => t.id === 'cap' || t.id === 'hoops');
        if (!cap || position.committed >= cap.value) return null;
        return {
          team: TEAMS.find((t) => t.id === org.id) ?? { ...org, roster: [] },
          room: formatUSD(cap.value - position.committed),
          sort: cap.value - position.committed,
        };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null)
      .sort((a, b) => b.sort - a.sort);
    return rows.map(({ sort: _sort, ...r }) => r);
  } catch {
    return [];
  }
}

export async function getAP25(): Promise<typeof AP_TOP_25> {
  try {
    return AP_TOP_25;
  } catch {
    return [];
  }
}

/* ============================================================
   INJURIES
   ============================================================ */

export interface InjuryCard extends InjuryReport {
  player: Player | null;
  team: Team | null;
}

export async function getInjuries(league: LeagueId): Promise<InjuryCard[]> {
  try {
    return injuriesForLeague(league).map((i) => ({
      ...i,
      player: playerById(i.playerId),
      team: teamById(i.teamId),
    }));
  } catch {
    return [];
  }
}

/* ============================================================
   TEAM DIRECTORY — full-width grid, grouped by division
   ============================================================ */

export interface TeamDirectoryEntry {
  team: Team;
  division: string;
  conference: string;
  record: string;
  payroll: string;
  tone: 'moss' | 'oak' | 'clay';
}

export async function getTeamDirectory(league: LeagueModule): Promise<TeamDirectoryEntry[]> {
  try {
    const orgs = ORGS[league.id] ?? [];
    return orgs.map((org) => {
      const position = positionFor(org.id);
      const thresholds = league.economics.thresholds(position.season);
      const band = bandOf(position, thresholds);
      const tone: 'moss' | 'oak' | 'clay' =
        band?.id === 'apron1' || band?.id === 'apron2' ? 'clay' : band?.id === 'cap' || band?.id === 'tax' ? 'oak' : 'moss';
      const record = TEAM_RECORDS[org.id];
      return {
        team: TEAMS.find((t) => t.id === org.id) ?? { ...org, roster: [] },
        division: org.grouping.division ?? '',
        conference: org.grouping.conference ?? '',
        record: record ? `${record.wins}-${record.losses}` : '—',
        payroll: formatUSD(position.committed),
        tone,
      };
    });
  } catch {
    return [];
  }
}
