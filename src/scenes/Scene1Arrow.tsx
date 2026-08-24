import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {motion} from 'framer-motion';
import {EASE, ACCENT_SOFT, INK} from '../lib/easing';
import {INTER} from '../lib/fonts';
import {ArrowDownIcon} from '../components/icons';

// Scene 1 — Glowing Arrow (0:00–0:02.5)
// "Keep Moving" fades and rises in first, then a downward arrow fades in
// beneath it and settles into a continuous glow pulse + gentle bob, driven
// by a sine wave so the loop feels alive rather than mechanical.
export const Scene1Arrow: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const textOpacity = interpolate(frame, [2, 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const textY = interpolate(frame, [2, 24], [18, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  const arrowOpacity = interpolate(frame, [16, 36], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const arrowScale = interpolate(frame, [16, 36], [0.72, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  // Continuous glow + bob, ~1.1 cycles per second — computed from wall time
  // so it stays frame-accurate no matter where in the timeline we render.
  const pulse = Math.sin((frame / fps) * Math.PI * 2 * 1.1);
  const glowSpread = interpolate(pulse, [-1, 1], [6, 26]);
  const glowAlpha = interpolate(pulse, [-1, 1], [0.25, 0.7]);
  const bobY = interpolate(pulse, [-1, 1], [-5, 5]);

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 56}}>
        <motion.h1
          style={{
            margin: 0,
            fontFamily: INTER,
            fontWeight: 800,
            fontSize: 64,
            letterSpacing: '-0.02em',
            color: INK,
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
            willChange: 'transform, opacity',
          }}
        >
          Keep Moving
        </motion.h1>

        <div
          style={{
            opacity: arrowOpacity,
            transform: `translateY(${bobY}px) scale(${arrowScale})`,
            willChange: 'transform, opacity',
            borderRadius: 999,
            padding: 22,
            boxShadow: `0 0 ${glowSpread}px ${glowSpread * 0.5}px rgba(139,92,246,${glowAlpha})`,
          }}
        >
          <ArrowDownIcon size={64} color={ACCENT_SOFT} strokeWidth={2.2} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
