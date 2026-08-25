import { notFound } from 'next/navigation';
import { ContextRail } from '@/components/dashboard/ContextRail';
import { ModuleFrame } from '@/components/dashboard/ModuleFrame';
import { resolveModules } from '@/core/dashboard-registry';
import { getProfile } from '@/core/profile';
import { getLeague, leagueParams } from '@/leagues';

export const generateStaticParams = leagueParams;

/**
 * Above-the-fold budget: the News lead (up to ~10 wire items, each
 * timestamp+category+headline+dek+team+source ≈ 6 fields) plus the top of
 * the transactions ledger (visible without scrolling, not fully expanded).
 * That's the primary module plus the start of the second — four modules
 * max are ever on this page at all (News, Transactions, Rumor mill, plus
 * the context rail), and Rumor mill sits below the fold by design.
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
  const ctx = { league: league.id, profile };
  const modules = resolveModules(ctx);

  return (
    <main className="mx-auto max-w-[1360px] px-5 pb-20 pt-8 sm:px-7">
      <header className="mb-8 border-b-2 border-walnut pb-4">
        <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-bark-light">
          {league.name}
        </div>
        <h1 className="font-serif text-[clamp(26px,3.4vw,38px)] font-semibold tracking-[-0.01em]">
          Dashboard
        </h1>
      </header>

      <div className="flex flex-col gap-10 min-[1121px]:flex-row min-[1121px]:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-10">
          {modules.map((m) => (
            <ModuleFrame key={m.id} spec={m} ctx={ctx} />
          ))}
        </div>
        <ContextRail league={league} />
      </div>
    </main>
  );
}
