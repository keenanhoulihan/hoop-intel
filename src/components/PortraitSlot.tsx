/**
 * Fixed-aspect placeholder for a player portrait — walnut ground, oak
 * monogram. A real portrait treatment drops in later without relayout;
 * until then, no likeness of any kind renders here. Deliberately not an
 * illustration or a silhouette — those are still a likeness question once
 * they're recognizable, and resolving that is a legal input, not a design
 * one. 3:4 portrait ratio, matching a standard headshot/trading-card crop.
 */
export function PortraitSlot({ initials, size = 'md' }: { initials: string; size?: 'md' | 'lg' }) {
  const width = size === 'lg' ? 'w-28 sm:w-36' : 'w-20';
  return (
    <div className={`${width} aspect-[3/4] shrink-0 rounded-panel bg-walnut flex items-center justify-center`}>
      <span className="font-serif text-[28px] font-semibold text-oak">{initials}</span>
    </div>
  );
}
