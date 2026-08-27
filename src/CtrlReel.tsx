import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ARCHIVO} from './lib/fonts';
import {Field, Grain, Keyword, Lockup, Mark, Pulse, Slab, Sweep} from './reel/Layers';
import {C, DURATION} from './reel/tokens';

/**
 * CTRL Room — motion reel.
 * 1920x1080, 30fps, 150 frames (5.000s).
 *
 * Layer order is bottom-up, exactly as it is stacked in the AE project:
 *   01 FIELD      gradient background, drifting
 *   02 SWEEP      trim-path arc (under the type, so the type stays readable)
 *   03 PULSE      3 circles + 2 triangles, blurred fills, 20% strokes
 *   04 MARK       the glass slab brand reveal
 *   05 KEYWORD    per-character kinetic type
 *   06 LOCKUP     logo + tagline
 *   07 GRAIN      full-frame, always last
 */
export const CtrlReel: React.FC = () => (
  <AbsoluteFill style={{background: C.ink, fontFamily: ARCHIVO}}>
    <Field />
    <Sweep />
    <Pulse />
    <Mark />
    <Keyword />
    <Lockup />
    <Grain />
    {/* Final corner falloff, held to the last frame. */}
    <AbsoluteFill
      style={{boxShadow: 'inset 0 0 300px 110px rgba(0,0,0,0.5)', pointerEvents: 'none'}}
    />
  </AbsoluteFill>
);

export {DURATION as REEL_DURATION};
