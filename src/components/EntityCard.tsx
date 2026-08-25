import type { Player, Team } from '@/core/domain';

export interface HeroStat {
  label: string;
  value: string;
}

/**
 * Shared player reference card — search, team pages, news feed, and predictor
 * results all reuse this. Collapsed (L0) only for now: photo, name, team,
 * position, one hero stat. The L1-L3 expand layers wrap this later; this
 * component doesn't grow into them itself.
 *
 * No photo asset — an initials mark avoids needing a licensed headshot.
 * `heroStat` is supplied by the caller rather than computed here: what's
 * "hero" depends on context (a box-score line in Results, a contract figure
 * in a market module), and the card shouldn't need to know every context.
 */
export function EntityCard({
  player,
  team,
  heroStat,
}: {
  player: Player;
  team: Team | null;
  heroStat?: HeroStat;
}) {
  return (
    <div className="flex items-center gap-3 rounded border border-rule-soft bg-bone px-3 py-2">
      <div
        aria-hidden
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-oak font-serif text-[13px] font-semibold text-walnut"
      >
        {initials(player.fullName)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13.5px] font-semibold text-ink">{player.fullName}</div>
        <div className="truncate text-[11px] text-muted">
          {team ? `${team.code} · ` : ''}
          {player.position}
        </div>
      </div>
      {heroStat && (
        <div className="shrink-0 text-right">
          <div className="text-[9px] font-bold uppercase tracking-[0.11em] text-bark-light">
            {heroStat.label}
          </div>
          <div className="font-mono text-[12.5px] tabular-nums text-ink">{heroStat.value}</div>
        </div>
      )}
    </div>
  );
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
