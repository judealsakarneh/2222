import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {EASE} from '../lib/tokens';
import {OVERLAP} from '../lib/timeline';

/**
 * Section overlap, per the spec: each section starts 200ms before the previous
 * ends, and the outgoing one scales to 60% at 40% opacity as it leaves.
 *
 * The exit runs across the overlap window and a little past it, so the two
 * sections are genuinely on screen together rather than cutting. That handoff is
 * what makes five sections read as one film.
 */
export const SceneLayer: React.FC<{
  start: number;
  end: number;
  children: React.ReactNode;
}> = ({start, end, children}) => {
  const frame = useCurrentFrame();

  if (frame < start - OVERLAP || frame > end + OVERLAP) {
    return null;
  }

  // 1 -> 0 across the overlap. Scale lands on 0.6 exactly as opacity hits 0.4.
  const out = interpolate(frame, [end - OVERLAP, end + OVERLAP], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${1 - 0.4 * out})`,
        opacity: 1 - out,
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </div>
  );
};
