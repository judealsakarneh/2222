import {Diamond} from './Diamond';

/**
 * ctrl ROOM lockup.
 *
 * "ctrl" has no dotted letter, so the brief's "teal diamond as the dot on the
 * i" becomes a floating tittle: the diamond sits above the t/r junction, at the
 * optical centre of the word, doing the job an i-dot would.
 *
 * Everything inside is sized in `em` off the one font-size on the root, so the
 * whole lockup scales from a single number — and `size` takes a CSS length
 * string as well as a number, which is what lets the card place it in `em` and
 * have it scale with the card's container query.
 */
export function Logo({
  size = 28,
  className = '',
}: {
  size?: number | string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex select-none flex-col items-start leading-none ${className}`}
      style={{fontSize: size}}
      aria-label="ctrl ROOM"
      role="img"
    >
      <span className="relative block font-bold tracking-tightest text-white">
        ctrl
        <Diamond
          className="absolute text-teal"
          style={{left: '0.56em', top: '-0.18em', width: '0.2em', height: '0.2em'}}
        />
      </span>
      <span
        className="block font-medium text-teal"
        style={{
          fontSize: '0.4em',
          letterSpacing: '0.4em',
          // Tracking adds a trailing gap after the last letter; the small left
          // nudge re-centres the word optically under "ctrl".
          marginLeft: '0.12em',
          marginTop: '0.5em',
        }}
      >
        ROOM
      </span>
    </span>
  );
}

/** Single-line variant for tight spots — the nav bar and the footer bottom rule. */
export function LogoInline({
  size = 20,
  className = '',
}: {
  size?: number | string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex select-none items-baseline gap-[0.42em] leading-none ${className}`}
      style={{fontSize: size}}
      aria-label="ctrl ROOM"
      role="img"
    >
      <span className="relative font-bold tracking-tightest text-white">
        ctrl
        <Diamond
          className="absolute text-teal"
          style={{left: '0.56em', top: '-0.18em', width: '0.2em', height: '0.2em'}}
        />
      </span>
      <span
        className="font-medium text-teal"
        style={{fontSize: '0.5em', letterSpacing: '0.32em'}}
      >
        ROOM
      </span>
    </span>
  );
}
