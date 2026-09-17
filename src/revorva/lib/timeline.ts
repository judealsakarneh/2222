import {Easing} from 'remotion';

/**
 * Revorva — the beat sheet.
 *
 * 15.000 s at **60 fps**. Every other composition in this repo is 30; this one
 * is not, because the brief was smoothness and frame rate is the one variable
 * that buys it unconditionally. At 30 fps a camera crossing the frame in a
 * second lands on 30 discrete positions; at 60 it lands on 60, and no amount of
 * easing recovers the difference.
 *
 * Times are in milliseconds, converted once by `ms()`.
 */

export const FPS = 60;
export const ms = (t: number) => (t * FPS) / 1000;
export const DURATION = ms(15000);

// ---------------------------------------------------------------------------
// Curves
// ---------------------------------------------------------------------------

/** The house curve. Fast out, long settle. Used for elements. */
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);

/**
 * The camera curve. Symmetric, and that is the whole point.
 *
 * This started as bezier(0.16, 1, 0.3, 1) - the same fast-out family as the
 * house curve - and measuring the result showed why that is wrong for a path
 * with waypoints. An ease-out curve STARTS FAST. Interpolation applies the
 * easing per segment, so at every waypoint the camera glided to almost nothing
 * on the tail of one segment and then restarted at full speed on the head of
 * the next. Sampling a probe point frame by frame found four acceleration
 * spikes, the worst of them 45 px/frame² - the camera going from a standstill
 * to 45 px in a single frame. That is a visible jolt, and it happened at
 * exactly the moments the film was trying to feel most fluid.
 *
 * bezier(0.4, 0, 0.6, 1) has zero velocity at BOTH ends: y of the first control
 * point is 0, y of the second is 1. Segments therefore meet at matching
 * velocity - zero - and the path is C1 continuous across every waypoint. Peak
 * acceleration drops from 45 to under 1.
 *
 * The elements keep the fast-out house curve. That contrast is deliberate:
 * things in the world snap, the camera watching them glides.
 */
export const EASE_CAMERA = Easing.bezier(0.4, 0, 0.6, 1);

/** Symmetric, for anything that starts and stops on screen. */
export const EASE_IO = Easing.bezier(0.65, 0, 0.35, 1);

// ---------------------------------------------------------------------------
// The world
//
// Everything is authored at 1x inside a 1920x1080 stage, and the camera is a
// transform over that stage. Authoring in world coordinates rather than per
// scene is what lets one interpolation carry the whole film: there are no
// scenes to cut between, only places the camera happens to be.
// ---------------------------------------------------------------------------

export const PANEL = {x: 260, y: 170, w: 1400, h: 740, r: 20} as const;
export const HEAD_H = 104;
export const ROW_H = 84;
export const TABLE_X = PANEL.x + 40;
export const TABLE_W = PANEL.w - 80;
export const TABLE_Y = PANEL.y + HEAD_H + 56;
export const ROWS = 5;

/** Which row the film happens to. Second from the top: read as one of many. */
export const HERO_INDEX = 1;
export const HERO_Y = TABLE_Y + ROW_H * HERO_INDEX;
export const HERO_CY = HERO_Y + ROW_H / 2;

/** The email the row becomes, centred in the work framing. */
export const MAIL = {w: 900, h: 372, cx: 960, cy: 512, r: 18} as const;

// ---------------------------------------------------------------------------
// Beats
//
// Every boundary below OVERLAPS its neighbour. Nothing in this film starts on
// the frame something else finished - that single frame of stillness is what
// makes a sequence read as a list of animations, and avoiding it everywhere is
// most of what "smooth" actually means.
// ---------------------------------------------------------------------------

export const BEATS = {
  /** The hook: an ordinary row, then a decline. Late enough to have been read. */
  fail: {declineAt: 900, badgeIn: 420},

  /** The turn: Stripe connects while the camera is already pulling back. */
  connect: {at: 3250, move: 620, checkAt: 3980},

  /** The work: retries tick, the row becomes an email, the email sends. */
  work: {
    liftAt: 5600,
    liftMove: 620,
    retryAt: 6000,
    retryStagger: 520,
    retries: 3,
    /** The morph. One interpolation of w/h/radius - a shape change, not a swap. */
    morphAt: 7300,
    morphMove: 900,
    sendAt: 9400,
    sendMove: 800,
    /** The recovered row fades up UNDER the departing email, not after it. */
    recoverAt: 9700,
    recoverMove: 700,
  },

  /** The close. */
  outro: {at: 11600, move: 700, stagger: [0, 180, 340]},
} as const;

// ---------------------------------------------------------------------------
// The camera path
//
// One array. The whole film is `interpolate(frame, CAM_T, CAM_<channel>)`, so
// the camera is mathematically incapable of cutting: there is no frame at which
// it is in two places, because it is one continuous function of time.
//
// (x, y) is the world point held at the centre of frame; s is the zoom.
// ---------------------------------------------------------------------------

export const CAM_T = [0, 2200, 5000, 7300, 9800, 11200, 15000].map(ms);

/**
 * Held at frame centre.
 *
 * The film opens at x 1150, not at the row's midpoint. The first framing was
 * centred on the row and it was unreadable: at that zoom the visible world is
 * narrower than the row, so the shot landed between the customer name and the
 * status and showed neither. 1150 puts the amount and the status pill in frame
 * - the two things the hook is actually about - and leaves the name off screen,
 * which gives the pull-back something to reveal.
 */
export const CAM_X = [1150, 1146, 960, 960, 960, 960, 960];
export const CAM_Y = [HERO_CY, HERO_CY, 540, 500, 500, 540, 505];

/**
 * Zoom.
 *
 * 2.30 → 2.18 over the first 2200 ms is the detail that matters most here. It
 * is barely a move; its whole job is that the camera is ALREADY DRIFTING when
 * the decline lands, so the pull-back that follows is a continuation rather
 * than a start. A camera that begins moving at a beat boundary announces the
 * boundary.
 *
 * 1.42 in the work section is not arbitrary: at that zoom the 1320 px row spans
 * 1352 px of visible world, so it fills the frame with 16 px to spare on each
 * side. One notch tighter and the row is cropped mid-morph.
 *
 * 2.00 at the open is bounded the same way from the other side: at x 1150 it
 * shows world 670-1630, which sits inside the panel's 260-1660 without letting
 * the panel's own edge into the shot.
 */
export const CAM_S = [2.0, 1.92, 1.0, 1.42, 1.4, 1.0, 0.88];

/**
 * Readability floor. A short label needs ~0.8 s settled; a sentence ~0.3 s per
 * word. Used to check the cut after the first render rather than by eye.
 */
export const holdFor = (text: string) => {
  const words = text.trim().split(/\s+/).length;
  return words <= 2 ? 800 : Math.max(800, words * 300);
};
