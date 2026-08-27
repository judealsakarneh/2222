import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {ARCHIVO, MONO} from '../../lib/fonts';
import {MaskLine, Rise} from '../components/Type';
import {CtrlCard} from '../components/CtrlCard';
import {Wordmark} from '../components/Chrome';
import {C, EASE, S, accent, act, fg, fgMuted, line} from '../lib/tokens';

const PAD = 84;

const display = (size: number, t: number): React.CSSProperties => ({
  fontFamily: ARCHIVO,
  fontWeight: 800,
  fontSize: size,
  lineHeight: 0.96,
  letterSpacing: '-0.035em',
  color: fg(t),
});

const label = (t: number): React.CSSProperties => ({
  fontFamily: MONO,
  fontWeight: 500,
  fontSize: 24,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: fgMuted(t),
});

/**
 * SCENE 1 — HOOK (0.0-3.2s)
 *
 * The research is blunt about this: a reel is decided in the first 1.5 seconds,
 * and 85% of them are watched with the sound off. So there is no logo fade and
 * no establishing shot — the first question is legible at frame 4, and the hook
 * is the audience's own problem stated in their words.
 */
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const t = act(frame);
  const Q = [
    ['Where\u2019s good', 'this week?'],
    ['Who is actually', 'hiring?'],
    ['What\u2019s on', 'this weekend?'],
  ];

  return (
    <AbsoluteFill style={{justifyContent: 'center', padding: PAD}}>
      {Q.map((q, i) => {
        const enter = 4 + i * 30;
        const exit = enter + 22;
        return (
          <AbsoluteFill
            key={i}
            style={{justifyContent: 'center', padding: PAD}}
          >
            {q.map((l, j) => (
              <MaskLine key={j} enter={enter} exit={exit} delay={j * 3} dur={14}>
                <div style={display(112, t)}>{l}</div>
              </MaskLine>
            ))}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

/**
 * SCENE 2 — TURN (3.2-6.2s)
 *
 * The questions resolve into one answer, then the brand lands. Putting the
 * wordmark here rather than at frame 0 buys three seconds of attention first —
 * nobody watches a logo, but everybody finishes a question.
 */
export const Turn: React.FC = () => {
  const frame = useCurrentFrame();
  const t = act(frame);
  const f = frame - S.turn.from;

  // The mark overshoots to 103% and settles. A move that lands exactly on its
  // target reads mechanical; the overshoot is what gives it weight.
  const pop = interpolate(f, [46, 62, 74], [0.9, 1.03, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const popA = interpolate(f, [46, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{justifyContent: 'center', padding: PAD}}>
      <MaskLine enter={S.turn.from + 2} exit={S.turn.from + 40} dur={16}>
        <div style={display(112, t)}>One room</div>
      </MaskLine>
      <MaskLine enter={S.turn.from + 2} exit={S.turn.from + 40} delay={4} dur={16}>
        <div style={{...display(112, t), color: accent(t)}}>has all of it.</div>
      </MaskLine>

      <div
        style={{
          position: 'absolute',
          left: PAD,
          right: PAD,
          top: '50%',
          transform: `translateY(-50%) scale(${pop})`,
          opacity: popA,
        }}
      >
        <div style={{fontFamily: ARCHIVO}}>
          <Wordmark size={148} t={t} />
        </div>
        <div style={{...label(t), marginTop: 34, color: fgMuted(t)}}>
          Jordan&rsquo;s discovery platform
        </div>
      </div>
    </AbsoluteFill>
  );
};

const PILLARS = [
  ['01', 'What\u2019s Trending', 'Trends, viral conversations, new openings'],
  ['02', 'CTRL Picks', 'Restaurants, cafés, hidden places, weekend trips'],
  ['03', 'Career Room', 'Who is hiring, salaries, startups, workplace culture'],
  ['04', 'What\u2019s On', 'Events, concerts, pop-ups, networking, festivals'],
  ['05', 'CTRL Intelligence', 'Why everyone is talking about it this week'],
];

/**
 * SCENE 3 — PILLARS (6.2-11.6s)
 *
 * The value section, built as a feed rather than a grid — the brand is a room
 * where information is monitored, so its five formats arrive the way entries
 * arrive on a monitor: one at a time, each on its own rule, in order.
 *
 * The whole stack drifts up slowly under the stagger. Static rows would read as
 * a slide; the drift is what keeps it feeling live.
 */
export const Pillars: React.FC = () => {
  const frame = useCurrentFrame();
  const t = act(frame);
  const f = frame - S.pillars.from;

  const drift = interpolate(f, [0, 162], [26, -26], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{justifyContent: 'center', padding: PAD}}>
      <Rise enter={S.pillars.from} exit={S.pillars.to - 18}>
        <div style={{...label(t), color: accent(t), marginBottom: 46}}>
          Five reasons to check it daily
        </div>
      </Rise>

      <div style={{transform: `translateY(${drift}px)`}}>
        {PILLARS.map(([n, title, body], i) => {
          const enter = S.pillars.from + 14 + i * 17;
          return (
            <div key={n} style={{overflow: 'hidden'}}>
              <MaskLine enter={enter} exit={S.pillars.to - 14 + i * 2} dur={15} outDur={12}>
                <div
                  style={{
                    borderTop: `1px solid ${line(t)}`,
                    paddingTop: 26,
                    paddingBottom: 26,
                    display: 'flex',
                    gap: 34,
                    alignItems: 'baseline',
                  }}
                >
                  <span
                    style={{
                      ...label(t),
                      fontSize: 22,
                      color: accent(t),
                      flexShrink: 0,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {n}
                  </span>
                  <div>
                    <div
                      style={{
                        fontFamily: ARCHIVO,
                        fontWeight: 800,
                        fontSize: 62,
                        letterSpacing: '-0.03em',
                        color: fg(t),
                        lineHeight: 1.02,
                      }}
                    >
                      {title}
                    </div>
                    <div
                      style={{
                        fontFamily: ARCHIVO,
                        fontWeight: 400,
                        fontSize: 30,
                        marginTop: 12,
                        color: fgMuted(t),
                        lineHeight: 1.3,
                      }}
                    >
                      {body}
                    </div>
                  </div>
                </div>
              </MaskLine>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const PERKS = ['Restaurant & café discounts', 'Gym & hotel offers', 'Member-only events', 'Early access & giveaways'];

/**
 * SCENE 4 — MEMBERSHIP (11.6-17.0s)
 *
 * The act turns light here, and the ground has been warming since well before
 * the scene starts, so by the time the card arrives the page is already there.
 *
 * The card enters rotated hard and settles to near-flat. Rotating it *out* of a
 * pose rather than into one is what makes it read as an object being handed
 * over rather than a picture being animated.
 */
export const Membership: React.FC = () => {
  const frame = useCurrentFrame();
  const t = act(frame);
  const f = frame - S.card.from;

  const spin = interpolate(f, [0, 54], [46, -8], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const tilt = interpolate(f, [0, 54], [16, 6], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const inZ = interpolate(f, [0, 54], [-420, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  // A slow continuous turn after the settle, so the card never freezes.
  const idle = Math.sin((f / 78) * Math.PI * 2) * 5;
  const out = interpolate(f, [S.card.to - S.card.from - 16, S.card.to - S.card.from], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{justifyContent: 'center', padding: PAD}}>
      <Rise enter={S.card.from + 4} exit={S.card.to - 20}>
        <div style={{...label(t), color: accent(t), marginBottom: 44}}>
          CTRL Room Membership
        </div>
      </Rise>

      <div
        style={{
          perspective: 1600,
          display: 'flex',
          justifyContent: 'center',
          opacity: out,
        }}
      >
        <div
          style={{
            transform: `rotateY(${spin + idle}deg) rotateX(${tilt}deg) translateZ(${inZ}px)`,
            transformStyle: 'preserve-3d',
            filter: 'drop-shadow(0 40px 70px rgba(0,0,0,0.45))',
          }}
        >
          <CtrlCard width={820} />
        </div>
      </div>

      <div style={{marginTop: 70}}>
        {PERKS.map((p, i) => (
          <MaskLine
            key={p}
            enter={S.card.from + 58 + i * 12}
            exit={S.card.to - 16}
            dur={14}
          >
            <div
              style={{
                borderTop: `1px solid ${line(t)}`,
                paddingTop: 18,
                paddingBottom: 18,
                fontFamily: ARCHIVO,
                fontWeight: 700,
                fontSize: 40,
                letterSpacing: '-0.02em',
                color: fg(t),
              }}
            >
              {p}
            </div>
          </MaskLine>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const STATS: [string, number, string, string][] = [
  ['11.6M', 11.6, 'M', 'People in Jordan · median age 24.9'],
  ['92.5%', 92.5, '%', 'Internet penetration · 10.7M online'],
  ['6.8M', 6.8, 'M', 'On social media · 59% of the country'],
];

/**
 * SCENE 5 — SCALE (17.0-20.2s)
 *
 * Numbers count rather than appear. A figure that ticks up is read; a figure
 * that cuts in is skipped — and these three are the argument for why the whole
 * thing works, so they are the ones worth two extra seconds.
 */
export const Scale: React.FC = () => {
  const frame = useCurrentFrame();
  const t = act(frame);
  const f = frame - S.scale.from;

  return (
    <AbsoluteFill style={{justifyContent: 'center', padding: PAD}}>
      <Rise enter={S.scale.from} exit={S.scale.to - 14}>
        <div style={{...label(t), color: accent(t), marginBottom: 52}}>The market</div>
      </Rise>

      {STATS.map(([, target, suffix, caption], i) => {
        const start = 8 + i * 14;
        const p = interpolate(f, [start, start + 30], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EASE,
        });
        const val = target * p;
        const shown = suffix === '%' ? val.toFixed(1) : val.toFixed(1);
        return (
          <Rise key={caption} enter={S.scale.from + start} exit={S.scale.to - 14} y={22}>
            <div
              style={{
                borderTop: `1px solid ${line(t)}`,
                paddingTop: 22,
                marginBottom: 34,
              }}
            >
              <div
                style={{
                  fontFamily: ARCHIVO,
                  fontWeight: 900,
                  fontSize: 132,
                  letterSpacing: '-0.045em',
                  lineHeight: 0.94,
                  color: fg(t),
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {shown}
                {suffix}
              </div>
              <div style={{...label(t), marginTop: 16}}>{caption}</div>
            </div>
          </Rise>
        );
      })}
    </AbsoluteFill>
  );
};

/**
 * SCENE 6 — END CARD (20.2-24.0s)
 *
 * The tagline, the mark, the action. Nothing else. A reel loops, so the last
 * frame sits next to the first one — this holds still and lets the hook land
 * again clean.
 */
export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const t = act(frame);
  const f = frame - S.end.from;

  const ctaW = interpolate(f, [40, 62], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  return (
    <AbsoluteFill style={{justifyContent: 'center', padding: PAD}}>
      <MaskLine enter={S.end.from + 2} dur={18}>
        <div style={display(122, t)}>Jordan,</div>
      </MaskLine>
      <MaskLine enter={S.end.from + 2} delay={5} dur={18}>
        <div style={{...display(122, t), color: accent(t)}}>switched on.</div>
      </MaskLine>

      <Rise enter={S.end.from + 26} y={18}>
        <div style={{marginTop: 62, fontFamily: ARCHIVO}}>
          <Wordmark size={82} t={t} />
        </div>
      </Rise>

      {/* The CTA wipes open from the left rather than fading — it is the last
          thing on screen and it should arrive with intent. */}
      <div style={{marginTop: 54, overflow: 'hidden'}}>
        <div
          style={{
            display: 'inline-block',
            background: accent(t),
            color: t > 0.5 ? C.white : '#06201F',
            fontFamily: MONO,
            fontWeight: 500,
            fontSize: 30,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            padding: '30px 46px',
            clipPath: `inset(0 ${(1 - ctaW) * 100}% 0 0)`,
          }}
        >
          Join the room
        </div>
      </div>
    </AbsoluteFill>
  );
};
