import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

/**
 * CRT scanlines at 5%, plus a bright band that sweeps down the frame every 3
 * seconds. The sweep is what sells it as a live display rather than a texture.
 */
export const Scanlines: React.FC = () => {
  const frame = useCurrentFrame();

  // Lines drift one pixel per frame so they shimmer instead of sitting still.
  const offset = frame % 4;
  const sweepY = ((frame % 90) / 90) * 140 - 20;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill
        style={{
          backgroundImage:
            'repeating-linear-gradient(180deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 4px)',
          transform: `translate3d(0, ${offset}px, 0)`,
          willChange: 'transform',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: `${sweepY}%`,
          height: '18%',
          background:
            'linear-gradient(180deg, rgba(0,255,204,0) 0%, rgba(0,255,204,0.05) 50%, rgba(0,255,204,0) 100%)',
          willChange: 'transform',
        }}
      />
    </AbsoluteFill>
  );
};
