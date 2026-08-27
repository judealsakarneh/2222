/**
 * The disc behind the card.
 *
 * Hard-edged on purpose. A soft radial blur is the default "glow" every dark
 * landing page reaches for, and it reads as atmosphere — it sits behind the
 * subject and does nothing. A crisp disc with a visible edge reads as a
 * deliberate graphic mark, and the card overlapping that edge is what creates
 * the depth the blur was trying to fake.
 *
 * Two rings, not one: the filled disc gives the card something to sit against,
 * and the wider outline stops the disc from looking like a dropped ball.
 */
export function Ring({className = ''}: {className?: string}) {
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      <div className="relative h-full w-full">
        {/* Outline, larger, barely there */}
        <div className="absolute inset-[-11%] rounded-full border border-teal/[0.14]" />
        {/* The disc */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'radial-gradient(circle at 32% 22%, #0C3833 0%, #08272400 0%, #07211F 46%, #051413 78%, #040E0D 100%)',
          }}
        />
        {/* A faint inner wash so the disc is not a dead cutout */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'radial-gradient(circle at 34% 26%, rgba(45,212,191,0.16), rgba(45,212,191,0.03) 44%, rgba(45,212,191,0) 72%)',
          }}
        />
        {/* One bright arc where the light would catch the top-left rim */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'conic-gradient(from 190deg, rgba(94,234,212,0) 0deg, rgba(94,234,212,0.55) 62deg, rgba(94,234,212,0) 128deg)',
            WebkitMask:
              'radial-gradient(circle, transparent calc(50% - 1.5px), black calc(50% - 1.5px))',
            mask: 'radial-gradient(circle, transparent calc(50% - 1.5px), black calc(50% - 1.5px))',
          }}
        />
      </div>
    </div>
  );
}
