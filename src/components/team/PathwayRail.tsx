/** Mini preview rail — same left-to-right position language as ThresholdRail, scoped to one pathway's projected effect. */
export function PathwayRail({ pct }: { pct: number }) {
  return (
    <div className="relative mt-2 h-1.5 w-full max-w-[220px] rounded bg-bone-lo" aria-hidden>
      <div
        className="absolute -inset-y-1 w-[2px] rounded bg-walnut"
        style={{ left: `${Math.max(0, Math.min(100, pct))}%` }}
      />
    </div>
  );
}
