import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {INTER} from '../../lib/fonts';
import {C, EASE, ui} from '../lib/tokens';
import {CUE, DURATION} from '../lib/timeline';

/**
 * 9.000-13.000s — AI AGENT CHAT WINDOW
 *
 * The centrepiece. Container scales 90% -> 105% -> 100%, header fades, the
 * bubble slides in from the left, the message types at 70ms per character, and
 * three thinking dots loop underneath.
 *
 * 70ms/char is 2.1 frames — deliberately NOT rounded to 2. Rounding would drift
 * the line's finish by ~4 frames over 45 characters and desync it from the dots.
 */

const MESSAGE = 'Hello, Mark. What are we pitching today?';

export const D4Chat: React.FC<{
  /** Scene 5 slides this window away; it drives the exit from outside. */
  exit?: number;
}> = ({exit = 0}) => {
  const frame = useCurrentFrame();
  const {container, header, bubble, typeStart, msPerChar, dots} = CUE.chat;

  const scale = interpolate(frame, [container[0], container[1], container[2]], [0.9, 1.05, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });
  const shellIn = interpolate(frame, [container[0], container[2]], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });
  const headerP = interpolate(frame, [header[0], header[1]], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });
  const bubbleP = interpolate(frame, [bubble[0], bubble[1]], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });

  const framesPerChar = (msPerChar * 30) / 1000;
  const chars = Math.max(
    0,
    Math.min(MESSAGE.length, Math.floor((frame - typeStart) / framesPerChar))
  );
  const typing = chars < MESSAGE.length;

  // Cursor blinks on a 0.8s loop = 24 frames.
  const caretOn = frame % 24 < 12;

  const dotsIn = interpolate(frame, [dots, dots + 9], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });

  return (
    <div
      style={{
        width: 640,
        borderRadius: 12,
        overflow: 'hidden',
        background: C.panel2,
        boxShadow: '0 30px 90px -20px rgba(0,0,0,0.85)',
        border: `1px solid ${C.border}`,
        fontFamily: INTER,
        opacity: shellIn * (1 - exit * 0.6),
        transform: `translateX(${exit * -200}px) scale(${scale * (1 - exit * 0.4)})`,
        filter: exit > 0 && exit < 1 ? `blur(${Math.sin(exit * Math.PI) * 8}px)` : undefined,
        willChange: 'transform, opacity, filter',
      }}
    >
      {/* Header */}
      <div
        style={{
          height: 44, background: C.header,
          display: 'flex', alignItems: 'center', gap: 14, padding: '0 16px',
          opacity: headerP,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{display: 'flex', gap: 7}}>
          {[0, 1].map((i) => (
            <div key={i} style={{width: 12, height: 12, borderRadius: '50%', background: '#33333D'}} />
          ))}
        </div>
        <span
          style={{
            fontSize: 14, fontWeight: 600, letterSpacing: 1.5,
            textTransform: 'uppercase', color: C.mute, marginLeft: 6,
          }}
        >
          AI Agent
        </span>
        <div style={{flex: 1}} />
        <div
          style={{
            width: 7, height: 7, borderRadius: '50%', background: C.signal,
            boxShadow: `0 0 8px ${C.glow}`,
          }}
        />
      </div>

      {/* Body */}
      <div style={{padding: 24, height: 356, display: 'flex', flexDirection: 'column'}}>
        <div
          style={{
            alignSelf: 'flex-start',
            maxWidth: 480,
            background: C.bubble,
            borderRadius: 12,
            padding: 16,
            opacity: bubbleP,
            transform: `translateX(${(1 - bubbleP) * -20}px)`,
            willChange: 'transform, opacity',
          }}
        >
          <span style={{...ui(16, C.text), lineHeight: 1.6}}>
            {MESSAGE.slice(0, chars)}
            <span
              style={{
                display: 'inline-block', width: 2, height: 16, marginLeft: 3,
                background: C.signal, verticalAlign: 'text-bottom',
                opacity: typing ? 1 : caretOn ? 1 : 0,
              }}
            />
          </span>
        </div>

        {/* Thinking dots — 500ms bounce, 150ms stagger, loops */}
        <div style={{display: 'flex', gap: 8, marginTop: 18, marginLeft: 6, opacity: dotsIn}}>
          {[0, 1, 2].map((i) => {
            // 500ms = 15 frames; 150ms stagger = 4.5 frames.
            const t = ((frame - dots - i * 4.5) % 15 + 15) % 15;
            const s = 1 + 0.4 * Math.sin((t / 15) * Math.PI);
            return (
              <div
                key={i}
                style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: C.signal,
                  transform: `scale(${s})`,
                  willChange: 'transform',
                }}
              />
            );
          })}
        </div>

        <div style={{flex: 1}} />

        {/* Composer. A 640x400 window holding one bubble is mostly void; the
            input row is what a real chat client has there. */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '13px 16px', borderRadius: 10,
            background: C.header, border: `1px solid ${C.border}`,
            opacity: headerP * 0.9,
          }}
        >
          <span style={{...ui(15, C.faint)}}>Ask anything…</span>
          <div style={{flex: 1}} />
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
            stroke={C.signal} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export const CHAT_MESSAGE = MESSAGE;
export const CHAT_END = DURATION;
