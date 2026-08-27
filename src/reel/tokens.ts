import {Easing} from 'remotion';

/** CTRL Room reel — 1920x1080, 30fps, 150 frames (5.000s). */
export const FPS = 30;
export const DURATION = 150;

/** ms -> frames. Never rounded: rounding drifts a 40ms stagger by a whole
 *  frame across eight characters and the word stops landing on the beat. */
export const ms = (v: number) => (v * FPS) / 1000;

export const C = {
  ink: '#07090A',
  ink2: '#0B0B0B',
  panel: '#101314',
  teal: '#006563',
  tealBright: '#00A9A4',
  tealLight: '#4FD1CA',
  white: '#FFFFFF',
  paper: '#F2F3F3',
};

/** The house curve. Fast out, long settle — an S in the speed graph. */
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);
/** Symmetric S, for anything that starts and stops in frame. */
export const EASE_IO = Easing.bezier(0.65, 0, 0.35, 1);
/** Sharp attack, used only on the sweep's second half. */
export const EASE_IN = Easing.bezier(0.55, 0, 1, 0.45);

/** Section boundaries, in ms, exactly as briefed. */
export const T = {
  bgFade: [0, 300],
  markScale: [0, 500],
  keyword: [300, 1800],
  charStagger: 40,
  charDur: 520,
  pulse: [1800, 3200],
  sweep: [2200, 3500],
  lockup: [3500, 4500],
  hold: [4500, 5000],
} as const;

export const KEYWORD = 'SWITCHED';
