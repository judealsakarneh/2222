import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {SceneLayer} from './demo/components/SceneLayer';
import {Dust, Grain} from './demo/components/Atmos';
import {D1Logo} from './demo/scenes/D1Logo';
import {D2Dashboard} from './demo/scenes/D2Dashboard';
import {D3Updates} from './demo/scenes/D3Updates';
import {D4Chat} from './demo/scenes/D4Chat';
import {D5Carousel} from './demo/scenes/D5Carousel';
import {INTER} from './lib/fonts';
import {C, EASE} from './demo/lib/tokens';
import {CUE, SCENES} from './demo/lib/timeline';

/**
 * zamble — "Demo"
 * Authored at 1920x1080, 30fps, 540 frames (18.0s). Render at --scale=2 for the
 * spec's 3840x2160.
 *
 * WHY AUTHORED AT 1080p: the brief's measurements — 120px logo, 48px greeting,
 * 640x400 chat window, 60/90px ring radii — are all written for a 1080p mental
 * model. Typing them into a 3840-wide canvas would render every element at half
 * the intended size. Authoring at 1920x1080 and rendering at 2x gives a true 4K
 * file with the spec's proportions intact, and keeps the numbers in the code
 * diffable against the numbers in the brief.
 *
 * TIMELINE (every cue transcribed from the millisecond spec via `ms()`)
 *   0.0-2.0   LOGO REVEAL   400ms of black, then the wordmark opens out of
 *                           -10px tracking and overshoots to 102% at 1400ms
 *   2.0-6.0   DASHBOARD     panel rises with motion blur, "Hello,"/"Mark" on a
 *                           150ms stagger, counter 0-86% while the ring draws
 *                           to 309.6deg, chart strokes L-to-R over 1200ms
 *   6.0-9.0   NEW UPDATES   two concentric rings pulsing 1 -> 1.3 -> 1 on a
 *                           1200ms cycle, offset half a cycle from each other
 *   9.0-13.0  AI AGENT      the centrepiece — container overshoots to 105%,
 *                           message types at 70ms/char, three dots loop
 *  13.0-18.0  CAROUSEL      chat slides out, three cards turn a full 360 in an
 *                           800px perspective, logo and CTA land
 *
 * SECTION OVERLAP: each section starts 200ms before the previous ends, and the
 * outgoing one scales to 60% at 40% opacity as it goes (see SceneLayer). That is
 * what makes five sections read as one film rather than five clips.
 */
export const ZambleDemo: React.FC = () => {
  const frame = useCurrentFrame();

  // The chat window is driven out by section 5 rather than by its own layer, so
  // the slide and the carousel's arrival are one continuous move.
  const chatExit = interpolate(
    frame,
    [CUE.carousel.chatOut[0], CUE.carousel.chatOut[1]],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE}
  );

  // Fade to black over the final 400ms.
  const blackout = interpolate(
    frame,
    [CUE.carousel.fadeOut[0], CUE.carousel.fadeOut[1]],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE}
  );

  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: INTER}}>
      {/* A single wide bloom keeps the near-black field from ever going dead. */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, #101018 0%, #0A0A0F 60%, #06060A 100%)',
        }}
      />

      <Dust />

      <SceneLayer start={SCENES[0].start} end={SCENES[0].end}>
        <D1Logo />
      </SceneLayer>
      <SceneLayer start={SCENES[1].start} end={SCENES[1].end}>
        <D2Dashboard />
      </SceneLayer>
      <SceneLayer start={SCENES[2].start} end={SCENES[2].end}>
        <D3Updates />
      </SceneLayer>

      {/* Section 4 is NOT wrapped in SceneLayer: it is carried out of frame by
          section 5's slide instead of scaling down in place, so the two sections
          share one move. */}
      {frame >= SCENES[3].start - 6 && chatExit < 1 ? (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <D4Chat exit={chatExit} />
        </AbsoluteFill>
      ) : null}

      <SceneLayer start={SCENES[4].start} end={SCENES[4].end}>
        <D5Carousel />
      </SceneLayer>

      <Grain />

      {/* Corner falloff */}
      <AbsoluteFill
        style={{
          boxShadow: 'inset 0 0 220px 70px rgba(0,0,0,0.6)',
          pointerEvents: 'none',
        }}
      />

      <AbsoluteFill
        style={{background: '#000', opacity: blackout, pointerEvents: 'none'}}
      />
    </AbsoluteFill>
  );
};
