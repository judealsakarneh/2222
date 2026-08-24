import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Pill} from './chrome';
import {SERIF} from '../../lib/fonts';
import {D, EASE, label, ui} from '../lib/tokens';

/**
 * PAGE 4 — One slide, full bleed. Frames 276-360.
 *
 * The iris opens onto the hero slide the grid was highlighting. This is the only
 * page where the product's OUTPUT is shown at full size, so it gets the serif
 * headline and a chart that actually draws — the columns grow and the trend line
 * strokes on after them.
 */

const A = 276;

// Monotonic, and '24 lands on 4.2B so the chart agrees with the headline.
const BARS = [30, 38, 47, 58, 72, 91];
const YEARS = ['20', '21', '22', '23', '24', '25'];

export const PgSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - A;

  const head = interpolate(local, [-14, 6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const lineDraw = interpolate(local, [22, 46], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  return (
      <div style={{position: 'absolute', inset: 0, padding: '52px 130px', display: 'flex', flexDirection: 'column'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: head}}>
          <span style={{...label(D.signal, 17)}}>Market</span>
          <div style={{display: 'flex', gap: 12}}><Pill active>Edit</Pill><Pill>Present</Pill></div>
        </div>

        <div
          style={{
            ...ui(84, D.text, 400),
            fontFamily: SERIF,
            marginTop: 22,
            letterSpacing: '-0.015em',
            opacity: head,
            transform: `translateY(${(1 - head) * 14}px)`,
            willChange: 'transform, opacity',
          }}
        >
          A $4.2B category growing 18% a year
        </div>

        {/* Chart */}
        <div style={{flex: 1, display: 'flex', alignItems: 'flex-end', gap: 40, marginTop: 44, paddingBottom: 10}}>
          {BARS.map((v, i) => {
            const start = -6 + i * 4;
            const p = interpolate(local, [start, start + 16], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: EASE,
            });
            const last = i === BARS.length - 1;
            return (
              <div key={i} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
                <span style={{...ui(24, last ? D.signal : D.faint, 700), opacity: p}}>
                  {Math.round(v * p * 0.058 * 10) / 10}B
                </span>
                <div
                  style={{
                    width: '100%',
                    height: `${v * p * 4.6}px`,
                    borderRadius: '10px 10px 0 0',
                    background: last
                      ? `linear-gradient(180deg, ${D.signal}, ${D.signalDim})`
                      : 'linear-gradient(180deg, rgba(168,216,240,0.32), rgba(168,216,240,0.08))',
                    boxShadow: last ? `0 0 26px rgba(23,232,168,0.4)` : 'none',
                    willChange: 'height',
                  }}
                />
                <span style={{...label(D.faint, 16), opacity: p}}>'{YEARS[i]}</span>
              </div>
            );
          })}
        </div>

        {/* Source footnote — strokes on after the chart, the "fully sourced" proof. */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            paddingTop: 26,
            borderTop: `1px solid ${D.line}`,
            opacity: lineDraw,
          }}
        >
          <span style={{...label(D.faint, 16)}}>Source</span>
          <span style={{...ui(22, D.mute)}}>
            Industry reports · 6 citations · verified {Math.round(lineDraw * 100)}%
          </span>
        </div>
      </div>
  );
};
