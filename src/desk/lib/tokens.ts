import React from 'react';
import {Easing} from 'remotion';

/**
 * "Desk POV" — design system.
 *
 * A physical room, and a screen inside it. The room is warm-neutral and almost
 * monochrome so the SCREEN is the only saturated thing in frame — that contrast
 * is what makes the eye treat the monitor as a light source rather than as
 * another rectangle.
 */

export const D = {
  room: '#0A0B0D',
  deskHi: '#242A32',
  deskLo: '#111519',
  bezel: '#141619',
  bezelHi: '#24282E',
  screenBg: '#111A22',
  panel: '#131A1F',
  line: 'rgba(168,216,240,0.16)',
  signal: '#17E8A8', // brand
  signalDim: '#0C6B4E',
  ice: '#A8D8F0',
  text: '#EDF3F7',
  mute: '#8AA6B8',
  faint: '#4A6474',
} as const;

export const BRAND = 'zamble';

/** Standard settle. Everything inside the screen uses this. */
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);

/**
 * Swipe easing — quick off the mark, decelerating hard into the landing.
 *
 * Calibrated, not guessed: a hard ease-out like (0.16, 1, 0.3, 1) is 93% done at
 * the halfway frame, so the visible motion is over in about five frames and the
 * rest of the window is a blurred still. This curve spreads the travel across
 * the whole window while keeping the weighty deceleration at the end.
 */
export const EASE_SWIPE = Easing.bezier(0.3, 0.8, 0.2, 1);

/** Screen geometry. Pages are authored at exactly this size. */
export const SCREEN_W = 1920;
export const SCREEN_H = 1080;

export const ui = (size: number, color: string = D.text, weight = 400): React.CSSProperties => ({
  fontSize: size,
  fontWeight: weight,
  color,
  margin: 0,
});

export const label = (color: string = D.mute, size = 13): React.CSSProperties => ({
  fontWeight: 700,
  fontSize: size,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color,
});

/** Surface used by cards and panels inside the screen. */
export const CARD: React.CSSProperties = {
  background: 'linear-gradient(165deg, #151D23 0%, #111820 60%, #0D1318 100%)',
  border: `1px solid ${D.line}`,
  borderRadius: 14,
};

/**
 * The persistent app shell. The top bar and bottom strip render ONCE, outside
 * the transition engine, and never move — so they are the anchor the eye holds
 * while the body does something violent. This is the same trick a monitor bezel
 * performs in a filmed ad, done natively instead of faked.
 */
export const BAR_H = 78;
export const STRIP_H = 64;
export const BODY_H = SCREEN_H - BAR_H - STRIP_H; // 938
