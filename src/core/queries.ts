import type { LeagueId } from './league';
import type { Game, Player, Team, Transaction } from './domain';
import { GAMES, GAME_HIGHLIGHTS, TEAMS, TRANSACTIONS, playerById } from './domain-fixtures';

/**
 * The provider-layer seam. Components call these, never `domain-fixtures`
 * directly — this is the file a live provider (balldontlie, Sportradar)
 * replaces internals of later, without any component or module changing.
 * Every function degrades to an empty result on failure rather than
 * throwing, matching `credentials.ts`'s "missing/broken provider is a
 * degraded feature, never a crashed page" rule.
 */

function teamById(id: string): Team | null {
  return TEAMS.find((t) => t.id === id) ?? null;
}

export interface GameSummary {
  game: Game;
  home: Team;
  away: Team;
  highlight: { player: Player; line: string } | null;
}

function toSummary(game: Game): GameSummary | null {
  const home = teamById(game.homeTeamId);
  const away = teamById(game.awayTeamId);
  if (!home || !away) return null;
  const hi = GAME_HIGHLIGHTS[game.id];
  const player = hi ? playerById(hi.playerId) : null;
  return { game, home, away, highlight: player && hi ? { player, line: hi.line } : null };
}

export async function getRecentResults(league: LeagueId, limit = 3): Promise<GameSummary[]> {
  try {
    return GAMES.filter((g) => g.league === league && g.status === 'final')
      .sort((a, b) => b.date.localeCompare(a.date))
      .map(toSummary)
      .filter((s): s is GameSummary => s !== null)
      .slice(0, limit);
  } catch {
    return [];
  }
}

export async function getLiveGames(league: LeagueId): Promise<GameSummary[]> {
  try {
    return GAMES.filter((g) => g.league === league && g.status === 'live')
      .map(toSummary)
      .filter((s): s is GameSummary => s !== null);
  } catch {
    return [];
  }
}

export async function getUpcomingGames(league: LeagueId, limit = 2): Promise<GameSummary[]> {
  try {
    return GAMES.filter((g) => g.league === league && g.status === 'scheduled')
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(toSummary)
      .filter((s): s is GameSummary => s !== null)
      .slice(0, limit);
  } catch {
    return [];
  }
}

export interface TransactionSummary {
  transaction: Transaction;
  teams: Team[];
  players: Player[];
}

export async function getRecentTransactions(league: LeagueId, limit = 3): Promise<TransactionSummary[]> {
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
