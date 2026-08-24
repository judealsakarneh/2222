import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {hash} from '../../lib/random';
import {T} from '../lib/tokens';

/**
 * Thin wireframe grid + floating data points over the montage.
 *
 * The grid rotates on a slow 4-second cycle and the points drift on independent
 * hash-derived paths, so the overlay never lines up the same way twice across
 * the montage's eight hard cuts — which is what stops the cuts from feeling like
 * a slideshow of unrelated stills.
 */

const POINTS = 14;

export const WireframeGrid: React.FC<{opacity?: number}> = ({opacity = 1}) => {
  const frame = useCurrentFrame();
  const rotate = (frame / 120) * 360; // 360deg over 4s, linear

  return (
    <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none', opacity}}>
      {/* Rotating perspective grid, oversized so its corners never enter frame. */}
      <AbsoluteFill
        style={{
          transform: `rotate(${rotate}deg)`,
          willChange: 'transform',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '-50%',
            top: '-50%',
            width: '200%',
            height: '200%',
            backgroundImage: `
              linear-gradient(rgba(0,255,204,0.14) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,204,0.14) 1px, transparent 1px)
            `,
            backgroundSize: '92px 92px',
          }}
        />
      </AbsoluteFill>

      {/* Floating data points with readouts. */}
      {new Array(POINTS).fill(0).map((_, i) => {
        const speed = 0.4 + hash(i * 4.4) * 0.9;
        const px = (hash(i * 2.2) * 100 + frame * speed * 0.35) % 108 - 4;
        const py = (hash(i * 6.6) * 100 - frame * speed * 0.22 + 200) % 108 - 4;
        const live = hash(i * 8.8) > 0.5;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${px}%`,
              top: `${py}%`,
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: live ? T.cyan : T.purple,
              boxShadow: `0 0 10px ${live ? T.cyan : T.purple}`,
              opacity: 0.75,
              willChange: 'transform',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
