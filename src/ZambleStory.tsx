import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Transition} from './story/components/Transition';
import {S1Type} from './story/scenes/S1Type';
import {S2Understand} from './story/scenes/S2Understand';
import {S3Slide} from './story/scenes/S3Slide';
import {S4Payoff} from './story/scenes/S4Payoff';
import {S5Cta} from './story/scenes/S5Cta';
import {stateAt} from './story/lib/timeline';
import {INTER} from './lib/fonts';
import {EASE, N} from './story/lib/tokens';

/**
 * zamble — "Story"
 * 1920x1080, 30fps, 690 frames (23.0s)
 *
 * A rebuild of the screen film around two notes: it was too fast to read, and
 * every scene carried too much.
 *
 * WHAT CHANGED
 *
 *   Pacing. Five scenes instead of six, every hold at least three seconds, every
 *   transition 24 frames instead of 12-18. The payoff number counts up and then
 *   simply sits there for two seconds, because a number nobody has time to read
 *   is decoration, not a claim.
 *
 *   Density. One idea per scene. The deck grid of fourteen unreadable thumbnails
 *   is gone — a single slide at full size makes the same point and can actually
 *   be taken in.
 *
 *   Two worlds. Night for the product at work, cream paper for the moments of
 *   understanding, alternating N-P-N-P-N. The light scenes are the film's breath;
 *   an all-dark piece has nowhere for the eye to rest. The paper palette is
 *   lifted from the brand sketches.
 *
 *   Shape-driven transitions, not page flips:
 *     150  ZOOM      the camera pushes THROUGH the phrase being typed and comes
 *                    out the other side on paper
 *     330  GROW      the dot the mark's line resolves into swells until it IS the
 *                    next scene — colour first, then its content materialises
 *     480  PUSH      a sheet of paper slides up over the night scene
 *     600  COLLAPSE  the paper world shrinks to a point, and the point is the mark
 *
 * Every scene owns an opaque background, so the outgoing scene is genuinely
 * occluded rather than showing through the incoming one.
 */

const SCENE_COMPONENTS = [S1Type, S2Understand, S3Slide, S4Payoff, S5Cta];

const renderScene = (i: number): React.ReactNode => {
  const C = SCENE_COMPONENTS[i];
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <C />
    </div>
  );
};

export const ZambleStory: React.FC = () => {
  const frame = useCurrentFrame();
  const state = stateAt(frame);

  const openFade = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  return (
    <AbsoluteFill style={{background: N.bgDeep, fontFamily: INTER}}>
      <AbsoluteFill style={{opacity: openFade}}>
        {state.kind === 'scene' ? (
          renderScene(state.index)
        ) : (
          <Transition
            kind={state.via}
            progress={state.progress}
            spec={state.spec}
            outgoing={renderScene(state.from)}
            incoming={renderScene(state.to)}
          />
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
