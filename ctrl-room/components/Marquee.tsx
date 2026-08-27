import {Diamond} from './Diamond';

/** Placeholder venue names — replace with real partner rooms. */
const ROOMS = [
  'MONTAUK COFFEE', 'THE ANNEX', 'PALOMA', 'NORTH BAR', 'SESSIONS',
  'KIN & CO', 'OLIVE ST.', 'THE LANTERN', 'HALF LIGHT', 'BASEMENT 9',
];

/**
 * The network, as a moving strip.
 *
 * The track holds the list twice and translates exactly -50%, so the second
 * copy is in the first one's place when the animation restarts and the loop has
 * no seam. Any translation other than half breaks it visibly.
 *
 * Pure CSS — no scroll listener, no JS timer. It keeps running while the main
 * thread is busy, which is exactly when a JS-driven marquee starts stuttering.
 */
export function Marquee() {
  const strip = (
    <ul className="flex shrink-0 items-center gap-12 pr-12 sm:gap-16 sm:pr-16">
      {ROOMS.map((r) => (
        <li key={r} className="flex items-center gap-12 sm:gap-16">
          <span className="label whitespace-nowrap text-chalk-35">{r}</span>
          <Diamond size={5} className="shrink-0 text-teal/50" />
        </li>
      ))}
    </ul>
  );

  return (
    <section
      className="relative border-y border-white/[0.05] bg-ink-975 py-6"
      aria-label="Rooms in the network"
    >
      <div className="marquee-mask overflow-hidden">
        <div className="flex w-max animate-marquee motion-reduce:animate-none">
          {strip}
          {/* Second copy: aria-hidden so the list is announced once. */}
          <div aria-hidden="true" className="flex">{strip}</div>
        </div>
      </div>
    </section>
  );
}
