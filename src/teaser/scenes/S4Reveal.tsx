import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {SceneGate} from '../components/SceneGate';
import {CodeRain} from '../components/CodeRain';
import {GlitchText} from '../components/GlitchText';
import {MONO} from '../lib/fonts';
import {COPY, EASE, PRODUCT, T} from '../lib/tokens';
import {S} from '../lib/timeline';

/**
 * SCENE 4 — Product reveal. Frames 210-300 (7.0 - 10.0s)
 *
 * The money shot. Code particles rise behind a centre punch-in while the
 * wordmark resolves out of glyph noise over 30 frames.
 *
 * The reveal is two curves running against each other: `resolve` walks the
 * characters from noise to their real glyphs left-to-right, while `tear` decays
 * the chromatic split from wide to zero. The name therefore arrives and *locks*,
 * which is a different feeling from a name that simply fades up.
 *
 * A scanline sweep passes down over the wordmark once it has settled, so the
 * final held frames still have something moving through them.
 */

const REVEAL_START = 216;
const REVEAL_FRAMES = 30;

export const S4Reveal: React.FC = () => {
  const frame = useCurrentFrame();

  // Centre punch-in across the whole scene.
  const punch = interpolate(frame, [S.reveal.start, S.reveal.start + 40], [1.14, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  const resolve = interpolate(frame, [REVEAL_START, REVEAL_START + REVEAL_FRAMES], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const tear = interpolate(frame, [REVEAL_START, REVEAL_START + REVEAL_FRAMES], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  const rainIn = interpolate(frame, [S.reveal.start, S.reveal.start + 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  const taglineIn = interpolate(frame, [252, 266], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  // Scanline sweep over the settled wordmark, 250 -> 300.
  const sweep = interpolate(frame, [250, 300], [-30, 130], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneGate start={S.reveal.start} end={S.reveal.end}>
      <AbsoluteFill style={{background: T.bg}} />
      <CodeRain opacity={rainIn * 0.85} />

      {/* Emerald-free neon bloom behind the mark. */}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            width: 900,
            height: 900,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(0,255,204,0.13) 0%, rgba(147,51,234,0.06) 45%, rgba(10,10,10,0) 72%)',
            filter: 'blur(30px)',
            opacity: rainIn,
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${punch})`,
          willChange: 'transform',
        }}
      >
        <div style={{position: 'relative'}}>
          <GlitchText
            text={PRODUCT}
            intensity={tear}
            resolve={resolve}
            style={{
              fontFamily: MONO,
              fontWeight: 800,
              fontSize: 104,
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
            }}
          />

          {/* Scanline sweep. A wide translucent band was the obvious approach and
              it reads as a grey censor bar over the wordmark; a thin bright line
              with a glow reads unmistakably as a scan passing across it. */}
          <div
            style={{
              position: 'absolute',
              inset: '-14% -6%',
              overflow: 'hidden',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: `${sweep}%`,
                height: 3,
                background: T.cyan,
                opacity: 0.6,
                boxShadow: `0 0 26px ${T.cyan}, 0 0 60px rgba(0,255,204,0.4)`,
              }}
            />
          </div>
        </div>

        <div
          style={{
            marginTop: 40,
            fontFamily: MONO,
            fontSize: 30,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: T.cyan,
            opacity: taglineIn * 0.85,
            transform: `translate3d(0, ${(1 - taglineIn) * 16}px, 0)`,
            textShadow: `0 0 16px ${T.cyan}`,
            willChange: 'transform, opacity',
          }}
        >
          {COPY.tagline}
        </div>
      </AbsoluteFill>
    </SceneGate>
  );
};
