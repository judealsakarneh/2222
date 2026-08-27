import {Easing, interpolate} from 'remotion';

/**
 * CTRL Room — promo tokens.
 *
 * Palette is the brand deck's: Near-Black #151515, White, CTRL Teal #006563.
 * The deck teal has no contrast as type on near-black, so a brightened sibling
 * carries accent text and the deck value is spent as the card's fill — exactly
 * the split the website uses, so the film and the site look like one brand.
 */
export const C = {
  ink: '#0B0B0B',
  ink2: '#151515',
  paper: '#F2F3F3',
  teal: '#006563',
  tealBright: '#00A9A4',
  tealLight: '#4FD1CA',
  white: '#FFFFFF',
};

/** Fast out, long settle. Every move in the film uses it; nothing is linear. */
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);
export const EASE_IO = Easing.bezier(0.65, 0, 0.35, 1);

export const FPS = 30;
export const DURATION = 720; // 24.0s — inside the 21-34s zone reels retain

/**
 * The film runs through the same dark and light "acts" as the website, and the
 * ground crossfades between them rather than cutting. `act(frame)` returns
 * 0 for dark and 1 for light, and every colour on screen is derived from it —
 * which is why no scene has to know what act it is in.
 */
export const ACT_KEYS = [0, 336, 366, 486, 516, DURATION];
export const ACT_VALS = [0, 0, 1, 1, 0, 0];

export const act = (frame: number) =>
  interpolate(frame, ACT_KEYS, ACT_VALS, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_IO,
  });

/** Mix two hex colours. Used to derive every foreground from the act value. */
export const mix = (a: string, b: string, t: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [r1, g1, b1] = p(a);
  const [r2, g2, b2] = p(b);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const bl = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r} ${g} ${bl})`;
};

/** Foreground for the current act. */
export const fg = (t: number) => mix('#FFFFFF', '#151515', t);
export const fgMuted = (t: number) =>
  `rgba(${t > 0.5 ? '21,21,21' : '255,255,255'}, ${t > 0.5 ? 0.62 : 0.6})`;
export const accent = (t: number) => mix(C.tealBright, C.teal, t);
export const line = (t: number) =>
  `rgba(${t > 0.5 ? '21,21,21' : '255,255,255'}, ${t > 0.5 ? 0.14 : 0.12})`;

/** Scene boundaries, in frames. */
export const S = {
  hook: {from: 0, to: 96},
  turn: {from: 96, to: 186},
  pillars: {from: 186, to: 348},
  card: {from: 348, to: 510},
  scale: {from: 510, to: 606},
  end: {from: 606, to: DURATION},
};
