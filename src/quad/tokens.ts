import React from 'react';
import {Easing} from 'remotion';

/** Shared tokens for the four-panel loop. */
export const N = {
  bg: '#0B1116',
  bgDeep: '#070C10',
  signal: '#17E8A8',
  signalDim: '#0C6B4E',
  text: '#EDF3F7',
  mute: '#8AA6B8',
  faint: '#526D7E',
  line: 'rgba(168,216,240,0.10)',
} as const;

/** 1920 / 4. Every panel is exactly this tall. */
export const PANEL_H = 480;

/** The premium curve. Fast start, long settle. Nothing here is linear. */
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);

export const ui = (
  size: number,
  color: string,
  weight = 400
): React.CSSProperties => ({fontSize: size, fontWeight: weight, color, margin: 0});

export const label = (color: string, size = 15): React.CSSProperties => ({
  fontWeight: 700,
  fontSize: size,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color,
});
