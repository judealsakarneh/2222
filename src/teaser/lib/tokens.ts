import {Easing} from 'remotion';
import React from 'react';

/**
 * zamble teaser — design system.
 *
 * Cyberpunk / terminal / glitchcore. Four colours, one monospace face, one
 * easing curve. The restraint is what keeps it from looking like a filter pack.
 */

export const T = {
  bg: '#0a0a0a',
  cyan: '#00ffcc', // primary — all live text
  purple: '#9333ea', // accent — prompts, chrome, the magenta half of RGB splits
  white: '#ffffff', // highlights only
  dim: '#1c2b28', // inactive terminal furniture
} as const;

/** The brand. Change this one line to re-brand the whole teaser. */
export const BRAND = 'zamble';
export const PRODUCT = 'ZAMBLE v2';

/**
 * Placeholder growth figures, carried over from the reference teaser.
 * Swap for real numbers before publishing.
 */
export const STATS = {from: 3277, to: 62000};

/** All on-screen copy, in one place. */
export const COPY = {
  hudGrowth: '// community growth',
  hudMontage: '// generated · batch 0x2f',
  features: ['more accurate', 'more templates', 'more sources'],
  // ASCII arrow on purpose: U+2192 is not in the latin subset we load, and it
  // reads more terminal anyway.
  tagline: 'voice note -> pitch deck',
  cta: 'coming soon',
  url: 'zamble.app',
} as const;

/** Every move in the film rides this curve. */
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);

/** Monospace cell metrics — advance width is ~0.6em in JetBrains Mono. */
export const CELL_W = 0.6;

/** Emerald-free neon glow used on live terminal text. */
export const cyanGlow = (px = 12): string =>
  `drop-shadow(0 0 ${px}px rgba(0,255,204,0.55))`;

/** The uppercase micro-label used for HUD chrome. */
export const hud = (color: string = T.purple, size = 18): React.CSSProperties => ({
  fontWeight: 700,
  fontSize: size,
  letterSpacing: '0.24em',
  textTransform: 'uppercase',
  color,
});
