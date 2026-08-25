import { notFound } from 'next/navigation';
import { ContextRail } from '@/components/dashboard/ContextRail';
import { ModuleFrame } from '@/components/dashboard/ModuleFrame';
import { resolveModules } from '@/core/dashboard-registry';
import { getProfile } from '@/core/profile';
import { getLeague, leagueParams } from '@/leagues';

export const generateStaticParams = leagueParams;

/**
 * Above-the-fold budget: News lead (up to ~10 wire items, each
 * timestamp+category+headline+dek+team+source ≈ 6 fields) plus the top of
 * the transactions ledger — that's the primary module plus the start of the
 * second. Injuries, Rumor mill, and the Team directory sit below the fold
 * by design; four sections (News, Transactions, Injuries, Rumor mill) plus
 * the context rail are the whole page, and the Team directory is a fifth,
 * full-width section people scroll to, not a module competing above it.
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
  const columnModules = modules.filter((m) => m.size !== 'full');
  const fullModules = modules.filter((m) => m.size === 'full');

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
