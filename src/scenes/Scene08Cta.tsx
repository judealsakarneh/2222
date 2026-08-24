import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneShell} from '../components/SceneShell';
import {KineticWords} from '../components/KineticWords';
import {EASE_CAMERA, EASE_STANDARD, SPRING_BUTTON, SPRING_SETTLE} from '../lib/easing';
import {INTER, SERIF} from '../lib/fonts';
import {C, serifHead} from '../lib/tokens';

/**
 * SCENE 8 — CTA close. Frames 540-600 (18.00s - 20.00s)
 *
 * Everything lands in sequence rather than together: eyebrow (546), headline
 * word-by-word (550), button (566), url (582). Four beats in two seconds keeps
 * the pacing brisk right to the last frame.
 *
 * The button is deliberately under-damped (damping 12, stiffness 130) so it
 * overshoots and settles — a mechanical, tactile arrival that draws the eye to
 * the one thing we want clicked.
 *
 * From 576 two staggered rings expand out of the button on a 30-frame loop, so
 * frame 599 is still in motion. Nothing in this film ever freezes.
 *
 * Note: the brief specified the pulse as an animated box-shadow spread, but the
 * project's own rule is GPU-safe properties only (transform / opacity / filter).
 * A scaling ring element is pixel-equivalent and stays on the compositor.
 */

const START = 540;
const END = 600;

const RING_PERIOD = 30;
const RING_START = 576;
const RING_STAGGER = 15;

export const Scene08Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Scene arrives on the camera curve, 540-556.
  const arriveScale = interpolate(frame, [START, 556], [1.12, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_CAMERA,
  });
  const arriveOpacity = interpolate(frame, [START, 556], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_CAMERA,
  });

  // Eyebrow, 546-560.
  const eyebrowIn = interpolate(frame, [546, 558], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_STANDARD,
  });

  // Button, 566-586. Under-damped spring so it overshoots then settles.
  const buttonSpring = spring({
    frame: frame - 566,
    fps,
    config: SPRING_BUTTON,
    durationInFrames: 20,
  });
  const buttonOpacity = interpolate(frame, [566, 578], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_STANDARD,
  });

  // URL line, 582-600.
  const urlIn = interpolate(frame, [582, 594], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_STANDARD,
  });

  return (
    <SceneShell start={START} end={END}>
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          opacity: arriveOpacity,
          transform: `scale(${arriveScale})`,
          willChange: 'transform, opacity',
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            fontFamily: INTER,
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: C.ink,
            opacity: eyebrowIn,
            transform: `translate3d(0, ${(1 - eyebrowIn) * 16}px, 0)`,
            willChange: 'transform, opacity',
            marginBottom: 40,
          }}
        >
          Free to try
        </div>

        {/* Headline — "Get the deck." flips to emerald italic. */}
        <KineticWords
          text="Say it. Get the deck."
          startFrame={550}
          staggerFrames={2.5}
          durationInFrames={16}
          travelY={34}
          springConfig={SPRING_SETTLE}
          style={{
            ...serifHead(92, C.text),
            fontFamily: SERIF,
            maxWidth: 900,
            textAlign: 'center',
          }}
          wordStyle={(i) =>
            i >= 2 ? {fontStyle: 'italic', color: C.ink} : {}
          }
        />

        {/* Button + pulse rings */}
        <div
          style={{
            position: 'relative',
            marginTop: 64,
            opacity: buttonOpacity,
            transform: `translate3d(0, ${(1 - buttonSpring) * 26}px, 0)`,
            willChange: 'transform, opacity',
          }}
        >
          {[0, 1].map((k) => {
            const local = frame - RING_START - k * RING_STAGGER;
            if (local < 0) {
              return null;
            }
            const t = (local % RING_PERIOD) / RING_PERIOD;
            return (
              <div
                key={k}
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 999,
                  border: '2px solid rgba(23,232,168,0.45)',
                  opacity: 0.45 * (1 - t),
                  transform: `scale(${1 + 0.28 * t})`,
                  willChange: 'transform, opacity',
                  pointerEvents: 'none',
                }}
              />
            );
          })}

          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              padding: '34px 62px',
              borderRadius: 999,
              background: `linear-gradient(180deg, ${C.inkBright}, ${C.ink} 55%, #0FC98E)`,
              color: '#04120D',
              fontFamily: INTER,
              fontWeight: 700,
              fontSize: 34,
              boxShadow:
                '0 14px 30px -10px rgba(23,232,168,0.55), inset 0 1px 0 rgba(255,255,255,0.45)',
            }}
          >
            Start rambling
            <svg
              width={26}
              height={26}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="12" x2="19" y2="12" />
              <polyline points="13 6 19 12 13 18" />
            </svg>
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            marginTop: 44,
            fontFamily: INTER,
            fontWeight: 400,
            fontSize: 24,
            color: C.label,
            opacity: urlIn,
            transform: `translate3d(0, ${(1 - urlIn) * 14}px, 0)`,
            willChange: 'transform, opacity',
          }}
        >
          ramble.app — first deck in under a minute
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
