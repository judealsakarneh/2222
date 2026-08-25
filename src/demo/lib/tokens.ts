import React from 'react';
import {Easing} from 'remotion';

/**
 * "Demo" — design system.
 *
 * The reference spec calls for neon blue + purple. Swapped for our emerald as
 * the single neon, with everything else held neutral: one saturated colour on
 * near-black is what reads as Apple/Linear rather than as a gamer product.
 */
export const C = {
  bg: '#0A0A0F',
  panel: '#12121A',
  panel2: '#1A1A1E',
  header: '#16161C',
  bubble: '#1E1E26',
  border: 'rgba(255,255,255,0.08)',
  signal: '#17E8A8',
  signalDim: '#0C6B4E',
  glow: 'rgba(23,232,168,0.55)',
  text: '#FFFFFF',
  mute: '#8A8A99',
  faint: '#55555F',
} as const;

export const BRAND = 'zamble';

/** The spec's global curve. Every motion in the film uses it. */
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);

/** ms -> frames at 30fps. The spec is written in milliseconds; the code is not. */
export const ms = (v: number): number => (v * 30) / 1000;

export const ui = (
  size: number,
  color: string,
  weight = 400
): React.CSSProperties => ({fontSize: size, fontWeight: weight, color, margin: 0});
