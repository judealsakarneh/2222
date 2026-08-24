import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {BED, CUES} from './cues';

/**
 * Wires the cue sheet to real audio files.
 *
 * DISABLED BY DEFAULT so the composition renders on a clean checkout —
 * `staticFile` on a missing file fails the render.
 *
 * To turn sound on:
 *   1. drop the files named in cues.ts into `public/audio/`
 *   2. render with <AudioDesign enabled /> in ZambleTeaser.tsx
 */
export const AudioDesign: React.FC<{enabled?: boolean}> = ({enabled = false}) => {
  if (!enabled) {
    return null;
  }

  return (
    <>
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
