import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {SLIDE_ICONS} from './icons';
import {INTER, SERIF} from '../lib/fonts';
import {EASE, N, PANEL_H, label, ui} from './tokens';

/**
 * PANEL 4 — "Any idea. Any deck."
 *
 * Nine slide-type glyphs on a 3-frame stagger (100ms, exactly as the reference
 * specifies). The stagger is the entire reason this reads as hand-animated
 * rather than templated — nine icons appearing together looks like a static
 * asset, nine arriving in sequence looks authored.
 *
 * Once they are all in, the whole grid takes a 2% scale pulse on a 90-frame
 * cycle so the panel never sits still, then they stagger back out for the loop.
 */

export const Panel4Grid: React.FC = () => {
  const frame = useCurrentFrame();

  // Grid-wide breath, period 90 — divides 360.
  const pulse = 1 + 0.02 * ((1 + Math.sin((frame / 90) * Math.PI * 2)) / 2);

  const capIn = interpolate(frame, [56, 78, 304, 326], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'relative', height: PANEL_H, overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <span
        style={{
          position: 'absolute', top: 52, left: 92,
          ...ui(34, N.text, 400), fontFamily: SERIF, opacity: capIn,
        }}
      >
        Any idea.
      </span>
      <span
        style={{
          position: 'absolute', bottom: 52, right: 92,
          ...ui(34, N.signal, 400), fontFamily: SERIF, opacity: capIn,
        }}
      >
        Any deck.
      </span>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 104px)',
          gridTemplateRows: 'repeat(3, 104px)',
          gap: 22,
          transform: `scale(${pulse})`,
          willChange: 'transform',
        }}
      >
        {SLIDE_ICONS.map((Icon, i) => {
          // 3 frames = 100ms at 30fps.
          const inStart = 10 + i * 3;
          const outStart = 306 + i * 2;
          const p = interpolate(
            frame,
            [inStart, inStart + 14, outStart, outStart + 12],
            [0, 1, 1, 0],
            {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE}
          );

          return (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 24,
                background: 'rgba(23,232,168,0.05)',
                border: `1px solid rgba(23,232,168,${0.10 + 0.14 * p})`,
                boxShadow: `0 0 ${20 * p}px rgba(23,232,168,0.16)`,
                opacity: p,
                transform: `scale(${0.76 + 0.24 * p})`,
                willChange: 'transform, opacity',
              }}
            >
              <Icon size={40} color={N.signal} sw={1.7} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
