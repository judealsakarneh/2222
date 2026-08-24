import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {hash} from '../../lib/random';
import {D, EASE, label, ui} from '../lib/tokens';

/**
 * PAGE 2 — Research. Frames 96-186.
 *
 * Steps stream in and complete in sequence while a source counter climbs. The
 * in-progress row keeps a running spinner and a shimmering bar so the page is
 * never a static checklist — a list that only ever gains ticks reads as a
 * screenshot.
 */

const A = 96;

const STEPS = [
  'Parsing the brief',
  'Market size & growth',
  'Competitor landscape',
  'Pricing benchmarks',
  'Go-to-market channels',
];

export const PgResearch: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - A;

  const sources = Math.floor(
    interpolate(local, [-30, 52], [0, 31], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: EASE,
    })
  );

  return (
    <div style={{position: 'absolute', inset: 0, padding: '56px 130px'}}>
      {/* Running total, large enough to read as the page's headline number. */}
      <div style={{display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 34}}>
        <span style={{...ui(64, D.signal, 700), letterSpacing: '-0.02em'}}>{sources}</span>
        <span style={{...label(D.mute, 17)}}>sources read</span>
      </div>
        {STEPS.map((step, i) => {
          const start = -34 + i * 11;
          const p = interpolate(local, [start, start + 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: EASE,
          });
          // A row completes ~10 frames after the next one starts working.
          const done = interpolate(local, [start + 16, start + 26], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: EASE,
          });
          if (p <= 0) return null;

          const working = done < 1;
          const spin = local * 9;

          return (
            <div
              key={step}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 30,
                padding: '26px 0',
                borderBottom: `1px solid ${D.line}`,
                opacity: p,
                transform: `translateX(${(1 - p) * -22}px)`,
                willChange: 'transform, opacity',
              }}
            >
              {/* Spinner that resolves into a tick */}
              <svg width={38} height={38} viewBox="0 0 26 26" fill="none" style={{flexShrink: 0}}>
                <circle cx="13" cy="13" r="11" stroke="rgba(23,232,168,0.22)" strokeWidth="2" />
                {working ? (
                  <circle
                    cx="13"
                    cy="13"
                    r="11"
                    stroke={D.signal}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="18 52"
                    transform={`rotate(${spin} 13 13)`}
                  />
                ) : null}
                <path
                  d="M8 13.4 L11.4 16.8 L18 9.6"
                  stroke={D.signal}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength={100}
                  strokeDasharray={100}
                  strokeDashoffset={100 * (1 - done)}
                />
              </svg>

              <span style={{...ui(33, done > 0.5 ? D.text : D.mute), flex: 1}}>{step}</span>

              {/* Progress shimmer while the row is working */}
              <div style={{width: 300, height: 6, borderRadius: 2, background: 'rgba(168,216,240,0.08)'}}>
                <div
                  style={{
                    width: `${done * 100}%`,
                    height: '100%',
                    borderRadius: 2,
                    background: D.signal,
                    boxShadow: `0 0 8px ${D.signal}`,
                  }}
                />
              </div>

              <span style={{...label(done > 0.9 ? D.signal : D.faint, 15), width: 92, textAlign: 'right'}}>
                {done > 0.9 ? 'done' : `${Math.floor(hash(i * 3.3) * 8) + 2} src`}
              </span>
            </div>
          );
        })}
    </div>
  );
};
