import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {EASE_STANDARD, SPRING_SETTLE} from '../lib/easing';

/**
 * Word-staggered headline reveal.
 *
 * No headline in this film ever fades in as a block — every line arrives one
 * word at a time. Vertical travel is spring-driven so each word overshoots a
 * hair and settles; opacity rides a separate clamped ramp over the first 60%
 * of the word's window, because a spring-driven opacity spends too long near
 * zero and the line reads as laggy.
 *
 * `\n` in `text` starts a new line. The stagger index is global across lines so
 * a two-line headline still reads as one continuous sweep.
 */
export const KineticWords: React.FC<{
  text: string;
  startFrame: number;
  staggerFrames: number;
  durationInFrames?: number;
  travelY?: number;
  springConfig?: {damping: number; stiffness: number; mass: number};
  style?: React.CSSProperties;
  lineStyle?: React.CSSProperties;
  /** Per-word style override, keyed by the word's global index. */
  wordStyle?: (globalIndex: number, word: string) => React.CSSProperties;
}> = ({
  text,
  startFrame,
  staggerFrames,
  durationInFrames = 15,
  travelY = 40,
  springConfig = SPRING_SETTLE,
  style,
  lineStyle,
  wordStyle,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const lines = text.split('\n');
  let globalIndex = 0;

  return (
    <div style={style}>
      {lines.map((line, lineIndex) => (
        <div
          key={lineIndex}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            columnGap: '0.26em',
            ...lineStyle,
          }}
        >
          {line.split(' ').map((word) => {
            const i = globalIndex++;
            const wordStart = startFrame + i * staggerFrames;
            const local = frame - wordStart;

            const progress = spring({
              frame: local,
              fps,
              config: springConfig,
              durationInFrames,
            });
            const opacity = interpolate(
              local,
              [0, durationInFrames * 0.6],
              [0, 1],
              {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: EASE_STANDARD,
              }
            );

            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  opacity,
                  transform: `translate3d(0, ${(1 - progress) * travelY}px, 0)`,
                  willChange: 'transform, opacity',
                  ...(wordStyle ? wordStyle(i, word) : null),
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
