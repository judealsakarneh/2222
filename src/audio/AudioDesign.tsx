import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {BED, CUES} from './cues';

/**
 * Wires the cue sheet to real audio files.
 *
 * DISABLED BY DEFAULT so the composition renders on a clean checkout with no
 * assets present — `staticFile` on a missing file would fail the render.
 *
 * To turn sound on:
 *   1. drop the files named in cues.ts into `public/audio/`
 *   2. render with <AudioDesign enabled /> in RambleAd.tsx
 *
 * Every cue is frame-exact against the picture edit; see cues.ts for the layer
 * stack each impact should be built from.
 */
export const AudioDesign: React.FC<{enabled?: boolean}> = ({enabled = false}) => {
  if (!enabled) {
    return null;
  }

  return (
    <>
      {/* Constant low drone under the whole film. */}
      <Audio src={staticFile(`audio/${BED.file}`)} volume={BED.volume} loop />

      {CUES.map((cue) => (
        <Sequence
          key={cue.id}
          from={cue.frame}
          durationInFrames={cue.durationInFrames}
          name={`SFX ${cue.id}`}
        >
          <Audio src={staticFile(`audio/${cue.file}`)} volume={cue.volume} />
        </Sequence>
      ))}
    </>
  );
};
