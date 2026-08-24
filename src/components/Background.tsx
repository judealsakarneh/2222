import React from 'react';
import {AbsoluteFill} from 'remotion';

// #0b0b0e base with a subtle center-weighted radial gradient plus a faint
// violet glow lifted from the bottom, so the frame never reads as flat.
export const Background: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#0b0b0e'}}>
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(circle at 50% 38%, #18181f 0%, #101014 45%, #0b0b0e 100%)',
      }}
    />
    <AbsoluteFill
      style={{
        backgroundImage:
          'radial-gradient(circle at 50% 100%, rgba(139,92,246,0.06), transparent 55%)',
      }}
    />
  </AbsoluteFill>
);
