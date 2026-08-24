import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

/**
 * Persistent layer (z 90, frames 0-600).
 *
 * Real film grain, not a static noise texture. An SVG feTurbulence
 * (fractalNoise, baseFrequency 0.9, 4 octaves) desaturated to luminance and
 * composited at 13% on overlay.
 *
 * The critical detail: it must JITTER. A static grain layer instantly reads as
 * a texture overlay rather than as film. Every 4 frames the layer jumps to the
 * next of 8 positions AND the turbulence reseeds, so the noise field is
 * genuinely re-randomized rather than just sliding around. The filter id is
 * keyed to the step so the browser cannot reuse the previous frame's result.
 */

// 8-position offset table, stepped every 4 frames.
const OFFSETS: [number, number][] = [
  [0, 0],
  [13, -9],
  [-7, 15],
  [21, 6],
  [-18, -14],
  [9, 22],
  [-24, 3],
  [5, -20],
];

const PAD = 48; // oversize so an offset never exposes an edge

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();

  // floor(frame / 4) advances one step every 4 frames and cycles all 8 slots.
  const step = Math.floor(frame / 4) % OFFSETS.length;
  const [dx, dy] = OFFSETS[step];
  const filterId = `ramble-grain-${step}`;

  return (
    <AbsoluteFill
      style={{
        opacity: 0.13,
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
        <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="4"
            seed={step}
            stitchTiles="stitch"
          />
          {/* Desaturate — grain should read as luminance, never as color noise. */}
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${filterId})`} />
      </svg>
    </AbsoluteFill>
  );
};
