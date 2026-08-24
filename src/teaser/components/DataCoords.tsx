import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {hash} from '../../lib/random';
import {MONO} from '../lib/fonts';
import {T} from '../lib/tokens';

/**
 * Scrolling telemetry behind the growth counter — the "matrix-style data
 * coordinates" of the reference, at 30% opacity.
 *
 * Values are hash-derived per row and re-roll on a slow clock, so the readout
 * looks like a live feed but renders identically every time.
 */

// Enough rows to cover 1920px at a 46px line box, plus the scroll overshoot.
const ROWS = 46;

const pad = (n: number, width: number): string => String(n).padStart(width, '0');

export const DataCoords: React.FC<{opacity?: number}> = ({opacity = 0.3}) => {
  const frame = useCurrentFrame();
  const scroll = (frame * 1.6) % 46;

  return (
    <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none', opacity}}>
      <div
        style={{
          position: 'absolute',
          top: -46,
          left: 0,
          right: 0,
          transform: `translate3d(0, ${scroll}px, 0)`,
          fontFamily: MONO,
          fontSize: 19,
          lineHeight: '46px',
          color: T.cyan,
          willChange: 'transform',
        }}
      >
        {new Array(ROWS).fill(0).map((_, i) => {
          const tick = Math.floor(frame / 6) + i;
          const x = Math.floor(hash(tick * 3.1) * 9999);
          const y = Math.floor(hash(tick * 5.7) * 9999);
          const d = Math.floor(hash(tick * 9.3) * 999);
          const ok = hash(tick * 13.7) > 0.22;

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 26,
                paddingLeft: 40,
                paddingRight: 40,
                justifyContent: 'space-between',
              }}
            >
              <span>{`X:${pad(x, 4)}  Y:${pad(y, 4)}`}</span>
              <span style={{color: T.purple}}>{`~${pad(d, 3)}`}</span>
              <span style={{color: ok ? T.cyan : T.purple}}>
                {ok ? 'RESOLVED' : 'PENDING…'}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
