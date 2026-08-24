import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {EASE, ACCENT, INK} from '../lib/easing';
import {BellIcon} from '../components/icons';

const ENTRANCE_FRAMES = 15;
const PULSE_PERIOD = 20;
const PULSE_COUNT = 3;

// Scene 5 — Notification (0:10.5–0:13)
// The bell scales in, then rings out exactly three sonar-style pulses — a
// scale/opacity ripple synced with a subtle "ding" scale-up of the bell.
export const Scene5Notification: React.FC = () => {
  const frame = useCurrentFrame();

  const entranceOpacity = interpolate(frame, [0, ENTRANCE_FRAMES], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const entranceScale = interpolate(frame, [0, ENTRANCE_FRAMES], [0.6, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  const pulseFrame = frame - ENTRANCE_FRAMES;
  const activePulse = Math.floor(pulseFrame / PULSE_PERIOD);
  const localPulse = pulseFrame - activePulse * PULSE_PERIOD;
  const inPulseWindow = pulseFrame >= 0 && activePulse < PULSE_COUNT;

  const pulseProgress = inPulseWindow
    ? interpolate(localPulse, [0, PULSE_PERIOD], [0, 1], {extrapolateRight: 'clamp'})
    : 0;

  const bellScale = inPulseWindow ? interpolate(pulseProgress, [0, 0.3, 1], [1, 1.12, 1]) : 1;

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div
        style={{
          position: 'relative',
          width: 220,
          height: 220,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {inPulseWindow && (
          <div
            style={{
              position: 'absolute',
              width: 140,
              height: 140,
              borderRadius: '50%',
              border: `2px solid ${ACCENT}`,
              opacity: interpolate(pulseProgress, [0, 1], [0.55, 0]),
              transform: `scale(${interpolate(pulseProgress, [0, 1], [1, 1.9])})`,
              willChange: 'transform, opacity',
            }}
          />
        )}
        <div
          style={{
            opacity: entranceOpacity,
            transform: `scale(${entranceScale * bellScale})`,
            willChange: 'transform, opacity',
            borderRadius: 999,
            padding: 26,
            boxShadow: '0 0 30px 6px rgba(139,92,246,0.3)',
          }}
        >
          <BellIcon size={80} color={INK} strokeWidth={1.8} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
