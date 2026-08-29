import {Easing} from 'remotion';

/**
 * CTRL Flow — the beat sheet.
 *
 * Every time in this file is in **milliseconds from comp start**, exactly as
 * the build document states them, and `ms()` converts to frames at the point of
 * use. Nothing is written as a frame number, so the file can be read straight
 * against the document without arithmetic.
 *
 * At 30 fps one frame is 33.333 ms, so a few of the document's figures are
 * finer than the format can resolve: the 25 ms-per-character type rate and the
 * 30 ms bar stagger both land inside a single frame. They are kept at the
 * stated values because the aggregate rate is what reads on screen - roughly
 * 1.3 characters per frame - rather than rounded up to a frame boundary, which
 * would slow the typing by a third.
 */

export const FPS = 30;

/** Milliseconds to frames. Fractional on purpose; interpolate accepts it. */
export const ms = (t: number) => (t * FPS) / 1000;

/** 12.000 s. The document's own total, and the end of the outro hold. */
export const DURATION = ms(12000);

// ---------------------------------------------------------------------------
// Curves
//
// The build document's cubic-bezier values did not survive the paste - every
// "Speed Curve" line arrived empty, including the one under THE SECRET SAUCE.
// The description that did survive ("fast start, slow end, zero bounce", the
// Linear.app curve) matches the house curve already pinned in ae/SPEC.md, so
// that is what every UI move here uses. It is also what the CTRL Room website
// uses, which is the reason the film and the site move alike.
// ---------------------------------------------------------------------------

/** The house curve. Leaves instantly, settles long. AE: out-inf 1, in-inf 88. */
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);

/** Symmetric, for anything that both starts and stops on screen. */
export const EASE_IO = Easing.bezier(0.65, 0, 0.35, 1);

/** Organic in-out for the signal bars. Softer at both ends than EASE_IO. */
export const EASE_ORGANIC = Easing.bezier(0.37, 0, 0.63, 1);

/**
 * The icon's overshoot.
 *
 * The document asks for "56% elastic overshoot" as a Speed Graph influence,
 * which is an AE control with no direct equivalent here. A 0-110-100 scale
 * ramp on the house curve produces the same read - the 10% overshoot is the
 * shape, the influence number only decides how hard it snaps - so the value is
 * expressed as keyframes rather than as a spring, and the spring is not used.
 */
export const ICON_SCALE = {peak: 1.1, settle: 1.0};

// ---------------------------------------------------------------------------
// Beats
//
// `slot` is when the beat owns the screen; `move` is how long its animation
// actually takes. The document gives both and they rarely match - the panel,
// for instance, owns 1200 ms and slides in over 320 - so a beat animates for
// `move` and then holds for the remainder of its slot. Holding is the point:
// it is what stops the piece reading as a list of animations.
// ---------------------------------------------------------------------------

export const BEATS = {
  /** Mark loads. Scale 0 → 110 → 100, opacity over 300, glow over 500. */
  icon: {slot: [0, 600], move: 600, opacity: 300, glow: 500},

  /** Wallpaper resolves. Blur 100 → 0 px, scale 105 → 100. */
  wall: {slot: [600, 2000], move: 1400},

  /** Panel arrives. Y +120 → 0, shadow blur 0 → 40, shadow opacity 0 → 15%. */
  panel: {slot: [2000, 3200], move: 320},

  /** Live bars. 150 ms per bar, 30 ms stagger, scaleY 20 → 100 → 60. */
  bars: {slot: [3200, 4500], per: 150, stagger: 30},

  /** List types in. 25 ms per character, 60 ms between lines. */
  type: {slot: [4500, 6300], perChar: 25, perLine: 60, caret: 500},

  /** Tabs. Underline 0 → 120 → 240 px; out 150 ms, in 200 ms, 50 ms overlap. */
  tabs: {slot: [6300, 8000], underline: 250, out: 150, in: 200, overlap: 50},

  /** Counters run up over 1200 ms; card pops at 80% progress over 400 ms. */
  count: {slot: [8000, 10000], run: 1200, pop: 400, popAt: 0.8},

  /** Lockup. Opacity 0 → 100 + Y +10 → 0 over 400 ms, then a 500 ms hold. */
  outro: {slot: [10000, 12000], move: 400, hold: 500},
} as const;

// ---------------------------------------------------------------------------
// Content
//
// PLACEHOLDER. None of this is a claim CTRL Room has made. The figures exist
// because a counter needs digits to count to; replace them with real numbers
// before the film goes anywhere, or cut the beat. Same for the list rows: they
// are the shape of a CTRL Picks result, not real venues.
// ---------------------------------------------------------------------------

export const LIST_ROWS = [
  {name: 'Placeholder Roastery', area: 'Um Uthayna', kind: 'Coffee'},
  {name: 'Placeholder Kitchen', area: 'Sweifieh', kind: 'Levantine'},
  {name: 'Placeholder Rooftop', area: 'Abdoun', kind: 'Late'},
] as const;

export const TABS = ['Discover', 'Events', 'Elite'] as const;

/** REPLACE both figures with real ones, or remove the counter beat. */
export const COUNTERS = [
  {to: 978, label: 'places indexed'},
  {to: 19, label: 'areas covered'},
] as const;
