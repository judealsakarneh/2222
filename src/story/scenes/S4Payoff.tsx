import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {INTER, SERIF} from '../../lib/fonts';
import {EASE, P, label, ui} from '../lib/tokens';

/**
 * SCENE 4 — The payoff. Frames 480-600 (4.0s). PAPER.
 *
 * One idea, one number, nothing else on screen.
 *
 * The count runs over 26 frames and then the scene simply HOLDS for two full
 * seconds. That hold is the point — a number nobody has time to read is not a
 * claim, it is decoration.
 */

const A = 480;

export const S4Payoff: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - A;

  const count = Math.floor(
    interpolate(local, [-18, 18], [0, 47], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
    })
  );
  const numIn = interpolate(local, [-14, 6], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });
  const capIn = interpolate(local, [30, 52], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });

  return (
    <div
      style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 90% 80% at 50% 44%, ${P.bg} 0%, ${P.bgWarm} 100%)`,
        fontFamily: INTER,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 28,
      }}
    >
      <div style={{...label(P.mute, 19), opacity: capIn}}>voice note to finished deck</div>

      <div
        style={{
          display: 'flex', alignItems: 'baseline',
          opacity: numIn,
          transform: `scale(${0.92 + 0.08 * numIn})`,
          willChange: 'transform, opacity',
        }}
      >
        <span style={{...ui(340, P.ink, 400), fontFamily: SERIF, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums'}}>
          {count}
        </span>
        <span style={{...ui(150, P.mute, 400), fontFamily: SERIF}}>s</span>
      </div>
    </div>
  );
};
