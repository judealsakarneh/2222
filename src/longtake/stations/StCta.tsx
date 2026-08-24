import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {INTER, SERIF} from '../../lib/fonts';
import {STATIONS} from '../lib/camera';
import {BRAND, EASE, L, serif} from '../lib/tokens';

/**
 * STATION 7 — CTA. Arrives 855, holds 45 (to frame 900).
 *
 * The mark is a waveform that resolves into a straight line — the product, drawn
 * in one stroke: rambling in, structure out. It draws itself via
 * pathLength/dashoffset, so the reveal is exact regardless of the path geometry.
 *
 * The camera is still drifting forward on the final frame. This film never comes
 * to rest, which is the point.
 */

const A = STATIONS[7].arrive;

/** Ragged on the left, flattening to a clean line on the right. */
const MARK =
  'M4 26 C 12 6, 18 44, 26 14 C 33 -6, 39 40, 47 22 C 54 8, 60 30, 68 26 L 116 26';
const DASH = 300;

export const StCta: React.FC = () => {
  const frame = useCurrentFrame();

  const draw = interpolate(frame, [A - 70, A - 26], [DASH, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const wordIn = interpolate(frame, [A - 30, A - 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const btnIn = interpolate(frame, [A + 8, A + 26], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const urlIn = interpolate(frame, [A + 20, A + 36], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  // The button keeps a slow ring going through the last frame.
  const ringT = ((frame - A - 20) % 34) / 34;

  return (
    <div
      style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40}}
    >
      <svg
        width={340}
        height={(340 * 52) / 120}
        viewBox="0 0 120 52"
        fill="none"
        style={{filter: `drop-shadow(0 0 20px rgba(23,232,168,0.55))`}}
      >
        <path
          d={MARK}
          stroke={L.signal}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={DASH}
          strokeDasharray={DASH}
          strokeDashoffset={draw}
        />
      </svg>

      <div
        style={{
          ...serif(96, L.text),
          fontFamily: SERIF,
          opacity: wordIn,
          transform: `translateY(${(1 - wordIn) * 18}px)`,
          willChange: 'transform, opacity',
        }}
      >
        {BRAND}
      </div>

      <div
        style={{
          position: 'relative',
          marginTop: 22,
          opacity: btnIn,
          transform: `translateY(${(1 - btnIn) * 22}px)`,
          willChange: 'transform, opacity',
        }}
      >
        {ringT >= 0 && frame > A + 20 ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 999,
              border: `2px solid ${L.signal}`,
              opacity: 0.4 * (1 - ringT),
              transform: `scale(${1 + 0.3 * ringT})`,
              willChange: 'transform, opacity',
            }}
          />
        ) : null}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '28px 54px',
            borderRadius: 999,
            background: `linear-gradient(180deg, #43F0BB, ${L.signal} 55%, #0FC98E)`,
            color: '#04120D',
            fontFamily: INTER,
            fontWeight: 700,
            fontSize: 30,
            boxShadow:
              '0 16px 34px -12px rgba(23,232,168,0.6), inset 0 1px 0 rgba(255,255,255,0.45)',
          }}
        >
          Start rambling
          <svg
            width={22}
            height={22}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="12" x2="19" y2="12" />
            <polyline points="13 6 19 12 13 18" />
          </svg>
        </div>
      </div>

      <div
        style={{
          marginTop: 10,
          fontFamily: INTER,
          fontSize: 22,
          letterSpacing: '0.26em',
          textTransform: 'uppercase',
          color: L.mist,
          opacity: urlIn,
          willChange: 'opacity',
        }}
      >
        {BRAND}.app
      </div>
    </div>
  );
};
