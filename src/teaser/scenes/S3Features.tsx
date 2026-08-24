import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {SceneGate} from '../components/SceneGate';
import {MONO} from '../lib/fonts';
import {COPY, EASE, T, hud} from '../lib/tokens';
import {S} from '../lib/timeline';

/**
 * SCENE 3 — Feature callouts. Frames 120-210 (4.0 - 7.0s)
 *
 * Three claims typed into a terminal. Typewriter over 15 frames each (0.5s),
 * 24 frames apart (0.8s), exactly as the reference times them.
 *
 * The cursor only sits on the line currently being typed, and jumps down as each
 * line completes — a cursor blinking on every line at once is the tell that a
 * "terminal" is really just three text layers.
 *
 * Each line also scales in from 0.94 as it starts, so the callout pops rather
 * than merely appearing.
 */

const TYPE_START = 126;
const TYPE_DURATION = 15;
const TYPE_STAGGER = 24;

export const S3Features: React.FC = () => {
  const frame = useCurrentFrame();

  // Terminal window rises in.
  const winIn = interpolate(frame, [S.features.start, S.features.start + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  const lineStart = (i: number) => TYPE_START + i * TYPE_STAGGER;

  // The cursor belongs to the last line that has started.
  const activeLine = COPY.features.reduce(
    (acc, _, i) => (frame >= lineStart(i) ? i : acc),
    -1
  );
  const cursorOn = Math.floor(frame / 8) % 2 === 0;

  return (
    <SceneGate start={S.features.start} end={S.features.end}>
      <AbsoluteFill style={{background: T.bg}} />

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          opacity: winIn,
          transform: `translate3d(0, ${(1 - winIn) * 26}px, 0)`,
          willChange: 'transform, opacity',
        }}
      >
        <div
          style={{
            width: 880,
            border: `1px solid rgba(0,255,204,0.28)`,
            background: 'rgba(0,255,204,0.02)',
            boxShadow: '0 0 60px rgba(0,255,204,0.06), inset 0 0 60px rgba(0,255,204,0.02)',
          }}
        >
          {/* Title bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '18px 26px',
              borderBottom: `1px solid rgba(0,255,204,0.18)`,
              fontFamily: MONO,
              ...hud(T.purple, 17),
            }}
          >
            <span style={{color: T.cyan}}>●</span>
            <span>{`${'zamble'}://v2 — changelog`}</span>
          </div>

          {/* Lines */}
          <div style={{padding: '52px 46px 58px'}}>
            {COPY.features.map((text, i) => {
              const start = lineStart(i);
              const chars = Math.floor(
                interpolate(frame, [start, start + TYPE_DURATION], [0, text.length], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                })
              );
              const appear = interpolate(frame, [start, start + 8], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: EASE,
              });

              return (
                <div
                  key={text}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 18,
                    marginBottom: i === COPY.features.length - 1 ? 0 : 40,
                    fontFamily: MONO,
                    fontSize: 54,
                    fontWeight: 700,
                    opacity: appear,
                    transform: `scale(${0.94 + 0.06 * appear})`,
                    transformOrigin: 'left center',
                    willChange: 'transform, opacity',
                  }}
                >
                  <span style={{color: T.purple}}>&gt;</span>
                  <span style={{color: T.cyan, textShadow: `0 0 18px ${T.cyan}`}}>
                    {text.slice(0, chars)}
                  </span>
                  {i === activeLine && cursorOn ? (
                    <span
                      style={{
                        display: 'inline-block',
                        width: 26,
                        height: 52,
                        background: T.cyan,
                        boxShadow: `0 0 16px ${T.cyan}`,
                        transform: 'translateY(6px)',
                      }}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </SceneGate>
  );
};
