import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {EASE, INK} from '../lib/easing';
import {INTER} from '../lib/fonts';

const TEXT = 'Prompted with Claude Opus 5.0, nothing else. No design tools, no plugins.';

// Scene 6 — Outro (0:13–0:15)
// The closing line rises in, holds briefly, then the whole frame fades to
// black to close out the reel.
export const Scene6Outro: React.FC = () => {
  const frame = useCurrentFrame();

  const textOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const textY = interpolate(frame, [0, 20], [16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  const blackOpacity = interpolate(frame, [38, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <p
        style={{
          margin: 0,
          maxWidth: 760,
          textAlign: 'center',
          fontFamily: INTER,
          fontWeight: 600,
          fontSize: 40,
          lineHeight: 1.4,
          letterSpacing: '-0.01em',
          color: INK,
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
          willChange: 'transform, opacity',
        }}
      >
        {TEXT}
      </p>
      <AbsoluteFill style={{backgroundColor: '#000', opacity: blackOpacity, pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
