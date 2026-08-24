import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {hash} from '../../lib/random';
import {speedNorm} from '../lib/camera';
import {L} from '../lib/tokens';

/**
 * Speed-driven lens effects. Both are functions of camera velocity alone, so
 * they can never drift out of sync with the move — they ARE the move.
 *
 * 1. STREAKS — radial lines from the centre of frame, length and brightness
 *    scaled by velocity. These read as light trailing during fast travel and
 *    vanish completely at a station.
 *
 * 2. LENS FRINGING — a warm/cool split at the frame edges, again scaled by
 *    velocity. Real wide lenses fringe hardest at the corners under motion; the
 *    centre stays clean, which is why this is masked to the edges rather than
 *    applied flat.
 */

const STREAKS = 42;

export const SpeedFx: React.FC = () => {
  const frame = useCurrentFrame();
  const v = speedNorm(frame);

  if (v <= 0.01) {
    return null;
  }

  return (
    <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
      {/* Radial light streaks */}
      <AbsoluteFill style={{opacity: v * 0.75}}>
        {new Array(STREAKS).fill(0).map((_, i) => {
          const angle = hash(i * 3.1) * 360;
          // Pushed out from centre so the middle of frame stays readable.
          const radius = 240 + hash(i * 5.7) * 900;
          const length = (60 + hash(i * 9.3) * 260) * v;
          const isSignal = hash(i * 11.9) > 0.85;

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: length,
                height: 2,
                marginTop: -1,
                transformOrigin: '0 50%',
                transform: `rotate(${angle}deg) translateX(${radius}px)`,
                background: `linear-gradient(90deg, ${
                  isSignal ? 'rgba(23,232,168,0)' : 'rgba(168,216,240,0)'
                }, ${isSignal ? L.signal : L.ice})`,
                opacity: 0.5 + hash(i * 13.7) * 0.5,
                willChange: 'transform, opacity',
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* Lens fringing, edges only */}
      <AbsoluteFill
        style={{
          opacity: v * 0.5,
          mixBlendMode: 'screen',
          background:
            'radial-gradient(ellipse 62% 48% at 50% 50%, rgba(0,0,0,0) 60%, rgba(23,232,168,0.16) 100%)',
        }}
      />
      <AbsoluteFill
        style={{
          opacity: v * 0.5,
          mixBlendMode: 'screen',
          transform: 'scale(1.02)',
          background:
            'radial-gradient(ellipse 62% 48% at 50% 50%, rgba(0,0,0,0) 60%, rgba(120,180,255,0.16) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
