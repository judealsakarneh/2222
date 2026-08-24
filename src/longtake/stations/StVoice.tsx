import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Caption} from '../components/Caption';
import {INTER} from '../../lib/fonts';
import {STATIONS} from '../lib/camera';
import {EASE, L, label} from '../lib/tokens';

/**
 * STATION 1 — Voice capture. Arrives 105, holds 75.
 *
 * A RADIAL waveform: 76 bars fanned around a ring, growing outward from it.
 * Radial rather than the usual linear meter, because the camera is flying at
 * this thing head-on — a horizontal bar chart would read as a flat card, while a
 * ring reads as an aperture the camera is about to pass through.
 *
 * Bar heights are the same class of deterministic two-sine product used
 * elsewhere in this repo: organic-looking, bit-for-bit reproducible.
 */

const A = STATIONS[1].arrive;
const BARS = 76;
const RADIUS = 230;

const barLen = (frame: number, i: number): number =>
  16 +
  Math.abs(Math.sin(frame * 0.13 + i * 0.29)) *
    82 *
    (0.45 + 0.55 * Math.abs(Math.sin(frame * 0.06 + i * 0.9)));

export const StVoice: React.FC = () => {
  const frame = useCurrentFrame();

  const ringIn = interpolate(frame, [A - 72, A - 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  // Slow rotation so the ring is never a frozen sunburst.
  const spin = frame * 0.22;
  const pulse = 0.6 + 0.4 * ((1 + Math.cos((frame / 26) * Math.PI * 2)) / 2);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 66,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: RADIUS * 2 + 220,
          height: RADIUS * 2 + 220,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${0.82 + 0.18 * ringIn})`,
          opacity: ringIn,
          willChange: 'transform, opacity',
        }}
      >
        {/* Ring guide */}
        <div
          style={{
            position: 'absolute',
            width: RADIUS * 2,
            height: RADIUS * 2,
            borderRadius: '50%',
            border: `1px solid ${L.iceDim}`,
          }}
        />

        {/* Radial bars */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `rotate(${spin}deg)`,
            willChange: 'transform',
          }}
        >
          {new Array(BARS).fill(0).map((_, i) => {
            const angle = (i / BARS) * 360;
            const len = barLen(frame, i) * ringIn;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: 3,
                  height: len,
                  marginLeft: -1.5,
                  transformOrigin: '50% 0',
                  transform: `rotate(${angle}deg) translateY(${RADIUS}px)`,
                  borderRadius: 2,
                  background: `linear-gradient(180deg, ${L.ice}, rgba(23,232,168,0.15))`,
                  willChange: 'transform',
                }}
              />
            );
          })}
        </div>

        {/* Live indicator at the centre of the aperture */}
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: L.signal,
            boxShadow: `0 0 ${18 * pulse}px ${L.signal}`,
            opacity: 0.5 + 0.5 * pulse,
          }}
        />
        <div
          style={{
            position: 'absolute',
            ...label(L.mist, 17),
            fontFamily: INTER,
            transform: 'translateY(58px)',
          }}
        >
          Recording
        </div>
      </div>

      <Caption text="You talk for two minutes." from={A + 4} size={58} />
    </div>
  );
};
