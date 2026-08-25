import Link from 'next/link';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { resolveModules } from '@/core/dashboard-registry';
import { getProfile } from '@/core/profile';

/**
 * Information budget for this screen (max visible data points, enforced by
 * the module set below — nothing else renders above the fold):
 *   Results (primary):   3 games x (matchup + score + 1 highlight card) ≈ 15
 *   Live now:             1 game x (matchup + score)                   ≈ 4
 *   Coming up:             2 games x (matchup + date) + 1 puzzle teaser ≈ 5
 *   Transactions:          3 moves x (kind/teams + description)        ≈ 9
 * Total ≈ 33 data points. Anything past that lives behind a module's own
 * "see more" link, never added to this page directly.
 */
export default function Home() {
  const league = 'nba' as const;
  const profile = getProfile(league);
  const ctx = { league, profile };
  const modules = resolveModules(ctx);

  return (
    <main className="mx-auto max-w-[1360px] px-5 pb-20 pt-8 sm:px-7">
      <header className="mb-9 flex flex-wrap items-end justify-between gap-4 border-b-2 border-[var(--walnut)] pb-4">
        <div>
          <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[var(--bark-lo)]">
            Hoop Intel
          </div>
          <h1 className="font-[family-name:var(--serif)] text-[clamp(26px,3.4vw,38px)] font-semibold tracking-[-0.01em]">
            Today in the NBA
          </h1>
        </div>
        <Link
          href={`/${league}`}
          className="rounded-[2px] border border-[var(--oak-dk)] px-3 py-1.5 text-[11.5px] font-bold uppercase tracking-[0.11em] text-[var(--bark)] hover:bg-[var(--oak)]"
        >
          Cap sheet
        </Link>
      </header>

      <DashboardGrid modules={modules} ctx={ctx} />
    </main>
  );
}
