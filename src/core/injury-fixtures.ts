import type { InjuryReport } from './domain';

/**
 * Scoped to the players this repo actually models (BOS/OKC/DET) — unlike
 * News/Transactions/Rumors, the brief doesn't ask injuries to span all 30
 * teams, and a real injury designation needs a real player record behind
 * it. Extending coverage means adding players, not padding this file.
 */
export const INJURIES: InjuryReport[] = [
  { id: 'i1', league: 'nba', playerId: 'porzingis', teamId: 'BOS', designation: 'out', bodyArea: 'Calf', timeline: 'Re-eval in 2 weeks', gamesMissed: 4, updatedAt: '2025-11-18T14:00:00.000Z', elapsedMinutes: 12 },
  { id: 'i2', league: 'nba', playerId: 'athompson', teamId: 'DET', designation: 'doubtful', bodyArea: 'Ankle', timeline: 'Day-to-day monitoring', gamesMissed: 1, updatedAt: '2025-11-18T11:00:00.000Z', elapsedMinutes: 90 },
  { id: 'i3', league: 'nba', playerId: 'holmgren', teamId: 'OKC', designation: 'cleared', bodyArea: 'Hip', timeline: 'Full participation restored', gamesMissed: 2, updatedAt: '2025-11-17T20:00:00.000Z', elapsedMinutes: 600 },
  { id: 'i4', league: 'nba', playerId: 'white', teamId: 'BOS', designation: 'questionable', bodyArea: 'Illness', timeline: 'Game-time decision', gamesMissed: 0, updatedAt: '2025-11-18T09:00:00.000Z', elapsedMinutes: 165 },
  { id: 'i5', league: 'nba', playerId: 'dort', teamId: 'OKC', designation: 'day-to-day', bodyArea: 'Wrist', timeline: 'Reassessed before next game', gamesMissed: 0, updatedAt: '2025-11-18T13:00:00.000Z', elapsedMinutes: 60 },
  { id: 'i6', league: 'nba', playerId: 'ivey', teamId: 'DET', designation: 'out', bodyArea: 'Knee', timeline: 'Multi-week, no return date set', gamesMissed: 6, updatedAt: '2025-11-16T18:00:00.000Z', elapsedMinutes: 1200 },
  { id: 'i7', league: 'nba', playerId: 'jwilliams', teamId: 'OKC', designation: 'questionable', bodyArea: 'Back', timeline: 'Load management, expected to play', gamesMissed: 0, updatedAt: '2025-11-18T07:30:00.000Z', elapsedMinutes: 240 },
  { id: 'i8', league: 'nba', playerId: 'brown', teamId: 'BOS', designation: 'cleared', bodyArea: 'Groin', timeline: 'No restriction', gamesMissed: 3, updatedAt: '2025-11-15T18:00:00.000Z', elapsedMinutes: 2100 },
];

export function injuriesForLeague(league: string): InjuryReport[] {
  return INJURIES.filter((i) => i.league === league).sort((a, b) => a.elapsedMinutes - b.elapsedMinutes);
}
