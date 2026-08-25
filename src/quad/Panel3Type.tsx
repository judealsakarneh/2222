import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {INTER} from '../lib/fonts';
import {N, PANEL_H, ui} from './tokens';

/**
 * PANEL 3 — the prompt bar.
 *
 * Three phrases on a 120-frame cycle each, 360 total, so the panel returns to
 * its start exactly on the loop.
 *
 * The phrase swap has NO hard cut: each one types in, holds, then ERASES
 * character by character before the next begins. Cutting the text would be one
 * line of code less and would instantly read as a slideshow; erasing keeps it
 * feeling like one continuous act of typing.
 */

const PHRASES = [
  'a pitch deck for my bakery',
  'a Series A deck',
  'an investor update',
];

const CYCLE = 120;
const TYPE = 42;
const HOLD = 46;
const ERASE = 24;

export const Panel3Type: React.FC = () => {
  const frame = useCurrentFrame();

  const slot = Math.floor(frame / CYCLE) % PHRASES.length;
  const t = frame % CYCLE;
  const phrase = PHRASES[slot];

  let chars: number;
  if (t < TYPE) {
    chars = Math.floor(interpolate(t, [0, TYPE], [0, phrase.length]));
  } else if (t < TYPE + HOLD) {
    chars = phrase.length;
  } else if (t < TYPE + HOLD + ERASE) {
    chars = Math.floor(
      interpolate(t, [TYPE + HOLD, TYPE + HOLD + ERASE], [phrase.length, 0])
    );
  } else {
    chars = 0;
  }

  const caretOn = Math.floor(frame / 8) % 2 === 0;

  return (
    <div
      style={{
        position: 'relative', height: PANEL_H, overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 820, display: 'flex', alignItems: 'center', gap: 22,
          padding: '30px 34px', borderRadius: 20,
          background: 'rgba(168,216,240,0.05)',
          border: `1.5px solid ${N.line}`,
          boxShadow: '0 0 50px rgba(23,232,168,0.06)',
        }}
      >
        <svg width={28} height={28} viewBox="0 0 24 24" fill="none"
          stroke={N.signal} strokeWidth={2} strokeLinecap="round">
          <circle cx="10.5" cy="10.5" r="6.5" /><line x1="20" y1="20" x2="15.4" y2="15.4" />
        </svg>

        <span style={{...ui(32, chars > 0 ? N.text : N.faint), fontFamily: INTER, flex: 1}}>
          {phrase.slice(0, chars)}
          <span
            style={{
              display: 'inline-block', width: 3, height: 32, marginLeft: 4,
              background: N.signal, boxShadow: `0 0 10px ${N.signal}`,
              verticalAlign: 'text-bottom',
              opacity: caretOn ? 1 : 0.15,
            }}
          />
        </span>
      </div>
    </div>
  );
};
