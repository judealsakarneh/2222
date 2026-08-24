import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Caption} from '../components/Caption';
import {INTER} from '../../lib/fonts';
import {STATIONS} from '../lib/camera';
import {EASE, L, label} from '../lib/tokens';

/**
 * STATION 4 — The outline assembles. Arrives 500, holds 85.
 *
 * Six slide titles snap into a numbered list, 7 frames apart. Each row slides in
 * from the left behind a wipe: the rule under it scales out from x-origin first
 * and the text follows, so the line reads as being *ruled* then *written*,
 * rather than just fading up.
 */

const A = STATIONS[4].arrive;

const ROWS = [
  'Problem',
  'Why now',
  'Market size',
  'Product',
  'Business model',
  'Go-to-market',
];

export const StOutline: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 58}}
    >
      <div style={{width: 780}}>
        {ROWS.map((row, i) => {
          const start = A - 62 + i * 9;
          const p = interpolate(frame, [start, start + 16], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: EASE,
          });
          // The rule leads the text by 4 frames.
          const rule = interpolate(frame, [start, start + 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: EASE,
          });
          if (p <= 0 && rule <= 0) return null;

          return (
            <div key={row} style={{marginBottom: 30}}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 30,
                  opacity: p,
                  transform: `translateX(${(1 - p) * -34}px)`,
                  willChange: 'transform, opacity',
                }}
              >
                <span
                  style={{
                    fontFamily: INTER,
                    fontWeight: 700,
                    fontSize: 20,
                    letterSpacing: '0.16em',
                    color: L.signal,
                    width: 44,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  style={{
                    fontFamily: INTER,
                    fontWeight: 400,
                    fontSize: 40,
                    color: L.text,
                  }}
                >
                  {row}
                </span>
              </div>
              <div
                style={{
                  height: 1,
                  marginTop: 18,
                  background: L.iceDim,
                  transformOrigin: '0 50%',
                  transform: `scaleX(${rule})`,
                  willChange: 'transform',
                }}
              />
            </div>
          );
        })}
        {/* The hold's payoff beat: the outline resolves into a count. */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 8,
            opacity: interpolate(frame, [A + 6, A + 22], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: EASE,
            }),
          }}
        >
          <span style={{...label(L.mist, 18), fontFamily: INTER}}>Outline</span>
          <span style={{...label(L.signal, 18), fontFamily: INTER}}>
            14 slides · 31 sources
          </span>
        </div>
      </div>

      <Caption text="It builds the argument." from={A + 10} size={58} />
    </div>
  );
};
