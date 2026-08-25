import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {hash} from '../../lib/random';
import {C} from '../lib/tokens';

/**
 * 2% film grain and the drifting dust layer, both from the spec.
 *
 * The grain reseeds every 3 frames — a static noise texture reads as an overlay
 * rather than as film. Eight motes drift at ~2px/s at 5% opacity, which is
 * almost subliminal and is exactly the point: it stops the near-black background
 * from ever being a dead flat field.
 */

const OFFSETS: [number, number][] = [
  [0, 0], [14, -9], [-8, 17], [21, 6], [-19, -13], [9, 23], [-24, 4], [6, -20],
];

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const step = Math.floor(frame / 3) % OFFSETS.length;
  const [dx, dy] = OFFSETS[step];
  const id = `demo-grain-${step}`;

  return (
    <AbsoluteFill style={{opacity: 0.02, mixBlendMode: 'overlay', pointerEvents: 'none', overflow: 'hidden'}}>
      <svg
        style={{
          position: 'absolute', left: -50, top: -50,
          width: 'calc(100% + 100px)', height: 'calc(100% + 100px)',
          transform: `translate3d(${dx}px, ${dy}px, 0)`,
        }}
      >
        <filter id={id} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" seed={step} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${id})`} />
      </svg>
    </AbsoluteFill>
  );
};

export const Dust: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
      {new Array(8).fill(0).map((_, i) => {
        // ~2px per second, each on its own diagonal, wrapping across the frame.
        const speed = 1.6 + hash(i * 3.7) * 1.0;
        const x = (hash(i * 5.1) * 120 + (frame * speed) / 30) % 116 - 8;
        const y = (hash(i * 9.3) * 120 - (frame * speed * 0.4) / 30 + 200) % 116 - 8;
        const size = 2 + hash(i * 7.7) * 2;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`, top: `${y}%`,
              width: size, height: size, borderRadius: '50%',
              background: C.signal,
              opacity: 0.05,
              filter: 'blur(0.4px)',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
