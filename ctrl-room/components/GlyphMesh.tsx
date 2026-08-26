/**
 * The micro-pattern: the word "ctrl" repeated on a fine grid, at the threshold
 * of visibility.
 *
 * Done as an SVG <pattern> rather than a wall of spans so it tiles at any size,
 * costs one element, and can be dropped behind anything. The offset rows are
 * what stop it reading as a table — a straight grid of repeated text looks like
 * a rendering bug; a brick offset looks like security-print.
 */
export function GlyphMesh({
  className = '',
  opacity = 0.05,
  scale = 1,
  id = 'glyph-mesh',
}: {
  className?: string;
  opacity?: number;
  scale?: number;
  id?: string;
}) {
  const w = 78 * scale;
  const h = 44 * scale;

  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      aria-hidden="true"
      style={{opacity}}
    >
      <defs>
        <pattern
          id={id}
          width={w}
          height={h}
          patternUnits="userSpaceOnUse"
        >
          <text
            x={0}
            y={13 * scale}
            fill="#FFFFFF"
            fontSize={12 * scale}
            fontWeight={700}
            letterSpacing={-0.4 * scale}
            fontFamily="var(--font-sans), system-ui, sans-serif"
          >
            ctrl
          </text>
          {/* Second row, pushed half a tile across. */}
          <text
            x={w / 2}
            y={35 * scale}
            fill="#FFFFFF"
            fontSize={12 * scale}
            fontWeight={700}
            letterSpacing={-0.4 * scale}
            fontFamily="var(--font-sans), system-ui, sans-serif"
          >
            ctrl
          </text>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
