'use client';

import {motion, useMotionTemplate, useMotionValue, useSpring, useTransform} from 'framer-motion';
import {useEffect, useRef, useState} from 'react';
import {LoyaltyCard} from './LoyaltyCard';

/**
 * The card, made physical.
 *
 * Three things happen together, and they only work together:
 *
 *   TILT — the pointer's position over the card drives rotateX/rotateY through
 *   springs. Raw pointer values feel like a hinge; the spring gives the card
 *   mass, so it lags slightly and settles rather than snapping.
 *
 *   SPECULAR — a soft white highlight tracks the pointer across the surface. A
 *   tilt without a moving highlight reads as a rotating picture; the highlight
 *   is what makes it read as a rotating *object*, because it is the only cue
 *   that the surface is catching light from a fixed source.
 *
 *   SWEEP — a hard diagonal band crosses the card every few seconds, the way a
 *   reader's light passes over a card on tap. This is the NFC beat.
 *
 * A NOTE ON preserve-3d: any ancestor with opacity < 1 collapses the 3D context
 * and flattens the card. That is why the reveal animation on this section wraps
 * the *outer* container and settles at opacity 1 before anyone can tilt it.
 */
export function CardStage({
  className = '',
  maxTilt = 13,
  float = false,
  restX = 0,
  restY = 0,
  restZ = 0,
}: {
  className?: string;
  maxTilt?: number;
  float?: boolean;
  /** Resting rotation, so the card can sit like a product photo rather than
   *  flat-on. The pointer tilt is added on top of it. */
  restX?: number;
  restY?: number;
  restZ?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [coarse, setCoarse] = useState(false);

  // Normalised pointer position over the card, -0.5 .. 0.5 on both axes.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const lift = useMotionValue(0);

  const spring = {stiffness: 140, damping: 18, mass: 0.6};
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);
  const sLift = useSpring(lift, {stiffness: 160, damping: 22});

  const rotateY = useTransform(sx, (v) => restY + v * maxTilt * 2);
  const rotateX = useTransform(sy, (v) => restX - v * maxTilt * 1.5);
  const translateZ = useTransform(sLift, (v) => v * 34);

  // Highlight position in percent, trailing the pointer through the same
  // springs so it never separates from the tilt.
  const hx = useTransform(sx, (v) => `${50 + v * 100}%`);
  const hy = useTransform(sy, (v) => `${50 + v * 100}%`);
  // The highlight is nearly off at rest and only blooms while the pointer is on
  // the card. A permanent bright spot in the middle of the face does not read as
  // a highlight — it reads as a smudge on the render.
  const ha = useTransform(sLift, (v) => 0.035 + v * 0.115);
  const hb = useTransform(sLift, (v) => 0.01 + v * 0.035);
  const glare = useMotionTemplate`radial-gradient(40% 62% at ${hx} ${hy}, rgba(255,255,255,${ha}), rgba(255,255,255,${hb}) 44%, rgba(255,255,255,0) 70%)`;

  useEffect(() => {
    // No pointer to track on a phone. Rather than leave the card dead, it gets
    // a slow sway below — but it must never chase a touch.
    const mq = window.matchMedia('(hover: none)');
    const sync = () => setCoarse(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!coarse) return;
    let raf = 0;
    const t0 = performance.now();
    const loop = (t: number) => {
      const s = (t - t0) / 1000;
      // Two periods that do not divide each other, so the sway never repeats
      // in an obvious cycle.
      px.set(Math.sin(s / 3.1) * 0.16);
      py.set(Math.sin(s / 4.7) * 0.1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [coarse, px, py]);

  const onMove = (e: React.PointerEvent) => {
    if (coarse) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };

  const reset = () => {
    if (coarse) return;
    px.set(0);
    py.set(0);
    lift.set(0);
  };

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      style={{perspective: 1400}}
      onPointerMove={onMove}
      onPointerEnter={() => !coarse && lift.set(1)}
      onPointerLeave={reset}
    >
      <motion.div
        className="preserve-3d"
        style={{rotateX, rotateY, rotateZ: restZ, translateZ}}
        animate={
          float
            ? {y: [0, -9, 0]}
            : undefined
        }
        transition={
          float
            ? {duration: 7.5, repeat: Infinity, ease: 'easeInOut'}
            : undefined
        }
      >
        <LoyaltyCard
          overlay={
            <>
              {/* Specular highlight */}
              <motion.div
                className="pointer-events-none absolute inset-0"
                style={{background: glare}}
              />
              {/* NFC sweep — a narrow band, steeply raked, crossing the face */}
              <motion.div
                className="pointer-events-none absolute inset-y-[-40%] w-[26%]"
                style={{
                  background:
                    'linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.09) 42%, rgba(94,234,212,0.20) 50%, rgba(255,255,255,0.09) 58%, rgba(255,255,255,0) 100%)',
                  transform: 'rotate(14deg)',
                  filter: 'blur(6px)',
                }}
                initial={{left: '-35%'}}
                animate={{left: ['-35%', '115%']}}
                transition={{
                  duration: 1.35,
                  ease: [0.4, 0, 0.2, 1],
                  repeat: Infinity,
                  repeatDelay: 4.4,
                }}
              />
            </>
          }
        />
      </motion.div>
    </div>
  );
}
