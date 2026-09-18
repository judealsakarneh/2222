import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {cameraAt, cameraBlur, cameraTransform} from './revorva/lib/camera';
import {Dashboard, FillerRows} from './revorva/components/Dashboard';
import {MorphRow, Retries, SentChip} from './revorva/components/MorphRow';
import {Outro} from './revorva/components/Outro';
import {DAY, NIGHT, type Theme} from './revorva/lib/theme';
import {
  BAND_BOTTOM_T,
  BAND_BOTTOM_V,
  BAND_FEATHER,
  BAND_TOP_T,
  BAND_TOP_V,
  EASE_CAMERA,
} from './revorva/lib/timeline';

/**
 * One complete frame of the film in one palette.
 *
 * Rendered twice - once in daylight, once at night - so that the transition
 * between them can be a wipe rather than a blend. Everything inside is a pure
 * function of the frame and the theme, so the two copies are identical in every
 * respect except colour, and the wipe edge can fall anywhere without anything
 * appearing to jump.
 */
const Frame: React.FC<{T: Theme}> = ({T}) => {
  const frame = useCurrentFrame();
  const cam = cameraAt(frame);
  const blur = cameraBlur(frame);

  return (
    <AbsoluteFill style={{backgroundColor: T.bg, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: T.wash}} />

      {/* The world, under one camera. transformOrigin 0 0 is load-bearing:
          cameraTransform's arithmetic assumes it. */}
      <AbsoluteFill
        style={{
          transformOrigin: '0 0',
          transform: cameraTransform(cam),
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
          willChange: 'transform, filter',
        }}
      >
        <Dashboard T={T} />
        <FillerRows T={T} />
        <Retries T={T} />
        <MorphRow T={T} />
        <SentChip T={T} />
      </AbsoluteFill>

      <Outro T={T} />

      {/* Grade, outside the camera so it never moves. Barely there in daylight;
          a real lens stop at night. */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(74% 88% at 50% 46%, rgba(0,0,0,0) 44%, rgba(0,0,0,0.58) 100%)',
          opacity: T.vignette,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * Revorva — 1920x1080, 60 fps, 15.000 s. One continuous take, and now one
 * continuous day.
 *
 * The film runs daylight → night → daylight, and the dark stretch is not a mood:
 * the retry schedule is 1h / 24h / 72h, so time genuinely passes between the
 * decline and the recovery. Showing that as a night is the only honest way to
 * put days on screen inside fifteen seconds.
 *
 * Night arrives as a WIPE, not a crossfade, and that is a correctness decision
 * rather than a stylistic one. Interpolating a light palette into a dark one
 * puts the foreground and the background at the same grey in the middle -
 * measured at 1.00:1, no contrast at all - and every word on screen vanishes for
 * the length of the transition. It is not tunable: any continuous path between
 * ink-on-white and white-on-ink has to cross equal luminance. So the two
 * palettes are never mixed. A soft-edged band sweeps down the frame with night
 * above it and day below, and every pixel at every frame belongs to one palette
 * that was verified on its own.
 *
 * Both of the band's edges only ever move downward, so dawn reads as the next
 * thing happening rather than as dusk rewinding.
 */
export const RevorvaFilm: React.FC = () => {
  const frame = useCurrentFrame();

  const opts = {
    extrapolateLeft: 'clamp' as const,
    extrapolateRight: 'clamp' as const,
    easing: EASE_CAMERA,
  };
  const top = interpolate(frame, BAND_TOP_T, BAND_TOP_V, opts);
  const bottom = interpolate(frame, BAND_BOTTOM_T, BAND_BOTTOM_V, opts);

  // The band, as a mask. Transparent above `top`, opaque between the edges,
  // transparent below `bottom`, with BAND_FEATHER of softness on each edge -
  // enough that the boundary reads as dusk rather than as a wipe bar.
  const mask =
    `linear-gradient(180deg,` +
    ` rgba(0,0,0,0) ${top}%,` +
    ` rgba(0,0,0,1) ${top + BAND_FEATHER}%,` +
    ` rgba(0,0,0,1) ${bottom - BAND_FEATHER}%,` +
    ` rgba(0,0,0,0) ${bottom}%)`;

  return (
    <AbsoluteFill style={{backgroundColor: DAY.bg}}>
      <Frame T={DAY} />
      <AbsoluteFill
        style={{
          WebkitMaskImage: mask,
          maskImage: mask,
          willChange: 'mask-image',
        }}
      >
        <Frame T={NIGHT} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
