import React from 'react';
import {interpolate} from 'remotion';
import {ChromaSplit} from './ChromaSplit';
import {TransitionKind} from '../lib/timeline';
import {D, EASE, EASE_SWIPE, SCREEN_W} from '../lib/tokens';

/**
 * FIVE TRANSITIONS, five different mechanics.
 *
 * The rule that makes them all work: the monitor bezel, the desk and the room
 * are OUTSIDE this component and never move. Everything here happens within the
 * screen rectangle, so however violent a transition gets, the eye stays anchored
 * to the physical object and reads it as a display changing rather than as a cut.
 *
 *   swipe   parallax push — outgoing exits left, incoming enters right and
 *           lower, with real motion blur and chromatic aberration
 *   mask    a feathered wipe with a hot leading edge
 *   iris    a circular reveal expanding from a point of interest
 *   slices  the frame breaks into six columns that shuffle
 *   whip    a horizontal stretch with true DIRECTIONAL blur
 *
 * They are ordered so no two adjacent transitions share an axis or a mechanism.
 */

type Props = {
  kind: TransitionKind;
  /** Raw 0-1 across the transition window. */
  progress: number;
  outgoing: React.ReactNode;
  incoming: React.ReactNode;
};

/** Bell curve peaking mid-transition — used for blur, which should be 0 at both ends. */
const bell = (p: number): number => Math.sin(Math.max(0, Math.min(1, p)) * Math.PI);

const fill: React.CSSProperties = {position: 'absolute', inset: 0, overflow: 'hidden'};

