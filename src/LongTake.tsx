import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Station} from './longtake/components/Station';
import {ParticleField} from './longtake/components/ParticleField';
import {SpeedFx} from './longtake/components/SpeedFx';
import {StHook} from './longtake/stations/StHook';
import {StVoice} from './longtake/stations/StVoice';
import {StTranscript} from './longtake/stations/StTranscript';
import {StResearch} from './longtake/stations/StResearch';
import {StOutline} from './longtake/stations/StOutline';
import {StDeck} from './longtake/stations/StDeck';
import {StMetric} from './longtake/stations/StMetric';
import {StCta} from './longtake/stations/StCta';
import {AudioDesign} from './longtake/audio/AudioDesign';
import {PERSPECTIVE, speedNorm} from './longtake/lib/camera';
import {INTER} from './lib/fonts';
import {EASE, L} from './longtake/lib/tokens';

/**
 * zamble — "The Long Take"
 * 1080x1920, 30fps, 900 frames (30.0s)
 *
 * THE IDEA: there are no cuts. Not one. The entire film is a single unbroken
 * camera move through one 3D world, flying THROUGH eight stations that sit at
 * fixed depths along the Z axis.
 *
 * Everything on screen derives from a single continuous quantity — the camera
 * position `cameraZ(frame)` — or from its derivative:
 *
 *   which station is visible   <- depth relative to camera
 *   depth of field             <- depth relative to camera
 *   atmospheric fade           <- depth relative to camera
 *   particle positions         <- depth relative to camera
 *   speed streaks              <- camera velocity
 *   lens fringing              <- camera velocity
 *
 * Because it all comes from one function, none of it can drift out of sync with
 * the rest. That coupling is the whole reason the piece feels smooth — it isn't
 * a set of animations timed to agree with each other, it is one move that
 * everything else is a consequence of.
 *
 * The camera also never fully stops. At each station it decelerates into a slow
 * forward drift while you read, then accelerates away. A camera that halts
 * completely is just a cut with extra steps.
 *
 * TIMELINE (arrive / hold)
 *   000  55   the hook          "Everyone has the idea."
 *   105  75   voice capture     radial waveform aperture
 *   230  85   transcript        typing + entities lifting into chips
 *   355  95   research          source graph wires itself up
 *   500  85   outline           six slide titles rule themselves in
 *   630  80   the deck          fourteen slides as a breathing 3D wall
 *   745  70   the metric        a bar collapsing to 2.4% of its width
 *   855  45   CTA               mark draws, button lands, still drifting
 */
export const LongTake: React.FC = () => {
  const frame = useCurrentFrame();
  const v = speedNorm(frame);

  // A whisper of exposure lift under speed, like a lens opening up.
  const exposure = 1 + v * 0.06;

  // Open from black. The only fade in the film, and it is over by frame 20.
  const openFade = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  return (
    <AbsoluteFill style={{background: L.void, fontFamily: INTER}}>
      {/* Cold depth haze so the far plane never reads as flat black. */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 46%, #0B1520 0%, #070C13 45%, #04060A 100%)',
        }}
      />

      <AbsoluteFill style={{opacity: openFade, filter: `brightness(${exposure})`}}>
        {/* THE WORLD. One perspective, one preserve-3d rig, eight stations at
            fixed depths, and a particle field threaded through all of them. */}
        <AbsoluteFill
          style={{perspective: PERSPECTIVE, perspectiveOrigin: '50% 50%'}}
        >
          <AbsoluteFill style={{transformStyle: 'preserve-3d'}}>
            <ParticleField />

            <Station index={0}>
              <StHook />
            </Station>
            <Station index={1}>
              <StVoice />
            </Station>
            <Station index={2}>
              <StTranscript />
            </Station>
            <Station index={3}>
              <StResearch />
            </Station>
            <Station index={4}>
              <StOutline />
            </Station>
            <Station index={5}>
              <StDeck />
            </Station>
            <Station index={6}>
              <StMetric />
            </Station>
            <Station index={7}>
              <StCta />
            </Station>
          </AbsoluteFill>
        </AbsoluteFill>

        <SpeedFx />
      </AbsoluteFill>

      {/* Vignette */}
      <AbsoluteFill
        style={{
          boxShadow: 'inset 0 0 200px 60px rgba(0,0,0,0.72)',
          pointerEvents: 'none',
        }}
      />

      <AudioDesign />
    </AbsoluteFill>
  );
};
