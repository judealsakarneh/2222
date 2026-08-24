import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {INTER} from '../../lib/fonts';
import {BAR_H, BRAND, D, EASE, STRIP_H, label, ui} from '../lib/tokens';
import {PAGES, screenStateAt} from '../lib/timeline';

/**
 * The persistent app shell.
 *
 * This renders ONCE, outside the transition engine, and never moves. It is the
 * anchor: however hard the body swipes, tears or irises, the eye still has a
 * fixed frame to hold onto, so the change reads as a view swapping inside an
 * application rather than as a cut to a different shot.
 *
 * The only thing that changes up here is the breadcrumb and the right-hand stat,
 * and they crossfade rather than cutting — so even the anchor is never static.
 */

const CRUMBS = [
  'new deck',
  'researching',
  'building',
  'slide 06 · market size',
  'export',
  'ready',
];

const STATS = ['voice or text', '31 sources', '14 slides', '6 citations', '4 formats', 'zamble.app'];

/** Crossfade a per-page string as the pages change. */
const Swap: React.FC<{values: string[]; style: React.CSSProperties}> = ({values, style}) => {
  const frame = useCurrentFrame();
  const state = screenStateAt(frame);

  if (state.kind === 'page') {
    return <span style={style}>{values[state.index]}</span>;
  }
  // Hand over at the midpoint, out-then-in with NO overlap. Cross-dissolving two
  // different strings on top of each other just renders them as illegible mush.
  const out = state.progress < 0.5;
  const p = out
    ? 1 - interpolate(state.progress, [0.12, 0.48], [0, 1], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
      })
    : interpolate(state.progress, [0.52, 0.88], [0, 1], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
      });

  return (
    <span style={{...style, opacity: p, whiteSpace: 'nowrap'}}>
      {values[out ? state.from : state.to]}
    </span>
  );
};

export const AppShell: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();

  // A soft caret pulse on the brand dot — the app is alive even between beats.
  const pulse = 0.6 + 0.4 * ((1 + Math.cos((frame / 34) * Math.PI * 2)) / 2);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        fontFamily: INTER,
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(180deg, #141E26 0%, ${D.screenBg} 46%, #0D141B 100%)`,
      }}
    >
      {/* ---- Top bar (persistent anchor) ---- */}
      <div
        style={{
          height: BAR_H,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          padding: '0 40px',
          borderBottom: `1px solid ${D.line}`,
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        <div style={{display: 'flex', gap: 11}}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{width: 14, height: 14, borderRadius: '50%', background: '#33404C'}} />
          ))}
        </div>

        <div
          style={{
            width: 11,
            height: 11,
            borderRadius: '50%',
            marginLeft: 16,
            background: D.signal,
            boxShadow: `0 0 ${12 * pulse}px ${D.signal}`,
            opacity: 0.55 + 0.45 * pulse,
          }}
        />

        <span style={{...label(D.mute, 17)}}>
          {BRAND} <span style={{color: D.faint}}>/</span>{' '}
        </span>
        <Swap values={CRUMBS} style={{...label(D.text, 17)}} />

        <div style={{flex: 1}} />
        <Swap values={STATS} style={{...label(D.signal, 15)}} />
      </div>

      {/* ---- Body: everything transitions in here ---- */}
      <div style={{flex: 1, position: 'relative', overflow: 'hidden'}}>{children}</div>

      {/* ---- Bottom strip (persistent anchor) ---- */}
      <div
        style={{
          height: STRIP_H,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 30,
          padding: '0 40px',
          borderTop: `1px solid ${D.line}`,
          background: 'rgba(0,0,0,0.24)',
        }}
      >
        {PAGES.map((_, i) => {
          const state = screenStateAt(frame);
          const active = state.kind === 'page' ? state.index : state.to;
          const done = i <= active;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 2,
                background: done ? D.signal : 'rgba(168,216,240,0.12)',
                boxShadow: i === active ? `0 0 10px ${D.signal}` : 'none',
              }}
            />
          );
        })}
        <span style={{...ui(16, D.faint, 600), whiteSpace: 'nowrap'}}>
          {BRAND}.app
        </span>
      </div>
    </div>
  );
};

/** Small pill used for tags, formats and toggles. */
export const Pill: React.FC<{
  children: React.ReactNode;
  active?: boolean;
  style?: React.CSSProperties;
}> = ({children, active, style}) => (
  <div
    style={{
      padding: '13px 26px',
      borderRadius: 999,
      fontSize: 22,
      fontWeight: 600,
      color: active ? '#06241A' : D.mute,
      background: active ? D.signal : 'rgba(168,216,240,0.06)',
      border: `1px solid ${active ? D.signal : D.line}`,
      ...style,
    }}
  >
    {children}
  </div>
);
