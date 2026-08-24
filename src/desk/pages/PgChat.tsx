import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {INTER} from '../../lib/fonts';
import {D, EASE, label, ui} from '../lib/tokens';

/**
 * PAGE 1 — Prompt. Frames 0-96.
 *
 * The hook line sits centre-stage and then MORPHS DOWN into the input field:
 * it scales 68px -> 30px, travels to the field's line and hands off to the typed
 * prompt. Morphing the headline into the control it describes beats fading one
 * out and the other in — the sentence becomes the thing you're about to use.
 */

export const PROMPT = 'an investor deck for my handmade ceramics brand…';
export const SEND_FRAME = 74;

export const PgChat: React.FC = () => {
  const frame = useCurrentFrame();

  const hookIn = interpolate(frame, [6, 26], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });
  const morph = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });
  const fieldIn = interpolate(frame, [34, 50], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });

  const typed = Math.floor(
    interpolate(frame, [48, 72], [0, PROMPT.length], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    })
  );
  const caretOn = Math.floor(frame / 8) % 2 === 0;

  const sent = frame >= SEND_FRAME;
  const flash = interpolate(frame, [SEND_FRAME, SEND_FRAME + 7], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });

  return (
    <div style={{position: 'absolute', inset: 0, padding: '0 150px'}}>
      {/* The hook, morphing from centre-stage down onto the input line. */}
      <div
        style={{
          position: 'absolute',
          left: 150, right: 150,
          top: `${interpolate(morph, [0, 1], [34, 62])}%`,
          textAlign: morph > 0.5 ? 'left' : 'center',
          opacity: hookIn * (1 - morph),
          transform: `scale(${interpolate(morph, [0, 1], [1, 0.44])})`,
          transformOrigin: morph > 0.5 ? '0% 50%' : '50% 50%',
          willChange: 'transform, opacity',
        }}
      >
        <span style={{...ui(68, D.text, 500), fontFamily: INTER, letterSpacing: '-0.02em'}}>
          You describe it once.
        </span>
      </div>

      {/* Input field */}
      <div
        style={{
          position: 'absolute',
          left: 150, right: 150, top: '58%',
          display: 'flex', alignItems: 'center', gap: 24,
          padding: '30px 30px 30px 38px',
          borderRadius: 22,
          background: 'rgba(168,216,240,0.05)',
          border: `1.5px solid ${sent ? D.signal : D.line}`,
          boxShadow: sent ? `0 0 ${50 * flash}px rgba(23,232,168,${0.5 * flash})` : 'none',
          opacity: fieldIn,
          transform: `translateY(${(1 - fieldIn) * 18}px)`,
          willChange: 'transform, opacity',
        }}
      >
        <span style={{...ui(30, typed > 0 ? D.text : D.faint), flex: 1}}>
          {PROMPT.slice(0, typed)}
          <span
            style={{
              display: 'inline-block', width: 3, height: 32, marginLeft: 5,
              background: D.signal, boxShadow: `0 0 10px ${D.signal}`,
              verticalAlign: 'text-bottom',
              opacity: typed >= PROMPT.length ? (caretOn ? 1 : 0) : 1,
            }}
          />
        </span>

        <div
          style={{
            width: 62, height: 62, borderRadius: 17,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: sent ? D.signal : 'rgba(168,216,240,0.09)',
            transform: `scale(${sent ? 1 - 0.08 * flash : 1})`,
            willChange: 'transform',
          }}
        >
          <svg width={28} height={28} viewBox="0 0 24 24" fill="none"
            stroke={sent ? '#06241A' : D.mute} strokeWidth={2.4}
            strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="13 6 19 12 13 18" />
          </svg>
        </div>
      </div>

      <div
        style={{
          position: 'absolute', left: 150, top: '76%',
          ...label(D.faint, 16),
          opacity: interpolate(frame, [40, 56], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          }),
        }}
      >
        voice note or text · 14 slides · fully sourced
      </div>
    </div>
  );
};
