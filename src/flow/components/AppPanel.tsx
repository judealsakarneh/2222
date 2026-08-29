import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {ARCHIVO, MONO} from '../../lib/fonts';
import {
  BEATS,
  COUNTERS,
  EASE,
  EASE_ORGANIC,
  LIST_ROWS,
  TABS,
  ms,
} from '../lib/timeline';

const PANEL_W = 1120;
const PANEL_H = 566;

/** Tab column positions, in px from the tab row's left edge. */
const TAB_X = [0, 120, 240];

/**
 * The two tab switches, as absolute times.
 *
 * The document gives the underline as "X 0 → 120 → 240 over 250ms", which is
 * two moves sharing one duration. Read literally that is a 125 ms slide per
 * tab, which is under four frames and reads as a cut. It is taken here as
 * 250 ms per switch - the duration the document gives for the move, applied to
 * each move - spaced so the second tab has time to be seen before the third
 * arrives. A tab switch nobody can read is not a tab switch.
 */
const SWITCH = [6300, 7150];

/**
 * The panel material.
 *
 * The document specifies "85% opacity + 15px Gaussian Blur + 1px white stroke
 * at 10%". The 85% is the whole thing and it is easy to misread: it means a
 * panel that is nearly opaque, not a white wash over a photograph. Built the
 * other way the wallpaper reads straight through at full contrast and the UI
 * type has to fight it, which is the difference between glass and cellophane.
 *
 * So: a dark base at 0.85, a directional sheen over it for the lit edge, and
 * the backdrop blur on top of both. The blur is a bonus rather than the load
 * bearing part - if a renderer drops backdrop-filter the panel still reads.
 */
const glass: React.CSSProperties = {
  background:
    'linear-gradient(163deg, rgba(24,27,27,0.86) 0%, rgba(14,16,16,0.87) 54%, rgba(9,11,11,0.88) 100%)',
  border: '1px solid rgba(255,255,255,0.10)',
  backdropFilter: 'blur(15px)',
};

/** The lit top edge, as its own layer so it sits over the base rather than in it. */
const sheen: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  borderRadius: 'inherit',
  background:
    'linear-gradient(163deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 46%, rgba(255,255,255,0) 78%)',
  pointerEvents: 'none',
};

const label = (size = 10, color = 'rgba(255,255,255,0.5)'): React.CSSProperties => ({
  fontFamily: MONO,
  fontSize: size,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color,
});

/** Which tab is showing at `t` ms. */
const tabAt = (t: number) => (t >= SWITCH[1] ? 2 : t >= SWITCH[0] ? 1 : 0);

/**
 * Crossfade weight for one tab's content.
 *
 * Out over 150 ms, in over 200 ms, with a 50 ms overlap: the incoming panel
 * starts before the outgoing one has finished, so the switch never passes
 * through an empty frame. That overlap is the entire difference between a
 * crossfade and a blink.
 */
const tabAlpha = (t: number, index: number) => {
  const {out, in: inMs, overlap} = BEATS.tabs;
  let a = index === 0 ? 1 : 0;
  SWITCH.forEach((at, i) => {
    const from = i;
    const to = i + 1;
    if (index === from) {
      a = Math.min(a, interpolate(t, [at, at + out], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }));
    }
    if (index === to) {
      a = Math.max(a, interpolate(t, [at + out - overlap, at + out - overlap + inMs], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }));
    }
  });
  return a;
};

/**
 * 3200 - 4500 ms. The live signal.
 *
 * The document's beat is a microphone waveform. CTRL Room has no microphone,
 * but it does have a live index, and the same bars reading as activity rather
 * than as audio is a truer picture of the product. Scale Y 20 → 100 → 60 over
 * 150 ms per bar with a 30 ms stagger, looping.
 *
 * The stagger is why it reads as organic. Every bar on the same phase is an
 * equaliser graphic; each one 30 ms behind its neighbour is a wave travelling
 * along the row.
 */
const Signal: React.FC<{t: number}> = ({t}) => {
  const {slot, per, stagger} = BEATS.bars;
  const n = 26;
  const on = interpolate(t, [slot[0], slot[0] + 260], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  return (
    <div style={{opacity: on}}>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 7, height: 104}}>
      {new Array(n).fill(0).map((_, i) => {
        // Each bar runs its own 0-1 phase, offset by the stagger, wrapping.
        const local = (t - slot[0] - i * stagger) / (per * 2);
        const phase = local - Math.floor(local);
        const h = interpolate(
          phase,
          [0, 0.34, 0.68, 1],
          [0.2, 1, 0.6, 0.2],
          {easing: EASE_ORGANIC},
        );
        return (
          <div
            key={i}
            style={{
              width: 4,
              height: `${h * 100}%`,
              borderRadius: 2,
              background: i % 5 === 0 ? '#00A9A4' : 'rgba(255,255,255,0.55)',
            }}
          />
        );
      })}
      </div>
      <div style={{...label(10, 'rgba(255,255,255,0.46)'), marginTop: 16}}>
        Indexing · Amman · live
      </div>
    </div>
  );
};

