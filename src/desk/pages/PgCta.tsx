import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {INTER, SERIF} from '../../lib/fonts';
import {ZambleMark} from '../components/ZambleMark';
import {BRAND, D, EASE, label, ui} from '../lib/tokens';

/**
 * PAGE 6 — CTA. Frames 426-480.
 *
 * Deliberately drops the app chrome: the product steps out of its own UI for the
 * close.
 *
 * The mark draws itself here — a tangle resolving into one clean line, with eyes
 * that open once the stroke has passed them. It is the whole product in a single
 * stroke, so it gets the finale to itself and the wordmark arrives underneath it.
 */

const A = 426;

export const PgCta: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - A;

  const draw = interpolate(local, [-14, 30], [0, 1], {
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
      <ZambleMark progress={draw} width={860} strokeWidth={12} />

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
