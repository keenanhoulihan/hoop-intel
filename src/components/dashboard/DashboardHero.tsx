import type { LeagueModule } from '@/core/league';
import type { WireHighlights } from '@/core/queries';

/**
 * The page's lede — one editorial line, a date/season stamp, and up to two
 * live anchors. Replaces the old "{League name} / Dashboard" title block:
 * page identity is the masthead's "Hoop Intel" wordmark, this is content.
 * Kept deliberately small — it's one of the (at most four) things visible
 * above the fold alongside News and the context rail.
 */
export function DashboardHero({ league, wire }: { league: LeagueModule; wire: WireHighlights }) {
  const dateLabel = `${wire.asOf.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} · ${league.season.label(league.season.current)}`;

  const anchors = [
    wire.hotCount > 0
      ? { id: 'hot', text: `${wire.hotCount} developing ${wire.hotCount === 1 ? 'storyline' : 'storylines'}`, href: '#mod-news' }
      : null,
    wire.nextEvent
      ? { id: 'calendar', text: `${wire.nextEvent.label} in ${wire.nextEvent.daysUntil} ${wire.nextEvent.daysUntil === 1 ? 'day' : 'days'}` }
      : null,
  ].filter((a): a is { id: string; text: string; href?: string } => a !== null);

  return (
    <section className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-rule pb-6">
      <p className="max-w-[56ch] font-serif text-[17px] leading-snug text-ink">
        The day&rsquo;s movement across the {league.name}, plus who&rsquo;s approaching the numbers that matter.
      </p>

      <div className="flex shrink-0 flex-col items-end gap-3">
        <div className="text-[10.5px] font-bold uppercase tracking-[0.13em] text-bark-light">{dateLabel}</div>
        {anchors.length > 0 && (
          <ul className="flex flex-wrap justify-end gap-4">
            {anchors.map((a) => (
              <li key={a.id}>
                <LiveAnchor text={a.text} href={a.href} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function LiveAnchor({ text, href }: { text: string; href?: string }) {
  const content = (
    <span className="flex items-center gap-2 text-[12px] text-bark hover:text-walnut">
      <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-moss-mid opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-moss" />
      </span>
      <span className="font-semibold text-moss-hi">{text}</span>
    </span>
  );
  return href ? (
    <a href={href}>{content}</a>
  ) : (
    content
  );
}
