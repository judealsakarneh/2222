import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Panel1Voice} from './quad/Panel1Voice';
import {Panel2Mark} from './quad/Panel2Mark';
import {Panel3Type} from './quad/Panel3Type';
import {Panel4Grid} from './quad/Panel4Grid';
import {INTER} from './lib/fonts';
import {N, PANEL_H} from './quad/tokens';

/**
 * zamble — "Quad"
 * 1080x1920, 30fps, 360 frames (12.0s) — AND IT LOOPS SEAMLESSLY.
 *
 * A different structure to everything else in this repo: four panels stacked in
 * one locked frame, all running at once. No camera moves, no transitions, no
 * scene changes — every bit of motion happens inside the frame. That constraint
 * is the format's whole appeal: it shows four capabilities in the time it takes
 * to show one.
 *
 * THE LOOP IS THE FLEX. Frame 359 hands to frame 0 with no visible seam, so it
 * can be posted as an infinite loop. That is not free — it dictated every timing
 * decision in the film:
 *
 *   - the level meter's two sine terms use periods of 90 and 120 frames, both
 *     divisors of 360, so the waveform is continuous across the seam
 *   - the mark RETRACTS back along its own path instead of cutting or fading,
 *     so both ends of the loop are an empty canvas
 *   - the mark's blink (72) and breath (120) cycles are divisors too
 *   - the prompt bar runs three phrases on exactly 120 frames each
 *   - the icon grid staggers in, breathes on a 90-frame cycle, and staggers back
 *     out before the end
 *
 * Every motion uses cubic-bezier(0.22, 1, 0.36, 1) — fast start, long settle.
 * Nothing linear, nothing robotic.
 *
 * PANELS
 *   1  Just talk.        live level meter
 *   2  zamble            the mark drawing and un-drawing itself
 *   3  the prompt bar    three phrases, typed and erased, never cut
 *   4  Any idea.        nine slide types on a 100ms stagger
 *      Any deck.
 */

const PANELS = [Panel1Voice, Panel2Mark, Panel3Type, Panel4Grid];

export const ZambleQuad: React.FC = () => {
  const frame = useCurrentFrame();

  // A single emerald bloom drifting behind all four panels, on a 360-frame
  // cycle so it too returns exactly to where it started.
  const driftY = Math.sin((frame / 360) * Math.PI * 2) * 60;
  const bloom = 0.85 + 0.15 * ((1 + Math.cos((frame / 180) * Math.PI * 2)) / 2);

  return (
    <AbsoluteFill style={{background: N.bgDeep, fontFamily: INTER}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 45% at 50% 50%, #101A21 0%, ${N.bg} 55%, ${N.bgDeep} 100%)`,
        }}
      />
      <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>
        <div
          style={{
            position: 'absolute',
            left: '50%', top: '50%',
            width: 1100, height: 1100,
            marginLeft: -550, marginTop: -550,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(23,232,168,0.10) 0%, rgba(23,232,168,0.03) 45%, rgba(7,12,16,0) 72%)',
            filter: 'blur(50px)',
            transform: `translateY(${driftY}px) scale(${bloom})`,
            willChange: 'transform',
          }}
        />
      </AbsoluteFill>

      {/* Four locked panels. */}
      <AbsoluteFill>
        {PANELS.map((P, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: i * PANEL_H,
              left: 0,
              right: 0,
              height: PANEL_H,
              // Hairline rules between panels — structure, and they make the
              // four-up read as one deliberate layout rather than a stack.
              borderTop: i === 0 ? 'none' : `1px solid ${N.line}`,
            }}
          >
            <P />
          </div>
        ))}
      </AbsoluteFill>

      {/* Corner falloff */}
      <AbsoluteFill
        style={{
          boxShadow: 'inset 0 0 200px 60px rgba(0,0,0,0.55)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
