import { EmptyState } from './EmptyState';

/**
 * Shared chrome for context-rail panels — 2px moss top border, distinct from
 * the walnut rule that heads every main-column module. These panels are
 * informational (apron watch, room available, rankings), not story content.
 */
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
    <section className="border-t-2 border-moss-hi pt-3">
      <h2 className="mb-3 font-serif text-[15px] font-semibold text-ink">{title}</h2>
      {empty ? <EmptyState label={emptyLabel ?? 'Nothing to show.'} /> : children}
    </section>
  );
}
