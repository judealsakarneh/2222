import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COPY, FONT, LEDGER} from '../lib/brand';
import type {Theme} from '../lib/theme';
import {progressAt} from '../lib/progress';
import {
  BEATS,
  EASE,
  HERO_Y,
  MAIL,
  ROW_H,
  TABLE_W,
  TABLE_X,
  ms,
} from '../lib/timeline';

const mono = (size: number, color: string): React.CSSProperties => ({
  fontFamily: FONT.mono,
  fontSize: size,
  color,
  fontVariantNumeric: 'tabular-nums',
  letterSpacing: '0.02em',
});

/**
 * The status pill.
 *
 * A tinted pill with lit type, never a solid block with white type. That was
 * settled by measurement in brand.ts: white on solid #E5484D is 3.91:1 and
 * fails, the tint construction is 5.34:1 and passes. It is also the softer
 * read, which is what was asked for - a solid red badge is an alarm, and the
 * subject of this film is the recovery, not the decline.
 */
const Pill: React.FC<{tone: 'idle' | 'failed' | 'recovered'; p: number; T: Theme}> = ({tone, p, T}) => {
  const map = {
    idle: {bg: 'transparent', fg: T.fg3, label: 'Processing'},
    failed: {bg: T.redSoft, fg: T.redLit, label: 'Failed'},
    recovered: {bg: T.greenSoft, fg: T.greenLit, label: 'Recovered'},
  } as const;
  const m = map[tone];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        height: 30,
        padding: '0 12px',
        borderRadius: 8,
        background: m.bg,
        // Scales from 0.94, never from 0. A pill that grows from nothing reads
        // as an object appearing; one that grows from nearly itself reads as a
        // state changing, which is what actually happened.
        transform: `scale(${0.94 + p * 0.06})`,
        opacity: p,
      }}
    >
      {tone !== 'idle' ? (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            background: m.fg,
          }}
        />
      ) : null}
      <span style={{fontFamily: FONT.ui, fontWeight: 600, fontSize: 14, color: m.fg}}>
        {m.label}
      </span>
    </span>
  );
};

/**
 * The element the entire film happens to.
 *
 * It is on screen continuously from frame 0 until the close, and it is always
 * the same DOM node: the row does not fade out so an email can fade in, it
 * changes shape into the email and changes back. Width, height and radius are
 * one interpolation each, so at every frame there is exactly one object, in one
 * place, mid-way between two states it genuinely occupies.
 *
 * That is the whole trick behind "no cuts". A crossfade between a row and a
 * card is two objects and a moment where neither is real; a morph is one object
 * the viewer never loses track of.
 */
