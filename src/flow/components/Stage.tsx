import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {BEATS, EASE, ms} from '../lib/timeline';

/**
 * The ground the whole piece sits on.
 *
 * The document's beat is a mountain wallpaper resolving out of a 100 px blur.
 * The photograph here is the CTRL Room site's own hero - the same file, copied
 * into public/ - so the film and the website open on one image rather than on
 * two that merely share a mood.
 *
 * Blur and scale run together over the full 1400 ms on the house curve. They
 * have to be the same curve: a blur that lands before the scale does reads as
 * two effects, and the beat only works when it reads as one lens finding focus.
 */
export const Wallpaper: React.FC = () => {
  const frame = useCurrentFrame();
  const {slot, move} = BEATS.wall;

  const p = interpolate(frame, [ms(slot[0]), ms(slot[0] + move)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  const blur = interpolate(p, [0, 1], [100, 0]);
  const scale = interpolate(p, [0, 1], [1.05, 1]);

  // The panel arrives on top of this, so the wallpaper gives up focus as it
  // lands. That residual 16 px is the depth of field the document asks a 50 mm
  // camera for; a real camera layer would cost a 3D scene for one value that
  // never changes after 3200 ms. It has to be a real amount - at 8 px the
  // frame had two sharp planes and read flat.
  const dof = interpolate(
    frame,
    [ms(BEATS.panel.slot[0]), ms(BEATS.panel.slot[0] + BEATS.panel.move)],
    [0, 16],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE},
  );

  // The lockup is white type with no panel behind it, and the brightest part of
  // the photograph runs straight through where it sits. The wall gives up
  // another two thirds of its level as the panel leaves, which both clears the
  // type and closes the film down rather than ending on a lit frame.
  const dim = interpolate(frame, [ms(9700), ms(10300)], [1, 0.34], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#0B0B0B', overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale})`,
          filter: `blur(${blur + dof}px)`,
          // The photograph is dim under a glass panel by design; the panel is
          // the subject and the wall is the room it is standing in.
          opacity: 0.72 * dim,
        }}
      >
        <Img
          src={staticFile('img/flow-wall.webp')}
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * The grade, as one layer: lifted shadows, a pulled gamma and a 15% vignette.
 *
 * Doing this in a layer rather than per element is what keeps the frame
 * coherent - every element is graded by the same amount whether or not anyone
 * remembered to grade it.
 */
export const Grade: React.FC = () => (
  <>
    {/* Shadow lift. A near-black wash on screen raises the floor without
        touching the highlights, which is what "lift +5" does in a grade. */}
    <AbsoluteFill
      style={{
        background: 'rgba(28,34,34,1)',
        mixBlendMode: 'screen',
        opacity: 0.05,
        pointerEvents: 'none',
      }}
    />
    {/* Vignette. Elliptical and off-centre-high, so it reads as a lens rather
        than as a circle drawn on the frame. */}
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(72% 88% at 50% 44%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.62) 100%)',
        opacity: 0.15 / 0.62,
        pointerEvents: 'none',
      }}
    />
    {/* A low teal bloom, so the dark frame is never flat black. Brand colour
        used as light, which is the only place it appears outside the UI. */}
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(56% 38% at 50% 92%, rgba(0,169,164,0.13), rgba(0,169,164,0) 72%)',
        pointerEvents: 'none',
      }}
    />
  </>
);
