import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {GlitchLayer} from './teaser/components/GlitchLayer';
import {Scanlines} from './teaser/components/Scanlines';
import {TeaserGrain} from './teaser/components/TeaserGrain';
import {AudioDesign} from './teaser/audio/AudioDesign';
import {S1Counter} from './teaser/scenes/S1Counter';
import {S2Montage} from './teaser/scenes/S2Montage';
import {S3Features} from './teaser/scenes/S3Features';
import {S4Reveal} from './teaser/scenes/S4Reveal';
import {S5Cta} from './teaser/scenes/S5Cta';
import {MONO} from './teaser/lib/fonts';
import {EASE, T} from './teaser/lib/tokens';

/**
 * zamble — v2 teaser
 * 1080x1920, 30fps, 360 frames (12.0s)
 *
 * LAYER STACK (bottom to top)
 *   0   base           #0a0a0a
 *   1   scenes 1-5     inside GlitchLayer, so transitions tear the whole frame
 *   88  vignette
 *   89  scanlines      5% CRT lines + a sweeping band
 *   90  film grain     reseeds every 3 frames
 *       audio          off by default, see teaser/audio/AudioDesign.tsx
 *
 * TIMELINE
 *   000-045  growth counter      3277 -> 62000+ with digit scramble
 *   045-120  asset montage       8 hard cuts of procedural ASCII art
 *   120-210  feature callouts    three lines typed into a terminal
 *   210-300  product reveal      wordmark resolves out of glyph noise
 *   300-360  CTA end card        "coming soon", flickering
 *
 * TRANSITIONS (see teaser/lib/timeline.ts)
 *   Global, not per-scene. GlitchLayer wraps the entire scene stack, so a cut
 *   is one event that tears the whole frame rather than two scenes dissolving.
 *   036-054  RGB split hard cut
 *   111-129  whip pan + directional blur
 *   201-219  digital distortion
 *   285-312  chromatic aberration into black
 *
 * Everything is frame-driven — no CSS keyframes, no transitions, no wall-clock
 * timers — and all "randomness" comes from the seeded hash in lib/random.ts, so
 * every render is identical.
 */
export const ZambleTeaser: React.FC = () => {
  const frame = useCurrentFrame();

  // The chromatic fade at 285-300 dips the whole frame to black before the end
  // card arrives, then lifts. This is the only fade in the film.
  const blackout = interpolate(frame, [285, 300, 306], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  return (
    <AbsoluteFill style={{background: T.bg, fontFamily: MONO}}>
      <GlitchLayer>
        <AbsoluteFill>
          <S1Counter />
          <S2Montage />
          <S3Features />
          <S4Reveal />
          <S5Cta />
        </AbsoluteFill>
      </GlitchLayer>

      {/* Vignette */}
      <AbsoluteFill
        style={{
          boxShadow: 'inset 0 0 220px 70px rgba(0,0,0,0.75)',
          pointerEvents: 'none',
        }}
      />

      <Scanlines />
      <TeaserGrain />

      <AbsoluteFill
        style={{background: '#000', opacity: blackout, pointerEvents: 'none'}}
      />

      <AudioDesign />
    </AbsoluteFill>
  );
};
