import { PanelShell } from './PanelShell';

export function AP25Panel({ data }: { data: { rank: number; team: string; conference: string }[] }) {
  return (
    <PanelShell title="AP Top 25" empty={data.length === 0} emptyLabel="Rankings unavailable.">
      <ol className="flex flex-col gap-1.5">
        {data.map((row) => (
          <li key={row.rank} className="flex items-baseline gap-2.5 text-[12.5px]">
            <span className="w-[18px] shrink-0 text-right font-mono tabular-nums text-bark-light">
              {row.rank}
            </span>
            <span className="text-ink">{row.team}</span>
            <span className="ml-auto text-[11px] text-muted">{row.conference}</span>
          </li>
        ))}
      </ol>
    </PanelShell>
  );
}
