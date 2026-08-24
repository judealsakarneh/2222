import React from 'react';
import {Easing} from 'remotion';

/**
 * "The Long Take" — design system.
 *
 * The colour idea: the WORLD is cold data (ice blues, mist greys) and the BRAND
 * is the one warm signal in it. Emerald appears only at product moments, so it
 * carries meaning instead of just being the accent colour.
 */

export const L = {
  void: '#04060A', // deep space
  deep: '#070B12', // panel bodies
  mist: '#6E8CA0', // secondary text, cold
  ice: '#A8D8F0', // cool highlight — the "data" colour
  iceDim: '#2B4356',
  signal: '#17E8A8', // BRAND. Used sparingly, on purpose.
  signalDim: '#0C6B4E',
  text: '#EDF3F7',
} as const;

/** The brand. One line to re-brand the whole film. */
export const BRAND = 'zamble';

/** Camera curve — long glide, soft landing. Used for every travel segment. */
export const EASE_CAMERA = Easing.bezier(0.6, 0, 0.25, 1);

/** Content curve — everything that animates inside a station. */
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);

export const serif = (size: number, color: string = L.text): React.CSSProperties => ({
  fontWeight: 400,
  fontSize: size,
  lineHeight: 1.1,
  letterSpacing: '-0.015em',
  color,
  margin: 0,
});

export const label = (color: string = L.mist, size = 20): React.CSSProperties => ({
  fontWeight: 700,
  fontSize: size,
  letterSpacing: '0.24em',
  textTransform: 'uppercase',
  color,
});

/** Cold panel material for anything that reads as a surface. */
export const PANEL: React.CSSProperties = {
  background: 'linear-gradient(165deg, #0B131D 0%, #080D15 60%, #05080D 100%)',
  border: '1px solid rgba(168,216,240,0.14)',
  boxShadow:
    '0 40px 90px -30px rgba(0,0,0,0.95), inset 0 1px 0 rgba(168,216,240,0.10)',
};
