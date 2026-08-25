export function EmptyState({ label }: { label: string }) {
  return (
    <p className="rounded-[2px] border border-dashed border-[var(--oak-dk)] bg-[var(--bone)] px-3 py-4 text-[12.5px] text-[var(--muted)]">
      {label}
    </p>
  );
}
