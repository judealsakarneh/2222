import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

/**
 * Film grain that actually moves. An feTurbulence field that reseeds and shifts
 * every 3 frames — a static noise layer reads as a texture overlay, a jittering
 * one reads as signal noise.
 */

const OFFSETS: [number, number][] = [
  [0, 0],
  [17, -11],
  [-9, 19],
  [24, 7],
  [-21, -16],
  [11, 26],
  [-27, 4],
  [6, -23],
];

const PAD = 56;

export const TeaserGrain: React.FC = () => {
  const frame = useCurrentFrame();
  const step = Math.floor(frame / 3) % OFFSETS.length;
  const [dx, dy] = OFFSETS[step];
  const id = `zt-grain-${step}`;

  return (
    <AbsoluteFill
      style={{
        opacity: 0.16,
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <svg
        style={{
          position: 'absolute',
          left: -PAD,
          top: -PAD,
          width: `calc(100% + ${PAD * 2}px)`,
          height: `calc(100% + ${PAD * 2}px)`,
          transform: `translate3d(${dx}px, ${dy}px, 0)`,
          willChange: 'transform',
        }}
      >
        <filter id={id} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="4"
            seed={step}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${id})`} />
      </svg>
    </AbsoluteFill>
  );
};
