import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Caption} from '../components/Caption';
import {hash} from '../../lib/random';
import {INTER} from '../../lib/fonts';
import {STATIONS} from '../lib/camera';
import {EASE, L} from '../lib/tokens';

/**
 * STATION 3 — Research constellation. Arrives 355, holds 95.
 *
 * A source graph that builds itself: nodes pop in, then edges draw between them
 * with stroke-dashoffset, then four of them resolve into labelled findings.
 *
 * The layout is a deterministic golden-angle spiral rather than a circle — a
 * ring of evenly spaced nodes reads as a decorative diagram, whereas uneven
 * spiral spacing reads as data that landed where it landed. Positions come from
 * the seeded hash, so it is the same graph on every render.
 */

const A = STATIONS[3].arrive;
const SIZE = 760;
const NODES = 16;
const GOLDEN = 137.508;

type Node = {x: number; y: number; r: number; big: boolean};

/** Precomputed once at module scope — pure, deterministic, no per-frame cost. */
const RAW: Node[] = new Array(NODES).fill(0).map((_, i) => {
  const t = (i + 0.5) / NODES;
  const angle = (i * GOLDEN * Math.PI) / 180;
  // Jittered spiral radius.
  const radius = Math.sqrt(t) * (SIZE / 2 - 70) * (0.82 + hash(i * 3.7) * 0.3);
  const big = i % 4 === 1;
  return {
    x: SIZE / 2 + Math.cos(angle) * radius,
    y: SIZE / 2 + Math.sin(angle) * radius * 0.92,
    r: big ? 9 : 4.5,
    big,
  };
});

// Re-centre on the node centroid. A jittered golden spiral is not symmetric
// about its origin, so without this the constellation hangs off to one side of
// the frame and the whole composition reads as misaligned.
const CX = RAW.reduce((s, n) => s + n.x, 0) / NODES;
const CY = RAW.reduce((s, n) => s + n.y, 0) / NODES;
const NODE_LIST: Node[] = RAW.map((n) => ({
  ...n,
  x: n.x + (SIZE / 2 - CX),
  y: n.y + (SIZE / 2 - CY),
}));

/** Edges chain the spiral plus a few deterministic long-range links. */
const EDGES: [number, number][] = [];
for (let i = 1; i < NODES; i++) EDGES.push([i - 1, i]);
for (let i = 0; i < 6; i++) {
  const a = Math.floor(hash(i * 5.5) * NODES);
  const b = Math.floor(hash(i * 9.1) * NODES);
  if (a !== b) EDGES.push([a, b]);
}

const FINDINGS = [
  {node: 1, text: 'TAM $4.2B'},
  {node: 5, text: '18% CAGR'},
  {node: 9, text: '7 competitors'},
  {node: 13, text: '3 pricing models'},
];

export const StResearch: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 54}}
    >
      <div style={{position: 'relative', width: SIZE, height: SIZE}}>
        <svg width={SIZE} height={SIZE} style={{position: 'absolute', inset: 0}}>
          {/* Edges draw first, staggered, so the graph wires itself up. */}
          {EDGES.map(([a, b], i) => {
            const na = NODE_LIST[a];
            const nb = NODE_LIST[b];
            const len = Math.hypot(nb.x - na.x, nb.y - na.y);
            const start = A - 82 + i * 2.5;
            const p = interpolate(frame, [start, start + 16], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: EASE,
            });
            if (p <= 0) return null;

            return (
              <line
                key={i}
                x1={na.x}
                y1={na.y}
                x2={nb.x}
                y2={nb.y}
                stroke={L.iceDim}
                strokeWidth={1.2}
                strokeDasharray={len}
                strokeDashoffset={len * (1 - p)}
                opacity={0.9}
              />
            );
          })}

          {/* Nodes */}
          {NODE_LIST.map((n, i) => {
            const start = A - 92 + i * 3;
            const p = interpolate(frame, [start, start + 12], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: EASE,
            });
            if (p <= 0) return null;
            const isFinding = FINDINGS.some((f) => f.node === i);

            return (
              <circle
                key={i}
                cx={n.x}
                cy={n.y}
                r={n.r * p}
                fill={isFinding ? L.signal : L.ice}
                opacity={isFinding ? 1 : 0.55}
                style={{
                  filter: isFinding ? `drop-shadow(0 0 10px ${L.signal})` : undefined,
                }}
              />
            );
          })}
        </svg>

        {/* Findings resolve last, once the graph is wired. */}
        {FINDINGS.map((f, i) => {
          const n = NODE_LIST[f.node];
          const start = A + 8 + i * 9;
          const p = interpolate(frame, [start, start + 14], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: EASE,
          });
          if (p <= 0) return null;

          return (
            <div
              key={f.text}
              style={{
                position: 'absolute',
                left: n.x + 20,
                top: n.y - 15,
                fontFamily: INTER,
                fontWeight: 700,
                fontSize: 21,
                letterSpacing: '0.06em',
                color: L.signal,
                whiteSpace: 'nowrap',
                padding: '5px 12px',
                borderRadius: 8,
                border: `1px solid rgba(23,232,168,${0.35 * p})`,
                background: 'rgba(4,6,10,0.72)',
                opacity: p,
                transform: `translateX(${(1 - p) * -12}px)`,
                willChange: 'transform, opacity',
              }}
            >
              {f.text}
            </div>
          );
        })}
      </div>

      <Caption text="Then it goes and reads." from={A + 8} size={58} />
    </div>
  );
};
