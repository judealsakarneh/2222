import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {SceneGate} from '../components/SceneGate';
import {hash} from '../../lib/random';
import {MONO} from '../lib/fonts';
import {COPY, EASE, T} from '../lib/tokens';
import {S} from '../lib/timeline';

/**
 * SCENE 5 — CTA end card. Frames 300-360 (10.0 - 12.0s)
 *
 * Deliberately still, except that it never fully is: the copy flickers on a
 * hash-driven schedule (a clean sine pulse reads as a breathing animation, not
 * as a failing tube), the caret blinks, and the global grain and scanlines keep
 * running underneath. Frame 359 is still moving.
 */
export const S5Cta: React.FC = () => {
  const frame = useCurrentFrame();

  const arrive = interpolate(frame, [S.cta.start, S.cta.start + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  // Irregular flicker: mostly lit, with occasional dips. Hash-driven so it is
  // uneven, and stepped every 3 frames so dips are visible rather than subliminal.
  const step = Math.floor(frame / 3);
  const roll = hash(step * 19.7);
  const flicker = roll > 0.86 ? 0.55 : roll > 0.74 ? 0.82 : 1;

  const caretOn = Math.floor(frame / 9) % 2 === 0;

  const urlIn = interpolate(frame, [318, 332], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  return (
    <SceneGate start={S.cta.start} end={S.cta.end}>
      <AbsoluteFill style={{background: T.bg}} />

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            opacity: arrive * flicker,
            transform: `scale(${0.97 + 0.03 * arrive})`,
            willChange: 'transform, opacity',
          }}
        >
          <span
            style={{
              fontFamily: MONO,
              fontWeight: 800,
              fontSize: 86,
              letterSpacing: '0.04em',
              color: T.white,
              textShadow: `0 0 28px rgba(0,255,204,0.5)`,
            }}
          >
            {COPY.cta}
          </span>
          <span
            style={{
              display: 'inline-block',
              width: 30,
              height: 82,
              background: T.cyan,
              boxShadow: `0 0 22px ${T.cyan}`,
              opacity: caretOn ? 1 : 0,
            }}
          />
        </div>

        <div
          style={{
            marginTop: 46,
            fontFamily: MONO,
            fontSize: 28,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: T.cyan,
            opacity: urlIn * 0.8,
            transform: `translate3d(0, ${(1 - urlIn) * 12}px, 0)`,
            willChange: 'transform, opacity',
          }}
        >
          {COPY.url}
        </div>
      </AbsoluteFill>
    </SceneGate>
  );
};
