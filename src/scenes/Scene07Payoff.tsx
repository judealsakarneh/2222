import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {SceneShell} from '../components/SceneShell';
import {EASE_CAMERA, EASE_FAST_EXIT, EASE_STANDARD} from '../lib/easing';
import {INTER, SERIF} from '../lib/fonts';
import {C, serifHead} from '../lib/tokens';

/**
 * SCENE 7 — The payoff. Frames 486-540 (16.20s - 18.00s)
 *
 * We arrive out the far side of the zoom-through. The scene starts at scale 1.5
 * and settles to 1.0 on the camera curve, so the eye reads one continuous move:
 * INTO the deck at the end of scene 6, and OUT of it here. That shared vector is
 * why the cut doesn't feel like a cut.
 *
 * The number does the selling. 47 seconds, counted up rather than stated, so the
 * viewer watches the claim happen.
 */

const START = 486;
const END = 540;

export const Scene07Payoff: React.FC = () => {
  const frame = useCurrentFrame();

  // Burst out of the zoom-through, 486-500.
  const arriveScale = interpolate(frame, [START, 500], [1.5, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_CAMERA,
  });
  const arriveOpacity = interpolate(frame, [START, 500], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_CAMERA,
  });

  // Exit, 532-540.
  const exitScale = interpolate(frame, [532, END], [1, 1.04], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_FAST_EXIT,
  });
  const exitOpacity = interpolate(frame, [532, END], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_FAST_EXIT,
  });

  // The count itself, 492-516.
  const count = Math.floor(
    interpolate(frame, [492, 516], [0, 47], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  const counterOpacity = interpolate(frame, [486, 494], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_STANDARD,
  });

  // Label, 516-540.
  const labelIn = interpolate(frame, [516, 528], [0, 1], {
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
          opacity: arriveOpacity * exitOpacity,
          transform: `scale(${arriveScale * exitScale})`,
          willChange: 'transform, opacity',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            opacity: counterOpacity,
            filter: 'drop-shadow(0 0 50px rgba(23,232,168,0.5))',
          }}
        >
          {/* Sized up from the brief's 200px: this is the payoff shot of a 9:16
              film, and at 200px the number reads as a caption rather than a claim. */}
          <span
            style={{
              ...serifHead(300, C.ink),
              fontFamily: SERIF,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {count}
          </span>
          <span style={{...serifHead(130, C.textMute), fontFamily: SERIF}}>s</span>
        </div>

        <div
          style={{
            marginTop: 24,
            fontFamily: INTER,
            fontWeight: 400,
            fontSize: 30,
            color: C.textMute,
            opacity: labelIn,
            transform: `translate3d(0, ${(1 - labelIn) * 18}px, 0)`,
            willChange: 'transform, opacity',
          }}
        >
          from voice note to finished deck
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
