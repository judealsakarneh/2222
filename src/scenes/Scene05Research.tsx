import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneShell} from '../components/SceneShell';
import {Panel} from '../components/Panel';
import {EASE_FAST_EXIT, EASE_STANDARD, SPRING_SETTLE} from '../lib/easing';
import {INTER} from '../lib/fonts';
import {C, uiLabel} from '../lib/tokens';

/**
 * SCENE 5 — Product, research streaming. Frames 286-372 (9.53s - 12.40s)
 *
 * The value beat: ramble doesn't just transcribe, it goes and does the work.
 *
 * Four rows land 11 frames apart starting at frame 300, each sliding 26px in
 * from the left while its checkmark draws itself on. The stagger is the whole
 * point — four rows appearing together would read as a static list, but four
 * rows completing in sequence reads as a job running in real time.
 */

const START = 286;
const END = 372;

const ROWS = [
  'Market size & growth rate',
  'Competitor landscape',
  'Business model & pricing',
  'Go-to-market strategy',
];

const ROW_START = 300;
const ROW_STAGGER = 11;
const ROW_DURATION = 12;
const CHECK_DASH = 100;

export const Scene05Research: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Panel rise + spring settle, 286-300.
  const panelIn = spring({
    frame: frame - START,
    fps,
    config: SPRING_SETTLE,
    durationInFrames: 14,
  });
  const panelY = (1 - panelIn) * 60;
  const panelInScale = 0.96 + 0.04 * panelIn;
  const panelOpacity = interpolate(frame, [START, 298], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_STANDARD,
  });

  // Exit, 364-372.
  const exitScale = interpolate(frame, [364, END], [1, 0.97], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_FAST_EXIT,
  });
  const exitOpacity = interpolate(frame, [364, END], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_FAST_EXIT,
  });

  return (
    <SceneShell start={START} end={END}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <Panel
          width={860}
          padding={52}
          radius={44}
          style={{
            opacity: panelOpacity * exitOpacity,
            transform: `translate3d(0, ${panelY}px, 0) scale(${panelInScale * exitScale})`,
            textAlign: 'left',
          }}
        >
          <div style={{...uiLabel(C.label), fontFamily: INTER, marginBottom: 40}}>
            Researching
          </div>

          {ROWS.map((label, i) => {
            const rowStart = ROW_START + i * ROW_STAGGER;
            const progress = interpolate(
              frame,
              [rowStart, rowStart + ROW_DURATION],
              [0, 1],
              {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: EASE_STANDARD,
              }
            );

            return (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 22,
                  marginBottom: i === ROWS.length - 1 ? 0 : 30,
                  opacity: progress,
                  transform: `translate3d(${(1 - progress) * -26}px, 0, 0)`,
                  willChange: 'transform, opacity',
                }}
              >
                {/* Circular checkmark — the tick draws on over the same 12 frames. */}
                <svg width={34} height={34} viewBox="0 0 34 34" fill="none" style={{flexShrink: 0}}>
                  <circle
                    cx="17"
                    cy="17"
                    r="16"
                    stroke="rgba(23,232,168,0.4)"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M10.5 17.5 L15 22 L23.5 12"
                    stroke={C.ink}
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pathLength={CHECK_DASH}
                    strokeDasharray={CHECK_DASH}
                    strokeDashoffset={CHECK_DASH * (1 - progress)}
                    style={{filter: 'drop-shadow(0 0 6px rgba(23,232,168,0.7))'}}
                  />
                </svg>

                <span
                  style={{
                    fontFamily: INTER,
                    fontWeight: 400,
                    fontSize: 30,
                    color: C.rowText,
                  }}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </Panel>
      </AbsoluteFill>
    </SceneShell>
  );
};
