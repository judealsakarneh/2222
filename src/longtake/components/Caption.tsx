import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {SERIF} from '../../lib/fonts';
import {EASE, L, serif} from '../lib/tokens';

/**
 * The one line of copy each station carries.
 *
 * Word-staggered, like the headlines in the other films — but here the words
 * also arrive with a small Z parallax of their own, so even the type has depth
 * inside a shot that is entirely about depth.
 */
export const Caption: React.FC<{
  text: string;
  /** Absolute frame the line starts arriving. */
  from: number;
  size?: number;
  color?: string;
  /** Per-word highlight, e.g. to put the brand emerald on one phrase. */
  accentFrom?: number;
  style?: React.CSSProperties;
}> = ({text, from, size = 62, color = L.text, accentFrom, style}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        columnGap: '0.28em',
        maxWidth: 880,
        textAlign: 'center',
        perspective: 900,
        ...serif(size, color),
        fontFamily: SERIF,
        ...style,
      }}
    >
      {text.split(' ').map((word, i) => {
        const start = from + i * 2.5;
        const p = interpolate(frame, [start, start + 16], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EASE,
        });
        const accent = accentFrom !== undefined && i >= accentFrom;

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: p,
              color: accent ? L.signal : undefined,
              transform: `translate3d(0, ${(1 - p) * 26}px, ${(1 - p) * -140}px)`,
              willChange: 'transform, opacity',
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
