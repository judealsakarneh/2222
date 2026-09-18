import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COPY, FILLER_ROWS, FONT, LEDGER} from '../lib/brand';
import type {Theme} from '../lib/theme';
import {progressAt} from '../lib/progress';
import {
  BEATS,
  EASE,
  snap,
  HEAD_H,
  PANEL,
  ROWS,
  ROW_H,
  TABLE_W,
  TABLE_X,
  TABLE_Y,
  HERO_INDEX,
  ms,
} from '../lib/timeline';

/** The quiet rows. Fictional names, held in brand.ts with everything else. */
const FILLER = FILLER_ROWS;

const mono = (size: number, color: string): React.CSSProperties => ({
  fontFamily: FONT.mono,
  fontSize: size,
  color,
  fontVariantNumeric: 'tabular-nums',
  letterSpacing: '0.02em',
});

/** A quiet row. Present so the hero row reads as one of many, not as a poster. */
const FillerRow: React.FC<{i: number; slot: number; push: number; T: Theme; enter: number}> = ({
  i,
  slot,
  push,
  T,
  enter,
}) => {
  const f = FILLER[i];
  // Each row lands 55 ms after the one above it. The film now opens on movement
  // rather than on a held frame, which is most of why it reads faster than the
  // five seconds it actually saved.
  const e = snap(enter, 0.06);
  return (
    <div
      style={{
        position: 'absolute',
        left: TABLE_X,
        top: TABLE_Y + slot * ROW_H,
        transform: `translateY(${push + (1 - e) * 26}px)`,
        width: TABLE_W,
        height: ROW_H,
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        borderTop: `1px solid ${T.line}`,
        // The film is not about these. They sit back so the eye never has to
        // decide which row matters.
        opacity: 0.4 * Math.min(1, enter * 1.8),
      }}
    >
      <div style={{width: 34, height: 34, borderRadius: 10, background: T.surface2}} />
      <span style={{fontFamily: FONT.ui, fontSize: 19, color: T.fg2, flex: 1}}>{f.who}</span>
      <span style={mono(19, T.fg2)}>{f.amt}</span>
      <span style={{...mono(13, T.fg3), width: 120, textAlign: 'right'}}>{f.state}</span>
    </div>
  );
};

/**
 * The application window.
 *
 * It is on screen for the entire film. Nothing here enters or exits: the camera
 * moves and the window stays, which is the whole reason the piece has no cuts.
 * The only thing that changes is the Stripe connection state in the header.
 */
