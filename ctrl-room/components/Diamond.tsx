import type {CSSProperties} from 'react';

/**
 * The one accent shape in the system.
 *
 * A rotated square, not a rounded blob and not a bullet dot. It reads as the
 * tittle over the wordmark, as a list marker, and as a spacer between footer
 * items — the same mark doing three jobs is what makes it feel like a brand
 * asset rather than decoration.
 *
 * Drawn as a path rather than a rotated div so it never inherits a parent's
 * transform and never blurs at small sizes.
 */
export function Diamond({
  size = 8,
  className = '',
  style,
  filled = true,
}: {
  size?: number;
  className?: string;
  style?: CSSProperties;
  filled?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <path
        d="M5 0.6 9.4 5 5 9.4 0.6 5Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke={filled ? 'none' : 'currentColor'}
        strokeWidth={filled ? 0 : 1.2}
      />
    </svg>
  );
}
