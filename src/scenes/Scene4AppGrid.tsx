import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ACCENT_SOFT, INK} from '../lib/easing';
import {
  MailIcon,
  CameraIcon,
  MusicIcon,
  ChatIcon,
  HeartIcon,
  CalendarIcon,
  PhotoIcon,
  CompassIcon,
  SettingsIcon,
} from '../components/icons';

const ICONS = [MailIcon, CameraIcon, MusicIcon, ChatIcon, HeartIcon, CalendarIcon, PhotoIcon, CompassIcon, SettingsIcon];
const STAGGER_FRAMES = 3; // 100ms at 30fps

// Scene 4 — App Icon Grid (0:07.5–0:10.5)
// Nine tiles pop into a 3x3 grid with a 100ms stagger. Each tile uses a
// spring (not the shared bezier) so it overshoots slightly on the way in —
// that tactile bounce is what sells a grid of icons "landing" in place.
export const Scene4AppGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 176px)',
          gridTemplateRows: 'repeat(3, 176px)',
          gap: 36,
        }}
      >
        {ICONS.map((Icon, i) => {
          const delay = i * STAGGER_FRAMES;
          const springProgress = spring({
            frame: frame - delay,
            fps,
            config: {damping: 12, stiffness: 140, mass: 0.7},
          });
          const opacity = interpolate(frame - delay, [0, 10], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={i}
              style={{
                width: 176,
                height: 176,
                borderRadius: 40,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 0 30px rgba(139,92,246,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity,
                transform: `scale(${springProgress})`,
                willChange: 'transform, opacity',
              }}
            >
              <Icon size={64} color={i % 2 === 0 ? INK : ACCENT_SOFT} strokeWidth={1.6} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
