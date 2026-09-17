import {interpolate} from 'remotion';
import {BEATS, EASE} from './timeline';

/**
 * Every progression in the film, derived once from the frame.
 *
 * These were originally recomputed inside each component, which worked right up
 * until the table needed to know how far the morph had got in order to dim for
 * it. Three components each holding their own copy of "how far through the
 * morph are we" is three chances for them to disagree by a frame, and a single
 * frame of disagreement between an element and the thing reacting to it is
 * exactly the stutter this film is trying not to have.
 */
export type Progress = {
  /** 0 → 1 as the decline lands. */
  failed: number;
  /** 0 → 1 as the row rises off the table. */
  lift: number;
  /** 0 → 1 → 0. Out to the email, then back to the row. */
  morph: number;
  /** 0 → 1 as the email leaves upward. */
  send: number;
  /** 0 → 1 as the recovered state arrives. */
  recovered: number;
  /** 0 → 1 as the dashboard recedes for the close. */
  recede: number;
};

export const progressAt = (frame: number): Progress => {
  const t = (frame / 60) * 1000;
  const W = BEATS.work;
  const at = (from: number, dur: number) =>
    interpolate(t, [from, from + dur], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: EASE,
    });

  const recovered = at(W.recoverAt, W.recoverMove);
  // The morph runs back down rather than snapping home, which is why the
  // recovered row does not appear from nowhere: it is the same object arriving
  // back at the shape it started in.
  const morph = at(W.morphAt, W.morphMove) * (1 - recovered);

  return {
    failed: at(BEATS.fail.declineAt, BEATS.fail.badgeIn),
    lift: at(W.liftAt, W.liftMove),
    morph,
    send: at(W.sendAt, W.sendMove),
    recovered,
    recede: at(BEATS.outro.at, 900),
  };
};
