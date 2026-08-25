import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {INTER} from '../../lib/fonts';
import {BRAND, C, EASE, ui} from '../lib/tokens';
import {CUE} from '../lib/timeline';

/**
 * 0.000-2.000s — LOGO REVEAL
 *
 * 400ms of black and grain before anything happens. That silence is doing work:
 * it makes the logo's arrival an event rather than a start-of-video.
 *
 * Letter-spacing animates -10px -> 0 as it fades, so the wordmark opens out
 * rather than simply appearing, and the scale keyframes through 102% at 1400ms
 * before settling — a spring overshoot written as three explicit keyframes,
 * which is more controllable than a physics spring for a beat this short.
 */
export const D1Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const [fs, fe] = CUE.logo.fadeIn;
  const [s0, s1, s2] = CUE.logo.scale;

  const opacity = interpolate(frame, [fs, fe], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });
  const tracking = interpolate(frame, [fs, fe], [-10, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });
  const scale = interpolate(frame, [s0, s1, s2], [0.95, 1.02, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });

  // 0.5% brightness pulse at 1900ms.
  const pulse = 1 + 0.005 * Math.max(0, 1 - Math.abs(frame - CUE.logo.pulse) / 6);

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        filter: `brightness(${pulse})`,
        willChange: 'transform, opacity',
      }}
    >
      <span
        style={{
          ...ui(120, C.text, 700),
          fontFamily: INTER,
          letterSpacing: tracking,
          // Dual-layer glow: a tight core and a wide bloom.
          textShadow: `0 0 20px ${C.glow}, 0 0 60px rgba(23,232,168,0.28)`,
        }}
      >
        {BRAND}
      </span>
    </div>
  );
};
