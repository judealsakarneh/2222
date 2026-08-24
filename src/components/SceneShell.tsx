import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {EASE_CAMERA} from '../lib/easing';

/**
 * Mount gating + the overlap rule, in one place.
 *
 * Scenes are NOT wrapped in <Sequence> because the timeline deliberately
 * overlaps: every incoming scene is mounted `lead` frames before its nominal
 * start and dissolves up while the outgoing scene is still exiting, so the cut
 * is a continuous camera action and there is never an empty frame between
 * sections. Each scene reads absolute frame numbers straight off the timeline,
 * which is also what makes the whole film scrubbable and reproducible.
 *
 * Scenes unmount outside their window so the 3D deck and the grain filter are
 * not being composited during sections that don't use them.
 */
export const SceneShell: React.FC<{
  start: number;
  end: number;
  /** Frames of lead-in before `start`. 0 for the cold open, which has no predecessor. */
  lead?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({start, end, lead = 6, style, children}) => {
  const frame = useCurrentFrame();

  if (frame < start - lead || frame > end) {
    return null;
  }

  const enter =
    lead === 0
      ? 1
      : interpolate(frame, [start - lead, start + lead], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EASE_CAMERA,
        });

  return (
    <AbsoluteFill
      style={{
        opacity: enter,
        alignItems: 'center',
        justifyContent: 'center',
        willChange: 'transform, opacity',
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
