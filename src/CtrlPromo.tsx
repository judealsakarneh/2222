import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {ARCHIVO} from './lib/fonts';
import {Grain, Ground, Progress, StatusBar} from './ctrl/components/Chrome';
import {EndCard, Hook, Membership, Pillars, Scale, Turn} from './ctrl/scenes/Scenes';
import {DURATION, EASE, S, act} from './ctrl/lib/tokens';

/**
 * CTRL Room — "Jordan, switched on."
 * 1080x1920, 30fps, 720 frames (24.0s).
 *
 * Built vertical because Instagram is the brand's distribution channel, and
 * timed to the two things the research is unambiguous about: a reel is decided
 * inside the first 1.5 seconds, and roughly 85% of them are watched with the
 * sound off. So the first question is legible at frame 4, every beat is carried
 * by on-screen type, and the whole thing lands at 24s — inside the 21-34s band
 * where business reels still get finished.
 *
 * STRUCTURE — problem, answer, value, product, proof, action:
 *   0.0-3.2   HOOK        three questions the audience already asks
 *   3.2-6.2   TURN        they resolve into one answer; the mark lands
 *   6.2-11.6  PILLARS     the five formats, arriving like entries on a monitor
 *  11.6-17.0  MEMBERSHIP  the act turns light; the card is handed over
 *  17.0-20.2  SCALE       three figures, counted not cut
 *  20.2-24.0  END CARD    tagline, mark, one action
 *
 * THE ACT CROSSFADE is the film's through-line and it is shared with the
 * website: one ground whose colour is a function of the frame, easing dark to
 * light and back. Nothing cuts. See lib/tokens.ts.
 *
 * SCENE OVERLAP: each scene mounts 12 frames before its own start so its
 * content is already assembling as the previous one clears. Content whose
 * animation begins on its own first frame renders as an empty hole for the
 * whole handover — the single most common way a sequence like this reads
 * "broken" rather than "fast".
 */

const SCENES = [
  {C: Hook, ...S.hook},
  {C: Turn, ...S.turn},
  {C: Pillars, ...S.pillars},
  {C: Membership, ...S.card},
  {C: Scale, ...S.scale},
  {C: EndCard, ...S.end},
];

const LEAD = 12;
const TAIL = 10;

export const CtrlPromo: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{fontFamily: ARCHIVO}}>
      <Ground />

      {SCENES.map(({C: Scene, from, to}, i) => {
        if (frame < from - LEAD || frame > to + TAIL) return null;
        // A short scale settle on entry and release on exit. Small — 1.5% — so
        // it registers as the frame breathing rather than as a zoom.
        const enter = interpolate(frame, [from - LEAD, from + 6], [0.985, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EASE,
        });
        const leave = interpolate(frame, [to - 8, to + TAIL], [1, 1.015], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EASE,
        });
        const fade = interpolate(frame, [to, to + TAIL], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <AbsoluteFill
            key={i}
            style={{transform: `scale(${enter * leave})`, opacity: fade}}
          >
            <Scene />
          </AbsoluteFill>
        );
      })}

      <StatusBar />
      <Progress />
      <Grain />

      {/* Corner falloff — keeps the eye in the middle third, which is where a
          phone actually gets looked at. It fades out with the light act: the
          same falloff that reads as depth on near-black reads as grime on
          paper. */}
      <AbsoluteFill
        style={{
          boxShadow: 'inset 0 0 260px 90px rgba(0,0,0,0.42)',
          opacity: 1 - act(frame),
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

export {DURATION as CTRL_DURATION};
