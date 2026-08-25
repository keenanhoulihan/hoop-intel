'use client';

import { useMemo, useState } from 'react';
import type { InjuryDesignation } from '@/core/domain';
import type { InjuryCard } from '@/core/queries';
import { EmptyState } from './EmptyState';

const DESIGNATION_TONE: Record<InjuryDesignation, string> = {
  out: 'bg-clay text-bone',
  doubtful: 'bg-clay-wash text-clay',
  questionable: 'bg-oak text-walnut',
  'day-to-day': 'bg-oak text-walnut',
  cleared: 'bg-moss-wash text-moss',
};

const DESIGNATION_LABEL: Record<InjuryDesignation, string> = {
  out: 'Out',
  doubtful: 'Doubtful',
  questionable: 'Questionable',
  'day-to-day': 'Day-to-day',
  cleared: 'Cleared',
};

function elapsedLabel(minutes: number): string {
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

/**
 * A status board, not a wire — denser rows, less prose. Deliberately
 * table-like (fixed columns) rather than card-like, so it reads as a
 * different kind of thing from News at a glance.
 */
export function InjuryBoard({ data }: { data: InjuryCard[] }) {
  const [team, setTeam] = useState('all');
  const [designation, setDesignation] = useState('all');

  const teams = useMemo(() => [...new Set(data.map((i) => i.team?.code).filter(Boolean))] as string[], [data]);
  const filtered = data.filter(
    (i) => (team === 'all' || i.team?.code === team) && (designation === 'all' || i.designation === designation),
  );

  if (data.length === 0) return <EmptyState label="No injury designations on file." />;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <FilterSelect label="Team" value={team} onChange={setTeam} options={teams} />
        <FilterSelect
          label="Designation"
          value={designation}
          onChange={setDesignation}
          options={['out', 'doubtful', 'questionable', 'day-to-day', 'cleared']}
          display={(v) => DESIGNATION_LABEL[v as InjuryDesignation]}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState label="No players match that filter." />
      ) : (
        <ul className="flex flex-col divide-y divide-rule-soft border-y border-rule">
          {filtered.map((item) => (
            <li key={item.id} className="grid grid-cols-2 gap-x-3 gap-y-1 py-2.5 sm:grid-cols-[1fr_90px_100px_1fr_70px_80px]">
              <div className="text-[13px] font-semibold text-ink">{item.player?.fullName ?? 'Unknown'}</div>
              <div className="text-[12px] text-bark-light">{item.team?.code}</div>
              <div>
                <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.05em] ${DESIGNATION_TONE[item.designation]}`}>
                  {DESIGNATION_LABEL[item.designation]}
                </span>
              </div>
              <div className="text-[12px] text-muted">
                {item.bodyArea} · {item.timeline}
              </div>
              <div className="font-mono text-[11px] tabular-nums text-bark-light">
                {item.gamesMissed} missed
              </div>
              <div className="font-mono text-[11px] tabular-nums text-bark-light">{elapsedLabel(item.elapsedMinutes)}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  display,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  display?: (v: string) => string;
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded border border-oak-dark bg-bone px-2 py-1 text-[11.5px] text-ink"
    >
      <option value="all">{label}: all</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {display ? display(o) : o}
        </option>
      ))}
    </select>
  );
}
