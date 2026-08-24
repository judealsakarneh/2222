import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Caption} from '../components/Caption';
import {hash} from '../../lib/random';
import {INTER} from '../../lib/fonts';
import {STATIONS} from '../lib/camera';
import {EASE, L, PANEL} from '../lib/tokens';

/**
 * STATION 5 — The deck wall. Arrives 630, holds 80.
 *
 * Fourteen finished slides as a wall the camera flies at. Where the other film
 * fanned three big cards, this shows the whole deck at once — the claim here is
 * volume, not detail, so the slides are small and none of them are readable.
 *
 * The wall has its OWN perspective container. The parent Station sets opacity,
 * which forces transform-style: flat on everything below it, so without a local
 * perspective every card's translateZ would collapse to zero and the wall would
 * be a flat grid. That per-card Z is the whole effect: the wall breathes.
 */

const A = STATIONS[5].arrive;
const COLS = 4;
const ROWS = 4;
const TOTAL = 14; // a 4x4 grid with the last two cells left empty
const CARD_W = 196;
const CARD_H = 250;

export const StDeck: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 58}}
    >
      <div style={{perspective: 1200, perspectiveOrigin: '50% 50%'}}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${COLS}, ${CARD_W}px)`,
            gridTemplateRows: `repeat(${ROWS}, ${CARD_H}px)`,
            gap: 22,
            transformStyle: 'preserve-3d',
          }}
        >
          {new Array(TOTAL).fill(0).map((_, i) => {
            const start = A - 88 + i * 5;
            const p = interpolate(frame, [start, start + 20], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: EASE,
            });
            if (p <= 0) return null;

            // Each card rests at its own depth and drifts on its own slow cycle,
            // so the wall is never a flat plane.
            const restZ = (hash(i * 4.4) - 0.5) * 150;
            const bob = Math.sin(frame * 0.05 + hash(i * 7.7) * 6) * 22;
            const z = restZ + bob - (1 - p) * 420;

            // One slide is the brand slide.
            const isHero = i === 5;

            return (
              <div
                key={i}
                style={{
                  ...PANEL,
                  borderRadius: 14,
                  padding: 18,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 9,
                  opacity: p,
                  transform: `translateZ(${z}px) scale(${0.86 + 0.14 * p})`,
                  borderColor: isHero
                    ? 'rgba(23,232,168,0.45)'
                    : 'rgba(168,216,240,0.14)',
                  willChange: 'transform, opacity',
                }}
              >
                <div
                  style={{
                    fontFamily: INTER,
                    fontWeight: 700,
                    fontSize: 9,
                    letterSpacing: '0.18em',
                    color: isHero ? L.signal : L.mist,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                {/* Title bar */}
                <div
                  style={{
                    height: 9,
                    width: `${58 + hash(i * 2.2) * 34}%`,
                    borderRadius: 999,
                    background: isHero
                      ? 'rgba(23,232,168,0.55)'
                      : 'rgba(168,216,240,0.34)',
                  }}
                />
                {/* Body lines */}
                {[0, 1, 2].map((k) => (
                  <div
                    key={k}
                    style={{
                      height: 4,
                      width: `${45 + hash(i * 9 + k) * 50}%`,
                      borderRadius: 999,
                      background: 'rgba(168,216,240,0.13)',
                    }}
                  />
                ))}
                <div style={{flex: 1}} />
                {/* Mini chart */}
                <div style={{display: 'flex', alignItems: 'flex-end', gap: 4, height: 42}}>
                  {[0, 1, 2, 3, 4].map((k) => (
                    <div
                      key={k}
                      style={{
                        flex: 1,
                        height: `${28 + hash(i * 13 + k * 3) * 70}%`,
                        borderRadius: 2,
                        background: isHero
                          ? 'rgba(23,232,168,0.5)'
                          : 'rgba(168,216,240,0.22)',
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Caption text="Fourteen slides. Fully sourced." from={A + 8} size={54} />
    </div>
  );
};
