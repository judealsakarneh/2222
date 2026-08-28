'use client';

import {motion} from 'framer-motion';
import {useReducedMotion} from '@/lib/useReducedMotion';
import type {ReactNode} from 'react';

/**
 * Line-by-line reveal. Each line sits in its own overflow-hidden box and
 * rises from below it, so the type is uncovered rather than faded in.
 *
 * Two things here are load-bearing.
 *
 * The trigger lives on the OUTER element and the motion is inherited through
 * variants. IntersectionObserver clips an element against its ancestors'
 * overflow, so a span translated fully below its own overflow-hidden parent
 * never intersects anything: put whileInView on the translated span and it
 * deadlocks, because it cannot be seen, so it never animates, so it can never
 * be seen. The wrapper is never transformed, so it always fires.
 *
 * Under reduced motion the DOM is exactly the same and only the animation
 * config changes. `initial={false}` starts the type at its resting position
 * with nothing to wait for, so content is never gated on a scroll trigger
 * that may not fire. Swapping in a different tree instead would keep the
 * pixels right but change the element order between the two modes.
 */
const SHOW = {
  hidden: {y: '110%'},
  show: {y: '0%'},
};

export function RevealText({
  lines,
  className = '',
  delay = 0,
  as: Tag = 'h2',
}: {
  lines: ReactNode[];
  className?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div';
}) {
  const reduce = useReducedMotion();

  return (
    <Tag className={className}>
      <motion.span
        className="block"
        initial={reduce ? false : 'hidden'}
        whileInView={reduce ? undefined : 'show'}
        viewport={{once: true, margin: '-8%'}}
      >
        {lines.map((line, i) => (
          // The mask is sized by line-height, which sits tighter than the
          // glyphs' actual ink: at leading below 1 the descenders of g, y and
          // j get sliced off. The padding gives the ink room inside the mask
          // and the equal negative margin takes it back out of the layout, so
          // nothing below moves.
          <span
            key={i}
            className="block overflow-hidden"
            style={{paddingBottom: '0.2em', marginBottom: '-0.2em'}}
          >
            <motion.span
              className="block will-change-transform"
              variants={reduce ? undefined : SHOW}
              transition={{
                duration: 0.85,
                delay: delay + i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

/** The workhorse: a block that rises a little as it enters. */
export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : {opacity: 0, y: 18}}
      whileInView={reduce ? undefined : {opacity: 1, y: 0}}
      viewport={{once: true, margin: '-8%'}}
      transition={{duration: 0.7, delay, ease: [0.22, 1, 0.36, 1]}}
    >
      {children}
    </motion.div>
  );
}
