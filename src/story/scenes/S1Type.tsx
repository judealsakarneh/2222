import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {INTER} from '../../lib/fonts';
import {EASE, N, label, ui} from '../lib/tokens';

/**
 * SCENE 1 — Type. Frames 0-150 (5.0s). NIGHT.
 *
 * One idea: you say it in your own words.
 *
 * The prompt is set on TWO lines with the key phrase alone on the second, and
 * that second line sits at the exact vertical centre of frame. That is not a
 * layout accident — the zoom out of this scene pushes through it with
 * transform-origin at dead centre, so the phrase has to BE the centre for the
 * camera to travel into it cleanly.
 *
 * From frame 118 the scene begins its own push-in, so by the time the transition
 * takes over the camera is already moving and the handover is invisible.
 */

const LINE1 = 'an investor deck for my';
const LINE2 = 'handmade ceramics brand';

export const S1Type: React.FC = () => {
  const frame = useCurrentFrame();

  const l1 = Math.floor(
    interpolate(frame, [26, 62], [0, LINE1.length], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    })
  );
  const l2 = Math.floor(
    interpolate(frame, [64, 106], [0, LINE2.length], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    })
  );

  const caretOn = Math.floor(frame / 9) % 2 === 0;
  const done = l2 >= LINE2.length;

  const labelIn = interpolate(frame, [6, 24], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });

  // The key phrase lights up once it is complete, then the camera starts moving.
  const highlight = interpolate(frame, [108, 124], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });
  const preZoom = interpolate(frame, [118, 150], [1, 1.28], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });

  return (
    <div
      style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 80% 70% at 50% 46%, #121C24 0%, ${N.bg} 55%, ${N.bgDeep} 100%)`,
        fontFamily: INTER,
        transform: `scale(${preZoom})`,
        willChange: 'transform',
      }}
    >
      <div style={{position: 'absolute', top: 76, left: 0, right: 0, textAlign: 'center', opacity: labelIn}}>
        <span style={{...label(N.faint, 20)}}>you just say it</span>
      </div>

      {/* Line 2 is pinned to frame centre; line 1 hangs above it. */}
      <div style={{position: 'absolute', top: '50%', left: 0, right: 0, textAlign: 'center'}}>
        <div style={{position: 'absolute', bottom: 34, left: 0, right: 0}}>
          <span style={{...ui(66, N.mute, 400)}}>{LINE1.slice(0, l1)}</span>
        </div>

        <div style={{position: 'absolute', top: -46, left: 0, right: 0}}>
          <span
            style={{
              ...ui(78, N.text, 500),
              letterSpacing: '-0.02em',
              color: highlight > 0.5 ? N.signal : N.text,
              textShadow: highlight > 0.5 ? `0 0 ${40 * highlight}px rgba(23,232,168,0.45)` : 'none',
            }}
          >
            {LINE2.slice(0, l2)}
          </span>
          {!done ? (
            <span
              style={{
                display: 'inline-block', width: 4, height: 66, marginLeft: 8,
                background: N.signal, verticalAlign: 'text-bottom',
                opacity: caretOn ? 1 : 0.25,
                boxShadow: `0 0 14px ${N.signal}`,
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};
