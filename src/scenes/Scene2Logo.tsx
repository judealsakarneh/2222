import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {motion} from 'framer-motion';
import {EASE, ACCENT, ACCENT_SOFT, INK} from '../lib/easing';
import {INTER} from '../lib/fonts';
import {LogoMark} from '../components/icons';

const RADIUS = 92;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Scene 2 — Logo Reveal (0:02.5–0:05)
// A ring draws itself clockwise from 12 o'clock via stroke-dashoffset, the
// play-mark logo scales in once the ring nears completion, and the
// wordmark rises in beneath it.
export const Scene2Logo: React.FC = () => {
  const frame = useCurrentFrame();

  const drawProgress = interpolate(frame, [0, 42], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const dashoffset = CIRCUMFERENCE * (1 - drawProgress);

  const markOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const markScale = interpolate(frame, [30, 50], [0.5, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  const textOpacity = interpolate(frame, [46, 66], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const textY = interpolate(frame, [46, 66], [14, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40}}>
        <div style={{position: 'relative', width: 220, height: 220, willChange: 'transform'}}>
          <svg width={220} height={220} viewBox="0 0 220 220" style={{transform: 'rotate(-90deg)'}}>
            <circle cx="110" cy="110" r={RADIUS} stroke="rgba(255,255,255,0.08)" strokeWidth={4} fill="none" />
            <circle
              cx="110"
              cy="110"
              r={RADIUS}
              stroke={ACCENT}
              strokeWidth={4}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashoffset}
              style={{filter: `drop-shadow(0 0 10px ${ACCENT_SOFT})`}}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: markOpacity,
              transform: `scale(${markScale})`,
              willChange: 'transform, opacity',
            }}
          >
            <LogoMark size={72} color={INK} />
          </div>
        </div>

        <motion.h2
          style={{
            margin: 0,
            fontFamily: INTER,
            fontWeight: 800,
            fontSize: 52,
            letterSpacing: '-0.01em',
            color: INK,
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
            willChange: 'transform, opacity',
          }}
        >
          YouMotion
        </motion.h2>
      </div>
    </AbsoluteFill>
  );
};
