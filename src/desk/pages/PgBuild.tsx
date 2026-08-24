import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {hash} from '../../lib/random';
import {CARD, D, EASE, label, ui} from '../lib/tokens';

/**
 * PAGE 3 — Building. Frames 186-276.
 *
 * Fourteen slide thumbnails populate a grid, 4 frames apart. Card 03 "Market
 * size" is the hero and lights up in the brand colour — it sits at 37% / 29% of
 * the body, which is exactly where the iris out of this page opens from, and it
 * is the slide the next page shows. The eye is already looking at the right
 * thing when the transition starts.
 */

const A = 186;
const TOTAL = 14;

const TITLES = [
  'Problem', 'Why now', 'Market size', 'Product', 'How it works', 'Traction',
  'Business model', 'Pricing', 'Competition', 'Go-to-market', 'Roadmap',
  'Team', 'The ask', 'Appendix',
];

export const PgBuild: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - A;

  const built = Math.min(
    TOTAL,
    Math.floor(interpolate(local, [-14, 44], [0, TOTAL], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }))
  );

  return (
    <div style={{position: 'absolute', inset: 0, padding: '44px 110px', display: 'flex', flexDirection: 'column'}}>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 28}}>
        <span style={{...ui(46, D.signal, 700)}}>{built}</span>
        <span style={{...label(D.mute, 17)}}>of {TOTAL} slides built</span>
      </div>
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gridAutoRows: 300,
          gap: 22,
          alignContent: 'start',
        }}
      >
        {new Array(TOTAL).fill(0).map((_, i) => {
          const start = -18 + i * 4;
          const p = interpolate(local, [start, start + 16], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: EASE,
          });
          if (p <= 0) return null;
          const isHero = i === 2; // 'Market size' — the slide the iris opens onto next

          return (
            <div
              key={i}
              style={{
                ...CARD,
                padding: 22,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                opacity: p,
                transform: `scale(${0.82 + 0.18 * p})`,
                borderColor: isHero ? 'rgba(23,232,168,0.55)' : D.line,
                boxShadow: isHero ? `0 0 24px rgba(23,232,168,0.18)` : 'none',
                willChange: 'transform, opacity',
              }}
            >
              <div style={{...label(isHero ? D.signal : D.faint, 13)}}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div style={{...ui(19, isHero ? D.text : D.mute, 600), lineHeight: 1.25}}>
                {TITLES[i]}
              </div>
              <div style={{flex: 1}} />
              {/* Mini content: bars or lines, deterministic per card. */}
              {hash(i * 5.1) > 0.5 ? (
                <div style={{display: 'flex', alignItems: 'flex-end', gap: 5, height: 74}}>
                  {[0, 1, 2, 3, 4].map((k) => (
                    <div
                      key={k}
                      style={{
                        flex: 1,
                        height: `${26 + hash(i * 11 + k * 3) * 72}%`,
                        borderRadius: 2,
                        background: isHero ? 'rgba(23,232,168,0.55)' : 'rgba(168,216,240,0.22)',
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div style={{display: 'flex', flexDirection: 'column', gap: 9}}>
                  {[0, 1, 2].map((k) => (
                    <div
                      key={k}
                      style={{
                        height: 5,
                        width: `${44 + hash(i * 7 + k) * 52}%`,
                        borderRadius: 999,
                        background: isHero ? 'rgba(23,232,168,0.35)' : 'rgba(168,216,240,0.15)',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