export const MorphRow: React.FC<{T: Theme}> = ({T}) => {
  const frame = useCurrentFrame();
  const t = (frame / 60) * 1000;
  const W = BEATS.work;

  // --- state progressions, from the one place that computes them ----------
  const {failed, lift, morph: m, recovered, recede} = progressAt(frame);

  // --- geometry -----------------------------------------------------------
  // The row's resting box and the email's box, blended by `morph`. Because the
  // blend runs on the box rather than on opacity, the object is never absent.
  const rowBox = {x: TABLE_X, y: HERO_Y, w: TABLE_W, h: ROW_H, r: 0};
  const mailBox = {
    x: MAIL.cx - MAIL.w / 2,
    y: MAIL.cy - MAIL.h / 2,
    w: MAIL.w,
    h: MAIL.h,
    r: MAIL.r,
  };

  const box = {
    x: interpolate(m, [0, 1], [rowBox.x, mailBox.x]),
    y: interpolate(m, [0, 1], [rowBox.y, mailBox.y]),
    w: interpolate(m, [0, 1], [rowBox.w, mailBox.w]),
    h: interpolate(m, [0, 1], [rowBox.h, mailBox.h]),
    r: interpolate(m, [0, 1], [rowBox.r, mailBox.r]),
  };

  // The lift: the row rises off the table before anything else happens to it,
  // so the morph reads as happening to an object that is already in the air.
  const liftY = -14 * lift * (1 - recovered);
  const liftShadow = lift * (1 - recovered);

  // The email does NOT fly away, and this is the correction to the first build
  // rather than a preference. The email and the recovered row are the same
  // object; having it leave upward while fading meant it was gone at the exact
  // moment it was supposed to arrive back in the table, and the film played a
  // full second with an empty slot where the payoff should have been. One
  // element cannot both exit and return.
  //
  // So it returns: the morph runs back down to the row, the status flips to
  // Recovered underneath it, and the dispatch is carried by SentChip below -
  // a second, smaller element that can leave without taking the subject with it.
  const showMail = m > 0.02;

  // The row recedes for the close with the rest of the dashboard - but a beat
  // later than the table does. It is the subject, so it is the last thing to
  // let go, and holding it a fraction longer is what makes the close read as
  // the film settling rather than as everything being switched off at once.
  //
  // Without this it stayed sharp and lit while everything behind it defocused,
  // and the recovered row cut straight through the middle of the wordmark.
  const rowRecede = interpolate(recede, [0.25, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        borderRadius: box.r,
        transform: `translateY(${liftY}px)`,
        opacity: 1 - rowRecede * 0.92,
        filter: rowRecede > 0.001 ? `blur(${rowRecede * 7}px)` : undefined,
        background: interpolate(m, [0, 1], [0, 1]) > 0.02 ? T.surface2 : 'transparent',
        border: m > 0.02 ? `1px solid ${T.line}` : `1px solid transparent`,
        borderTop: m > 0.02 ? `1px solid ${T.line}` : `1px solid ${T.line}`,
        boxShadow: `0 ${18 * liftShadow + 30 * m}px ${44 * liftShadow + 80 * m}px -${
          10 * liftShadow + 20 * m
        }px rgba(0,0,0,${0.5 * liftShadow + 0.4 * m})`,
        overflow: 'hidden',
      }}
    >
      {/* ---- row face ---- */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          paddingLeft: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          // The two faces cross over the middle of the morph. Neither is ever
          // fully absent while the other is fully present.
          opacity: interpolate(m, [0, 0.42], [1, 0], {extrapolateRight: 'clamp'}),
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: T.surface2,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: FONT.ui,
            fontWeight: 500,
            fontSize: 19,
            color: T.fg,
            flex: 1,
            whiteSpace: 'nowrap',
          }}
        >
          {LEDGER.customer}
        </span>
        <span style={mono(19, T.fg)}>{LEDGER.amount}</span>
        <span
          style={{
            width: 160,
            display: 'flex',
            justifyContent: 'flex-end',
            flexShrink: 0,
          }}
        >
          {/* Three states, one slot. They cross-dissolve in place rather than
              sliding, so the row's right edge never moves. */}
          <span style={{position: 'relative', display: 'inline-flex'}}>
            <span style={{opacity: 1 - failed}}>
              <Pill tone="idle" p={1} T={T} />
            </span>
            <span style={{position: 'absolute', right: 0, top: 0}}>
              <Pill tone="failed" p={failed * (1 - recovered)} T={T} />
            </span>
            <span style={{position: 'absolute', right: 0, top: 0}}>
              <Pill tone="recovered" p={recovered} T={T} />
            </span>
          </span>
        </span>
      </div>

      {/* ---- email face ---- */}
      {showMail ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            padding: 40,
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            opacity: interpolate(m, [0.38, 0.8], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
            <span
              style={{...mono(11, T.fg3), letterSpacing: '0.16em', textTransform: 'uppercase'}}
            >
              To
            </span>
            <span style={{fontFamily: FONT.ui, fontSize: 16, color: T.fg2}}>
              {LEDGER.customer}
            </span>
          </div>
          <div
            style={{
              fontFamily: FONT.display,
              fontWeight: 600,
              fontSize: 34,
              lineHeight: 1.18,
              letterSpacing: '-0.02em',
              color: T.fg,
            }}
          >
            {/* Written here, not quoted from Revorva. Their own subject line
                will be better - this is the shape it needs to be. */}
            Your payment didn&rsquo;t go through
          </div>
          <div
            style={{
              fontFamily: FONT.ui,
              fontSize: 17,
              lineHeight: 1.6,
              color: T.fg2,
              // 64ch, not 58. At 58 the sentence broke three ways and left
              // "it." alone on the last line, which is the one thing a two-line
              // paragraph must not do.
              maxWidth: '64ch',
            }}
          >
            We tried {LEDGER.amount} for {LEDGER.plan}. The card was declined,
            and one tap fixes it.
          </div>

          {/* The decline detail. It fills the dead space the short body left
              above the button, and it is the line that makes the email read as
              a real notification rather than a mock of one: this is what the
              customer actually needs to know. 4242 is Stripe's published test
              card, which this audience reads as a test on sight. */}
          <div
            style={{
              ...mono(13, T.fg3),
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span>{LEDGER.card}</span>
            <span style={{opacity: 0.5}}>·</span>
            <span>{LEDGER.declineCode}</span>
          </div>
          <div
            style={{
              marginTop: 'auto',
              alignSelf: 'flex-start',
              height: 46,
              padding: '0 22px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: 10,
              background: T.accent,
              fontFamily: FONT.ui,
              fontWeight: 600,
              fontSize: 15,
              color: '#FFFFFF',
            }}
          >
            Update payment method
          </div>
        </div>
      ) : null}
    </div>
  );
};

