'use client';

import {useRef, useState, type ReactNode} from 'react';
import {motion, useReducedMotion} from 'framer-motion';

type Variant = 'solid' | 'outline' | 'ghost';

const BASE =
  'group relative inline-flex items-center gap-3 rounded-[2px] px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.1em] transition-colors duration-200';

const VARIANTS: Record<Variant, string> = {
  // Brand teal at full strength. White on #006563 is 6.9:1, so the fill can
  // carry type without lightening the brand colour.
  solid: 'bg-teal text-white hover:bg-[#00807D]',
  outline: 'border border-white/20 text-white hover:border-white/45 hover:bg-white/[0.04]',
  ghost: 'text-white/70 hover:text-white',
};

export function Button({
  children,
  href,
  variant = 'solid',
  className = '',
}: {
  children: ReactNode;
  href: string;
  variant?: Variant;
  className?: string;
}) {
  return (
    <a href={href} className={`${BASE} ${VARIANTS[variant]} ${className}`}>
      <span>{children}</span>
      <Arrow />
    </a>
  );
}

/**
 * The same button, with the pull. The element leans toward the cursor by a
 * fraction of the distance from its own centre, which reads as weight rather
 * than as a spring. Disabled outright under reduced motion and on coarse
 * pointers, where there is no cursor to lean toward.
 */
export function MagneticButton({
  children,
  href,
  variant = 'solid',
  className = '',
  strength = 0.28,
}: {
  children: ReactNode;
  href: string;
  variant?: Variant;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [d, setD] = useState({x: 0, y: 0});
  const reduce = useReducedMotion();

  const track = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || reduce) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const r = el.getBoundingClientRect();
    setD({
      x: (e.clientX - (r.left + r.width / 2)) * strength,
      y: (e.clientY - (r.top + r.height / 2)) * strength,
    });
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={track}
      onMouseLeave={() => setD({x: 0, y: 0})}
      animate={{x: d.x, y: d.y}}
      transition={{type: 'spring', stiffness: 260, damping: 22, mass: 0.4}}
      className={`${BASE} ${VARIANTS[variant]} ${className}`}
    >
      <span>{children}</span>
      <Arrow />
    </motion.a>
  );
}

function Arrow() {
  return (
    <svg
      width="14"
      height="10"
      viewBox="0 0 14 10"
      fill="none"
      aria-hidden
      className="translate-x-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
    >
      <path d="M0 5h12M8.5 1.5 12 5l-3.5 3.5" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}
