import type { OwnershipRole } from '@/core/queries';

/** No ownership data is modeled anywhere in this repo yet — every role renders as a real, labeled empty slot rather than a fabricated name. */
export function OwnershipSection({ data }: { data: OwnershipRole[] }) {
  return (
    <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
      {data.map((role) => (
        <div key={role.role} className="border-b border-rule-soft pb-2">
          <dt className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-bark-light">{role.role}</dt>
          <dd className="mt-0.5 text-[13px] italic text-muted">Not yet on file</dd>
        </div>
      ))}
    </dl>
  );
}
