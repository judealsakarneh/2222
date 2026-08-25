import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ZambleMark} from '../desk/components/ZambleMark';
import {SERIF} from '../lib/fonts';
import {N, PANEL_H, ui} from './tokens';

/**
 * PANEL 2 — the mark.
 *
 * Draws itself in, holds, then RETRACTS back along the same path to zero. The
 * retraction is what makes the loop work: rather than cutting or fading to
 * restart, the line un-draws itself, so frame 359 and frame 0 are both an empty
 * canvas and the seam is invisible. It also reads as intentional — the tangle
 * keeps resolving, over and over.
 *
 * Blink and breath cycles are set to 72 and 120, both divisors of 360.
 */

export const Panel2Mark: React.FC = () => {
  const frame = useCurrentFrame();

  const draw = interpolate(frame, [10, 132, 300, 352], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const wordIn = interpolate(frame, [120, 146, 300, 330], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'relative', height: PANEL_H, overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 8,
      }}
    >
      <ZambleMark
        progress={draw}
        width={720}
        strokeWidth={11}
        blinkCycle={72}
        breathCycle={120}
      />
      <div
        style={{
          ...ui(56, N.text, 400), fontFamily: SERIF, letterSpacing: '-0.015em',
          opacity: wordIn, transform: `translateY(${(1 - wordIn) * 12}px)`,
        }}
      >
        zamble
      </div>
    </div>
  );
};
