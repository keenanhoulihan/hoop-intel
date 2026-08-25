import { notFound } from 'next/navigation';
import { ThresholdRail } from '@/components/ThresholdRail';
import { TeamHeader } from '@/components/team/TeamHeader';
import { CapFigureRow } from '@/components/team/CapFigureRow';
import { TeamSectionFrame } from '@/components/team/TeamSectionFrame';
import { TeamTabs } from '@/components/team/TeamTabs';
import { spineSections, tabSections, type TeamSectionCtx } from '@/core/team-section-registry';
import { getCapFigures, getTeamHeader } from '@/core/queries';
import { ORGS } from '@/core/fixtures';
import { getLeague } from '@/leagues';

/**
 * NBA only for this task — NCAAM team pages are explicitly out of scope,
 * not a permanent limit. `[teamId]` is generic so adding NCAAM later is a
 * data question, not a routing one.
 *
 * Nested dynamic segments don't inherit a sibling route's resolved params —
 * `[league]/page.tsx` and `[league]/cap/page.tsx` each declare their own
 * `leagueParams()`, but this leaf has to return the full {league, teamId}
 * combination itself or Next falls back to an unstatic catch-all handler.
 */
export async function generateStaticParams() {
  return (ORGS.nba ?? []).map((o) => ({ league: 'nba', teamId: o.id }));
}

/**
 * Per-screen data budget: header (3 quick stats) + cap figure row (5
 * figures) + the rail itself (up to 4 headline stats, 5 thresholds, 4
 * constraints) + roster (always visible, one row per modeled player) is
 * the page's spine. Only one of the five tabbed sections renders visible
 * content at a time — the rest are mounted but hidden, holding the budget
 * to "spine + one tab" no matter how many sections exist.
 */
export default async function TeamPage({
  params,
}: {
  params: Promise<{ league: string; teamId: string }>;
}) {
  const { league: leagueId, teamId } = await params;
  const league = getLeague(leagueId);
  if (!league || league.id !== 'nba') notFound();

  const org = (ORGS[league.id] ?? []).find((o) => o.id === teamId);
  if (!org) notFound();

  const [header, capFigures] = await Promise.all([getTeamHeader(league, teamId), getCapFigures(league, teamId)]);
  if (!header || !capFigures) notFound();

  const ctx: TeamSectionCtx = { league, teamId };
  const roster = spineSections().find((s) => s.id === 'roster')!;
  const tabs = tabSections().map((spec) => ({
    id: spec.id,
    title: spec.title,
    content: <TeamSectionFrame spec={spec} ctx={ctx} />,
  }));

  return (
    <main className="mx-auto max-w-[1360px] px-5 pb-20 pt-8 sm:px-7">
      <TeamHeader data={header} seasonLabel={league.season.label(header.position.season)} />

      <section className="mb-10">
        <CapFigureRow data={capFigures} />
        <ThresholdRail league={league} position={header.position} />
      </section>

      <div className="mb-12">
        <TeamSectionFrame spec={roster} ctx={ctx} />
      </div>

      <TeamTabs tabs={tabs} />
    </main>
  );
}
