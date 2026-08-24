import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {D, EASE} from '../lib/tokens';

/**
 * THE ZAMBLE MARK — the tangle that resolves into a line.
 *
 * Chosen from the three sketches because it is the only one that is a LOGO and a
 * CHARACTER at the same time. It states the product in a single stroke: a
 * knotted mess of rambling on the left, two eyes at the moment it works out what
 * you meant, and one clean structured line running out to the right. The other
 * two sketches are charming creatures but they don't say anything about what the
 * product does.
 *
 * It is drawn as ONE continuous path, so `pathLength` + `strokeDashoffset` makes
 * the reveal literal: the stroke enters as chaos and leaves as structure, in that
 * order, because that is the order the path is authored in. Nothing else in this
 * repo gets that for free.
 *
 * The eyes only open once the stroke has travelled past them — the character
 * doesn't exist until the line has made sense of itself.
 */

/** Authored left-to-right: entry, five crossing loops, the resolve, the tail. */
const PATH =
  'M 40 196 ' +
  'C 78 196, 84 150, 124 142 ' +
  'C 172 135, 206 186, 172 214 ' +
  'C 136 243, 106 182, 148 148 ' +
  'C 196 110, 262 146, 258 196 ' +
  'C 254 248, 180 254, 168 208 ' +
  'C 156 160, 238 126, 288 154 ' +
  'C 336 181, 334 240, 288 250 ' +
  'C 242 260, 226 200, 262 168 ' +
  'C 302 132, 372 148, 388 192 ' +
  'C 402 230, 360 254, 336 232 ' +
  'C 312 210, 334 166, 378 164 ' +
  'C 416 162, 434 188, 456 192 ' +
  'C 478 196, 492 186, 512 190 ' +
  'C 534 194, 540 186, 560 190 ' +
  'L 960 190';

const DASH = 1000;
/** Where along the stroke the eyes sit — they open just after it passes. */
const EYES_AT = 0.6;

export const ZambleMark: React.FC<{
  /** 0 -> 1 draw-on. */
  progress: number;
  width?: number;
  color?: string;
  strokeWidth?: number;
  /** Set false for a static logo lockup. */
  alive?: boolean;
}> = ({progress, width = 760, color = D.signal, strokeWidth = 11, alive = true}) => {
  const frame = useCurrentFrame();

  const eyes = interpolate(progress, [EYES_AT, EYES_AT + 0.14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  // Blink: 4 frames closed on a 76-frame cycle, with a second quick blink
  // offset inside it so the rhythm isn't metronomic.
  const t = frame % 76;
  const blinking = alive && (t < 4 || (t > 9 && t < 12));
  const lidScale = blinking ? 0.12 : 1;

  // The tangle keeps a tiny breath so the character never freezes solid.
  const breath = alive ? 1 + Math.sin(frame / 38) * 0.012 : 1;

  return (
    <svg
      width={width}
      height={(width * 320) / 1000}
      viewBox="0 0 1000 320"
      fill="none"
      style={{
        overflow: 'visible',
        filter: `drop-shadow(0 0 22px ${color}55)`,
        transform: `scale(${breath})`,
        willChange: 'transform',
      }}
    >
      <path
        d={PATH}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={DASH}
        strokeDasharray={DASH}
        strokeDashoffset={DASH * (1 - progress)}
      />

      {/* Eyes. scaleY on its own origin gives a real lid, not a fade. */}
      {[520, 566].map((cx) => (
        <ellipse
          key={cx}
          cx={cx}
          cy={158}
          rx={11}
          ry={11 * lidScale}
          fill={color}
          opacity={eyes}
        />
      ))}
    </svg>
  );
};
