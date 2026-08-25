import type { Contract, Player, StoryEvent, Team } from '@/core/domain';
import { ageFromBirthDate } from '@/core/domain';
import { PortraitSlot } from './PortraitSlot';
import { CareerJourney } from './dashboard/CareerJourney';
import { ContractHistorySpine } from './dashboard/ContractHistorySpine';

export interface HeroStat {
  label: string;
  value: string;
}

export interface ContractStatus {
  capHit: string;
  through: string;
  option: string;
}

export type EntityCardLayer = 'collapsed' | 'expanded' | 'deep';

/**
 * Shared player reference card — search, team pages, news feed, and
 * predictor results all reuse this. Three layers, one component:
 *
 *   collapsed — photo, name, team, position, one hero stat (unchanged
 *               shape from when this was collapsed-only)
 *   expanded  — portrait slot, physicals, hero line, contract status,
 *               injury status
 *   deep      — everything in expanded plus the career journey timeline
 *               and the accumulated contract-history spine
 *
 * Layer is caller-controlled, not internal state — a roster table drives
 * an accordion, a search result might just render 'expanded' read-only.
 * `onRequestDeep` is how a caller wires the expanded→deep transition to
 * whatever state it's already holding.
 *
 * No photo asset anywhere in any layer — an initials mark / PortraitSlot
 * avoids needing a licensed likeness.
 */
export function EntityCard({
  player,
  team,
  heroStat,
  layer = 'collapsed',
  contractStatus,
  injuryLabel,
  storyEvents,
  contracts,
  onRequestDeep,
  asOf,
}: {
  player: Player;
  team: Team | null;
  heroStat?: HeroStat;
  layer?: EntityCardLayer;
  contractStatus?: ContractStatus;
  injuryLabel?: string;
  storyEvents?: StoryEvent[];
  contracts?: Contract[];
  onRequestDeep?: () => void;
  /** Reference date for age — pass the fixture snapshot date, not the default (real "now"), when rendering fixture data. */
  asOf?: Date;
}) {
  if (layer === 'collapsed') {
    return (
      <div className="flex items-center gap-3 rounded border border-rule-soft bg-bone px-3 py-2">
        <div
          aria-hidden
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-oak font-serif text-[13px] font-semibold text-walnut"
        >
          {initials(player.fullName)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13.5px] font-semibold text-ink">{player.fullName}</div>
          <div className="truncate text-[11px] text-muted">
            {team ? `${team.code} · ` : ''}
            {player.position}
          </div>
        </div>
        {heroStat && (
          <div className="shrink-0 text-right">
            <div className="text-[9px] font-bold uppercase tracking-[0.11em] text-bark-light">
              {heroStat.label}
            </div>
            <div className="font-mono text-[12.5px] tabular-nums text-ink">{heroStat.value}</div>
          </div>
        )}
      </div>
    );
  }

  const age = asOf ? ageFromBirthDate(player.birthDate, asOf) : ageFromBirthDate(player.birthDate);

  return (
    <div className="rounded-panel border border-rule bg-bone-hi p-4">
      <div className="flex gap-4">
        <PortraitSlot initials={initials(player.fullName)} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="text-[17px] font-serif font-semibold text-ink">{player.fullName}</div>
          <div className="mt-0.5 text-[12px] text-muted">
            {team?.name ?? '—'} · {player.position}
            {injuryLabel && (
              <span className="ml-2 rounded bg-clay-wash px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.06em] text-clay">
                {injuryLabel}
              </span>
            )}
          </div>

          <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[12px]">
            <Field label="Age" value={String(age)} />
            <Field label="Height" value={formatHeight(player.heightInches)} />
            <Field label="Weight" value={`${player.weightLbs} lb`} />
            {heroStat && <Field label={heroStat.label} value={heroStat.value} mono />}
          </dl>

          {contractStatus && (
            <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 border-t border-rule-soft pt-2 text-[12px]">
              <Field label="Cap hit" value={contractStatus.capHit} mono />
              <Field label="Through" value={contractStatus.through} mono />
              <Field label="Option" value={contractStatus.option} mono />
            </dl>
          )}

          {layer === 'expanded' && onRequestDeep && (
            <button
              onClick={onRequestDeep}
              className="mt-3 text-[11.5px] font-semibold text-bark hover:text-walnut"
            >
              Career &amp; contracts →
            </button>
          )}
        </div>
      </div>

      {layer === 'deep' && (
        <div className="mt-4 flex flex-col gap-4 border-t border-rule-soft pt-4">
          <div>
            <h4 className="mb-2 text-[10.5px] font-bold uppercase tracking-[0.12em] text-bark-light">
              Career journey
            </h4>
            <CareerJourney events={storyEvents ?? []} />
          </div>
          <div>
            <h4 className="mb-2 text-[10.5px] font-bold uppercase tracking-[0.12em] text-bark-light">
              Contract history
            </h4>
            <ContractHistorySpine contracts={contracts ?? []} />
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-[9px] font-bold uppercase tracking-[0.08em] text-bark-light">{label}</dt>
      <dd className={`text-ink ${mono ? 'font-mono tabular-nums' : ''}`}>{value}</dd>
    </div>
  );
}

function formatHeight(inches: number): string {
  const ft = Math.floor(inches / 12);
  const inch = inches % 12;
  return `${ft}'${inch}"`;
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
