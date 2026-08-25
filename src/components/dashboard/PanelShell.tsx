import { EmptyState } from './EmptyState';

/** Shared chrome for context-rail panels — 2px walnut top border, same signature as every module heading. */
export function PanelShell({
  title,
  empty,
  emptyLabel,
  children,
}: {
  title: string;
  empty?: boolean;
  emptyLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t-2 border-walnut pt-3">
      <h2 className="mb-3 font-serif text-[15px] font-semibold text-ink">{title}</h2>
      {empty ? <EmptyState label={emptyLabel ?? 'Nothing to show.'} /> : children}
    </section>
  );
}
