'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Persistent global chrome. Walnut ground, bone text, 3px clay bottom
 * border, sticky. The league switch and provenance stamp live here so
 * they're present on every page, not just the dashboard.
 */
export function Masthead() {
  const pathname = usePathname();
  const activeLeague = pathname?.split('/')[1];

  return (
    <header className="sticky top-0 z-20 border-b-[3px] border-clay bg-walnut text-bone">
      <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-4 px-5 py-3 sm:px-7">
        <Link href="/" className="font-serif text-[19px] tracking-[-0.01em]">
          Hoop<span className="italic text-oak">Intel</span>
        </Link>

        <nav className="flex overflow-hidden rounded border border-walnut-2" aria-label="League">
          {(['nba', 'ncaam'] as const).map((id) => (
            <Link
              key={id}
              href={`/${id}`}
              aria-current={activeLeague === id ? 'page' : undefined}
              className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.11em] ${
                activeLeague === id ? 'bg-oak text-walnut' : 'text-oak hover:bg-walnut-2'
              }`}
            >
              {id === 'nba' ? 'NBA' : 'NCAAM'}
            </Link>
          ))}
        </nav>

        <div className="hidden text-right text-[10px] font-bold uppercase tracking-[0.12em] text-bark-light sm:block">
          Fixture data
        </div>
      </div>
    </header>
  );
}
