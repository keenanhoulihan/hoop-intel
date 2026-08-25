import type { CapFigures } from '@/core/queries';

export function CapFigureRow({ data }: { data: CapFigures }) {
  const items: { label: string; value: string | null }[] = [
    { label: 'Payroll', value: data.payroll },
    { label: 'To tax', value: data.toTax },
    { label: 'To 1st apron', value: data.toApron1 },
    { label: 'To 2nd apron', value: data.toApron2 },
    { label: 'Dead money', value: data.deadMoney },
  ];
  return (
    <dl className="mb-4 flex flex-wrap gap-x-7 gap-y-2">
      {items.map((i) => (
        <div key={i.label}>
          <dt className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-bark-light">{i.label}</dt>
          <dd className="font-mono text-[16px] tabular-nums text-ink">{i.value ?? '—'}</dd>
        </div>
      ))}
    </dl>
  );
}
