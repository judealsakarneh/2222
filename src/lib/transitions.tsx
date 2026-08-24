import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {EASE} from './easing';

const TRANSITION_FRAMES = 12;

// Wraps a scene so it crossfades in/out of neighboring scenes with a short
// motion-blur swoosh, instead of hard-cutting between them. Entrance/exit
// can be disabled for scenes that already animate their own reveal
// (Scene 1's text fade-in) or teardown (Scene 6's fade to black).
export const SceneWrapper: React.FC<{
  durationInFrames: number;
  disableEnter?: boolean;
  disableExit?: boolean;
  children: React.ReactNode;
}> = ({durationInFrames, disableEnter, disableExit, children}) => {
  const frame = useCurrentFrame();

  const enter = disableEnter
    ? 1
    : interpolate(frame, [0, TRANSITION_FRAMES], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: EASE,
      });

  const exit = disableExit
    ? 1
    : interpolate(
        frame,
        [durationInFrames - TRANSITION_FRAMES, durationInFrames],
        [1, 0],
        {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE}
      );

  const progress = Math.min(enter, exit);
  const blurPx = (1 - progress) * 10;
  const translateY = (1 - enter) * 18 - (1 - exit) * 18;

  return (
    <AbsoluteFill
      style={{
        opacity: progress,
        filter: `blur(${blurPx}px)`,
        transform: `translateY(${translateY}px)`,
        willChange: 'transform, opacity, filter',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
