import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Pill} from './chrome';
import {CARD, D, EASE, label, ui} from '../lib/tokens';

/**
 * PAGE 5 — Export. Frames 360-426.
 *
 * The last functional beat: the deck leaves the product. A determinate progress
 * bar fills and flips to "Ready", three format pills sit above it. Short page —
 * it only has to answer "and then what do I get".
 */

const A = 360;

const FORMATS = ['Keynote', 'PowerPoint', 'PDF', 'Web link'];

export const PgExport: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - A;

  const pct = interpolate(local, [-10, 30], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const ready = pct >= 99.5;

  const panelIn = interpolate(local, [-10, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            ...CARD,
            width: 1080,
            padding: 70,
            opacity: panelIn,
            transform: `translateY(${(1 - panelIn) * 26}px)`,
            willChange: 'transform, opacity',
          }}
        >
          <div style={{...label(D.mute, 17), marginBottom: 38}}>Export deck</div>

          <div style={{display: 'flex', gap: 16, marginBottom: 52}}>
            {FORMATS.map((f, i) => {
              const p = interpolate(local, [-14 + i * 4, -2 + i * 4], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: EASE,
              });
              return (
                <div key={f} style={{opacity: p, transform: `translateY(${(1 - p) * 12}px)`}}>
                  <Pill active={i === 0}>{f}</Pill>
                </div>
              );
            })}
          </div>

          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12}}>
            <span style={{...ui(30, D.text, 500)}}>
              {ready ? 'Ready to share' : 'Rendering 14 slides…'}
            </span>
            <span style={{...ui(30, ready ? D.signal : D.mute, 700)}}>
              {ready ? 'DONE' : `${Math.round(pct)}%`}
            </span>
          </div>

          <div style={{height: 16, borderRadius: 999, background: 'rgba(168,216,240,0.07)', overflow: 'hidden'}}>
            <div
              style={{
                width: `${pct}%`,
                height: '100%',
                borderRadius: 999,
                background: `linear-gradient(90deg, ${D.signalDim}, ${D.signal})`,
                boxShadow: `0 0 18px rgba(23,232,168,0.5)`,
                willChange: 'width',
              }}
            />
          </div>

          <div style={{...label(D.faint, 16), marginTop: 34}}>
            14 slides · 31 sources · 47 seconds
          </div>
        </div>
      </div>
  );
};
