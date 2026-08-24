import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {SceneShell} from '../components/SceneShell';
import {KineticWords} from '../components/KineticWords';
import {EASE_FAST_EXIT, EASE_STANDARD} from '../lib/easing';
import {SERIF} from '../lib/fonts';
import {C, serifHead} from '../lib/tokens';

/**
 * SCENE 2 — Kinetic line 1. Frames 66-118 (2.20s - 3.93s)
 *
 * "You know the idea cold." — the flattering half of the setup, so it lands in
 * full-strength #F1F3F0.
 *
 * The line arrives one word at a time (2-frame stagger, 15-frame spring per
 * word) riding a 4px upward drift on the whole block. Word-staggering is what
 * separates a kinetic type film from a slideshow: the eye reads the line in the
 * same rhythm someone would say it.
 */

const START = 66;
const END = 118;

export const Scene02Line1: React.FC = () => {
  const frame = useCurrentFrame();

  // Block-level 4px upward drift on entry, frames 66-72.
  const drift = interpolate(frame, [START, 72], [4, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_STANDARD,
  });

  // Exit: the line lifts out of frame, 110-118.
  const exitY = interpolate(frame, [110, END], [0, -30], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_FAST_EXIT,
  });
  const exitOpacity = interpolate(frame, [110, END], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_FAST_EXIT,
  });

  return (
    <SceneShell start={START} end={END}>
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          opacity: exitOpacity,
          transform: `translate3d(0, ${drift + exitY}px, 0)`,
          willChange: 'transform, opacity',
        }}
      >
        <KineticWords
          text="You know the idea cold."
          startFrame={START}
          staggerFrames={2}
          durationInFrames={15}
          travelY={40}
          style={{
            ...serifHead(88, C.text),
            fontFamily: SERIF,
            maxWidth: 860,
            textAlign: 'center',
          }}
        />
      </AbsoluteFill>
    </SceneShell>
  );
};
