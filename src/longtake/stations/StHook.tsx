import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Caption} from '../components/Caption';
import {INTER} from '../../lib/fonts';
import {STATIONS} from '../lib/camera';
import {BRAND, EASE, L, label} from '../lib/tokens';

/**
 * STATION 0 — The hook. Camera arrives frame 0, holds 55.
 *
 * Opens already moving. A single line, and above it a hairline that draws out
 * from the centre — the first thing the film does is make a horizon, which
 * gives the eye something to measure the incoming depth against.
 */
const A = STATIONS[0].arrive;

export const StHook: React.FC = () => {
  const frame = useCurrentFrame();

  const rule = interpolate(frame, [A + 2, A + 26], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const brandIn = interpolate(frame, [A + 10, A + 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 44,
      }}
    >
      <div
        style={{
          ...label(L.mist, 20),
          fontFamily: INTER,
          opacity: brandIn,
          transform: `translateY(${(1 - brandIn) * 12}px)`,
          willChange: 'transform, opacity',
        }}
      >
        {BRAND}
      </div>

      <div
        style={{
          width: 420,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${L.iceDim}, transparent)`,
          transform: `scaleX(${rule})`,
          willChange: 'transform',
        }}
      />

      <Caption text="Everyone has the idea." from={A + 8} size={72} />
    </div>
  );
};
