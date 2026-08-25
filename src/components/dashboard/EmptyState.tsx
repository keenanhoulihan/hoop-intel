export function EmptyState({ label, action }: { label: string; action?: React.ReactNode }) {
  return (
    <div className="rounded border border-dashed border-oak-dark bg-bone px-3 py-4 text-[12.5px] text-muted">
      <p className="font-serif text-[14px] not-italic text-bark">{label}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
