import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {hash} from '../../lib/random';
import {GlitchKind, TRANSITIONS} from '../lib/timeline';

/**
 * The glitch engine. Wraps the entire scene stack, so a transition glitches the
 * whole frame as one event rather than as two scenes crossfading.
 *
 * Two effects compose:
 *
 * 1. REAL RGB SPLIT. Not a coloured drop-shadow — the subtree is rendered twice
 *    through feColorMatrix channel isolators (red-only and cyan-only), offset in
 *    opposite directions and recombined with `mix-blend-mode: screen`. Screen of
 *    red-only + cyan-only reconstructs the original exactly at zero offset, so
 *    the effect vanishes cleanly when intensity hits 0.
 *
 * 2. SLICE DISPLACEMENT. Horizontal bands of the frame torn sideways. This is
 *    the part that reads as "broken signal" rather than "blurry" — slices are
 *    clipped copies of the subtree, each shifted by a deterministic amount that
 *    re-rolls every 2 frames so the tear stutters instead of sliding.
 *
 * Both are inert outside transition windows: at intensity 0 exactly one copy of
 * the children renders.
 */

const SLICE_COUNT = 4;

/** Envelope: snaps up, decays out. A symmetric ramp would read as a dissolve. */
const envelope = (frame: number, start: number, peak: number, end: number): number => {
  if (frame < start || frame > end) return 0;
  if (frame <= peak) {
    const t = (frame - start) / Math.max(1, peak - start);
    return t * t; // slow build
  }
  const t = (frame - peak) / Math.max(1, end - peak);
  return Math.max(0, 1 - t); // fast decay
};

/** The strongest active transition this frame, or null. */
export const useGlitch = (): {intensity: number; kind: GlitchKind} | null => {
  const frame = useCurrentFrame();
  let best: {intensity: number; kind: GlitchKind} | null = null;

  for (const t of TRANSITIONS) {
    const i = envelope(frame, t.start, t.peak, t.end);
    if (i > 0 && (best === null || i > best.intensity)) {
      best = {intensity: i, kind: t.kind};
    }
  }
  return best;
};

export const GlitchLayer: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const g = useGlitch();
  const intensity = g?.intensity ?? 0;
  const kind = g?.kind ?? 'rgb';

  // A whip pan is a camera move, not a signal fault — it gets travel and blur
  // instead of channel separation.
  const isWhip = kind === 'whip';

  if (intensity <= 0.001) {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }

  // Channel separation, in px. Chromatic aberration on the fade-out is gentler
  // and symmetric; a hard cut is violent.
  const split = isWhip
    ? intensity * 6
    : kind === 'chroma'
      ? intensity * 10
      : intensity * 26;

  // Whole-frame jitter, re-rolled every 2 frames.
  const step = Math.floor(frame / 2);
  const jx = isWhip ? 0 : (hash(step * 7.1) - 0.5) * intensity * 22;
  const jy = isWhip ? 0 : (hash(step * 3.7) - 0.5) * intensity * 8;

  // Whip pan travel + directional blur.
  const whipX = isWhip ? (1 - intensity) * 0 + intensity * 260 : 0;
  const whipBlur = isWhip ? intensity * 18 : 0;

  const base: React.CSSProperties = {
    transform: `translate3d(${jx + whipX}px, ${jy}px, 0)`,
    willChange: 'transform, opacity, filter',
  };

  return (
    <AbsoluteFill>
      {/* Channel isolators. Screen-compositing red-only over cyan-only is a
          lossless reconstruction when the two are aligned. */}
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id="zt-red">
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0"
          />
        </filter>
        <filter id="zt-cyan">
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 1 0"
          />
        </filter>
      </svg>

      <AbsoluteFill style={{...base, filter: whipBlur ? `blur(${whipBlur}px)` : undefined}}>
        <AbsoluteFill
          style={{
            filter: 'url(#zt-red)',
            transform: `translate3d(${-split}px, 0, 0)`,
            mixBlendMode: 'screen',
          }}
        >
          {children}
        </AbsoluteFill>
        <AbsoluteFill
          style={{
            filter: 'url(#zt-cyan)',
            transform: `translate3d(${split}px, 0, 0)`,
            mixBlendMode: 'screen',
          }}
        >
          {children}
        </AbsoluteFill>
      </AbsoluteFill>

      {/* Torn slices. Skipped on the whip pan and the soft chromatic fade. */}
      {!isWhip && kind !== 'chroma' && intensity > 0.25
        ? new Array(SLICE_COUNT).fill(0).map((_, i) => {
            const seed = step * 13 + i * 29;
            const top = hash(seed) * 82;
            const height = 4 + hash(seed * 1.7) * 12;
            const shift = (hash(seed * 2.3) - 0.5) * intensity * 190;

            return (
              <AbsoluteFill
                key={i}
                style={{
                  clipPath: `inset(${top}% 0 ${Math.max(0, 100 - top - height)}% 0)`,
                  transform: `translate3d(${shift}px, 0, 0)`,
                  opacity: 0.9,
                  willChange: 'transform',
                }}
              >
                {children}
              </AbsoluteFill>
            );
          })
        : null}

      {/* A white flash frame at the very peak of a hard cut. */}
      {!isWhip && intensity > 0.9 ? (
        <AbsoluteFill
          style={{
            background: '#ffffff',
            opacity: (intensity - 0.9) * 0.9,
            mixBlendMode: 'overlay',
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
