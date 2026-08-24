import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {SceneShell} from '../components/SceneShell';
import {KineticWords} from '../components/KineticWords';
import {EASE_FAST_EXIT} from '../lib/easing';
import {SERIF} from '../lib/fonts';
import {C, serifHead} from '../lib/tokens';

/**
 * SCENE 3 — Kinetic line 2, the turn. Frames 118-172 (3.93s - 5.73s)
 *
 * "You just never sit down / and build the deck." — this is the pain line, so
 * it is deliberately set in the muted #68786F rather than full white. The
 * colour drop does the emotional work; the copy doesn't have to.
 *
 * Stagger tightens from 2 frames to 1.5 and travel shortens from 40px to 36px,
 * so the second line reads fractionally faster than the first. That acceleration
 * is what builds pressure going into the product reveal.
 */

const START = 118;
const END = 172;

export const Scene03Line2: React.FC = () => {
  const frame = useCurrentFrame();

  const exitY = interpolate(frame, [164, END], [0, -30], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_FAST_EXIT,
  });
  const exitOpacity = interpolate(frame, [164, END], [1, 0], {
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
          transform: `translate3d(0, ${exitY}px, 0)`,
          willChange: 'transform, opacity',
        }}
      >
        <KineticWords
          text={'You just never sit down\nand build the deck.'}
          startFrame={START}
          staggerFrames={1.5}
          durationInFrames={15}
          travelY={36}
          style={{
            ...serifHead(88, C.textMute),
            fontFamily: SERIF,
            maxWidth: 900,
            textAlign: 'center',
          }}
        />
      </AbsoluteFill>
    </SceneShell>
  );
};