export const Dashboard: React.FC<{T: Theme}> = ({T}) => {
  const frame = useCurrentFrame();
  const t = (frame / 60) * 1000;

  const connect = interpolate(
    t,
    [BEATS.connect.at, BEATS.connect.at + BEATS.connect.move],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE},
  );
  const check = interpolate(
    t,
    [BEATS.connect.checkAt, BEATS.connect.checkAt + 420],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE},
  );

  // The dashboard recedes for the close rather than cutting away. It is still
  // there underneath the lockup, just out of focus and dim.
  const {recede, morph, enter} = progressAt(frame);

  // It also gives way while the email is out. Without this the table stayed at
  // full strength behind the card and the frame had two subjects competing;
  // dimming in proportion to the morph means the handover of attention is the
  // same continuous value as the handover of shape.

  return (
    <div
      style={{
        position: 'absolute',
        left: PANEL.x,
        top: PANEL.y,
        width: PANEL.w,
        height: PANEL.h,
        borderRadius: PANEL.r,
        background: T.surface,
        border: `1px solid ${T.line}`,
        boxShadow: T.panelShadow,
        // The window itself lands with a 2% scale snap under the cascade.
        transform: `scale(${0.98 + snap(enter, 0.05) * 0.02})`,
        opacity: (1 - recede * 0.72) * (1 - morph * 0.45),
        filter: `blur(${recede * 7 + morph * 3}px)`,
      }}
    >
      {/* Header */}
      <div
        style={{
          height: HEAD_H,
          padding: '0 40px',
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          borderBottom: `1px solid ${T.line}`,
        }}
      >
        <span
          style={{
            fontFamily: FONT.display,
            fontWeight: 700,
            fontSize: 22,
            color: T.fg,
            letterSpacing: '-0.02em',
          }}
        >
          {COPY.wordmark}
        </span>
        <span style={{...mono(12, T.fg3), textTransform: 'uppercase', letterSpacing: '0.16em'}}>
          Payments
        </span>

        {/* The Stripe connection. Goes from an offer to a state - the button
            does not disappear and get replaced by a pill, it becomes one. */}
        <div
          style={{
            marginLeft: 'auto',
            height: 44,
            paddingLeft: 20,
            paddingRight: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            borderRadius: 10,
            background: interpolate(connect, [0, 1], [1, 0]) > 0.5 ? T.accent : T.greenSoft,
            border: `1px solid ${connect > 0.5 ? 'rgba(48,164,108,0.4)' : 'transparent'}`,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              background: connect > 0.5 ? T.green : 'rgba(255,255,255,0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${0.85 + check * 0.15})`,
            }}
          >
            {/* The check draws itself rather than fading in. */}
            <svg width="11" height="11" viewBox="0 0 11 11" aria-hidden>
              <path
                d="M2 5.6 L4.4 8 L9 3"
                fill="none"
                stroke={T.surface}
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="11"
                strokeDashoffset={11 - check * 11}
              />
            </svg>
          </div>
          <span
            style={{
              fontFamily: FONT.ui,
              fontWeight: 600,
              fontSize: 14,
              color: connect > 0.5 ? T.greenLit : '#FFFFFF',
              whiteSpace: 'nowrap',
            }}
          >
            {connect > 0.5 ? 'Stripe connected' : 'Connect Stripe'}
          </span>
        </div>
      </div>

      {/* Column heads */}
      <div
        style={{
          position: 'absolute',
          left: TABLE_X - PANEL.x,
          top: TABLE_Y - PANEL.y - 34,
          width: TABLE_W,
          display: 'flex',
          gap: 24,
        }}
      >
        <span style={{...mono(11, T.fg3), flex: 1, letterSpacing: '0.14em'}}>CUSTOMER</span>
        <span style={{...mono(11, T.fg3), letterSpacing: '0.14em'}}>AMOUNT</span>
        <span style={{...mono(11, T.fg3), width: 120, textAlign: 'right', letterSpacing: '0.14em'}}>
          STATUS
        </span>
      </div>
    </div>
  );
};

/**
 * The filler rows, drawn in world space rather than inside the panel so the
 * hero row can sit among them in the same coordinate system and still lift out.
 */
export const FillerRows: React.FC<{T: Theme}> = ({T}) => {
  const frame = useCurrentFrame();
  const {recede, morph, lift, recovered, enter} = progressAt(frame);

  let f = 0;
  return (
    <div
      style={{
        opacity: (1 - recede * 0.85) * (1 - morph * 0.5),
        filter: `blur(${recede * 7 + morph * 3}px)`,
      }}
    >
      {new Array(ROWS).fill(0).map((_, slot) => {
        if (slot === HERO_INDEX) return null;
        const i = f++ % FILLER.length;
        // Rows below the hero slide down as it lifts, opening the gap the retry
        // schedule appears in. The first build put the chips at a fixed offset
        // and they landed on top of the next row's name; making the list
        // actually make room is both the fix and the more honest behaviour -
        // this is what an expanding row does.
        // Relaxes with `recovered` so the gap closes as the row settles home,
        // rather than leaving a hole in the table through the close.
        const push = slot > HERO_INDEX ? lift * (1 - recovered) * 62 : 0;
        // Rows further down the table start later. Staggering by SLOT rather
        // than by list index keeps the cascade travelling downward even though
        // the hero row is skipped in the middle of it.
        const delay = (slot * BEATS.enter.stagger) / BEATS.enter.move;
        const e = Math.max(0, Math.min(1, (enter - delay) / (1 - delay || 1)));
        return <FillerRow key={slot} i={i} slot={slot} push={push} T={T} enter={e} />;
      })}
    </div>
  );
};

export {LEDGER};
