'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { Org } from '@/core/league';

/** Only the plain, serializable fields SubNav needs — never the full
 * LeagueModule, which carries functions (season.label, economics.*) that
 * can't cross the server/client boundary as props. */
export interface SubNavLeague {
  id: string;
  shortName: string;
}

const CHEVRON =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236E5A45' stroke-width='1.5' fill='none' fill-rule='evenodd'/%3E%3C/svg%3E\")";

const selectClass =
  'appearance-none rounded border border-oak-dark bg-bone px-2.5 py-1.5 pr-7 text-[12px] text-ink bg-no-repeat';
const selectStyle = { backgroundImage: CHEVRON, backgroundPosition: 'right 8px center' };

/** Fixed division order per conference — matches the NBA groupings in league.ts. */
const NBA_DIVISION_ORDER: Record<string, string[]> = {
  Eastern: ['Atlantic', 'Central', 'Southeast'],
  Western: ['Northwest', 'Pacific', 'Southwest'],
};

/** Reads the current #hash on mount and on hash change, so the "current team" shows selected without a real per-team route. */
function useHashSelection(): string {
  const [hash, setHash] = useState('');
  useEffect(() => {
    const read = () => setHash(window.location.hash.replace('#', ''));
    read();
    window.addEventListener('hashchange', read);
    return () => window.removeEventListener('hashchange', read);
  }, []);
  return hash;
}

/**
 * Sticky sub-nav beneath the masthead — breadcrumb + league-specific
 * context selects (team picker for NBA, conference + school for NCAAM).
 * Custom-styled native `<select>`s: no dropdown-menu dependency, but no
 * browser-default chrome either.
 */
export function SubNav({ league, orgs }: { league: SubNavLeague; orgs: Org[] }) {
  const pathname = usePathname();
  const onCap = pathname?.endsWith('/cap');
  const hash = useHashSelection();

  return (
    <div className="sticky top-[49px] z-10 border-b border-rule bg-bone-hi">
      <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-3 px-5 py-2.5 sm:px-7">
        <nav aria-label="Breadcrumb" className="text-[11.5px] text-muted">
          <span>Hoop Intel</span>
          <span className="mx-1.5 text-oak-dark">/</span>
          <span className="text-ink">{league.shortName}</span>
          <span className="mx-1.5 text-oak-dark">/</span>
          <span className="font-semibold text-ink">{onCap ? 'Cap sheet' : 'Dashboard'}</span>
        </nav>

        {league.id === 'ncaam' ? (
          <NcaamSelects league={league} orgs={orgs} hash={hash} />
        ) : (
          <NbaTeamSelect league={league} orgs={orgs} hash={hash} />
        )}
      </div>
    </div>
  );
}

function NbaTeamSelect({ league, orgs, hash }: { league: SubNavLeague; orgs: Org[]; hash: string }) {
  const router = useRouter();

  const groups = useMemo(() => {
    const out: { label: string; orgs: Org[] }[] = [];
    for (const [conference, divisions] of Object.entries(NBA_DIVISION_ORDER)) {
      for (const division of divisions) {
        const inDivision = orgs.filter((o) => o.grouping.conference === conference && o.grouping.division === division);
        if (inDivision.length > 0) out.push({ label: `${conference} · ${division}`, orgs: inDivision });
      }
    }
    return out;
  }, [orgs]);

  return (
    <select
      aria-label="Jump to team"
      className={selectClass}
      style={selectStyle}
      value={orgs.some((o) => o.id === hash) ? hash : ''}
      onChange={(e) => {
        router.push(e.target.value ? `/${league.id}/cap#${e.target.value}` : `/${league.id}`);
      }}
    >
      <option value="">Dashboard</option>
      {groups.map((g) => (
        <optgroup key={g.label} label={g.label}>
          {g.orgs.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

function NcaamSelects({ league, orgs, hash }: { league: SubNavLeague; orgs: Org[]; hash: string }) {
  const router = useRouter();
  const conferences = useMemo(
    () => [...new Set(orgs.map((o) => o.grouping.conference).filter(Boolean))],
    [orgs],
  );
  const [conference, setConference] = useState('');
  const schools = conference ? orgs.filter((o) => o.grouping.conference === conference) : orgs;

  return (
    <div className="flex gap-2">
      <select
        aria-label="Conference"
        className={selectClass}
        style={selectStyle}
        value={conference}
        onChange={(e) => setConference(e.target.value)}
      >
        <option value="">All conferences</option>
        {conferences.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select
        aria-label="Jump to school"
        className={selectClass}
        style={selectStyle}
        value={schools.some((o) => o.id === hash) ? hash : ''}
        onChange={(e) => {
          router.push(e.target.value ? `/${league.id}/cap#${e.target.value}` : `/${league.id}`);
        }}
      >
        <option value="">Dashboard</option>
        {schools.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
    </div>
  );
}