/**
 * 4500 - 6300 ms. The list types itself in.
 *
 * Per character: opacity 0 → 100 and X +8 → 0, at 25 ms per character with
 * 60 ms between lines. The X offset is what separates this from a fade - each
 * glyph arrives from slightly ahead of its slot, so the line has direction.
 */
const Typed: React.FC<{t: number}> = ({t}) => {
  const {slot, perChar, perLine, caret} = BEATS.type;
  const rows = LIST_ROWS.map((r) => `${r.name}  ·  ${r.area}  ·  ${r.kind}`);

  // Where each row starts: after every previous row has finished, plus a gap.
  const starts: number[] = [];
  let cursor = slot[0];
  rows.forEach((r) => {
    starts.push(cursor);
    cursor += r.length * perChar + perLine;
  });

  const done = cursor;
  const blink = Math.floor(((t - slot[0]) % caret) / (caret / 2)) === 0;

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
      {rows.map((row, ri) => {
        const start = starts[ri];
        return (
          <div
            key={ri}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 18,
              borderTop: '1px solid rgba(255,255,255,0.08)',
              paddingTop: 13,
              opacity: t >= start - 40 ? 1 : 0,
            }}
          >
            <span style={label(10, 'rgba(255,255,255,0.42)')}>
              {String(ri + 1).padStart(2, '0')}
            </span>
            <span
              style={{
                fontFamily: ARCHIVO,
                fontWeight: 500,
                fontSize: 21,
                color: 'rgba(255,255,255,0.94)',
                whiteSpace: 'pre',
              }}
            >
              {row.split('').map((ch, ci) => {
                const at = start + ci * perChar;
                const p = interpolate(t, [at, at + 90], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                  easing: EASE,
                });
                if (p <= 0) return null;
                return (
                  <span
                    key={ci}
                    style={{
                      display: 'inline-block',
                      opacity: p,
                      transform: `translateX(${(1 - p) * 8}px)`,
                      whiteSpace: 'pre',
                    }}
                  >
                    {ch}
                  </span>
                );
              })}
              {/* The caret sits at the end of whichever row is being written. */}
              {t >= start && t < (ri === rows.length - 1 ? done + 600 : starts[ri + 1]) ? (
                <span
                  style={{
                    display: 'inline-block',
                    width: 2,
                    height: 20,
                    marginLeft: 3,
                    transform: 'translateY(2px)',
                    background: '#00A9A4',
                    opacity: blink ? 1 : 0,
                  }}
                />
              ) : null}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/** Tab two. Deliberately quiet: it exists to be crossfaded past. */
const EventRows: React.FC = () => (
  <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
    {['Placeholder Night', 'Placeholder Session', 'Placeholder Weekend'].map((n, i) => (
      <div
        key={n}
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 18,
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: 13,
        }}
      >
        <span style={label(10, 'rgba(255,255,255,0.42)')}>{`0${i + 1}`}</span>
        <span
          style={{
            fontFamily: ARCHIVO,
            fontWeight: 500,
            fontSize: 21,
            color: 'rgba(255,255,255,0.94)',
          }}
        >
          {n}
        </span>
        <span style={{...label(11, 'rgba(255,255,255,0.42)'), marginLeft: 'auto'}}>TBC</span>
      </div>
    ))}
  </div>
);

/**
 * 8000 - 10000 ms. The counters.
 *
 * Numbers run 0 → target over 1200 ms on an ease-out, and the card pops
 * 95 → 105 → 100 over 400 ms starting at 80% of that run. The pop landing
 * *before* the number stops is the detail: the card is reacting to the count
 * finishing, and a reaction that arrives after the event reads as lag.
 */
