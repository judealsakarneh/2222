import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {SceneShell} from '../components/SceneShell';
import {DustMotes} from '../components/DustMotes';
import {EASE_CAMERA, EASE_FAST_EXIT, EASE_STANDARD} from '../lib/easing';
import {C} from '../lib/tokens';

/**
 * SCENE 1 — Cold open, the mark. Frames 0-66 (0.00s - 2.20s)
 *
 * The film opens mid-camera-move: a slow 1.10 -> 1.00 push-in that runs the
 * entire scene, so the very first frame is already in motion. The ramble mark
 * draws itself on as a single continuous stroke (frames 8-45), holds for a
 * beat, then blows past camera on the exit.
 *
 * The stroke uses pathLength={340} so the dash maths are exact: SVG normalises
 * the real path length to 340 units, which means strokeDashoffset 340 -> 0 is a
 * precise 0% -> 100% draw regardless of the path's actual geometry.
 */

const START = 0;
const END = 66;

const MARK_PATH =
  'M8 30 C 10 10, 22 6, 18 20 C 15 32, 30 34, 26 18 C 23 6, 40 4, 56 10';
const DASH = 340;

export const Scene01Mark: React.FC = () => {
  const frame = useCurrentFrame();

  // Camera: continuous push-in across the whole scene.
  const camera = interpolate(frame, [START, END], [1.1, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_CAMERA,
  });

  // Mark draws on, frames 8-45.
  const draw = interpolate(frame, [8, 45], [DASH, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_STANDARD,
  });
  const markFadeIn = interpolate(frame, [8, 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_STANDARD,
  });

  // Exit: pushes toward camera and dissolves, frames 58-66.
  const exitScale = interpolate(frame, [58, END], [1, 1.06], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_FAST_EXIT,
  });
  const exitOpacity = interpolate(frame, [58, END], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_FAST_EXIT,
  });

  return (
    <SceneShell start={START} end={END} lead={0}>
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${camera})`,
          willChange: 'transform',
        }}
      >
        {/* Atmosphere first — the motes sit behind the mark and give the frame depth. */}
        <DustMotes opacity={exitOpacity} />

        <div
          style={{
            opacity: markFadeIn * exitOpacity,
            transform: `scale(${exitScale})`,
            filter: 'drop-shadow(0 0 18px rgba(23,232,168,0.6))',
            willChange: 'transform, opacity',
          }}
        >
          <svg width={300} height={(300 * 40) / 64} viewBox="0 0 64 40" fill="none">
            <path
              d={MARK_PATH}
              stroke={C.ink}
              strokeWidth={3.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={DASH}
              strokeDasharray={DASH}
              strokeDashoffset={draw}
            />
          </svg>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
