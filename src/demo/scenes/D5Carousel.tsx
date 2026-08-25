import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {INTER} from '../../lib/fonts';
import {BRAND, C, EASE, ui} from '../lib/tokens';
import {CUE} from '../lib/timeline';

/**
 * 13.000-18.000s — 3D CAROUSEL + FINAL CTA
 *
 * Three cards on a ring, 120deg apart, spinning a full 360 on Y over 1500ms
 * inside an 800px perspective. A full turn returns every card to where it
 * started, so the carousel lands without needing to be eased into a pose.
 *
 * Card faces are dimmed by how far they are turned away — `cos` of their world
 * angle — which is what gives the ring depth. Without it, three cards on a
 * rotating rig read as flat rectangles sliding sideways.
 */

/**
 * Three cards evenly around a full ring, 120 apart.
 *
 * Backface culling is deliberately NOT used here, and that took two attempts to
 * get right. With `backface-visibility: hidden`, every card past 90 degrees is
 * culled — and with only three of them, there are stretches of the 360 spin
 * where all three are turned away and the frame goes completely empty.
 *
 * So the panels always render, and the TEXT is what hides when a card turns
 * away. That kills the mirrored-text artefact culling was there to solve, while
 * keeping geometry on screen for the whole rotation. Three cards 120 apart
 * guarantee at least one is always at facing >= 0.75, so a readable card is
 * never absent either.
 */
const CARDS = [
  {title: 'Deck', sub: '14 slides'},
  {title: 'Research', sub: '31 sources'},
  {title: 'Agent', sub: 'always on'},
];

// Radius AND rig depth, tuned together against the spec's 800px perspective.
// At radius 420 with the ring centred on the screen plane, the front card sits
// at z +420 and is magnified 800/(800-420) = 2.1x — it filled the frame. Pushing
// the whole ring back to z -450 puts the front card at -150 (0.84x) and the rear
// pair at -600 (0.57x), which is a readable ring instead of one giant card.
const RADIUS = 300;
const RIG_Z = -450;

export const D5Carousel: React.FC = () => {
  const frame = useCurrentFrame();
  const {spin, logo, cta, finalPulse} = CUE.carousel;

  const spinP = interpolate(frame, [spin[0], spin[1]], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });
  const rigY = spinP * 360;

  // The ring fades out as the logo takes over.
  const ringOut = interpolate(frame, [logo[0], logo[0] + 12], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });
  const logoIn = interpolate(frame, [logo[0], logo[1]], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });
  const ctaIn = interpolate(frame, [cta[0], cta[1]], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });

  // Final 2% scale pulse.
  const pulse = 1 + 0.02 * Math.max(0, 1 - Math.abs(frame - finalPulse) / 9);

  return (
    <div
      style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: `scale(${pulse})`,
        willChange: 'transform',
      }}
    >
      {/* Carousel */}
      <div
        style={{
          position: 'absolute',
          perspective: 800,
          opacity: ringOut,
        }}
      >
        <div style={{position: 'relative', width: 400, height: 250, transformStyle: 'preserve-3d', transform: `translateZ(${RIG_Z}px) rotateX(-6deg) rotateY(${rigY}deg)`}}>
          {CARDS.map((card, i) => {
            const base = i * 120;
            const world = ((base + rigY) % 360) * (Math.PI / 180);
            // Facing the camera = 1, turned away = 0.
            const facing = (Math.cos(world) + 1) / 2;
            const textOp = interpolate(facing, [0.58, 0.8], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });

            return (
              <div
                key={card.title}
                style={{
                  position: 'absolute', inset: 0,
                  borderRadius: 14,
                  border: `1px solid rgba(255,255,255,${0.15 + 0.25 * facing})`,
                  background: `rgba(26,26,30,${0.5 + 0.4 * facing})`,
                  transform: `rotateY(${base}deg) translateZ(${RADIUS}px)`,
                  opacity: 0.28 + 0.72 * facing,
                  padding: 26,
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                  fontFamily: INTER,
                  boxShadow: facing > 0.7 ? `0 0 40px rgba(23,232,168,${0.12 * facing})` : 'none',
                }}
              >
                {/* Text fades out before the card turns far enough to mirror it. */}
                <div style={{opacity: textOp}}>
                  <div style={{...ui(30, C.text, 600)}}>{card.title}</div>
                  <div style={{...ui(17, C.signal), marginTop: 6}}>{card.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Logo + CTA */}
      <div style={{position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
        <span
          style={{
            ...ui(80, C.text, 700),
            fontFamily: INTER,
            opacity: logoIn,
            transform: `scale(${0.96 + 0.04 * logoIn})`,
            textShadow: `0 0 20px ${C.glow}, 0 0 60px rgba(23,232,168,0.25)`,
            willChange: 'transform, opacity',
          }}
        >
          {BRAND}
        </span>
        <span
          style={{
            ...ui(32, C.mute, 500),
            fontFamily: INTER,
            opacity: ctaIn,
            transform: `translateY(${(1 - ctaIn) * 10}px)`,
            willChange: 'transform, opacity',
          }}
        >
          Discover {BRAND} today
        </span>
      </div>
    </div>
  );
};
