import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {INTER} from '../../lib/fonts';
import {C, EASE, ui} from '../lib/tokens';
import {CUE} from '../lib/timeline';

/**
 * 2.000-6.000s — SMART CONTROL DASHBOARD
 *
 * Four staggered beats, none of them simultaneous: panel, greeting, task widget,
 * then the chart. The spec's rule — UI elements never appear together, 100-150ms
 * between each — is what separates authored motion from a screenshot fading up.
 *
 * The greeting splits "Hello," and "Mark" onto a 150ms stagger. It is a tiny
 * detail and it is the one that makes the product feel like it knows you.
 */

const R = 54;
const CIRC = 2 * Math.PI * R;
/** 86% of 360deg, per the spec. */
const SWEEP = 309.6;

const CHART = [42, 30, 52, 38, 64, 48, 76, 58, 88];

export const D2Dashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const {panel, hello, name, widget, counter, cursor, chart} = CUE.dash;

  const panelP = interpolate(frame, [panel[0], panel[1]], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });
  const helloP = interpolate(frame, [hello, hello + 12], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });
  const nameP = interpolate(frame, [name, name + 12], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });
  const widgetP = interpolate(frame, [widget[0], widget[1]], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });
  const countP = interpolate(frame, [counter[0], counter[1]], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });
  const chartP = interpolate(frame, [chart[0], chart[1]], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });
  const cursorP = interpolate(frame, [cursor - 12, cursor], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });

  const pct = Math.round(86 * countP);

  // Chart geometry, normalised into a 640x180 box.
  const W = 640, H = 180;
  const pts = CHART.map((v, i) => [
    (i / (CHART.length - 1)) * W,
    H - (v / 100) * H,
  ]);
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');

  return (
    <div
      style={{
        width: 900,
        padding: 44,
        borderRadius: 16,
        background: C.panel,
        border: `1px solid ${C.border}`,
        boxShadow: '0 40px 90px -30px rgba(0,0,0,0.9)',
        opacity: panelP,
        // Slides up from +100px with motion blur while it travels.
        transform: `translateY(${(1 - panelP) * 100}px)`,
        filter: panelP < 1 ? `blur(${(1 - panelP) * 15}px)` : undefined,
        fontFamily: INTER,
        willChange: 'transform, opacity, filter',
      }}
    >
      {/* Greeting — two words, 150ms apart */}
      <div style={{display: 'flex', gap: 14, marginBottom: 34}}>
        <span style={{...ui(48, C.text, 600), opacity: helloP, transform: `translateY(${(1 - helloP) * 10}px)`}}>
          Hello,
        </span>
        <span style={{...ui(48, C.signal, 600), opacity: nameP, transform: `translateY(${(1 - nameP) * 10}px)`}}>
          Mark
        </span>
      </div>

      {/* Task widget — slides in from x:-80 */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 32,
          padding: 26, borderRadius: 12,
          background: C.panel2, border: `1px solid ${C.border}`,
          opacity: widgetP,
          transform: `translateX(${(1 - widgetP) * -80}px)`,
          willChange: 'transform, opacity',
        }}
      >
        <div style={{position: 'relative', width: 132, height: 132}}>
          <svg width={132} height={132} style={{transform: 'rotate(-90deg)'}}>
            <circle cx="66" cy="66" r={R} stroke="rgba(255,255,255,0.07)" strokeWidth={8} fill="none" />
            <circle
              cx="66" cy="66" r={R}
              stroke={C.signal} strokeWidth={8} fill="none" strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * (1 - (SWEEP / 360) * countP)}
              style={{filter: `drop-shadow(0 0 8px ${C.glow})`}}
            />
          </svg>
          <div
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              ...ui(34, C.text, 700),
            }}
          >
            {pct}%
          </div>
        </div>

        <div>
          <div style={{...ui(22, C.text, 600)}}>Deck complete</div>
          <div style={{...ui(17, C.mute), marginTop: 6}}>12 of 14 slides · 31 sources</div>
        </div>
      </div>

      {/* Line chart — draws left to right */}
      <div style={{position: 'relative', marginTop: 34, height: H}}>
        <svg width={W} height={H} style={{overflow: 'visible', width: '100%'}} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          {[0, 1, 2, 3].map((g) => (
            <line key={g} x1={0} y1={(g / 3) * H} x2={W} y2={(g / 3) * H}
              stroke="#ffffff" strokeOpacity={0.1} strokeWidth={1} />
          ))}
          <path
            d={d}
            stroke={C.signal} strokeWidth={2} fill="none"
            strokeLinecap="round" strokeLinejoin="round"
            pathLength={1000}
            strokeDasharray={1000}
            strokeDashoffset={1000 * (1 - chartP)}
            style={{filter: `drop-shadow(0 0 6px ${C.glow})`}}
          />
        </svg>

        {/* Data points pop 0 -> 1.2 -> 1 as the line reaches them */}
        {pts.map((p, i) => {
          const at = i / (CHART.length - 1);
          const local = interpolate(chartP, [at, at + 0.09], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          });
          const s = interpolate(local, [0, 0.6, 1], [0, 1.2, 1]);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${(p[0] / W) * 100}%`, top: p[1],
                width: 9, height: 9, marginLeft: -4.5, marginTop: -4.5,
                borderRadius: '50%', background: C.signal,
                boxShadow: `0 0 10px ${C.glow}`,
                transform: `scale(${s})`,
                willChange: 'transform',
              }}
            />
          );
        })}
      </div>

      {/* Mouse cursor, hovering the counter with a 1px blue glow */}
      <div
        style={{
          position: 'absolute',
          left: 196, top: 214,
          opacity: cursorP,
          transform: `translate(${(1 - cursorP) * 26}px, ${(1 - cursorP) * 22}px)`,
          willChange: 'transform, opacity',
          filter: `drop-shadow(0 0 3px ${C.glow})`,
        }}
      >
        <svg width={22} height={22} viewBox="0 0 24 24">
          <path d="M5 3 L5 19 L9.2 15 L11.8 21 L14.4 19.8 L11.8 14 L17 14 Z"
            fill="#fff" stroke={C.signal} strokeWidth={1} />
        </svg>
      </div>
    </div>
  );
};
