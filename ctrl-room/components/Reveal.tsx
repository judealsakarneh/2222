'use client';

import {motion} from 'framer-motion';
import type {ReactNode} from 'react';

/**
 * Scroll reveal.
 *
 * Deliberately small: 14px of travel and a short fade. A big slide-up is the
 * house style of every template landing page, and at 14px the eye reads it as
 * the content settling into place rather than as an effect.
 *
 * `once` is on and the viewport margin is negative at the bottom, so an element
 * animates when it is genuinely on screen — not while it is still a sliver at
 * the fold — and never replays when the user scrolls back up.
 */
export function Reveal({
  children,
  delay = 0,
  y = 14,
  className = '',
  as = 'div',
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'span' | 'li' | 'section';
}) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{opacity: 0, y}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '0px 0px -12% 0px'}}
      transition={{duration: 0.7, delay, ease: [0.22, 1, 0.36, 1]}}
    >
      {children}
    </Tag>
  );
}

/**
 * Reveal for a group whose children should arrive in sequence. Pair with
 * `RevealItem`. Kept separate from `Reveal` because staggering needs the parent
 * to own the viewport trigger — otherwise every child fires its own observer
 * and the sequence falls apart on a fast scroll.
 */
export function RevealGroup({
  children,
  className = '',
  stagger = 0.09,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{once: true, margin: '0px 0px -12% 0px'}}
      variants={{
        hidden: {},
        show: {transition: {staggerChildren: stagger, delayChildren: delay}},
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className = '',
  y = 16,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: {opacity: 0, y},
        show: {
          opacity: 1,
          y: 0,
          transition: {duration: 0.72, ease: [0.22, 1, 0.36, 1]},
        },
      }}
    >
      {children}
    </motion.div>
  );
}
