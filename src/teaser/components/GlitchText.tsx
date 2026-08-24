import React from 'react';
import {useCurrentFrame} from 'remotion';
import {hash} from '../../lib/random';
import {T} from '../lib/tokens';

/**
 * Chromatic-split text.
 *
 * Three stacked copies — cyan pushed one way, purple the other, white on top —
 * composited with `screen`. At offset 0 they converge into clean white text, so
 * the same component covers "settled" and "tearing" without a second code path.
 *
 * `scramble` swaps characters for glyph noise while the reveal is in progress;
 * the swap set is deterministic per (frame, charIndex).
 */

const NOISE = '!<>-_\\/[]{}—=+*^?#01';

export const GlitchText: React.FC<{
  text: string;
  /** 0 = clean, 1 = fully torn. */
  intensity: number;
  /** 0 = every char scrambled, 1 = fully resolved. */
  resolve?: number;
  style?: React.CSSProperties;
}> = ({text, intensity, resolve = 1, style}) => {
  const frame = useCurrentFrame();

  // Re-roll the scramble every 2 frames — per-frame is too fast to read.
  const step = Math.floor(frame / 2);
  const shown = text
    .split('')
    .map((ch, i) => {
      if (ch === ' ') return ch;
      // Characters resolve left to right, with a hash-jittered threshold so the
      // wipe is ragged rather than a clean sweep. The +3 headroom guarantees
      // every character is resolved at resolve = 1 — without it the jitter can
      // leave a trailing character stuck as noise forever.
      const charResolved = resolve * (text.length + 3) > i + hash(i * 5.3) * 2.5;
      if (charResolved) return ch;
      return NOISE[Math.floor(hash(step * 31 + i * 17) * NOISE.length)];
    })
    .join('');

  const dx = intensity * 7;
  const jitter = (hash(step * 9.1) - 0.5) * intensity * 10;

  const layer = (color: string, offset: number): React.CSSProperties => ({
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    color,
    transform: `translate3d(${offset}px, 0, 0)`,
    mixBlendMode: 'screen',
    willChange: 'transform',
  });

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        transform: `translate3d(${jitter}px, 0, 0)`,
        willChange: 'transform',
        ...style,
      }}
    >
      {/* Spacer establishes the box; the coloured copies are absolute over it. */}
      <span style={{visibility: 'hidden'}}>{shown}</span>
      <span style={layer(T.cyan, -dx)}>{shown}</span>
      <span style={layer(T.purple, dx)}>{shown}</span>
      <span style={layer(T.white, 0)}>{shown}</span>
    </div>
  );
};
