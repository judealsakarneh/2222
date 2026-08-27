'use client';

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import {useRef} from 'react';
import {MemberCard} from './MemberCard';

/**
 * The card, made physical. Three inputs drive one object.
 *
 *   SCROLL — the card's own position in the viewport rotates it. This is the
 *   base state: even untouched, the card turns as you move down the page, so it
 *   reads as an object sitting in the scene rather than an image pinned to it.
 *
 *   POINTER — hovering adds tilt on top of the scroll rotation, through springs
 *   so the card has mass and settles instead of snapping.
 *
 *   DRAG — on touch, where there is no pointer to track, a finger spins it
 *   directly. Momentum is deliberately absent: a card you are holding stops
 *   when your finger stops.
 *
 * All three sum into the same two spring-backed values, which is why they never
 * fight each other — the card has one rotation, fed from three places.
 *
 * A NOTE ON preserve-3d: any ancestor with opacity < 1 collapses the 3D context
 * and flattens the card. Nothing above this component may animate opacity.
 */
export function CardStage({
  className = '',
  maxTilt = 12,
  scrollTurn = 16,
  restX = 4,
  restY = -10,
  restZ = -2,
  member,
}: {
  className?: string;
  maxTilt?: number;
  /** Degrees of Y rotation swept across the card's full pass through the view. */
  scrollTurn?: number;
  restX?: number;
  restY?: number;
  restZ?: number;
  member?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const {scrollYProgress} = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const px = useMotionValue(0); // pointer, -0.5..0.5
  const py = useMotionValue(0);
  const drag = useMotionValue(0); // accumulated finger rotation, degrees
  const lift = useMotionValue(0);

  const spring = {stiffness: 130, damping: 18, mass: 0.62};
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);
  const sDrag = useSpring(drag, {stiffness: 170, damping: 22});
  const sLift = useSpring(lift, {stiffness: 160, damping: 22});
  // The scroll term is springed too, so a flung scroll does not snap the card.
  const sScroll = useSpring(scrollYProgress, {stiffness: 90, damping: 24, mass: 0.5});

  // 0 at the bottom of the screen, 1 at the top — mapped either side of centre
  // so the card faces the reader when it is in the middle of the viewport.
  const turn = useTransform(sScroll, [0, 0.5, 1], [scrollTurn, 0, -scrollTurn]);
  const rise = useTransform(sScroll, [0, 0.5, 1], [26, 0, -26]);

  const rotateY = useTransform(
    [sx, turn, sDrag] as const,
    ([p, t, d]: number[]) => restY + p * maxTilt * 2 + t + d
  );
  const rotateX = useTransform(
    [sy, turn] as const,
    ([p, t]: number[]) => restX - p * maxTilt * 1.4 + t * 0.18
  );
  const translateZ = useTransform(sLift, (v) => v * 30);

  // Highlight tracks the pointer through the same springs, so the light can
  // never separate from the rotation.
  const hx = useTransform(sx, (v) => `${50 + v * 96}%`);
  const hy = useTransform(sy, (v) => `${50 + v * 96}%`);
  const ha = useTransform(sLift, (v) => 0.05 + v * 0.13);
  const glare = useMotionTemplate`radial-gradient(42% 64% at ${hx} ${hy}, rgba(255,255,255,${ha}), rgba(255,255,255,0) 70%)`;

  const dragging = useRef<{x: number; from: number} | null>(null);

  const onDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') return;
    dragging.current = {x: e.clientX, from: drag.get()};
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      px.set((e.clientX - r.left) / r.width - 0.5);
      py.set((e.clientY - r.top) / r.height - 0.5);
      return;
    }
    const d = dragging.current;
    if (!d) return;
    // 0.42deg per pixel: a thumb-width swipe turns the card about a third of
    // the way round, which is enough to feel like spinning it and not so much
    // that the back flies past.
    drag.set(d.from + (e.clientX - d.x) * 0.42);
  };

  const onUp = () => {
    dragging.current = null;
  };

  const onLeave = () => {
    px.set(0);
    py.set(0);
    lift.set(0);
  };

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      style={{perspective: 1500, touchAction: 'pan-y'}}
      onPointerMove={onMove}
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onPointerEnter={(e) => e.pointerType === 'mouse' && lift.set(1)}
      onPointerLeave={onLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          rotateZ: restZ,
          translateZ,
          y: rise,
          transformStyle: 'preserve-3d',
        }}
      >
        <MemberCard
          member={member}
          overlay={
            <motion.div
              className="pointer-events-none absolute inset-0"
              style={{background: glare}}
            />
          }
        />
      </motion.div>
    </div>
  );
}
