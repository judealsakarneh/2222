import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {MONO} from '../../lib/fonts';
import {C, DURATION, act, accent, fg, fgMuted, line, mix} from '../lib/tokens';

/**
 * The ground. One layer for the whole film whose colour is a function of the
 * act value, so the film changes temperature gradually instead of cutting at a
 * scene boundary — the same behaviour as the website's scroll-driven acts.
 */
export const Ground: React.FC = () => {
  const frame = useCurrentFrame();
  const t = act(frame);
  return (
    <>
      <AbsoluteFill style={{backgroundColor: mix(C.ink, C.paper, t)}} />
      {/* A wide teal bloom, low, so the dark acts are never flat black. */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(58% 40% at 50% 88%, rgba(0,169,164,0.16), rgba(0,169,164,0) 70%)',
          opacity: 1 - t,
        }}
      />
    </>
  );
};

/**
 * The status bar. Present from frame 0 to the last frame — it is the film's
 * constant, and it is what makes every scene read as one continuous broadcast
 * rather than six clips. The clock counts real elapsed time.
 */
export const StatusBar: React.FC = () => {
  const frame = useCurrentFrame();
  const t = act(frame);
  const secs = Math.floor(frame / 30);
  const clock = `00:${String(secs).padStart(2, '0')}`;
  // A square that blinks on a 30-frame cycle — an indicator, not decoration.
  const blip = frame % 30 < 18 ? 1 : 0.25;

  return (
    <div
      style={{
        position: 'absolute',
        top: 84,
        left: 84,
        right: 84,
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        fontFamily: MONO,
        fontSize: 24,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: fgMuted(t),
        borderTop: `1px solid ${line(t)}`,
        paddingTop: 26,
      }}
    >
      <span
        style={{
          width: 12,
          height: 12,
          background: accent(t),
          opacity: blip,
          flexShrink: 0,
        }}
      />
      <span style={{color: accent(t)}}>Live</span>
      <span>Amman</span>
      <span style={{marginLeft: 'auto', fontVariantNumeric: 'tabular-nums'}}>{clock}</span>
    </div>
  );
};

/**
 * A progress hairline across the bottom. Reels are watched on a loop; a viewer
 * who can see how much is left is measurably likelier to stay for the end card.
 */
export const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  const t = act(frame);
  const p = interpolate(frame, [0, DURATION - 1], [0, 1]);
  return (
    <div
      style={{
        position: 'absolute',
        left: 84,
        right: 84,
        bottom: 92,
        height: 2,
        background: line(t),
      }}
    >
      <div
        style={{
          width: `${p * 100}%`,
          height: '100%',
          background: accent(t),
          transformOrigin: 'left',
        }}
      />
    </div>
  );
};

/** Film grain. Large near-black fields band badly without it. */
export const Grain: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      opacity: 0.05,
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")",
    }}
  />
);

/** The wordmark, drawn at any size. */
export const Wordmark: React.FC<{size: number; t: number; gap?: number}> = ({
  size,
  t,
  gap = 0.42,
}) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: `${gap}em`,
      fontSize: size,
      lineHeight: 1,
    }}
  >
    <span style={{fontWeight: 900, letterSpacing: '-0.035em', color: fg(t)}}>CTRL</span>
    <span
      style={{
        fontSize: '0.6em',
        fontWeight: 500,
        letterSpacing: '0.3em',
        color: accent(t),
      }}
    >
      ROOM
    </span>
  </span>
);
