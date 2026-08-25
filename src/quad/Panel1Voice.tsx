import React from 'react';
import {useCurrentFrame} from 'remotion';
import {INTER, SERIF} from '../lib/fonts';
import {N, PANEL_H, label, ui} from './tokens';

/**
 * PANEL 1 — "Just talk."
 *
 * A live level meter. Bar heights are a product of two sines whose periods
 * (90 and 120 frames) both divide the composition's 360, so the waveform is
 * continuous across the loop seam — frame 359 hands to frame 0 with no jump.
 * Every cycle in this film is chosen that way; that is what makes the loop
 * seamless rather than nearly seamless.
 */

const BARS = 46;

const barH = (f: number, i: number): number =>
  10 +
  Math.abs(Math.sin((f / 90) * Math.PI * 2 + i * 0.5)) *
    72 *
    (0.42 + 0.58 * Math.abs(Math.sin((f / 120) * Math.PI * 2 + i * 1.7)));

export const Panel1Voice: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = (1 + Math.cos((frame / 60) * Math.PI * 2)) / 2;

  // No entrance fade. Anything that fades in from frame 0 is absent at 0 and
  // present at 359, which pops at the loop seam — a loop has no beginning.
  const textIn = 1;

  return (
    <div
      style={{
        position: 'relative', height: PANEL_H, overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 34,
      }}
    >
      {/* Recording indicator */}
      <div style={{display: 'flex', alignItems: 'center', gap: 12, opacity: textIn}}>
        <div
          style={{
            width: 10, height: 10, borderRadius: '50%', background: N.signal,
            boxShadow: `0 0 ${8 + 10 * pulse}px ${N.signal}`,
            opacity: 0.45 + 0.55 * pulse,
          }}
        />
        <span style={{...label(N.faint, 15), fontFamily: INTER}}>recording</span>
      </div>

      {/* Level meter */}
      <div style={{display: 'flex', alignItems: 'center', gap: 7, height: 96}}>
        {new Array(BARS).fill(0).map((_, i) => (
          <div
            key={i}
            style={{
              width: 5, height: barH(frame, i), borderRadius: 3,
              background: `linear-gradient(180deg, ${N.signal}, ${N.signalDim})`,
              willChange: 'transform',
            }}
          />
        ))}
      </div>

      <div
        style={{
          ...ui(46, N.text, 400), fontFamily: SERIF, letterSpacing: '-0.015em',
          opacity: textIn, transform: `translateY(${(1 - textIn) * 14}px)`,
        }}
      >
        Just talk.
      </div>
    </div>
  );
};
