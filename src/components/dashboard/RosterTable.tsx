'use client';

import { Fragment, useState } from 'react';
import { EntityCard } from '@/components/EntityCard';
import { ageFromBirthDate, type ContractOption } from '@/core/domain';
import { formatUSD } from '@/core/league';
import type { RosterData } from '@/core/queries';
import { EmptyState } from './EmptyState';

const OPTION_LABEL: Record<ContractOption, string> = { player: 'Player opt.', team: 'Team opt.', none: 'None' };
const DESIGNATION_LABEL: Record<string, string> = {
  out: 'OUT',
  doubtful: 'DTB',
  questionable: 'Q',
  'day-to-day': 'DTD',
  cleared: 'CLR',
};

/**
 * One table, not two — roster and contracts share a row. Clicking a name
 * accordion-expands the same shared `EntityCard` used everywhere else a
 * player is referenced (news, transactions), driven at its 'expanded'
 * layer; a second click inside that panel reveals 'deep' (career journey +
 * contract history) without leaving the row.
 */
export function RosterTable({ data }: { data: RosterData }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [deep, setDeep] = useState(false);

  if (data.rows.length === 0) return <EmptyState label="No roster on file." />;

  function toggle(id: string) {
    if (openId === id) {
      setOpenId(null);
      setDeep(false);
    } else {
      setOpenId(id);
      setDeep(false);
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse text-[12.5px]">
        <thead>
          <tr className="border-b border-rule text-left text-[10px] font-bold uppercase tracking-[0.08em] text-bark-light">
            <th className="py-2 pr-2 font-bold">#</th>
            <th className="py-2 pr-2 font-bold">Player</th>
            <th className="py-2 pr-2 font-bold">Pos</th>
            <th className="py-2 pr-2 font-bold">Age</th>
            <th className="py-2 pr-2 font-bold">Ht</th>
            <th className="py-2 pr-2 font-bold">Exp</th>
            <th className="py-2 pr-2 font-bold">Contract</th>
            <th className="py-2 pr-2 text-right font-bold">Cap hit</th>
            <th className="py-2 pr-2 font-bold">Through</th>
            <th className="py-2 pr-2 font-bold">Option</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row) => {
            const isOpen = openId === row.player.id;
            return (
              <Fragment key={row.player.id}>
                <tr className="border-b border-rule-soft">
                  <td className="py-2 pr-2 font-mono tabular-nums text-bark-light">
                    {row.player.jerseyNumber ?? '—'}
                  </td>
                  <td className="py-2 pr-2">
                    <button
                      onClick={() => toggle(row.player.id)}
                      className="flex items-center gap-2 text-left font-semibold text-ink hover:text-walnut"
                      aria-expanded={isOpen}
                    >
                      {row.player.fullName}
                      {row.injury && (
                        <span className="rounded bg-clay-wash px-1 py-0.5 text-[9px] font-bold text-clay">
                          {DESIGNATION_LABEL[row.injury.designation]}
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="py-2 pr-2 text-muted">{row.player.position}</td>
                  <td className="py-2 pr-2 font-mono tabular-nums text-muted">
                    {ageFromBirthDate(row.player.birthDate, data.asOf)}
                  </td>
                  <td className="py-2 pr-2 font-mono tabular-nums text-muted">
                    {Math.floor(row.player.heightInches / 12)}&apos;{row.player.heightInches % 12}&quot;
                  </td>
                  <td className="py-2 pr-2 font-mono tabular-nums text-muted">{row.experience}</td>
                  <td className="py-2 pr-2 text-muted">{row.contract?.type ?? '—'}</td>
                  <td className="py-2 pr-2 text-right font-mono font-semibold tabular-nums text-ink">
                    {row.capHit !== null ? formatUSD(row.capHit) : '—'}
                  </td>
                  <td className="py-2 pr-2 font-mono tabular-nums text-muted">{row.through ?? '—'}</td>
                  <td className="py-2 pr-2">
                    {row.option && row.option !== 'none' ? (
                      <span className="rounded bg-oak px-1.5 py-0.5 text-[9.5px] font-bold text-walnut">
                        {OPTION_LABEL[row.option]}
                      </span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                </tr>
                {isOpen && (
                  <tr className="border-b border-rule-soft">
                    <td colSpan={10} className="py-3">
                      <EntityCard
                        player={row.player}
                        team={null}
                        layer={deep ? 'deep' : 'expanded'}
                        contractStatus={{
                          capHit: row.capHit !== null ? formatUSD(row.capHit) : '—',
                          through: row.through ?? '—',
                          option: row.option ? OPTION_LABEL[row.option] : '—',
                        }}
                        injuryLabel={row.injury ? DESIGNATION_LABEL[row.injury.designation] : undefined}
                        storyEvents={row.storyEvents}
                        contracts={row.careerContracts}
                        onRequestDeep={!deep ? () => setDeep(true) : undefined}
                        asOf={data.asOf}
                      />
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-rule text-[11.5px]">
            <td colSpan={7} className="py-2 pr-2 text-bark-light">
              Other contracts not itemized ({data.otherContractsCount})
            </td>
            <td className="py-2 pr-2 text-right font-mono tabular-nums text-bark-light">
              {formatUSD(data.otherContractsTotal)}
            </td>
            <td colSpan={2} />
          </tr>
          {data.deadMoney > 0 && (
            <tr className="text-[11.5px]">
              <td colSpan={7} className="py-1 pr-2 text-bark-light">
                Dead money (not included in payroll below)
              </td>
              <td className="py-1 pr-2 text-right font-mono tabular-nums text-bark-light">
                {formatUSD(data.deadMoney)}
              </td>
              <td colSpan={2} />
            </tr>
          )}
          <tr className="border-t border-rule font-semibold">
            <td colSpan={7} className="py-2 pr-2 text-ink">
              Total payroll (reconciles to the rail)
            </td>
            <td className="py-2 pr-2 text-right font-mono tabular-nums text-ink">
              {formatUSD(data.grandTotal)}
            </td>
            <td colSpan={2} />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
