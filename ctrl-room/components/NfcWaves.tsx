'use client';

import {motion} from 'framer-motion';
import type {CSSProperties} from 'react';

/**
 * The NFC tap motif.
 *
 * The arcs light up in sequence, outward from the source, then all three hold
 * bright for a beat before releasing — which is what a real tap reads like:
 * reach, connect, confirm. A simple all-together breathe would read as a
 * loading spinner instead, and this site should never look like it is waiting
 * for something.
 *
 * The whole cycle is 2.6s with a long tail, so it registers as ambient rather
 * than as something demanding attention.
 */
export function NfcWaves({
  size = 26,
  className = '',
  style,
  play = true,
}: {
  size?: number;
  className?: string;
  style?: CSSProperties;
  play?: boolean;
}) {
  const arcs = [
    'M5.4 10.4a2.6 2.6 0 0 1 0 3.2',
    'M9.2 7.6a6.6 6.6 0 0 1 0 8.8',
    'M13 4.8a10.6 10.6 0 0 1 0 14.4',
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      style={style}
    >
      {arcs.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          stroke="currentColor"
          strokeWidth={1.35}
          strokeLinecap="round"
          initial={{opacity: 0.16}}
          animate={play ? {opacity: [0.16, 1, 1, 0.16]} : {opacity: 0.5}}
          transition={{
            duration: 2.6,
            // The three arcs share one timeline; only their delay differs, so
            // the light always travels outward and never crosses itself.
            times: [0, 0.18, 0.5, 0.78],
            delay: i * 0.16,
            repeat: Infinity,
            repeatDelay: 0.7,
            ease: 'easeInOut',
          }}
        />
      ))}
    </svg>
  );
}

/**
 * A single ring that expands and dissolves — the ripple a tap leaves behind.
 * Sits under the card in the interactive preview.
 */
export function TapRipple({className = ''}: {className?: string}) {
  return (
    <div className={`pointer-events-none absolute ${className}`}>
      {[0, 1].map((i) => (
        <motion.span
          key={i}
          className="absolute inset-0 rounded-full border border-teal"
          initial={{scale: 0.6, opacity: 0}}
          animate={{scale: [0.6, 1.9], opacity: [0, 0.22, 0]}}
          transition={{
            duration: 3.4,
            delay: i * 1.7,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}
