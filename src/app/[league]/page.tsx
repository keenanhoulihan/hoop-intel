import { notFound } from 'next/navigation';
import { ContextRail } from '@/components/dashboard/ContextRail';
import { DashboardHero } from '@/components/dashboard/DashboardHero';
import { ModuleFrame } from '@/components/dashboard/ModuleFrame';
import { resolveModules } from '@/core/dashboard-registry';
import { getProfile } from '@/core/profile';
import { getWireHighlights } from '@/core/queries';
import { getLeague, leagueParams } from '@/leagues';

export const generateStaticParams = leagueParams;

/**
 * Above-the-fold budget: the hero lede, the News lead (up to ~10 wire items,
 * only 6 rendered on first paint — see NewsSection), and the context rail
 * (Apron watch + Room available, or AP 25) — four modules at most. Page
 * identity is the masthead's "Hoop Intel" wordmark; this page has no title
 * of its own. Transactions, Injuries, and Rumor mill sit below the fold by
 * design.
 */
export default async function LeagueDashboard({
  params,
}: {
  params: Promise<{ league: string }>;
}) {
  const { league: id } = await params;
  const league = getLeague(id);
  if (!league) notFound();

  const profile = getProfile(league.id);
  const ctx = { league: league.id, leagueModule: league, profile };
  const modules = resolveModules(ctx);
  const wire = await getWireHighlights(league);
  const columnModules = modules.filter((m) => m.size !== 'full');
  const fullModules = modules.filter((m) => m.size === 'full');

  return (
    <main className="mx-auto max-w-[1360px] px-5 pb-20 pt-8 sm:px-7">
      <DashboardHero league={league} wire={wire} />

      <div className="flex flex-col gap-10 min-[1121px]:flex-row min-[1121px]:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-10">
          {columnModules.map((m) => (
            <ModuleFrame key={m.id} spec={m} ctx={ctx} />
          ))}
        </div>
        <ContextRail league={league} />
      </div>

      {fullModules.length > 0 && (
        <div className="mt-10 flex flex-col gap-10">
          {fullModules.map((m) => (
            <ModuleFrame key={m.id} spec={m} ctx={ctx} />
          ))}
        </div>
      )}
    </main>
  );
}