/**
 * The retry attempts, ticking in under the lifted row.
 *
 * Staggered 520 ms apart. They are the only thing in the film that arrives on a
 * beat rather than continuously, because a retry IS a discrete event and
 * smoothing it would misrepresent what the product does.
 */
export const Retries: React.FC<{T: Theme}> = ({T}) => {
  const frame = useCurrentFrame();
  const t = (frame / 60) * 1000;
  const W = BEATS.work;

  const {lift} = progressAt(frame);

  // They leave as the morph begins - the schedule hands over to the email.
  const out = interpolate(t, [W.morphAt, W.morphAt + 420], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  if (out <= 0.01 || lift <= 0.01) return null;

  const labels = ['Retry · 1h', 'Retry · 24h', 'Retry · 72h'];

  return (
    <div
      style={{
        position: 'absolute',
        left: TABLE_X + 58,
        // Sits in the gap the list opened rather than at a fixed offset. The
        // chips and the space they occupy are driven by the same `lift`, so
        // they cannot arrive before there is room for them.
        top: HERO_Y + ROW_H + 10 + lift * 14,
        display: 'flex',
        gap: 12,
        opacity: out * lift,
      }}
    >
      {labels.slice(0, W.retries).map((label, i) => {
        const p = interpolate(
          t,
          [W.retryAt + i * W.retryStagger, W.retryAt + i * W.retryStagger + 420],
          [0, 1],
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE},
        );
        return (
          <span
            key={label}
            style={{
              height: 32,
              padding: '0 14px',
              display: 'inline-flex',
              alignItems: 'center',
              borderRadius: 8,
              background: T.surface2,
              border: `1px solid ${T.line}`,
              ...mono(13, T.fg2),
              opacity: p,
              transform: `translateY(${(1 - p) * 10}px)`,
            }}
          >
            {label}
          </span>
        );
      })}
    </div>
  );
};

/**
 * The dispatch.
 *
 * A small chip that rises out of the email and fades, at the moment the email
 * is sent. It exists because the email itself cannot leave - it is the same
 * object as the row and has to be there when the row comes back - so the
 * departure had to be given to something expendable.
 *
 * It starts 300 ms before the row begins morphing home, so the send and the
 * return overlap rather than queue.
 */
export const SentChip: React.FC<{T: Theme}> = ({T}) => {
  const frame = useCurrentFrame();
  const t = (frame / 60) * 1000;
  const W = BEATS.work;

  const p = interpolate(t, [W.sendAt, W.sendAt + W.sendMove], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  if (p <= 0.001 || p >= 0.999) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: MAIL.cx - 70,
        top: MAIL.cy - MAIL.h / 2 - 16,
        width: 140,
        display: 'flex',
        justifyContent: 'center',
        transform: `translateY(${-64 * p}px)`,
        // Up fast, gone slowly. A chip that fades linearly reads as a UI toast;
        // one that holds then releases reads as something leaving.
        opacity: interpolate(p, [0, 0.25, 1], [0, 1, 0]),
      }}
    >
      <span
        style={{
          height: 34,
          padding: '0 16px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 9,
          borderRadius: 999,
          background: T.greenSoft,
          border: `1px solid rgba(48,164,108,0.34)`,
          fontFamily: FONT.ui,
          fontWeight: 600,
          fontSize: 14,
          color: T.greenLit,
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{width: 6, height: 6, borderRadius: 3, background: T.greenLit}} />
        Recovery email sent
      </span>
    </div>
  );
};
