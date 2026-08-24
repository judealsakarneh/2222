import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

/**
 * Persistent layer (z 0, frames 0-600).
 *
 * A 640px emerald bloom sitting behind everything. It breathes (scale
 * 1.0 -> 1.15 on a 180-frame sine loop) and drifts (x 0 -> 26, y 0 -> -18 on a
 * 270-frame sine loop). The two periods are deliberately coprime-ish so the
 * combined motion never visibly repeats inside 600 frames.
 *
 * This layer is why no frame of the film is ever completely still.
 */

const BREATHE_PERIOD = 180;
const DRIFT_PERIOD = 270;

/** 0 -> 1 -> 0 over one period, with zero derivative at the seam so it loops cleanly. */
const sineLoop = (frame: number, period: number): number =>
  (1 - Math.cos((frame / period) * Math.PI * 2)) / 2;

export const AmbientGlow: React.FC = () => {
  const frame = useCurrentFrame();

  const scale = 1 + 0.15 * sineLoop(frame, BREATHE_PERIOD);
  const driftT = sineLoop(frame, DRIFT_PERIOD);
  const x = 26 * driftT;
  const y = -18 * driftT;

  return (
    <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '38%',
          width: 640,
          height: 640,
          marginLeft: -320,
          marginTop: -320,
          borderRadius: '50%',
          // Many stops with a long tail: a short gradient leaves a visible disc
          // edge where it terminates, which instantly reads as a shape rather
          // than as light in the room.
          background:
            'radial-gradient(circle, rgba(23,232,168,0.20) 0%, rgba(23,232,168,0.13) 22%, rgba(23,232,168,0.075) 40%, rgba(23,232,168,0.035) 56%, rgba(23,232,168,0.014) 70%, rgba(23,232,168,0.004) 84%, rgba(23,232,168,0) 100%)',
          filter: 'blur(40px)',
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
          willChange: 'transform',
        }}
      />
    </AbsoluteFill>
  );
};
