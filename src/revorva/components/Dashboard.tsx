import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, COPY, FILLER_ROWS, FONT, LEDGER} from '../lib/brand';
import {progressAt} from '../lib/progress';
import {
  BEATS,
  EASE,
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
const FillerRow: React.FC<{i: number; slot: number; push: number}> = ({i, slot, push}) => {
  const f = FILLER[i];
  return (
    <div
      style={{
        position: 'absolute',
        left: TABLE_X,
        top: TABLE_Y + slot * ROW_H,
        transform: `translateY(${push}px)`,
        width: TABLE_W,
        height: ROW_H,
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        borderTop: `1px solid ${C.line}`,
        // The film is not about these. They sit back so the eye never has to
        // decide which row matters.
        opacity: 0.4,
      }}
    >
      <div style={{width: 34, height: 34, borderRadius: 10, background: C.surface2}} />
      <span style={{fontFamily: FONT.ui, fontSize: 19, color: C.fg2, flex: 1}}>{f.who}</span>
      <span style={mono(19, C.fg2)}>{f.amt}</span>
      <span style={{...mono(13, C.fg3), width: 120, textAlign: 'right'}}>{f.state}</span>
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
export const Dashboard: React.FC = () => {
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
  const {recede, morph} = progressAt(frame);

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
        background: C.surface,
        border: `1px solid ${C.line}`,
        boxShadow: '0 40px 120px -30px rgba(0,0,0,0.75)',
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
          borderBottom: `1px solid ${C.line}`,
        }}
      >
        <span
          style={{
            fontFamily: FONT.display,
            fontWeight: 700,
            fontSize: 22,
            color: C.fg,
            letterSpacing: '-0.02em',
          }}
        >
          {COPY.wordmark}
        </span>
        <span style={{...mono(12, C.fg3), textTransform: 'uppercase', letterSpacing: '0.16em'}}>
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
            background: interpolate(connect, [0, 1], [1, 0]) > 0.5 ? C.accent : C.greenSoft,
            border: `1px solid ${connect > 0.5 ? 'rgba(48,164,108,0.4)' : 'transparent'}`,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              background: connect > 0.5 ? C.green : 'rgba(255,255,255,0.9)',
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
                stroke={C.surface}
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
              color: connect > 0.5 ? C.greenLit : '#FFFFFF',
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
        <span style={{...mono(11, C.fg3), flex: 1, letterSpacing: '0.14em'}}>CUSTOMER</span>
        <span style={{...mono(11, C.fg3), letterSpacing: '0.14em'}}>AMOUNT</span>
        <span style={{...mono(11, C.fg3), width: 120, textAlign: 'right', letterSpacing: '0.14em'}}>
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
export const FillerRows: React.FC = () => {
  const frame = useCurrentFrame();
  const {recede, morph, lift, recovered} = progressAt(frame);

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
        return <FillerRow key={slot} i={i} slot={slot} push={push} />;
      })}
    </div>
  );
};

export {LEDGER};
