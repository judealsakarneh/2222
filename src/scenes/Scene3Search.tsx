import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {EASE, ACCENT_SOFT, INK, INK_DIM} from '../lib/easing';
import {INTER} from '../lib/fonts';
import {SearchIcon} from '../components/icons';

const FULL_TEXT = 'Search anything';
const TYPE_START = 20;
const FRAMES_PER_CHAR = 2.6;

// Scene 3 — Search Bar (0:05–0:07.5)
// The bar pops in, then the placeholder types out one character at a time
// with a blinking caret, as if someone were typing live into the field.
export const Scene3Search: React.FC = () => {
  const frame = useCurrentFrame();

  const barOpacity = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const barScale = interpolate(frame, [0, 16], [0.9, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  const charsVisible = Math.round(
    interpolate(
      frame,
      [TYPE_START, TYPE_START + FULL_TEXT.length * FRAMES_PER_CHAR],
      [0, FULL_TEXT.length],
      {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
    )
  );
  const typedText = FULL_TEXT.slice(0, charsVisible);
  const typingDone = charsVisible >= FULL_TEXT.length;
  const caretOn = Math.floor(frame / 14) % 2 === 0;

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          width: 640,
          padding: '26px 34px',
          borderRadius: 999,
          background: 'rgba(255,255,255,0.05)',
          border: '1.5px solid rgba(255,255,255,0.1)',
          boxShadow: '0 0 40px rgba(139,92,246,0.12), inset 0 0 0 1px rgba(255,255,255,0.02)',
          opacity: barOpacity,
          transform: `scale(${barScale})`,
          willChange: 'transform, opacity',
        }}
      >
        <SearchIcon size={30} color={ACCENT_SOFT} strokeWidth={2} />
        <span
          style={{
            fontFamily: INTER,
            fontWeight: 600,
            fontSize: 32,
            color: typedText ? INK : INK_DIM,
            letterSpacing: '-0.01em',
          }}
        >
          {typedText}
          <span style={{opacity: !typingDone || caretOn ? 1 : 0, color: ACCENT_SOFT}}>|</span>
        </span>
      </div>
    </AbsoluteFill>
  );
};
