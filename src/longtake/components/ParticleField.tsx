import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {hash} from '../../lib/random';
import {cameraZAt, depthBlur, depthOpacity, depthScale} from '../lib/camera';
import {L} from '../lib/tokens';

/**
 * The 3D particle field the camera flies through.
 *
 * This is not decoration — it is the load-bearing element of the whole piece.
 * Between stations there is nothing else on screen, so without particles the
 * camera move is invisible and the film reads as a sequence of fades. With them
 * you feel every unit of travel.
 *
 * Particles live on a repeating depth slab of length `DEPTH`. Rather than
 * mutating state (impossible — Remotion renders frames out of order), each
 * particle's depth is derived by wrapping the camera position into the slab, and
 * its lap number reseeds its x/y. So a particle that passes the lens comes back
 * as a genuinely different particle, deterministically.
 */

const COUNT = 90;
const DEPTH = 4200;
/** Half-width of the spawn box in world units at the screen plane. */
const SPREAD_X = 1500;
const SPREAD_Y = 2400;

export const ParticleField: React.FC = () => {
  const frame = useCurrentFrame();
  const camZ = cameraZAt(frame);

  return (
    <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>
      {new Array(COUNT).fill(0).map((_, i) => {
        const base = hash(i * 2.7) * DEPTH;

        // Wrap into [-DEPTH, 0): approaches the lens as the camera advances.
        const raw = camZ - base;
        const lap = Math.floor(raw / DEPTH);
        const tz = (raw - lap * DEPTH) - DEPTH;

        const opacity = depthOpacity(tz);
        if (opacity <= 0.01) return null;

        // Reseeded every lap so recycled particles are not visibly the same one.
        const seed = i * 131 + lap * 997;
        const wx = (hash(seed * 1.3) - 0.5) * 2 * SPREAD_X;
        const wy = (hash(seed * 3.9) - 0.5) * 2 * SPREAD_Y;

        // Perspective projection is handled by the browser via translateZ, so we
        // only need world-space offsets here.
        const size = 2 + hash(seed * 5.1) * 3.5;
        const isSignal = hash(seed * 7.3) > 0.88;
        const blur = depthBlur(tz);

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: size,
              height: size,
              marginLeft: -size / 2,
              marginTop: -size / 2,
              borderRadius: '50%',
              background: isSignal ? L.signal : L.ice,
              boxShadow: `0 0 ${size * 3}px ${isSignal ? L.signal : L.ice}`,
              opacity: opacity * (isSignal ? 0.85 : 0.5),
              transform: `translate3d(${wx}px, ${wy}px, ${tz}px)`,
              filter: blur > 0.5 ? `blur(${Math.min(blur, 6)}px)` : undefined,
              willChange: 'transform, opacity',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Exported for the streak layer, which mirrors the particle projection. */
export const PARTICLE_CONSTANTS = {COUNT, DEPTH, SPREAD_X, SPREAD_Y, depthScale};
