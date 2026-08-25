/**
 * The provenance line matters: while running on fixtures, say so plainly.
 * League structure (teams, thresholds, rules) is real; players, news,
 * transactions, and rumors are sample data. A live provider replaces this
 * with source + last-updated, in the same slot.
 */
export function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex max-w-[1360px] flex-col gap-1 px-5 py-5 text-[11.5px] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <p>Hoop Intel — front office, roster, and market intelligence.</p>
        <p>
          League structure is real. Players, news, transactions, and rumors are sample data until a
          live provider is configured.
        </p>
      </div>
    </footer>
  );
}