export const Transition: React.FC<Props> = ({kind, progress, outgoing, incoming}) => {
  /* ---------------------------------------------------------------- *
   * SWIPE — the hero. Outgoing slides 120% left; incoming comes in from
   * the right 50px LOWER and rises to meet its resting position. That
   * vertical offset is the whole reason it reads as parallax rather than
   * as two slides on a conveyor belt.
   * ---------------------------------------------------------------- */
  if (kind === 'swipe') {
    // Fast off the mark, decelerating hard into the landing.
    const p = EASE_SWIPE(progress);
    // 12, not the reference's 20: that figure was for a 1400px screen inset in a
    // 1920 frame. Full-bleed over sparse dark UI, 20px stops being a smear and
    // just fogs the page.
    const blur = bell(progress) * 12;
    const chroma = bell(progress) * 2.4;

    return (
      <ChromaSplit amount={chroma}>
        <div style={fill}>
          <div
            style={{
              ...fill,
              transform: `translate3d(${-120 * p}%, 0, 0)`,
              filter: `blur(${blur}px)`,
              willChange: 'transform, filter',
            }}
          >
            {outgoing}
          </div>
          <div
            style={{
              ...fill,
              transform: `translate3d(${120 * (1 - p)}%, ${50 * (1 - p)}px, 0)`,
              filter: `blur(${blur}px)`,
              willChange: 'transform, filter',
            }}
          >
            {incoming}
          </div>
        </div>
      </ChromaSplit>
    );
  }

  /* ---------------------------------------------------------------- *
   * MASK — a feathered wipe. The incoming page is revealed by a gradient
   * mask with a 25px soft edge, and a hot emerald line rides the boundary.
   * The leading edge is what turns a wipe from "a rectangle growing" into
   * "something being drawn onto the screen".
   * ---------------------------------------------------------------- */
  if (kind === 'mask') {
    const p = EASE(progress);
    const edgePct = p * 100;
    const featherPct = (25 / SCREEN_W) * 100;
    const mask = `linear-gradient(90deg, #000 ${Math.max(0, edgePct - featherPct)}%, rgba(0,0,0,0) ${edgePct}%)`;

    return (
      <div style={fill}>
        <div style={fill}>{outgoing}</div>
        <div
          style={{
            ...fill,
            WebkitMaskImage: mask,
            maskImage: mask,
            transform: `scale(${1.02 - 0.02 * p})`,
            willChange: 'transform',
          }}
        >
          {incoming}
        </div>
        {/* Leading edge */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${edgePct}%`,
            width: 2,
            background: D.signal,
            boxShadow: `0 0 26px 4px ${D.signal}`,
            opacity: bell(progress) * 0.9 + 0.1,
          }}
        />
      </div>
    );
  }

  /* ---------------------------------------------------------------- *
   * IRIS — a circular reveal expanding from the point the eye was already
   * looking at (the hero slide in the grid, upper-left of centre), not from
   * the geometric centre. Expanding from the point of interest is what makes
   * it feel motivated rather than decorative.
   * ---------------------------------------------------------------- */
  if (kind === 'iris') {
    const p = EASE(progress);
    const cx = 37; // % — measured centre of the highlighted card in the build grid
    const cy = 29;
    // Radius must clear the far corner, whichever that is.
    const maxR = Math.hypot(Math.max(cx, 100 - cx), Math.max(cy, 100 - cy)) * 1.15;
    const r = p * maxR;

    return (
      <div style={fill}>
        <div
          style={{
            ...fill,
            transform: `scale(${1 - 0.04 * p})`,
            filter: `brightness(${1 - 0.35 * p})`,
            willChange: 'transform, filter',
          }}
        >
          {outgoing}
        </div>
        <div
          style={{
            ...fill,
            clipPath: `circle(${r}% at ${cx}% ${cy}%)`,
            willChange: 'clip-path',
          }}
        >
          {incoming}
        </div>
        {/* Expanding ring on the boundary */}
        <div
          style={{
            position: 'absolute',
            left: `${cx}%`,
            top: `${cy}%`,
            width: `${r * 2}%`,
            // Height is expressed against width so the ring stays circular in a
            // 16:9 box — a %-height would make it an ellipse.
            aspectRatio: '1 / 1',
            marginLeft: `${-r}%`,
            transform: 'translateY(-50%)',
            borderRadius: '50%',
            border: `2px solid ${D.signal}`,
            opacity: (1 - p) * 0.7,
            boxShadow: `0 0 30px ${D.signal}`,
          }}
        />
      </div>
    );
  }

  /* ---------------------------------------------------------------- *
   * SLICES — the frame breaks into six columns. Odd columns of the outgoing
   * push up and out, even columns push down, each on its own stagger; the
   * incoming columns arrive from the opposite direction. Six clipped copies
   * per layer, and only for sixteen frames.
   * ---------------------------------------------------------------- */
  if (kind === 'slices') {
    const N = 6;
    const colPct = 100 / N;

    return (
      <div style={fill}>
        {new Array(N).fill(0).map((_, i) => {
          // Stagger left to right so the break sweeps rather than snapping.
          const local = interpolate(progress, [i * 0.07, 0.7 + i * 0.05], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const p = EASE(local);
          const dir = i % 2 === 0 ? -1 : 1;
          const clip = `inset(0 ${100 - (i + 1) * colPct}% 0 ${i * colPct}%)`;

          return (
            <React.Fragment key={i}>
              <div
                style={{
                  ...fill,
                  clipPath: clip,
                  transform: `translate3d(0, ${dir * 110 * p}%, 0)`,
                  willChange: 'transform',
                }}
              >
                {outgoing}
              </div>
              <div
                style={{
                  ...fill,
                  clipPath: clip,
                  transform: `translate3d(0, ${-dir * 110 * (1 - p)}%, 0)`,
                  willChange: 'transform',
                }}
              >
                {incoming}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  /* ---------------------------------------------------------------- *
   * WHIP — horizontal stretch with TRUE directional blur. CSS blur() is
   * isotropic and smears vertically too, which reads as "out of focus"
   * rather than "moving fast"; an feGaussianBlur with stdDeviation="N 0"
   * blurs on X only, which is what a real whip pan records.
   * ---------------------------------------------------------------- */
  const p = EASE_SWIPE(progress);
  const amt = bell(progress);
  const stdDev = amt * 42;
  const stretch = 1 + amt * 1.6;

  return (
    <div style={fill}>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id="dk-dirblur" x="-50%" y="-20%" width="200%" height="140%">
          <feGaussianBlur stdDeviation={`${stdDev} 0`} />
        </filter>
      </svg>
      <div style={{...fill, filter: 'url(#dk-dirblur)'}}>
        <div
          style={{
            ...fill,
            transform: `translate3d(${-100 * p}%, 0, 0) scaleX(${stretch})`,
            willChange: 'transform',
          }}
        >
          {outgoing}
        </div>
        <div
          style={{
            ...fill,
            transform: `translate3d(${100 * (1 - p)}%, 0, 0) scaleX(${stretch})`,
            willChange: 'transform',
          }}
        >
          {incoming}
        </div>
      </div>
    </div>
  );
};
