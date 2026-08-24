import React from 'react';
import {AbsoluteFill} from 'remotion';

/**
 * Persistent layer (z 89, frames 0-600).
 *
 * A soft inner falloff that pulls the eye to center and keeps the emerald from
 * bleeding into the frame edges. Static by design — the motion in the frame
 * comes from the glow and the grain, not from the vignette.
 */
export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      boxShadow: 'inset 0 0 160px 50px rgba(0,0,0,0.6)',
      pointerEvents: 'none',
    }}
  />
);
