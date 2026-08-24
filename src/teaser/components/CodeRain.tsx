import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {hash} from '../../lib/random';
import {MONO} from '../lib/fonts';
import {T} from '../lib/tokens';

/**
 * Code particles drifting UP behind the product reveal.
 *
 * Matrix rain conventionally falls; the reference teaser has it rising, which
 * reads as ascending/launch rather than as decay — the right feeling under a
 * version reveal.
 *
 * Each column has its own speed, glyph set and phase, all hash-derived, and each
 * column's head character is brighter than its tail.
 */

const GLYPHS = '01<>[]{}/\\|=+-*#$%&@ABCDEFXYZ01';
const COLUMNS = 26;
const CHARS_PER_COL = 16;

export const CodeRain: React.FC<{opacity?: number}> = ({opacity = 1}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none', opacity}}>
      {new Array(COLUMNS).fill(0).map((_, c) => {
        const x = (c / COLUMNS) * 100 + (hash(c * 3.3) - 0.5) * 2;
        const speed = 0.9 + hash(c * 7.7) * 2.4;
        const phase = hash(c * 11.1) * 1400;
        // Rises from below the frame and wraps.
        const y = 120 - (((frame * speed + phase) % 1600) / 1600) * 240;
        const size = 15 + hash(c * 5.5) * 9;

        return (
          <div
            key={c}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              fontFamily: MONO,
              fontSize: size,
              lineHeight: 1.25,
              willChange: 'transform',
            }}
          >
            {new Array(CHARS_PER_COL).fill(0).map((__, i) => {
              // Glyph changes over time so columns are never frozen strings.
              const g =
                GLYPHS[
                  Math.floor(
                    hash(c * 101 + i * 17 + Math.floor(frame / 4)) * GLYPHS.length
                  )
                ];
              // The head (i === 0, the topmost/leading char) burns brightest.
              const fade = 1 - i / CHARS_PER_COL;
              return (
                <div
                  key={i}
                  style={{
                    color: i === 0 ? T.white : T.cyan,
                    opacity: i === 0 ? 0.9 : fade * 0.42,
                  }}
                >
                  {g}
                </div>
              );
            })}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
