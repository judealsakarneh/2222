import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ZambleMark} from '../../desk/components/ZambleMark';
import {SERIF} from '../../lib/fonts';
import {EASE, P, ui} from '../lib/tokens';

/**
 * SCENE 2 — Understand. Frames 150-330 (6.0s). PAPER.
 *
 * The film's breath, and its longest hold. Coming out of a hard zoom into a dark
 * screen, landing on cream paper is the biggest contrast beat in the piece — it
 * reads as the moment the noise resolves into sense.
 *
 * One idea, one line, one drawing. The mark draws itself across the whole scene,
 * and the dot its line resolves into is the shape the NEXT transition grows out
 * of — so the scene ends by handing the film its own exit.
 */

const A = 150;

export const S2Understand: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - A;

  const draw = interpolate(local, [-10, 74], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });
  const lineIn = interpolate(local, [76, 100], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });

  // The dot the line ends in. It appears late, breathes, and is the origin of
  // the grow transition at frame 306.
  const dotIn = interpolate(local, [104, 124], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });
  const dotPulse = 1 + Math.sin(local / 9) * 0.07;

  return (
    <div
      style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 90% 80% at 50% 42%, ${P.bg} 0%, ${P.bgWarm} 100%)`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 60,
      }}
    >
      <ZambleMark progress={draw} width={1180} strokeWidth={13} color={P.ink} />

      <div
        style={{
          ...ui(64, P.text, 400),
          fontFamily: SERIF,
          letterSpacing: '-0.015em',
          opacity: lineIn,
          transform: `translateY(${(1 - lineIn) * 16}px)`,
          willChange: 'transform, opacity',
        }}
      >
        It works out what you meant.
      </div>

      {/* The shape the next world grows from — at 72% / 50% of frame. */}
      <div
        style={{
          position: 'absolute',
          left: '72%', top: '50%',
          width: 30, height: 30, marginLeft: -15, marginTop: -15,
          borderRadius: '50%',
          background: P.ink,
          opacity: dotIn,
          transform: `scale(${dotPulse})`,
          willChange: 'transform',
        }}
      />
    </div>
  );
};
