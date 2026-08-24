import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {SceneGate} from '../components/SceneGate';
import {DataCoords} from '../components/DataCoords';
import {hash} from '../../lib/random';
import {MONO} from '../lib/fonts';
import {COPY, EASE, T, STATS, hud} from '../lib/tokens';
import {S} from '../lib/timeline';

/**
 * SCENE 1 — Growth flex. Frames 0-45 (0.0 - 1.5s)
 *
 * Open on the number. No logo, no preamble — the flex IS the hook, and at 1.5s
 * there is no room for a wind-up.
 *
 * The counter runs 3277 -> 62000 over 36 frames on the standard curve, so it
 * decelerates hard into its final value rather than ticking linearly. While it
 * is still climbing, individual digits scramble to glyph noise — that is what
 * makes it read as a live counter under load rather than as a tween.
 */
export const S1Counter: React.FC = () => {
  const frame = useCurrentFrame();

  const value = Math.floor(
    interpolate(frame, [3, 39], [STATS.from, STATS.to], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: EASE,
    })
  );
  const settled = frame >= 39;

  // Digit scramble while climbing, re-rolled every 2 frames.
  //
  // Only the last two places scramble. Scrambling the leading digits destroys
  // the number — the viewer loses the sense that it is climbing and just sees
  // noise. Blurring the low places is what a fast mechanical counter actually
  // does, and it keeps the headline figure readable the whole way up.
  const step = Math.floor(frame / 2);
  const raw = String(value);
  const digits = raw
    .split('')
    .map((d, i) => {
      if (settled || i < raw.length - 2) return d;
      const noisy = hash(step * 23 + i * 7) > 0.35;
      return noisy ? String(Math.floor(hash(step * 5 + i * 3) * 10)) : d;
    })
    .join('');

  const introOpacity = interpolate(frame, [0, 6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  // The whole readout punches in very slightly across the scene.
  const punch = interpolate(frame, [0, 45], [1.06, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  return (
    <SceneGate start={S.counter.start} end={S.counter.end}>
      <AbsoluteFill style={{background: T.bg}} />
      <DataCoords opacity={0.3} />

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          opacity: introOpacity,
          transform: `scale(${punch})`,
          willChange: 'transform, opacity',
        }}
      >
        <div style={{...hud(T.purple), marginBottom: 34, fontFamily: MONO}}>
          {COPY.hudGrowth}
        </div>

        <div
          style={{
            fontFamily: MONO,
            fontWeight: 800,
            fontSize: 196,
            lineHeight: 1,
            color: T.white,
            textShadow: `0 0 40px rgba(0,255,204,0.45)`,
            letterSpacing: '-0.02em',
            display: 'flex',
            alignItems: 'baseline',
          }}
        >
          {digits}
          <span style={{color: T.cyan}}>+</span>
        </div>

        <div
          style={{
            ...hud(T.cyan, 30),
            marginTop: 30,
            fontFamily: MONO,
            textShadow: `0 0 18px ${T.cyan}`,
          }}
        >
          Users
        </div>

        {/* Progress rail — a second, quieter read on the same number. */}
        <div
          style={{
            marginTop: 44,
            width: 560,
            height: 3,
            background: 'rgba(0,255,204,0.14)',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${interpolate(frame, [3, 39], [5, 100], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: EASE,
              })}%`,
              background: T.cyan,
              boxShadow: `0 0 12px ${T.cyan}`,
            }}
          />
        </div>
      </AbsoluteFill>
    </SceneGate>
  );
};