const Counters: React.FC<{t: number}> = ({t}) => {
  const {slot, run, pop, popAt} = BEATS.count;
  const p = interpolate(t, [slot[0], slot[0] + run], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const popStart = slot[0] + run * popAt;
  const s = interpolate(
    t,
    [popStart, popStart + pop * 0.45, popStart + pop],
    [0.95, 1.05, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE},
  );

  return (
    <div style={{display: 'flex', gap: 20}}>
      {COUNTERS.map((c) => (
        <div
          key={c.label}
          style={{
            ...glass,
            flex: 1,
            borderRadius: 16,
            padding: '26px 28px',
            transform: `scale(${s})`,
          }}
        >
          <div
            style={{
              fontFamily: ARCHIVO,
              fontWeight: 900,
              fontSize: 74,
              lineHeight: 1,
              letterSpacing: '-0.035em',
              color: '#FFFFFF',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {Math.round(c.to * p)}
          </div>
          <div style={{...label(11), marginTop: 12}}>{c.label}</div>
        </div>
      ))}
    </div>
  );
};

/**
 * 2000 ms onward. The application window.
 *
 * Y +120 → 0 over 320 ms with the shadow blooming on the same curve and the
 * same duration. A panel that arrives before its shadow does looks pasted on;
 * tying them together is what makes it read as an object with weight.
 */
export const AppPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const t = (frame / 30) * 1000;
  const {slot, move} = BEATS.panel;

  const p = interpolate(t, [slot[0], slot[0] + move], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  // Hands the frame to the outro: recedes rather than cutting.
  const out = interpolate(t, [9700, 10200], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  if (p <= 0 || out >= 1) return null;

  const y = interpolate(p, [0, 1], [120, 0]);
  const shadowBlur = interpolate(p, [0, 1], [0, 40]);
  const shadowAlpha = interpolate(p, [0, 1], [0, 0.15]);
  const active = tabAt(t);

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div
        style={{
          ...glass,
          width: PANEL_W,
          height: PANEL_H,
          borderRadius: 26,
          padding: 40,
          display: 'flex',
          flexDirection: 'column',
          opacity: p * (1 - out),
          transform: `translateY(${y - out * 26}px) scale(${1 - out * 0.04})`,
          boxShadow: `0 ${shadowBlur * 0.7}px ${shadowBlur * 2}px -${shadowBlur * 0.3}px rgba(0,0,0,${shadowAlpha * 5.4}), inset 0 1px 0 rgba(255,255,255,0.16)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={sheen} />
        {/* Window head. A readout, not macOS traffic lights - this is CTRL
            Room's own chrome, and it says what the app is doing. */}
        <div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 14}}>
          <span
            style={{
              fontFamily: ARCHIVO,
              fontWeight: 900,
              fontSize: 19,
              letterSpacing: '-0.03em',
              color: '#FFFFFF',
            }}
          >
            CTRL
          </span>
          <span style={label(10, '#4FD1CA')}>Room</span>
          <span style={{...label(10), marginLeft: 'auto'}}>
            Live · Amman · 31.9539° N
          </span>
        </div>

        {/* Tabs. The underline is one element that slides; three underlines
            fading in and out would lose the sense of a single indicator. */}
        <div style={{position: 'relative', zIndex: 1, marginTop: 34, height: 30}}>
          <div style={{display: 'flex', gap: 0}}>
            {TABS.map((tab, i) => (
              <span
                key={tab}
                style={{
                  width: 120,
                  fontFamily: ARCHIVO,
                  fontWeight: 600,
                  fontSize: 13,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: i === active ? '#FFFFFF' : 'rgba(255,255,255,0.42)',
                }}
              >
                {tab}
              </span>
            ))}
          </div>
          <div
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: 84,
              height: 2,
              background: '#00A9A4',
              transform: `translateX(${interpolate(
                t,
                [
                  SWITCH[0],
                  SWITCH[0] + BEATS.tabs.underline,
                  SWITCH[1],
                  SWITCH[1] + BEATS.tabs.underline,
                ],
                [TAB_X[0], TAB_X[1], TAB_X[1], TAB_X[2]],
                {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE},
              )}px)`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: 1,
              background: 'rgba(255,255,255,0.08)',
            }}
          />
        </div>

        {/* Body. All three tabs are mounted and crossfaded by weight, so the
            switch is a dissolve between two live layouts rather than a swap. */}
        <div style={{position: 'relative', zIndex: 1, flex: 1, marginTop: 34}}>
          <div style={{position: 'absolute', inset: 0, opacity: tabAlpha(t, 0)}}>
            <Signal t={t} />
            <div style={{marginTop: 34}}>
              <Typed t={t} />
            </div>
          </div>
          <div style={{position: 'absolute', inset: 0, opacity: tabAlpha(t, 1)}}>
            <EventRows />
          </div>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: tabAlpha(t, 2),
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div style={{width: '100%'}}>
              <Counters t={t} />
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
