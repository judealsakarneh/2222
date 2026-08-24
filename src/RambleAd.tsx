import React from 'react';
import {AbsoluteFill} from 'remotion';
import {AmbientGlow} from './components/AmbientGlow';
import {Grain} from './components/Grain';
import {Vignette} from './components/Vignette';
import {AudioDesign} from './audio/AudioDesign';
import {Scene01Mark} from './scenes/Scene01Mark';
import {Scene02Line1} from './scenes/Scene02Line1';
import {Scene03Line2} from './scenes/Scene03Line2';
import {Scene04Voice} from './scenes/Scene04Voice';
import {Scene05Research} from './scenes/Scene05Research';
import {Scene06Deck} from './scenes/Scene06Deck';
import {Scene07Payoff} from './scenes/Scene07Payoff';
import {Scene08Cta} from './scenes/Scene08Cta';
import {INTER} from './lib/fonts';
import {C} from './lib/tokens';

/**
 * ramble. — product film
 * 1080x1920, 30fps, 600 frames (20.0s)
 *
 * LAYER STACK (bottom to top):
 *   0   base            #060A08 with a soft vertical falloff
 *   0   ambient glow    breathes + drifts, never static
 *   1   scenes 1-8      absolutely timed, deliberately overlapping
 *   89  vignette        pulls focus to centre
 *   90  film grain      re-randomised every 4 frames
 *       audio           off by default, see audio/AudioDesign.tsx
 *
 * Scenes are NOT wrapped in <Sequence>. Each one reads absolute frame numbers
 * and mounts 6 frames before its nominal start (see components/SceneShell), so
 * every cut is an overlap rather than a hard switch and no frame is ever empty.
 *
 * TIMELINE
 *   000-066  cold open, the mark draws on
 *   066-118  "You know the idea cold."
 *   118-172  "You just never sit down / and build the deck."
 *   172-286  voice capture — waveform + live transcript
 *   286-372  research streaming — four rows complete in sequence
 *   372-486  the deck assembles in 3D, then the camera flies through it
 *   486-540  the payoff — 47s, counted up
 *   540-600  CTA
 */
export const RambleAd: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: C.bgDeep, fontFamily: INTER}}>
      {/* Base — a touch of vertical falloff so the field is never a flat fill. */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, #080D0B 0%, #060A08 55%, #040706 100%)',
        }}
      />

      <AmbientGlow />

      <Scene01Mark />
      <Scene02Line1 />
      <Scene03Line2 />
      <Scene04Voice />
      <Scene05Research />
      <Scene06Deck />
      <Scene07Payoff />
      <Scene08Cta />

      <Vignette />
      <Grain />

      <AudioDesign />
    </AbsoluteFill>
  );
};
