import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {INTER, SERIF} from '../../lib/fonts';
import {BRAND, D, EASE, label, ui} from '../lib/tokens';

/**
 * PAGE 6 — CTA. Frames 426-480.
 *
 * Deliberately drops the app chrome: the product steps out of its own UI for the
 * close. The mark is a ragged waveform resolving into a clean line — rambling in,
 * structure out — drawn with pathLength so the reveal is exact.
 */

const A = 426;
const MARK =
  'M4 26 C 12 6, 18 44, 26 14 C 33 -6, 39 40, 47 22 C 54 8, 60 30, 68 26 L 116 26';
const DASH = 300;

export const PgCta: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - A;

  const draw = interpolate(local, [-12, 20], [DASH, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const wordIn = interpolate(local, [10, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const subIn = interpolate(local, [20, 38], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  // Ring keeps running through the final frame.
  const ringT = local > 34 ? ((local - 34) % 36) / 36 : -1;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        fontFamily: INTER,
        background: 'radial-gradient(ellipse 70% 60% at 50% 46%, #10201B 0%, #0B1114 55%, #080C0F 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 38,
      }}
    >
      <svg
        width={380}
        height={(380 * 52) / 120}
        viewBox="0 0 120 52"
        fill="none"
        style={{filter: `drop-shadow(0 0 18px rgba(23,232,168,0.55))`}}
      >
        <path
          d={MARK}
          stroke={D.signal}
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
          ...ui(120, D.text, 400),
          fontFamily: SERIF,
          letterSpacing: '-0.015em',
          opacity: wordIn,
          transform: `translateY(${(1 - wordIn) * 14}px)`,
          willChange: 'transform, opacity',
        }}
      >
        {BRAND}
      </div>

      <div style={{position: 'relative', marginTop: 8, opacity: subIn, transform: `translateY(${(1 - subIn) * 16}px)`}}>
        {ringT >= 0 ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 999,
              border: `2px solid ${D.signal}`,
              opacity: 0.4 * (1 - ringT),
              transform: `scale(${1 + 0.28 * ringT})`,
              willChange: 'transform, opacity',
            }}
          />
        ) : null}
        <div
          style={{
            position: 'relative',
            padding: '26px 60px',
            borderRadius: 999,
            background: `linear-gradient(180deg, #43F0BB, ${D.signal} 55%, #0FC98E)`,
            color: '#04120D',
            fontSize: 34,
            fontWeight: 700,
            boxShadow: '0 14px 30px -12px rgba(23,232,168,0.6), inset 0 1px 0 rgba(255,255,255,0.45)',
          }}
        >
          Start rambling
        </div>
      </div>

      <div style={{...label(D.mute, 20), marginTop: 18, opacity: subIn}}>
        {BRAND}.app
      </div>
    </div>
  );
};
