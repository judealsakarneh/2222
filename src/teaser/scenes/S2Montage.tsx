import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {SceneGate} from '../components/SceneGate';
import {AsciiCanvas} from '../components/AsciiCanvas';
import {WireframeGrid} from '../components/WireframeGrid';
import {MONO} from '../lib/fonts';
import {MONTAGE} from '../lib/ascii';
import {COPY, EASE, T, hud} from '../lib/tokens';
import {S} from '../lib/timeline';

/**
 * SCENE 2 — Asset montage. Frames 45-120 (1.5 - 4.0s)
 *
 * Eight hard cuts at 9 frames each (0.3s), straight through the generated
 * assets. Every one is real ASCII art computed from maths this frame — a shaded
 * sphere, a z-buffered torus, chart renders, a scan grid (see lib/ascii.ts).
 *
 * Two details do the heavy lifting:
 *   - each cut opens with a 2-frame scale pop and brightness spike, so the cut
 *     lands as an impact rather than as a swap
 *   - the wireframe overlay runs CONTINUOUSLY across all eight cuts, which is
 *     what binds them into one montage instead of eight unrelated stills
 */

const CUT = 9;
// Sized to fill the 1080x1920 frame: at 28px the monospace cell is 16.8 x 28,
// so 58 x 44 renders a 974 x 1232 block with room for the HUD above and below.
const COLS = 58;
const ROWS = 44;
const FONT = 28;

export const S2Montage: React.FC = () => {
  const frame = useCurrentFrame();

  const local = frame - S.montage.start;

  // SceneGate gates the OUTPUT, but this component body still runs on every
  // frame of the film — so bail before doing any ASCII work (and before
  // indexing the playlist with a negative cut index) when we are off-screen.
  if (local < 0 || frame >= S.montage.end) {
    return null;
  }

  const index = Math.max(0, Math.min(MONTAGE.length - 1, Math.floor(local / CUT)));
  const intoCut = local - index * CUT;
  const asset = MONTAGE[index];

  // Per-cut impact: a fast settle on scale and a brightness spike.
  const pop = interpolate(intoCut, [0, 5], [1.06, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const flash = interpolate(intoCut, [0, 3], [1.9, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  const rows = asset.gen(frame + asset.phase, COLS, ROWS);
  const color = asset.accent ? T.purple : T.cyan;

  return (
    <SceneGate start={S.montage.start} end={S.montage.end}>
      <AbsoluteFill style={{background: T.bg}} />

      {/* Continuous across every cut — the thread that ties the montage together. */}
      <WireframeGrid opacity={0.75} />

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${pop})`,
          filter: `brightness(${flash})`,
          willChange: 'transform, filter',
        }}
      >
        <AsciiCanvas rows={rows} fontSize={FONT} color={color} glow={12} />
      </AbsoluteFill>

      {/* HUD chrome — reads as a capture tool bracketing each asset. */}
      <AbsoluteFill style={{padding: 64, pointerEvents: 'none'}}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: MONO,
            ...hud(T.purple, 19),
          }}
        >
          <span>{COPY.hudMontage}</span>
          <span style={{color: T.cyan}}>
            {String(index + 1).padStart(2, '0')}/{String(MONTAGE.length).padStart(2, '0')}
          </span>
        </div>

        <div style={{flex: 1}} />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: MONO,
            ...hud(T.cyan, 19),
          }}
        >
          <span>{asset.label}</span>
          <span style={{color: T.purple}}>OK</span>
        </div>
      </AbsoluteFill>

      {/* Corner brackets. */}
      {[
        {top: 44, left: 44, borderTop: true, borderLeft: true},
        {top: 44, right: 44, borderTop: true, borderRight: true},
        {bottom: 44, left: 44, borderBottom: true, borderLeft: true},
        {bottom: 44, right: 44, borderBottom: true, borderRight: true},
      ].map((c, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: 42,
            height: 42,
            top: c.top,
            left: c.left,
            right: c.right,
            bottom: c.bottom,
            borderTop: c.borderTop ? `2px solid ${T.cyan}` : undefined,
            borderBottom: c.borderBottom ? `2px solid ${T.cyan}` : undefined,
            borderLeft: c.borderLeft ? `2px solid ${T.cyan}` : undefined,
            borderRight: c.borderRight ? `2px solid ${T.cyan}` : undefined,
            opacity: 0.55,
          }}
        />
      ))}
    </SceneGate>
  );
};
