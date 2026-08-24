import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ThresholdRail } from '@/components/ThresholdRail';
import { ORGS, positionFor } from '@/core/fixtures';
import { LEAGUE_IDS, getLeague, leagueParams } from '@/leagues';

export const generateStaticParams = leagueParams;

export default async function LeaguePage({
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
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b-2 border-[var(--walnut)] pb-4">
        <div>
          <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[var(--bark-lo)]">
            {league.name}
          </div>
          <h1 className="font-[family-name:var(--serif)] text-[clamp(26px,3.4vw,38px)] font-semibold tracking-[-0.01em]">
            {league.economics.title}
          </h1>
        </div>
        <nav className="flex gap-2">
          {LEAGUE_IDS.map((l) => (
            <Link
              key={l}
              href={`/${l}`}
              aria-current={l === league.id ? 'page' : undefined}
              className={`rounded-[2px] border px-3 py-1.5 text-[11.5px] font-bold uppercase tracking-[0.11em] ${
                l === league.id
                  ? 'border-[var(--walnut)] bg-[var(--walnut)] text-[var(--bone)]'
                  : 'border-[var(--oak-dk)] text-[var(--bark)] hover:bg-[var(--oak)]'
              }`}
            >
              {getLeague(l)!.shortName}
            </Link>
          ))}
        </nav>
      </header>

      {orgs.map((org) => {
        const position = positionFor(org.id);
        return (
          <section key={org.id} className="mb-10">
            <div className="mb-3 flex flex-wrap items-baseline gap-3">
              <h2 className="font-[family-name:var(--serif)] text-[22px] font-semibold">
                {org.name}
              </h2>
              <span className="text-[12px] text-[var(--muted)]">
                {Object.values(org.grouping).join(' · ')}
              </span>
            </div>
            <ThresholdRail league={league} position={position} />
          </section>
        );
      })}
    </main>
  );
}
