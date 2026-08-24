import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ZambleMark} from '../../desk/components/ZambleMark';
import {INTER, SERIF} from '../../lib/fonts';
import {BRAND, EASE, N, label, ui} from '../lib/tokens';

/**
 * SCENE 5 — CTA. Frames 600-690 (3.0s). NIGHT.
 *
 * The paper world collapsed to a point, and the point opens here as the mark.
 * The mark is already most of the way drawn when the scene arrives, so the
 * collapse hands straight into it rather than restarting.
 */

const A = 600;

export const S5Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - A;

  const draw = interpolate(local, [-20, 22], [0.25, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });
  const wordIn = interpolate(local, [16, 38], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });
  const btnIn = interpolate(local, [30, 52], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });

  const ringT = local > 48 ? ((local - 48) % 38) / 38 : -1;

  return (
    <div
      style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 70% 62% at 50% 46%, #10201B 0%, ${N.bg} 55%, ${N.bgDeep} 100%)`,
        fontFamily: INTER,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 34,
      }}
    >
      <ZambleMark progress={draw} width={780} strokeWidth={12} />

      <div style={{...ui(104, N.text, 400), fontFamily: SERIF, letterSpacing: '-0.015em', opacity: wordIn}}>
        {BRAND}
      </div>

      <div style={{position: 'relative', marginTop: 10, opacity: btnIn, transform: `translateY(${(1 - btnIn) * 18}px)`}}>
        {ringT >= 0 ? (
          <div
            style={{
              position: 'absolute', inset: 0, borderRadius: 999,
              border: `2px solid ${N.signal}`,
              opacity: 0.42 * (1 - ringT),
              transform: `scale(${1 + 0.3 * ringT})`,
              willChange: 'transform, opacity',
            }}
          />
        ) : null}
        <div
          style={{
            position: 'relative', padding: '26px 60px', borderRadius: 999,
            background: `linear-gradient(180deg, #43F0BB, ${N.signal} 55%, #0FC98E)`,
            color: '#04120D', fontSize: 34, fontWeight: 700,
            boxShadow: '0 14px 30px -12px rgba(23,232,168,0.6), inset 0 1px 0 rgba(255,255,255,0.45)',
          }}
        >
          Start rambling
        </div>
      </div>

      <div style={{...label(N.mute, 18), marginTop: 12, opacity: btnIn}}>{BRAND}.app</div>
    </div>
  );
};
