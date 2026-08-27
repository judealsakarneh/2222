/**
 * Brand marks.
 *
 * The deck's own line — "CTRL Room reads like a place where information is
 * being monitored" — is the whole identity, so the mark beside the wordmark is
 * a live indicator, not an ornament. It blinks because a control room's
 * indicators blink; a static decorative shape would say nothing.
 */
export function Signal({
  size = 8,
  className = '',
  live = true,
}: {
  size?: number;
  className?: string;
  live?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 ${live ? 'animate-blip' : ''} ${className}`}
      style={{width: size, height: size, background: 'currentColor'}}
    />
  );
}

/** Three ascending bars — used where a "signal strength" read is wanted. */
export function Bars({size = 14, className = ''}: {size?: number; className?: string}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <rect x="0" y="9" width="3" height="5" />
      <rect x="5.5" y="5" width="3" height="9" />
      <rect x="11" y="0" width="3" height="14" />
    </svg>
  );
}

/**
 * The wordmark. CTRL is set tight and heavy; ROOM is tracked wide beside it so
 * the two halves hold the same optical weight despite different letter counts.
 */
export function Wordmark({
  size = 19,
  className = '',
  live = false,
}: {
  size?: number;
  className?: string;
  live?: boolean;
}) {
  return (
    <span
      className={`inline-flex select-none items-center gap-[0.5em] leading-none ${className}`}
      style={{fontSize: size}}
      role="img"
      aria-label="CTRL Room"
    >
      {live ? <Signal size={size * 0.3} className="accent" /> : null}
      <span className="font-extrabold tracking-[-0.03em] wide" style={{color: 'var(--fg)'}}>
        CTRL
      </span>
      <span
        className="font-medium"
        style={{fontSize: '0.62em', letterSpacing: '0.3em', color: 'var(--accent)'}}
      >
        ROOM
      </span>
    </span>
  );
}
