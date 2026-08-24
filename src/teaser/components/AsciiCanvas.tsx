import React from 'react';
import {MONO} from '../lib/fonts';
import {T} from '../lib/tokens';

/**
 * Renders a generated ASCII frame.
 *
 * `lineHeight: 1` plus a monospace face is what keeps the character grid square
 * enough for the shading maths in lib/ascii to read as geometry. `whiteSpace:
 * pre` preserves the leading spaces that carry the silhouette.
 */
export const AsciiCanvas: React.FC<{
  rows: string[];
  fontSize?: number;
  color?: string;
  glow?: number;
  style?: React.CSSProperties;
}> = ({rows, fontSize = 22, color = T.cyan, glow = 10, style}) => (
  <pre
    style={{
      margin: 0,
      fontFamily: MONO,
      fontWeight: 700,
      fontSize,
      lineHeight: 1,
      letterSpacing: 0,
      whiteSpace: 'pre',
      color,
      textShadow: `0 0 ${glow}px ${color}`,
      willChange: 'transform, opacity',
      ...style,
    }}
  >
    {rows.join('\n')}
  </pre>
);
