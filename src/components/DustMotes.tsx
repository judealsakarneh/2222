import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {hash, hashRange} from '../lib/random';

/**
 * 18 slow emerald motes drifting upward through the cold open.
 *
 * These do one job: sell depth. Without them the opening frame is a mark on a
 * flat field; with them there is air in front of and behind the logo. Every
 * mote's position, size, period and phase comes from the deterministic hash in
 * lib/random, so the scatter is identical on every render.
 */

const COUNT = 18;

export const DustMotes: React.FC<{opacity?: number}> = ({opacity = 1}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity}}>
      {new Array(COUNT).fill(0).map((_, i) => {
        const size = hashRange(i * 3.1, 1, 3);
        const xPct = hashRange(i * 7.7, 20, 80);
        const yPct = hashRange(i * 11.3, 18, 82);
        const period = hashRange(i * 5.9, 150, 300);
        const phase = hash(i * 17.3) * Math.PI * 2;

        const t = (frame / period) * Math.PI * 2 + phase;
        // Rises from -30px to -100px and back, so the field never resets hard.
        const y = -30 - 70 * ((1 - Math.cos(t)) / 2);
        const x = 15 * Math.sin(t);
        // A touch of twinkle keeps them from reading as a fixed particle grid.
        const twinkle = 0.35 + 0.65 * ((1 + Math.sin(t * 1.7 + phase)) / 2);

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${xPct}%`,
              top: `${yPct}%`,
              width: size,
              height: size,
              borderRadius: '50%',
              background: 'rgba(23,232,168,0.5)',
              opacity: twinkle,
              transform: `translate3d(${x}px, ${y}px, 0)`,
              willChange: 'transform, opacity',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
