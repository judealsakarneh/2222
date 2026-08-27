'use client';

import {motion, useMotionTemplate, useScroll, useSpring, useTransform} from 'framer-motion';
import {useRef} from 'react';
import type {ReactNode} from 'react';

/**
 * The site's one signature move.
 *
 * Archivo is a variable font with a real `wdth` axis, and this animates it: the
 * headline enters slightly condensed and settles expanded as it arrives. The
 * letterforms themselves change proportion. Not a fade, not a slide.
 *
 * WHY THIS AND NOT A SHADER: WebGL backgrounds, live product demos and bento
 * grids are commodity in 2026 and read as generated. What separates the top
 * tier is voice and restraint. So the page spends its one effect here, on one
 * headline per view, on something almost nobody bothers to do.
 *
 * It is also the entire argument for carrying a second typeface. Geist has no
 * width axis and structurally cannot do this, which is why Archivo appears at
 * display scale and nowhere else.
 *
 * The scroll value runs through a spring, so a flung scroll settles rather than
 * snapping the width. Under reduced motion the axis is fixed at its resting
 * value and the component renders as ordinary type.
 */
export function DisplayHeadline({
  children,
  className = '',
  as: Tag = 'h2',
  from = 92,
  to = 112,
}: {
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'h2';
  /** Archivo's wdth axis runs 62-125. These stay well inside it. */
  from?: number;
  to?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const {scrollYProgress} = useScroll({
    target: ref,
    offset: ['start 0.95', 'start 0.35'],
  });
  const s = useSpring(scrollYProgress, {stiffness: 110, damping: 26, mass: 0.5});
  const wdth = useTransform(s, [0, 1], [from, to]);
  const variation = useMotionTemplate`'wdth' ${wdth}`;

  const M = Tag === 'h1' ? motion.h1 : motion.h2;

  return (
    <div ref={ref}>
      <M
        className={`display ${className}`}
        style={{
          color: 'var(--fg)',
          fontVariationSettings: variation,
          // The axis is the animation; nothing else about this element moves.
          willChange: 'font-variation-settings',
        }}
      >
        {children}
      </M>
    </div>
  );
}
