import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {INTER} from '../../lib/fonts';
import {C, EASE, ui} from '../lib/tokens';
import {CUE} from '../lib/timeline';

/**
 * 6.000-9.000s — NEW UPDATES
 *
 * Two concentric rings, 60px and 90px radius, pulsing scale 1 -> 1.3 -> 1 on a
 * 1200ms cycle while their opacity runs 0.3 -> 0 -> 0.3.
 *
 * The outer ring is offset half a cycle from the inner one. Pulsing them in
 * unison reads as one thick ring breathing; offset, it reads as something
 * radiating outward, which is what a notification should feel like.
 */
export const D3Updates: React.FC = () => {
  const frame = useCurrentFrame();
  const [t0, t1] = CUE.upd.text;
  const [c0, c1] = CUE.upd.circles;
  const [p0] = CUE.upd.pulse;

  const textIn = interpolate(frame, [t0, t1], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });
  const ringsIn = interpolate(frame, [c0, c1], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
  });

  // 1200ms = 36 frames.
  const cycle = (off: number) => {
    const t = ((frame - p0 + off) % 36 + 36) % 36;
    return t / 36;
  };

  const ring = (radius: number, offset: number) => {
    const t = cycle(offset);
    const scale = 1 + 0.3 * Math.sin(t * Math.PI);
    const op = 0.3 * (1 - Math.sin(t * Math.PI));
    return {radius, scale, op};
  };

  const rings = [ring(60, 0), ring(90, 18)];
  const glow = 1 + 0.05 * Math.sin(cycle(0) * Math.PI);

  return (
    <div style={{position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      {rings.map((r, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: r.radius * 2, height: r.radius * 2,
            marginLeft: -r.radius, marginTop: -r.radius,
            left: '50%', top: '50%',
            borderRadius: '50%',
            border: `2px dashed ${C.signal}`,
            opacity: ringsIn * r.op,
            transform: `scale(${r.scale})`,
            willChange: 'transform, opacity',
          }}
        />
      ))}

      <span
        style={{
          ...ui(56, C.text, 700),
          fontFamily: INTER,
          opacity: textIn,
          filter: `brightness(${glow})`,
          textShadow: `0 0 24px rgba(23,232,168,${0.35 * textIn})`,
          position: 'relative',
        }}
      >
        New Updates
      </span>
    </div>
  );
};
