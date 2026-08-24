import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {INTER, SERIF} from '../../lib/fonts';
import {EASE, N, label, ui} from '../lib/tokens';

/**
 * SCENE 3 — The slide. Frames 330-480 (5.0s). NIGHT.
 *
 * One idea: what comes out is a real, sourced slide.
 *
 * Deliberately ONE slide, not a grid of fourteen. The previous cut showed the
 * whole deck at once and nothing in it could be read; a single slide at full size
 * makes the same claim and can actually be taken in. Six bars, one headline, one
 * source line — nothing else.
 */

const A = 330;
const BARS = [30, 38, 47, 58, 72, 91];
const YEARS = ['20', '21', '22', '23', '24', '25'];

export const S3Slide: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - A;

  const head = interpolate(local, [-16, 12], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });
  const src = interpolate(local, [64, 92], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });

  return (
    <div
      style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 80% 70% at 50% 44%, #121C24 0%, ${N.bg} 55%, ${N.bgDeep} 100%)`,
        fontFamily: INTER,
        padding: '96px 150px',
        display: 'flex', flexDirection: 'column',
      }}
    >
      <div style={{...label(N.signal, 19), opacity: head}}>Slide 03 · Market</div>

      <div
        style={{
          ...ui(92, N.text, 400),
          fontFamily: SERIF,
          letterSpacing: '-0.02em',
          marginTop: 26,
          maxWidth: 1300,
          opacity: head,
          transform: `translateY(${(1 - head) * 16}px)`,
          willChange: 'transform, opacity',
        }}
      >
        A $4.2B category, growing 18% a year
      </div>

      <div style={{flex: 1, display: 'flex', alignItems: 'flex-end', gap: 46, marginTop: 56, paddingBottom: 14}}>
        {BARS.map((v, i) => {
          const start = -14 + i * 7;
          const p = interpolate(local, [start, start + 22], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
          });
          const last = i === BARS.length - 1;
          return (
            <div key={i} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
              <span style={{...ui(28, last ? N.signal : N.faint, 700), opacity: p}}>
                {(Math.round(v * p * 0.058 * 10) / 10).toFixed(1)}B
              </span>
              <div
                style={{
                  width: '100%',
                  height: `${v * p * 4.2}px`,
                  borderRadius: '12px 12px 0 0',
                  background: last
                    ? `linear-gradient(180deg, ${N.signal}, ${N.signalDim})`
                    : 'linear-gradient(180deg, rgba(168,216,240,0.30), rgba(168,216,240,0.07))',
                  boxShadow: last ? '0 0 34px rgba(23,232,168,0.4)' : 'none',
                  willChange: 'height',
                }}
              />
              <span style={{...label(N.faint, 17), opacity: p}}>'{YEARS[i]}</span>
            </div>
          );
        })}
      </div>

      <div style={{display: 'flex', gap: 22, paddingTop: 28, borderTop: `1px solid ${N.line}`, opacity: src}}>
        <span style={{...label(N.faint, 16)}}>Source</span>
        <span style={{...ui(24, N.mute)}}>6 citations · verified</span>
      </div>
    </div>
  );
};
