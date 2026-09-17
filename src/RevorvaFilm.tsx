import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C} from './revorva/lib/brand';
import {cameraAt, cameraBlur, cameraTransform} from './revorva/lib/camera';
import {Dashboard, FillerRows} from './revorva/components/Dashboard';
import {MorphRow, Retries, SentChip} from './revorva/components/MorphRow';
import {Outro} from './revorva/components/Outro';

/**
 * Revorva — 1920x1080, 60 fps, 15.000 s.
 *
 * ONE CONTINUOUS TAKE. There is no cut anywhere in this film, and that is not a
 * stylistic preference - it is the structure. Three things make it true:
 *
 *   1. The camera is a single interpolation of time. It cannot cut because at
 *      no frame is it in two places; it is one function.
 *   2. The dashboard never enters or exits. It is present from frame 0 to the
 *      last frame; only the camera's relationship to it changes.
 *   3. The payment row is a shared element. It does not fade out so an email can
 *      fade in - it changes shape into the email and changes back, so the viewer
 *      never loses the object they were following.
 *
 * What is left is motion blur, which is the cue that separates a smooth digital
 * move from a filmed one: every frame of a rendered camera move is perfectly
 * sharp, and no real lens has ever produced that. The blur here is measured off
 * the camera's own velocity rather than authored, so it is correct by
 * construction at every frame including the ones nobody checks.
 *
 * ALL BRAND VALUES ARE PLACEHOLDER. See src/revorva/lib/brand.ts - the site was
 * never readable from this session (403 on revorva.com:443), so every colour,
 * face and line is a guess. None of the motion depends on them.
 */
export const RevorvaFilm: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = cameraAt(frame);
  const blur = cameraBlur(frame);

  return (
    <AbsoluteFill style={{backgroundColor: C.bg, overflow: 'hidden'}}>
      {/* A low wash so the ground is never flat black under the panel. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(58% 44% at 50% 42%, ${C.accentSoft}, rgba(0,0,0,0) 72%)`,
        }}
      />

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
        <Dashboard />
        <FillerRows />
        <Retries />
        <MorphRow />
        <SentChip />
      </AbsoluteFill>

      <Outro />

      {/* Grade, over everything and outside the camera so it never moves. */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(74% 88% at 50% 46%, rgba(0,0,0,0) 44%, rgba(0,0,0,0.58) 100%)',
          opacity: 0.3,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
