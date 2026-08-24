import React from 'react';
import {Easing} from 'remotion';

/**
 * "Story" — design system.
 *
 * TWO WORLDS, alternating. The dark world is the product doing work; the light
 * world is the moment of understanding. Cutting between them gives the film a
 * pulse that an all-dark piece cannot have, and the light scenes act as a breath
 * — somewhere for the eye to rest between dense beats.
 *
 * The light palette is lifted straight from the brand sketches: cream paper,
 * deep green ink.
 */

export const N = {
  // NIGHT — the product at work
  bg: '#0D141A',
  bgDeep: '#080D12',
  signal: '#17E8A8',
  signalDim: '#0C6B4E',
  text: '#EDF3F7',
  mute: '#8AA6B8',
  faint: '#4A6474',
  line: 'rgba(168,216,240,0.16)',
} as const;

export const P = {
  // PAPER — the moment of understanding
  bg: '#F4F1E8',
  bgWarm: '#EFEBDF',
  ink: '#0E7A5A',
  inkDeep: '#0A5B43',
  text: '#16201C',
  mute: '#6E7E76',
  line: 'rgba(14,122,90,0.18)',
} as const;

export const BRAND = 'zamble';

/** Standard settle. */
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);

/**
 * Transition easing. Deliberately gentler than a snappy UI curve: these
 * transitions are 24 frames because the previous cut was unreadable at 12-18.
 * A hard ease-out would spend most of that window sitting still.
 */
export const EASE_MOVE = Easing.bezier(0.45, 0, 0.15, 1);

export const ui = (
  size: number,
  color: string,
  weight = 400
): React.CSSProperties => ({fontSize: size, fontWeight: weight, color, margin: 0});

export const label = (color: string, size = 18): React.CSSProperties => ({
  fontWeight: 700,
  fontSize: size,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color,
});
