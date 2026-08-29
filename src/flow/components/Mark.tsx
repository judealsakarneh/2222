import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {ARCHIVO} from '../../lib/fonts';
import {BEATS, EASE, ICON_SCALE, ms} from '../lib/timeline';

/**
 * 0 - 600 ms. The mark loads.
 *
 * Scale 0 → 110 → 100, opacity over the first 300 ms, glow over 500 ms - three
 * properties on three different durations, which is the whole trick. If they
 * shared one duration the mark would arrive as a single flat pop; staggered,
 * the shape lands first, the light catches up, and the eye reads it as an
 * object rather than as a fade.
 *
 * It then hands the frame over: from 600 ms it scales up and out, so the panel
 * beat is not competing with a logo sitting in the middle of the screen.
 */
export const Mark: React.FC = () => {
  const frame = useCurrentFrame();
  const {move, opacity, glow} = BEATS.icon;
  const exitAt = BEATS.icon.slot[1];

  // 0 → 110 → 100. The overshoot is the shape; the curve decides the snap.
  const scaleIn = interpolate(
    frame,
    [0, ms(move * 0.62), ms(move)],
    [0, ICON_SCALE.peak, ICON_SCALE.settle],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE},
  );

  // Hands off to the panel: grows slightly and dissolves rather than shrinking,
  // so it reads as the camera moving past it, not as an element being deleted.
  const exit = interpolate(frame, [ms(exitAt), ms(exitAt + 320)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  const fade = interpolate(frame, [0, ms(opacity)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  const bloom = interpolate(frame, [0, ms(glow)], [0, 0.3], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  const scale = scaleIn * interpolate(exit, [0, 1], [1, 1.18]);
  const alpha = fade * (1 - exit);
  if (alpha <= 0.001) return null;

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div
        style={{
          position: 'relative',
          transform: `scale(${scale})`,
          opacity: alpha,
        }}
      >
        {/* The glow. 40 px of Gaussian at 20% white, ramping to 30% opacity -
            a light source behind the slab, not a stroke around it. */}
        <div
          style={{
            position: 'absolute',
            inset: -46,
            borderRadius: 64,
            background: 'rgba(255,255,255,0.2)',
            filter: 'blur(40px)',
            opacity: bloom,
          }}
        />
        {/* The glass slab, in the same material as the app panel. */}
        <div
          style={{
            position: 'relative',
            width: 196,
            height: 196,
            borderRadius: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background:
              'linear-gradient(158deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.05) 58%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(255,255,255,0.16)',
            boxShadow:
              '0 30px 80px -20px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.22)',
            backdropFilter: 'blur(15px)',
          }}
        >
          <span
            style={{
              fontFamily: ARCHIVO,
              fontWeight: 900,
              fontSize: 62,
              letterSpacing: '-0.04em',
              color: '#FFFFFF',
              lineHeight: 1,
            }}
          >
            C
          </span>
          {/* The teal tile. The brand colour's one appearance at this scale. */}
          <div
            style={{
              position: 'absolute',
              right: 26,
              bottom: 26,
              width: 26,
              height: 26,
              borderRadius: 7,
              background: '#00A9A4',
              filter: `drop-shadow(0 0 ${14 * (bloom / 0.3)}px rgba(0,169,164,0.7))`,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
