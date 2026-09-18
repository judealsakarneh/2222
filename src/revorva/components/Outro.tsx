import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {COPY, FONT} from '../lib/brand';
import type {Theme} from '../lib/theme';
import {BEATS, EASE} from '../lib/timeline';

/**
 * The close.
 *
 * Sits OUTSIDE the camera transform, so it is not zoomed, blurred or dragged by
 * the camera's last move. The dashboard behind it is still there, receding and
 * defocusing - the film ends by pulling focus off the product and onto the name,
 * which is a continuous change of attention rather than a cut to an end card.
 *
 * Three elements on a 0 / 180 / 340 ms stagger so they resolve in reading order.
 */
export const Outro: React.FC<{T: Theme}> = ({T}) => {
  const frame = useCurrentFrame();
  const t = (frame / 60) * 1000;
  const {at, move, stagger} = BEATS.outro;

  const p = (i: number) =>
    interpolate(t, [at + stagger[i], at + stagger[i] + move], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: EASE,
    });

  const word = p(0);
  const rule = p(1);
  const line = p(2);
  if (word <= 0) return null;

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{textAlign: 'center'}}>
        <div
          style={{
            fontFamily: FONT.display,
            fontWeight: 700,
            fontSize: 92,
            letterSpacing: '-0.035em',
            lineHeight: 1,
            color: T.fg,
            opacity: word,
            transform: `translateY(${(1 - word) * 12}px)`,
          }}
        >
          {COPY.wordmark}
        </div>
        <div
          style={{
            width: 300,
            height: 1,
            margin: '28px auto 0',
            background: T.accent,
            transform: `scaleX(${rule})`,
            transformOrigin: 'center',
          }}
        />
        <div
          style={{
            marginTop: 24,
            fontFamily: FONT.ui,
            fontSize: 20,
            color: T.fg2,
            opacity: line,
            transform: `translateY(${(1 - line) * 12}px)`,
          }}
        >
          {COPY.cta}
        </div>
        <div
          style={{
            marginTop: 14,
            fontFamily: FONT.mono,
            fontSize: 14,
            letterSpacing: '0.18em',
            color: T.fg3,
            opacity: line * 0.9,
          }}
        >
          {COPY.domain}
        </div>
      </div>
    </AbsoluteFill>
  );
};
