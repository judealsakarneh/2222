import {Easing} from 'remotion';

/**
 * Revorva — the beat sheet.
 *
 * 15.000 s at 30 fps. Shorter than the CTRL Room brand film on purpose: this
 * is a launch piece, and a launch piece earns attention by being over before
 * the viewer decides to leave. 15-25 s is the useful band; this sits at the
 * floor because the product's own story is four beats long and padding it
 * would only dilute them.
 *
 * Times are in milliseconds, converted once by `ms()`, so the file reads as a
 * beat sheet rather than as frame arithmetic.
 */

export const FPS = 30;
export const ms = (t: number) => (t * FPS) / 1000;
export const DURATION = ms(15000);

// ---------------------------------------------------------------------------
// Curves. The same house curve as every other piece in this repo, which is why
// they all move alike.
// ---------------------------------------------------------------------------

/** Fast out, long settle. cubic-bezier(0.22, 1, 0.36, 1). */
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);
/** Symmetric, for anything that starts and stops on screen. */
export const EASE_IO = Easing.bezier(0.65, 0, 0.35, 1);
/** Exits. Slower to release than to arrive. */
export const EASE_EXIT = Easing.bezier(0.55, 0, 1, 0.45);

// ---------------------------------------------------------------------------
// Beats
//
// `slot` is when a beat owns the screen; `move` is how long its animation
// takes. A beat animates for `move` then holds. The holding is what stops the
// film reading as a list of animations.
// ---------------------------------------------------------------------------

export const BEATS = {
  /**
   * 0 - 2500 ms. THE HOOK. A payment fails.
   *
   * The problem is stated before the product exists. A launch video that opens
   * on its own logo has spent its first two seconds on the one thing the
   * viewer does not yet care about.
   *
   * The row is already on screen at frame 0, settled and normal. The decline
   * arrives at 900 ms - late enough that the viewer has read the row as
   * ordinary, which is what makes the state change land.
   */
  fail: {slot: [0, 2500], rowIn: 420, declineAt: 900, badgeIn: 260},

  /**
   * 2500 - 5000 ms. THE TURN. Revorva connects.
   *
   * The Stripe OAuth handshake is genuinely one click and about two seconds,
   * so the edit can show it at real speed and be honest. Speeding it up would
   * be the one place this film could lie and gain nothing.
   */
  connect: {slot: [2500, 5000], move: 520, holdAfter: 700},

  /**
   * 5000 - 11000 ms. THE WORK. Retry schedule, then the email, then recovery.
   *
   * The longest beat because it is the only one that shows the product doing
   * something. Three sub-moments, each given room rather than crossfaded past.
   */
  work: {
    slot: [5000, 11000],
    retryAt: 5200,
    /** Each retry attempt lands 620 ms after the last. */
    retryStagger: 620,
    retries: 3,
    emailAt: 7400,
    emailMove: 460,
    recoverAt: 9200,
    recoverMove: 520,
  },

  /**
   * 11000 - 15000 ms. THE CLOSE. Wordmark, line, domain.
   *
   * Staggered 0 / 160 / 300 so the three elements resolve in reading order
   * rather than together, then a hold.
   */
  outro: {slot: [11000, 15000], move: 420, stagger: [0, 160, 300], hold: 600},
} as const;

/**
 * Readability floor, applied to every line the viewer must read.
 *
 * A short label needs about 0.8 s settled; a sentence needs about 0.3 s per
 * word. Fast-in, then hold - never fast-in, then gone. This is the rule the
 * pacing is checked against after the first render, not a suggestion.
 */
export const holdFor = (text: string) => {
  const words = text.trim().split(/\s+/).length;
  return words <= 2 ? 800 : Math.max(800, words * 300);
};
