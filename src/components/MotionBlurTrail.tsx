import React from 'react';

/**
 * Fake-but-convincing motion blur for fast scale moves.
 *
 * Remotion has no per-frame shutter blur, so on any transition where scale
 * changes more than ~1.5x inside 20 frames we render the subject several extra
 * times at incremental scale offsets with falling opacity. The eye integrates
 * the stack into a smear, which is exactly what a real shutter produces.
 *
 * Ghosts render BEHIND the subject and are inert (pointerEvents none), so the
 * layer stack and hit-testing are unchanged.
 */
export const MotionBlurTrail: React.FC<{
  /** Only render ghosts while the fast move is actually happening. */
  active: boolean;
  /** The subject's current scale this frame. */
  scale: number;
  /** The subject's current opacity this frame — ghosts are scaled against it. */
  opacity?: number;
  /**
   * Scale offsets for each ghost. These are SUBTRACTED from the subject's
   * current scale so the ghosts trail where the subject just was, which is what
   * a real shutter records. Ghosts placed ahead of the motion read as
   * double-vision instead of blur.
   */
  offsets?: number[];
  /** Opacity multiplier for each ghost. */
  ghostOpacities?: number[];
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({
  active,
  scale,
  opacity = 1,
  offsets = [0.12, 0.24, 0.36],
  ghostOpacities = [0.35, 0.2, 0.1],
  style,
  children,
}) => {
  return (
    <div style={{position: 'relative', ...style}}>
      {active
        ? offsets.map((offset, i) => (
            <div
              key={i}
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: opacity * (ghostOpacities[i] ?? 0.1),
                transform: `scale(${Math.max(0.01, scale - offset)})`,
                willChange: 'transform, opacity',
                pointerEvents: 'none',
              }}
            >
              {children}
            </div>
          ))
        : null}
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          willChange: 'transform, opacity',
        }}
      >
        {children}
      </div>
    </div>
  );
};
