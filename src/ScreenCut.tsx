import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {AppShell} from './desk/pages/chrome';
import {ScreenStage} from './desk/components/ScreenStage';
import {AudioDesign} from './desk/audio/AudioDesign';
import {INTER} from './lib/fonts';
import {D, EASE} from './desk/lib/tokens';
import {DURATION} from './desk/lib/timeline';

/**
 * zamble — "Screen Cut"
 * 1920x1080, 30fps, 480 frames (16.0s)
 *
 * THIS IS SCREEN CONTENT. There is no fake desk, no rendered monitor, no CSS
 * houseplant. In the reference reel those things are the poster's REAL room,
 * filmed on a phone — only what is on the display is motion graphics. So this
 * is built as the thing that goes on the display: play it full-screen and film
 * it, or post it as-is.
 *
 * THE IDEA: every scene change happens inside a persistent application shell.
 * The top bar and the bottom progress strip render once, OUTSIDE the transition
 * engine, and never move. They do the job the monitor bezel does in a filmed
 * ad — the eye anchors to a fixed frame, so however violent the body gets, the
 * change reads as a view swapping inside an app rather than as a cut.
 *
 * That anchoring is what buys the variety. Five completely different mechanics
 * inside sixteen seconds, and it still reads as one continuous take:
 *
 *   096  >> PARALLAX SWIPE   out left 120%, in from right 120% and 50px lower,
 *                            20px motion blur + 2.4px chromatic aberration
 *   186  >> FEATHERED WIPE   25px soft mask edge with a hot emerald leading line
 *   276  >> IRIS             circular reveal opening from the hero card the grid
 *                            was already highlighting — motivated, not decorative
 *   360  >> SLICE SHUFFLE    six columns, alternating up/down, staggered L to R
 *   426  >> WHIP PAN         horizontal stretch with TRUE directional blur
 *                            (feGaussianBlur "N 0" — CSS blur() smears both axes
 *                            and reads as out-of-focus rather than as fast)
 *
 * No two adjacent transitions share an axis or a mechanism.
 *
 * TIMELINE
 *   000-096  prompt      hook morphs into the input, prompt types, send flashes
 *   096-186  research    five steps stream and complete, source counter climbs
 *   186-276  building    14 slide cards populate a grid
 *   276-360  slide       the finished slide, chart drawing, sources cited
 *   360-426  export      formats, render progress, ready
 *   426-480  CTA         mark draws, wordmark, button
 */
export const ScreenCut: React.FC = () => {
  const frame = useCurrentFrame();

  const openFade = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  return (
    <AbsoluteFill style={{background: D.screenBg, fontFamily: INTER}}>
      <AbsoluteFill style={{opacity: openFade}}>
        <AppShell>
          <ScreenStage />
        </AppShell>
      </AbsoluteFill>

      {/* A whisper of corner falloff. Enough to stop the panel reading as a flat
          fill, light enough that it survives being filmed off a real monitor. */}
      <AbsoluteFill
        style={{
          boxShadow: 'inset 0 0 220px 40px rgba(0,0,0,0.35)',
          pointerEvents: 'none',
        }}
      />

      <AudioDesign />
    </AbsoluteFill>
  );
};
