import { notFound } from 'next/navigation';
import { ThresholdRail } from '@/components/ThresholdRail';
import { ORGS, positionFor } from '@/core/fixtures';
import { leagueParams, getLeague } from '@/leagues';

export const generateStaticParams = leagueParams;

export default async function CapSheetPage({
  params,
}: {
  params: Promise<{ league: string }>;
}) {
  const { league: id } = await params;
  const league = getLeague(id);
  if (!league) notFound();

  const orgs = ORGS[league.id] ?? [];

  return (
    <main className="mx-auto max-w-[1360px] px-5 pb-20 pt-8 sm:px-7">
      <header className="mb-8 border-b-2 border-walnut pb-4">
        <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-bark-light">
          {league.name}
        </div>
        <h1 className="font-serif text-[clamp(26px,3.4vw,38px)] font-semibold tracking-[-0.01em]">
          {league.economics.title}
        </h1>
      </header>

      {orgs.map((org) => {
        const position = positionFor(org.id);
        return (
          <section key={org.id} id={org.id} className="mb-10 scroll-mt-[110px]">
            <div className="mb-3 flex flex-wrap items-baseline gap-3">
              <h2 className="font-serif text-[22px] font-semibold">{org.name}</h2>
              <span className="text-[12px] text-muted">{Object.values(org.grouping).join(' · ')}</span>
            </div>
            <ThresholdRail league={league} position={position} />
          </section>
        );
      })}
    </main>
  );
}
