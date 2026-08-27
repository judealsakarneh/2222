import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {EASE} from '../lib/tokens';

/**
 * A line of display type revealed by an advancing mask.
 *
 * The mask is what makes it read as broadcast typography rather than a fade:
 * the letterforms are never semi-transparent, they are progressively uncovered.
 * The small upward travel underneath adds the weight — mask alone reads flat,
 * travel alone reads like every generated page's fade-in-up.
 *
 * `exit` optionally masks it back out downward, so a line can leave the way it
 * arrived instead of dissolving.
 */
export const MaskLine: React.FC<{
  children: React.ReactNode;
  enter: number;
  exit?: number;
  dur?: number;
  outDur?: number;
  delay?: number;
  style?: React.CSSProperties;
}> = ({children, enter, exit, dur = 16, outDur = 10, delay = 0, style}) => {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [enter + delay, enter + delay + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const outP =
    exit === undefined
      ? 0
      : interpolate(frame, [exit + delay, exit + delay + outDur], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EASE,
        });

  // Reveal from below, then clear upward. Both edges are the same mask, so the
  // line never changes opacity and never looks washed.
  const top = outP * 100;
  const bottom = (1 - inP) * 100;

  return (
    <div style={{overflow: 'hidden', ...style}}>
      <div
        style={{
          clipPath: `inset(${top}% 0% ${bottom}% 0%)`,
          transform: `translateY(${(1 - inP) * 22 - outP * 18}px)`,
          willChange: 'clip-path, transform',
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Fade plus travel, for supporting text that should not compete with a MaskLine. */
export const Rise: React.FC<{
  children: React.ReactNode;
  enter: number;
  exit?: number;
  dur?: number;
  y?: number;
  style?: React.CSSProperties;
}> = ({children, enter, exit, dur = 18, y = 16, style}) => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [enter, enter + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const b =
    exit === undefined
      ? 1
      : interpolate(frame, [exit, exit + 10], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EASE,
        });
  return (
    <div
      style={{
        opacity: a * b,
        transform: `translateY(${(1 - a) * y}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
