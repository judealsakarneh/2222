import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {ARCHIVO, MONO} from '../../lib/fonts';
import {BEATS, EASE} from '../lib/timeline';

/**
 * 10000 - 12000 ms. The lockup.
 *
 * Opacity 0 → 100 and Y +10 → 0 over 400 ms, then a 500 ms hold. The rule
 * underneath wipes in slightly late and the tagline later still, so the three
 * elements resolve in reading order instead of together - the same staggered
 * arrival as the mark at the top of the piece, which is what makes the film
 * feel like it closes the loop rather than just stopping.
 */
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const t = (frame / 30) * 1000;
  const {slot, move} = BEATS.outro;

  const at = (delay: number) =>
    interpolate(t, [slot[0] + delay, slot[0] + delay + move], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: EASE,
    });

  const word = at(0);
  const rule = at(160);
  const tag = at(280);

  if (word <= 0) return null;

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{textAlign: 'center'}}>
        <div
          style={{
            fontFamily: ARCHIVO,
            fontWeight: 900,
            fontSize: 96,
            letterSpacing: '-0.045em',
            lineHeight: 1,
            color: '#FFFFFF',
            opacity: word,
            transform: `translateY(${(1 - word) * 10}px)`,
          }}
        >
          CTRL ROOM
        </div>
        <div
          style={{
            width: 340,
            height: 1,
            margin: '30px auto 0',
            background: '#00A9A4',
            transform: `scaleX(${rule})`,
            transformOrigin: 'center',
          }}
        />
        <div
          style={{
            fontFamily: MONO,
            fontSize: 13,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.72)',
            marginTop: 26,
            opacity: tag * 0.78,
            transform: `translateY(${(1 - tag) * 10}px)`,
          }}
        >
          Jordan, switched on.
        </div>
      </div>
    </AbsoluteFill>
  );
};
