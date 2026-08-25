import { Suspense } from 'react';
import type { LeagueModule } from '@/core/league';
import { getAP25, getApronWatch, getRoomAvailable } from '@/core/queries';
import { ApronWatchPanel } from './ApronWatchPanel';
import { RoomAvailablePanel } from './RoomAvailablePanel';
import { AP25Panel } from './AP25Panel';

/**
 * Right-hand panels — not part of the module registry, since these are
 * fixed page furniture rather than reorderable/addable modules (the brief
 * scopes the registry to News/Transactions/Rumor mill). Still gets its own
 * Suspense boundary and per-panel error isolation, same contract in spirit.
 */
export function ContextRail({ league }: { league: LeagueModule }) {
  return (
    <aside className="grid grid-cols-2 gap-6 min-[1121px]:w-[292px] min-[1121px]:shrink-0 min-[1121px]:grid-cols-1 min-[1121px]:flex min-[1121px]:flex-col">
      <Suspense fallback={null}>
        {league.id === 'ncaam' ? <NcaamPanels /> : <NbaPanels league={league} />}
      </Suspense>
    </aside>
  );
}

async function NbaPanels({ league }: { league: LeagueModule }) {
  let apronWatch: Awaited<ReturnType<typeof getApronWatch>> = [];
  let roomAvailable: Awaited<ReturnType<typeof getRoomAvailable>> = [];
  try {
    [apronWatch, roomAvailable] = await Promise.all([getApronWatch(league), getRoomAvailable(league)]);
  } catch {
    // both panels render their own empty state below
  }
  return (
    <>
      <ApronWatchPanel data={apronWatch} />
      <RoomAvailablePanel data={roomAvailable} />
    </>
  );
}

async function NcaamPanels() {
  let ap25: Awaited<ReturnType<typeof getAP25>> = [];
  try {
    ap25 = await getAP25();
  } catch {
    // panel renders its own empty state
  }
  return <AP25Panel data={ap25} />;
}
