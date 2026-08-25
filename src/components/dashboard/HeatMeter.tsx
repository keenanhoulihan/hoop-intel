export function elapsedLabel(minutes: number): string {
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function HeatMeter({ heat }: { heat: 1 | 2 | 3 | 4 }) {
  return (
    <span className="flex items-center gap-1" aria-label={`Heat: ${heat} of 4 sources`}>
      <span className="flex gap-0.5" aria-hidden>
        {[1, 2, 3, 4].map((n) => (
          <span key={n} className={`h-2.5 w-1 rounded-sm ${n <= heat ? 'bg-clay' : 'bg-oak'}`} />
        ))}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-bark-light">{heat}/4 sources</span>
    </span>
  );
}
