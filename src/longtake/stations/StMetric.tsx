import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Caption} from '../components/Caption';
import {INTER, SERIF} from '../../lib/fonts';
import {STATIONS} from '../lib/camera';
import {EASE, L, label, serif} from '../lib/tokens';

/**
 * STATION 6 — The metric. Arrives 745, holds 70.
 *
 * Not another count-up. The claim here is a RATIO, so it is shown as one: a full
 * width bar for "three days" collapses down to a stub for "47 seconds", and the
 * stub is the only emerald thing on screen.
 *
 * Collapsing the bar rather than counting a number means the viewer sees the
 * size of the difference instead of reading it — the bar ends up at 2% of its
 * starting width, which is roughly the real ratio.
 */

const A = STATIONS[6].arrive;
const COLLAPSE_START = A - 6;
const COLLAPSE_FRAMES = 26;

export const StMetric: React.FC = () => {
  const frame = useCurrentFrame();

  const barIn = interpolate(frame, [A - 80, A - 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  // 100% -> 2.4%: the real ratio of 47s to three working days.
  const collapse = interpolate(
    frame,
    [COLLAPSE_START, COLLAPSE_START + COLLAPSE_FRAMES],
    [100, 2.4],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE}
  );
  const collapsed = interpolate(
    frame,
    [COLLAPSE_START + 8, COLLAPSE_START + COLLAPSE_FRAMES],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE}
  );

  const numberIn = interpolate(frame, [A + 16, A + 34], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  return (
    <div
      style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 62}}
    >
      <div style={{width: 800, opacity: barIn}}>
        {/* Before */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 16,
          }}
        >
          <span style={{...label(L.mist, 19), fontFamily: INTER}}>Doing it yourself</span>
          <span
            style={{
              ...label(L.mist, 19),
              fontFamily: INTER,
              opacity: 1 - collapsed * 0.55,
              textDecoration: collapsed > 0.6 ? 'line-through' : 'none',
            }}
          >
            three days
          </span>
        </div>

        {/* The bar. Track stays full width so the collapse is measurable. */}
        <div
          style={{
            height: 16,
            borderRadius: 999,
            background: 'rgba(168,216,240,0.08)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${collapse}%`,
              borderRadius: 999,
              background:
                collapsed > 0.5
                  ? `linear-gradient(90deg, ${L.signalDim}, ${L.signal})`
                  : `linear-gradient(90deg, ${L.iceDim}, ${L.ice})`,
              boxShadow: collapsed > 0.5 ? `0 0 22px ${L.signal}` : 'none',
              willChange: 'width',
            }}
          />
        </div>

        {/* After */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 16,
            opacity: collapsed,
          }}
        >
          <span style={{...label(L.signal, 19), fontFamily: INTER}}>With {'zamble'}</span>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          opacity: numberIn,
          transform: `scale(${0.9 + 0.1 * numberIn})`,
          filter: `drop-shadow(0 0 44px rgba(23,232,168,0.45))`,
          willChange: 'transform, opacity',
        }}
      >
        <span style={{...serif(240, L.signal), fontFamily: SERIF}}>47</span>
        <span style={{...serif(110, L.mist), fontFamily: SERIF}}>s</span>
      </div>

      <Caption text="Start to finish." from={A + 30} size={50} color={L.mist} />
    </div>
  );
};
