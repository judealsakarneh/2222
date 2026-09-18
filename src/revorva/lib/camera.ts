import {interpolate} from 'remotion';
import {CAM_S, CAM_T, CAM_X, CAM_Y, EASE_CAMERA} from './timeline';

export type Cam = {x: number; y: number; s: number};

/**
 * Where the camera is at a given frame.
 *
 * Pure, and deliberately callable at any frame including fractional and
 * negative ones - the motion blur below needs the previous frame, and a camera
 * that can only report "now" cannot be differentiated.
 */
export const cameraAt = (frame: number): Cam => {
  const opts = {
    extrapolateLeft: 'clamp' as const,
    extrapolateRight: 'clamp' as const,
    easing: EASE_CAMERA,
  };
  return {
    x: interpolate(frame, CAM_T, CAM_X, opts),
    y: interpolate(frame, CAM_T, CAM_Y, opts),
    s: interpolate(frame, CAM_T, CAM_S, opts),
  };
};

/**
 * The CSS transform that puts world point (x, y) at the centre of a 1920x1080
 * frame at zoom s. transformOrigin must be '0 0' for this to hold.
 */
export const cameraTransform = (c: Cam) =>
  `translate(${960 - c.x * c.s}px, ${540 - c.y * c.s}px) scale(${c.s})`;

/**
 * Velocity-derived motion blur.
 *
 * This is the part that does the most work for the least code. A 60 fps camera
 * move is already smooth; what still reads as digital is that every frame is
 * perfectly sharp, which no real lens ever is. Blurring in proportion to how
 * fast the frame is actually moving restores the one cue the eye is looking for.
 *
 * The speed is measured, not guessed: sample the transform now and one frame
 * ago, and take how far a point at the edge of frame travelled between them.
 * That captures zoom as well as pan, which matters here because most of this
 * film's movement is zoom and a pan-only measure would report almost nothing.
 *
 * Capped at 8 px, raised from 5 with the faster cut: the camera now covers the
 * same ground in two thirds of the time, so the same cap was clipping the peaks
 * off exactly the moves that most needed the cue. Past 8 it stops reading as a
 * lens and starts reading as a blur filter, which is worse than no blur at all.
 */
export const cameraBlur = (frame: number): number => {
  if (frame <= 0) return 0;
  const a = cameraAt(frame - 1);
  const b = cameraAt(frame);

  // A probe point at the top-left of frame, in world space, projected through
  // both cameras. The corner moves further than the centre under zoom, which is
  // exactly the motion the eye notices.
  const probe = {x: 200, y: 120};
  const pa = {x: 960 - a.x * a.s + probe.x * a.s, y: 540 - a.y * a.s + probe.y * a.s};
  const pb = {x: 960 - b.x * b.s + probe.x * b.s, y: 540 - b.y * b.s + probe.y * b.s};

  const speed = Math.hypot(pb.x - pa.x, pb.y - pa.y); // px per frame
  // 8 px/frame of corner travel earns 1 px of blur. Tuned against the render,
  // not derived: below this the blur is invisible, above it the type softens.
  return Math.min(8, speed / 8);
};
