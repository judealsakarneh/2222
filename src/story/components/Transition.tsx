import React from 'react';
import {interpolate} from 'remotion';
import {Scene, TransitionKind} from '../lib/timeline';
import {EASE, EASE_MOVE} from '../lib/tokens';

/**
 * FOUR TRANSITIONS, all 24 frames.
 *
 * The previous cut ran these at 12-18 frames and they were unreadable. 24 frames
 * (0.8s) is long enough that the eye can follow the mechanism instead of just
 * registering that something happened.
 *
 *   zoom      the camera pushes THROUGH the thing you were reading and comes out
 *             the other side in a different world
 *   grow      a shape in the outgoing scene swells until it IS the next scene —
 *             you see the colour arrive first, then its content materialise
 *   push      a sheet of the new world slides up over the old one
 *   collapse  the world shrinks to a point, and the point is the next world
 *
 * Two of the four are shape-driven, which is what stops the film reading as pages
 * flipping.
 */

type Props = {
  kind: TransitionKind;
  progress: number;
  spec: Scene;
  outgoing: React.ReactNode;
  incoming: React.ReactNode;
};

const bell = (p: number): number => Math.sin(Math.max(0, Math.min(1, p)) * Math.PI);
const fill: React.CSSProperties = {position: 'absolute', inset: 0, overflow: 'hidden'};

export const Transition: React.FC<Props> = ({kind, progress, spec, outgoing, incoming}) => {
  /* ------------------------------------------------------------------ *
   * ZOOM — push through the subject.
   *
   * The outgoing scene scales up hard and holds its opacity until late, so you
   * genuinely travel INTO the text rather than watching it dissolve. The
   * incoming world is already there at 1.25 and settles back to 1, which reads
   * as arriving rather than appearing.
   * ------------------------------------------------------------------ */
  if (kind === 'zoom') {
    const p = EASE_MOVE(progress);
    const outScale = 1 + p * 5.5;
    // Holds opaque through the first 55% — that is what sells "through", not "fade".
    const outOpacity = interpolate(progress, [0.55, 1], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const inScale = interpolate(p, [0, 1], [1.25, 1]);
    const inOpacity = interpolate(progress, [0.42, 0.85], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: EASE,
    });
    const blur = bell(progress) * 9;

    return (
      <div style={fill}>
        <div style={{...fill, opacity: inOpacity, transform: `scale(${inScale})`, willChange: 'transform, opacity'}}>
          {incoming}
        </div>
        <div
          style={{
            ...fill,
            opacity: outOpacity,
            transform: `scale(${outScale})`,
            filter: `blur(${blur}px)`,
            willChange: 'transform, opacity, filter',
          }}
        >
          {outgoing}
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------ *
   * GROW — a shape becomes the scene.
   *
   * Three layers: the outgoing scene, a plain circle of the incoming world's
   * colour swelling out of a point, and the incoming scene clipped to that same
   * circle but fading in LATER. Delaying the content is the whole trick — you
   * read "a shape is growing", then "the shape is a place".
   * ------------------------------------------------------------------ */
  if (kind === 'grow') {
    const p = EASE_MOVE(progress);
    const cx = spec.originX ?? 50;
    const cy = spec.originY ?? 50;
    // Reach the furthest corner.
    const maxR = Math.hypot(Math.max(cx, 100 - cx), Math.max(cy, 100 - cy)) * 1.2;
    const r = interpolate(p, [0, 1], [0, maxR]);
    const clip = `circle(${r}% at ${cx}% ${cy}%)`;
    const contentIn = interpolate(progress, [0.35, 0.85], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: EASE,
    });

    return (
      <div style={fill}>
        <div style={{...fill, transform: `scale(${1 - 0.03 * p})`}}>{outgoing}</div>
        <div style={{...fill, clipPath: clip, background: spec.bg, willChange: 'clip-path'}} />
        <div style={{...fill, clipPath: clip, opacity: contentIn, willChange: 'clip-path, opacity'}}>
          {incoming}
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------ *
   * PUSH — a sheet of the new world slides up over the old.
   *
   * The outgoing scene drifts up a little and dims as it goes, so the two layers
   * move together rather than one sliding across a static backdrop.
   * ------------------------------------------------------------------ */
  if (kind === 'push') {
    const p = EASE_MOVE(progress);
    return (
      <div style={fill}>
        <div
          style={{
            ...fill,
            transform: `translate3d(0, ${-14 * p}%, 0) scale(${1 - 0.04 * p})`,
            filter: `brightness(${1 - 0.45 * p})`,
            willChange: 'transform, filter',
          }}
        >
          {outgoing}
        </div>
        <div
          style={{
            ...fill,
            transform: `translate3d(0, ${100 * (1 - p)}%, 0)`,
            boxShadow: '0 -40px 90px -20px rgba(0,0,0,0.55)',
            willChange: 'transform',
          }}
        >
          {incoming}
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------ *
   * COLLAPSE — the world shrinks to a point, and the point is the next world.
   * The inverse of `grow`, and it closes the film's shape language.
   * ------------------------------------------------------------------ */
  const p = EASE_MOVE(progress);
  const cx = spec.originX ?? 50;
  const cy = spec.originY ?? 50;
  const startR = Math.hypot(Math.max(cx, 100 - cx), Math.max(cy, 100 - cy)) * 1.2;
  const r = interpolate(p, [0, 1], [startR, 0]);

  return (
    <div style={fill}>
      <div style={{...fill, transform: `scale(${1 + 0.05 * p})`}}>{incoming}</div>
      <div
        style={{
          ...fill,
          clipPath: `circle(${r}% at ${cx}% ${cy}%)`,
          transform: `scale(${1 - 0.1 * p})`,
          willChange: 'clip-path, transform',
        }}
      >
        {outgoing}
      </div>
    </div>
  );
};
