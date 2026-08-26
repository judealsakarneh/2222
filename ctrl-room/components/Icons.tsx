/**
 * The icon set. All hand-drawn on a 24 grid, 1.25 stroke, round caps — no icon
 * library, no emoji.
 *
 * One rule holds the set together: each icon is a white line drawing with
 * exactly one teal diamond in it. That single repeated accent is what makes
 * three unrelated shapes read as one family, and it ties every icon back to the
 * mark in the logo.
 */

type IconProps = {size?: number; className?: string};

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  strokeWidth: 1.25,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
});

/** EARN — three ascending bars with the diamond cresting the tallest. */
export function IconEarn({size = 24, className = ''}: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 19.5v-4.2M9.4 19.5v-7.6M14.8 19.5v-5" stroke="currentColor" />
      <path d="M20.2 19.5V9.6" stroke="currentColor" />
      <path d="M20.2 3.4 22.6 5.8 20.2 8.2 17.8 5.8Z" fill="#2DD4BF" />
    </svg>
  );
}

/** REWARDS — a tag, with the diamond sitting where the eyelet would be. */
export function IconReward({size = 24, className = ''}: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path
        d="M11.1 3.2H19a1.8 1.8 0 0 1 1.8 1.8v7.9a1.8 1.8 0 0 1-.53 1.27l-6.1 6.1a1.8 1.8 0 0 1-2.55 0l-7.06-7.06a1.8 1.8 0 0 1 0-2.55l6.1-6.1a1.8 1.8 0 0 1 1.27-.53Z"
        stroke="currentColor"
      />
      <path d="M16.6 6.4 18.7 8.5 16.6 10.6 14.5 8.5Z" fill="#2DD4BF" />
    </svg>
  );
}

/** ENJOY — an arch. The room you are being let into; diamond as the handle. */
export function IconEnjoy({size = 24, className = ''}: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M3.4 20.6h17.2" stroke="currentColor" />
      <path
        d="M6.2 20.6V10.4a5.8 5.8 0 0 1 11.6 0v10.2"
        stroke="currentColor"
      />
      <path d="M14.6 13.4 16.4 15.2 14.6 17 12.8 15.2Z" fill="#2DD4BF" />
    </svg>
  );
}

/** Arrow used inside the pill CTA and on the footer links. */
export function IconArrow({size = 16, className = ''}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M2.6 8h10.2M9.1 4.3 12.8 8l-3.7 3.7"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * TAP — a hand approaching a surface, with the NFC arcs coming off it. Used in
 * the "how it works" step that describes tapping the card, where the animated
 * NfcWaves would be too loud.
 */
export function IconTap({size = 24, className = ''}: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path
        d="M9.2 13.1V6.4a1.5 1.5 0 0 1 3 0v5.1M12.2 11.5v-1.2a1.4 1.4 0 0 1 2.8 0v1.2M15 11.6v-.7a1.4 1.4 0 0 1 2.8 0v4.6a5.2 5.2 0 0 1-5.2 5.2h-.9a4.6 4.6 0 0 1-3.5-1.6l-2.6-3a1.4 1.4 0 0 1 2-1.9l1.6 1.5"
        stroke="currentColor"
      />
      <path d="M4.4 4 6.1 5.7 4.4 7.4 2.7 5.7Z" fill="#2DD4BF" />
    </svg>
  );
}

/** Static NFC glyph — three arcs. The animated version lives in NfcWaves. */
export function IconSignal({size = 24, className = ''}: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path
        d="M8.6 7.4a6.4 6.4 0 0 1 0 9.2M12.4 4.4a11 11 0 0 1 0 15.2M4.9 10.6a2.4 2.4 0 0 1 0 2.8"
        stroke="currentColor"
      />
    </svg>
  );
}
