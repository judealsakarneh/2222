import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneShell} from '../components/SceneShell';
import {Panel} from '../components/Panel';
import {EASE_CAMERA, EASE_FAST_EXIT, EASE_STANDARD, SPRING_SETTLE} from '../lib/easing';
import {INTER} from '../lib/fonts';
import {C, uiLabel} from '../lib/tokens';

/**
 * SCENE 4 — Product, voice capture. Frames 172-286 (5.73s - 9.53s)
 *
 * First product beat. The camera pushes in (1.06 -> 1.00 over 172-200) while
 * the panel rises 70px and springs to rest — the two moves overlap so the panel
 * feels like it is arriving INTO a moving camera, not sliding onto a still one.
 *
 * Three things run simultaneously inside the panel, which is what makes it read
 * as live software rather than a screenshot:
 *   - the record dot pulses on a 30-frame cycle
 *   - 34 waveform bars react continuously (frames 182-278)
 *   - the transcript types itself out character by character (frames 190-268)
 *
 * The waveform height is a pure function of (frame, barIndex): two sine terms at
 * different rates multiplied together, so bars neighbour-couple like real audio
 * instead of flickering independently — and it renders identically every time.
 */

const START = 172;
const END = 286;

const BAR_COUNT = 34;
const CAPTION =
  "So it's a tool that turns a two-minute voice note into a full pitch deck…";

/** Deterministic waveform envelope. Never Math.random — renders must be reproducible. */
const barHeight = (frame: number, i: number): number =>
  8 +
  Math.abs(Math.sin(frame * 0.22 + i * 0.45)) *
    76 *
    (0.5 + 0.5 * Math.abs(Math.sin(frame * 0.09 + i * 1.7)));

export const Scene04Voice: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Camera push-in, 172-200.
  const camera = interpolate(frame, [START, 200], [1.06, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_CAMERA,
  });

  // Panel rise + spring settle, 172-190.
  const panelIn = spring({
    frame: frame - START,
    fps,
    config: SPRING_SETTLE,
    durationInFrames: 18,
  });
  const panelY = (1 - panelIn) * 70;
  const panelInScale = 0.95 + 0.05 * panelIn;
  const panelOpacity = interpolate(frame, [START, 186], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_STANDARD,
  });

  // Exit, 278-286.
  const exitScale = interpolate(frame, [278, END], [1, 0.97], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_FAST_EXIT,
  });
  const exitOpacity = interpolate(frame, [278, END], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_FAST_EXIT,
  });

  // Record dot: 1 -> 0.35 -> 1 every 30 frames.
  const dotOpacity =
    0.35 + 0.65 * ((1 + Math.cos((frame / 30) * Math.PI * 2)) / 2);

  // Waveform fades up 182-192 and holds until the panel leaves.
  const waveOpacity = interpolate(frame, [182, 192], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_STANDARD,
  });

  // Typewriter, 190-268.
  const charsShown = Math.floor(
    interpolate(frame, [190, 268], [0, CAPTION.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  const cursorVisible = Math.floor(frame / 8) % 2 === 0;
  const captionOpacity = interpolate(frame, [186, 196], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_STANDARD,
  });

  return (
    <SceneShell start={START} end={END}>
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${camera})`,
          willChange: 'transform',
        }}
      >
        <Panel
          width={860}
          padding={56}
          radius={44}
          style={{
            opacity: panelOpacity * exitOpacity,
            transform: `translate3d(0, ${panelY}px, 0) scale(${panelInScale * exitScale})`,
          }}
        >
          {/* Record indicator */}
          <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 44}}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: C.ink,
                boxShadow: `0 0 10px ${C.ink}`,
                opacity: dotOpacity,
                willChange: 'opacity',
              }}
            />
            <span style={{...uiLabel(C.label), fontFamily: INTER}}>Recording</span>
          </div>

          {/* Waveform — 6px bars distributed across the full panel interior so the
              module reads as a real level meter rather than a small centred cluster. */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: 92,
              marginBottom: 44,
              opacity: waveOpacity,
            }}
          >
            {new Array(BAR_COUNT).fill(0).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 6,
                  height: barHeight(frame, i),
                  borderRadius: 3,
                  background: `linear-gradient(180deg, ${C.ink}, ${C.inkDim})`,
                  willChange: 'transform',
                }}
              />
            ))}
          </div>

          {/* Live transcript */}
          <div
            style={{
              fontFamily: INTER,
              fontWeight: 400,
              fontSize: 30,
              lineHeight: 1.6,
              color: C.caption,
              // Reserved height for the longest state of the transcript, so the
              // panel never reflows mid-type.
              minHeight: 150,
              textAlign: 'left',
              opacity: captionOpacity,
            }}
          >
            {CAPTION.slice(0, charsShown)}
            <span
              style={{
                display: 'inline-block',
                width: 3,
                height: 34,
                marginLeft: 4,
                background: C.ink,
                verticalAlign: 'text-bottom',
                opacity: cursorVisible ? 1 : 0,
                boxShadow: `0 0 10px ${C.ink}`,
              }}
            />
          </div>
        </Panel>
      </AbsoluteFill>
    </SceneShell>
  );
};
