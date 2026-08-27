import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {ARCHIVO, MONO} from '../lib/fonts';
import {C, EASE, EASE_IN, EASE_IO, KEYWORD, T, ms} from './tokens';

const W = 1920;
const H = 1080;

const ip = (
  frame: number,
  range: number[],
  out: number[],
  easing = EASE
) =>
  interpolate(frame, range, out, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

/* ─────────────────────────────  01  GRADIENT FIELD  ───────────────────────── */

/**
 * Two slow-drifting teal masses over near-black, plus a fine vertical sheen.
 * The masses move on periods that do not divide each other, so the field never
 * visibly repeats inside five seconds.
 */
export const Field: React.FC = () => {
  const f = useCurrentFrame();
  const a = ip(f, [ms(T.bgFade[0]), ms(T.bgFade[1])], [0, 1], EASE_IO);

  const d1x = Math.sin((f / 118) * Math.PI * 2) * 90;
  const d1y = Math.cos((f / 143) * Math.PI * 2) * 60;
  const d2x = Math.cos((f / 97) * Math.PI * 2) * -120;

  return (
    <AbsoluteFill style={{opacity: a, backgroundColor: C.ink}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 70% at 30% 42%, rgba(0,169,164,0.30), rgba(0,169,164,0) 62%)`,
          transform: `translate(${d1x}px, ${d1y}px)`,
          filter: 'blur(30px)',
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(52% 60% at 74% 66%, rgba(0,101,99,0.42), rgba(0,101,99,0) 60%)`,
          transform: `translateX(${d2x}px)`,
          filter: 'blur(40px)',
        }}
      />
      {/* Sheen: a single wide highlight band that keeps the field from reading
          as a flat wash. */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(104deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0) 34%)',
        }}
      />
      <AbsoluteFill
        style={{boxShadow: 'inset 0 0 340px 120px rgba(0,0,0,0.62)'}}
      />
    </AbsoluteFill>
  );
};

/* ─────────────────────────────  02  GLASS SLAB  ───────────────────────────── */

/**
 * Glass 2.0, not a flat frost: a backdrop blur, a masked top-left specular, a
 * bright 1px rim that fades round the form, and an inner shadow at the base.
 * Four layers is what separates a pane of glass from a grey rectangle.
 */
export const Slab: React.FC<{
  w: number;
  h: number;
  r?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({w, h, r = 22, children, style}) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: r,
      position: 'relative',
      overflow: 'hidden',
      backdropFilter: 'blur(26px) saturate(140%)',
      background:
        'linear-gradient(152deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03) 46%, rgba(255,255,255,0.012))',
      boxShadow:
        'inset 0 1px 0 0 rgba(255,255,255,0.24), inset 0 0 0 1px rgba(255,255,255,0.085), inset 0 -22px 40px -26px rgba(0,0,0,0.8), 0 40px 90px -40px rgba(0,0,0,0.9)',
      ...style,
    }}
  >
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'radial-gradient(120% 100% at 12% 0%, rgba(255,255,255,0.16), rgba(255,255,255,0) 52%)',
      }}
    />
    {children}
  </div>
);

/* ─────────────────────────────  03  BRAND REVEAL  ─────────────────────────── */

/**
 * 0-500ms. The mark scales 95 to 100 and settles, with a glow that blooms on
 * arrival and decays. It holds until the keyword takes over, then clears.
 */
export const Mark: React.FC = () => {
  const f = useCurrentFrame();
  const s = ip(f, [ms(T.markScale[0]), ms(T.markScale[1])], [0.95, 1]);
  const a = ip(f, [0, ms(220)], [0, 1], EASE_IO);
  const glow = ip(f, [ms(120), ms(420), ms(900)], [0, 1, 0.32], EASE_IO);
  // The mark clears as the first characters arrive, and expands as it goes, so
  // the word reads as emerging from it. Holding the slab through the keyword
  // put a lit panel directly behind the type for over a second.
  const out = ip(f, [ms(300), ms(620)], [1, 0], EASE_IO);
  const bloom = ip(f, [ms(300), ms(620)], [1, 1.5], EASE);

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        opacity: a * out,
        transform: `scale(${s * bloom})`,
      }}
    >
      <Slab w={196} h={196} r={34}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              background: C.tealBright,
              boxShadow: `0 0 ${44 * glow}px ${10 * glow}px rgba(0,169,164,${0.55 * glow})`,
            }}
          />
        </div>
      </Slab>
    </AbsoluteFill>
  );
};

/* ─────────────────────────  04  KEYWORD TYPOGRAPHY  ───────────────────────── */

/**
 * 300-1800ms. Per character: Y +60 to 0 and opacity 0 to 100, 40ms stagger.
 *
 * The 180-degree shutter is faked the only way that is honest in a frame-driven
 * renderer — three trailing copies at decreasing opacity, offset BEHIND the
 * direction of travel. Ghosts placed ahead of the motion read as double vision,
 * not as blur.
 */
export const Keyword: React.FC = () => {
  const f = useCurrentFrame();
  const chars = KEYWORD.split('');
  const out = ip(f, [ms(3300), ms(3560)], [1, 0], EASE_IO);
  const drift = ip(f, [ms(300), ms(3560)], [0, -26], EASE_IO);

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        opacity: out,
        transform: `translateY(${drift}px)`,
      }}
    >
      <div style={{display: 'flex'}}>
        {chars.map((ch, i) => {
          const start = ms(T.keyword[0] + i * T.charStagger);
          const end = start + ms(T.charDur);
          const y = ip(f, [start, end], [60, 0]);
          const o = ip(f, [start, start + ms(300)], [0, 1], EASE_IO);
          const vel = Math.abs(ip(f, [start, end], [60, 0]) - ip(f - 1, [start, end], [60, 0]));

          return (
            <span key={i} style={{position: 'relative', display: 'inline-block'}}>
              {[3, 2, 1].map((g) => (
                <span
                  key={g}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    fontFamily: ARCHIVO,
                    fontWeight: 800,
                    fontSize: 172,
                    letterSpacing: '-0.045em',
                    color: C.white,
                    // Trailing: the ghost sits where the glyph WAS.
                    transform: `translateY(${y + vel * g * 0.85}px)`,
                    opacity: o * Math.min(vel / 7, 1) * (0.16 / g),
                    filter: `blur(${g * 1.1}px)`,
                  }}
                >
                  {ch}
                </span>
              ))}
              <span
                style={{
                  display: 'inline-block',
                  fontFamily: ARCHIVO,
                  fontWeight: 800,
                  fontSize: 172,
                  letterSpacing: '-0.045em',
                  color: C.white,
                  transform: `translateY(${y}px)`,
                  opacity: o,
                }}
              >
                {ch}
              </span>
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ─────────────────────────  05  GEOMETRIC PULSE  ──────────────────────────── */

const SHAPES: {
  kind: 'circle' | 'tri';
  x: number;
  y: number;
  size: number;
  delay: number;
  fill: string;
}[] = [
  {kind: 'circle', x: 296, y: 300, size: 220, delay: 0, fill: C.tealBright},
  {kind: 'circle', x: 1618, y: 762, size: 268, delay: 90, fill: C.teal},
  {kind: 'circle', x: 1500, y: 246, size: 150, delay: 180, fill: C.tealLight},
  {kind: 'tri', x: 402, y: 806, size: 178, delay: 250, fill: C.tealBright},
  {kind: 'tri', x: 1128, y: 176, size: 122, delay: 330, fill: C.teal},
];

/**
 * 1800-3200ms. Scale 0 to 140 to 100 with the overshoot landing at 110 before
 * it settles. 30px blur on the fill, 20% opacity on the stroke — the stroke is
 * what keeps a blurred disc from reading as a smudge.
 */
export const Pulse: React.FC = () => {
  const f = useCurrentFrame();

  return (
    <AbsoluteFill>
      {SHAPES.map((s, i) => {
        const t0 = ms(T.pulse[0] + s.delay);
        const scale = interpolate(
          f,
          [t0, t0 + ms(420), t0 + ms(760), t0 + ms(1000)],
          [0, 1.4, 1.1, 1],
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE}
        );
        const a = ip(f, [t0, t0 + ms(260)], [0, 1], EASE_IO);
        const fade = ip(f, [ms(3260), ms(3600)], [1, 0.35], EASE_IO);
        const bob = Math.sin(((f - t0) / 96) * Math.PI * 2) * 7;

        const common: React.CSSProperties = {
          position: 'absolute',
          left: s.x - s.size / 2,
          top: s.y - s.size / 2 + bob,
          width: s.size,
          height: s.size,
          transform: `scale(${scale})`,
          opacity: a * fade,
        };

        return (
          <div key={i} style={common}>
            {/* Blurred body */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                filter: 'blur(30px)',
                opacity: 0.55,
                ...(s.kind === 'circle'
                  ? {borderRadius: '50%', background: s.fill}
                  : {
                      background: s.fill,
                      clipPath: 'polygon(50% 2%, 98% 96%, 2% 96%)',
                    }),
              }}
            />
            {/* 20% stroke */}
            {s.kind === 'circle' ? (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  border: `2px solid rgba(255,255,255,0.2)`,
                }}
              />
            ) : (
              <svg width={s.size} height={s.size} viewBox="0 0 100 100" style={{position: 'absolute', inset: 0}}>
                <polygon
                  points="50,2 98,96 2,96"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth={2}
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ─────────────────────────  06  MOTION PATH SWEEP  ────────────────────────── */

/**
 * 2200-3500ms. Trim Path 0 to 100 across a wide arc, linear through the first
 * half then easing in — so the head accelerates out of frame rather than
 * gliding to a stop. Stroke pulses 1 to 3 to 1 as it draws.
 *
 * pathLength is normalised to 1 so the dash maths is exact regardless of the
 * curve's real arc length.
 */
export const Sweep: React.FC = () => {
  const f = useCurrentFrame();
  const a = ms(T.sweep[0]);
  const b = ms(T.sweep[1]);

  const half = a + (b - a) * 0.5;
  const p =
    f < half
      ? interpolate(f, [a, half], [0, 0.5], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : interpolate(f, [half, b], [0.5, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EASE_IN,
        });

  const sw = interpolate(f, [a, (a + b) / 2, b], [1, 3, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_IO,
  });

  const fade = ip(f, [ms(3400), ms(3720)], [1, 0], EASE_IO);
  const D = 'M -60 742 C 380 742, 520 300, 960 300 S 1540 742, 1980 470';

  return (
    <AbsoluteFill style={{opacity: fade}}>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <defs>
          <linearGradient id="sweepG" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={C.teal} stopOpacity="0" />
            <stop offset="26%" stopColor={C.tealBright} />
            <stop offset="72%" stopColor={C.tealLight} />
            <stop offset="100%" stopColor={C.white} />
          </linearGradient>
          <filter id="sweepGlow" x="-30%" y="-60%" width="160%" height="220%">
            <feGaussianBlur stdDeviation="12" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d={D}
          pathLength={1}
          fill="none"
          stroke="url(#sweepG)"
          strokeWidth={sw * 3}
          strokeLinecap="round"
          strokeDasharray="1 1"
          strokeDashoffset={1 - p}
          opacity={0.32}
          filter="url(#sweepGlow)"
        />
        <path
          d={D}
          pathLength={1}
          fill="none"
          stroke="url(#sweepG)"
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray="1 1"
          strokeDashoffset={1 - p}
        />
      </svg>

      {/* The head: a bright node riding the end of the trim. */}
      {p > 0.02 && p < 0.995 ? (
        <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
          <path
            d={D}
            pathLength={1}
            fill="none"
            stroke={C.white}
            strokeWidth={sw + 3}
            strokeLinecap="round"
            strokeDasharray="0.004 1"
            strokeDashoffset={1 - p}
            filter="url(#sweepGlow)"
          />
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};

/* ─────────────────────────  07  LOCKUP + TAGLINE  ─────────────────────────── */

/**
 * 3500-4500ms, holding to 5000ms. Logo scales 0 to 110 to 100 over 500ms; the
 * tagline follows with Y +10 to 0 and opacity over 400ms. A hairline opens
 * between them, which is what gives the lockup its architecture.
 */
export const Lockup: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = ms(T.lockup[0]);

  const s = interpolate(f, [t0, t0 + ms(300), t0 + ms(500)], [0, 1.1, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const a = ip(f, [t0, t0 + ms(240)], [0, 1], EASE_IO);
  const ruleW = ip(f, [t0 + ms(320), t0 + ms(760)], [0, 1]);
  const tagY = ip(f, [t0 + ms(420), t0 + ms(820)], [10, 0]);
  const tagA = ip(f, [t0 + ms(420), t0 + ms(820)], [0, 1], EASE_IO);

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{transform: `scale(${s})`, opacity: a, textAlign: 'center'}}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'baseline',
            gap: 44,
            lineHeight: 1,
          }}
        >
          <span
            style={{
              fontFamily: ARCHIVO,
              fontWeight: 900,
              fontSize: 152,
              letterSpacing: '-0.035em',
              color: C.white,
            }}
          >
            CTRL
          </span>
          <span
            style={{
              fontFamily: ARCHIVO,
              fontWeight: 500,
              fontSize: 92,
              letterSpacing: '0.3em',
              color: C.tealBright,
            }}
          >
            ROOM
          </span>
        </div>

        <div
          style={{
            height: 1,
            margin: '38px auto 0',
            width: `${ruleW * 340}px`,
            background: `linear-gradient(90deg, rgba(0,169,164,0), ${C.tealBright}, rgba(0,169,164,0))`,
          }}
        />

        <div
          style={{
            marginTop: 34,
            fontFamily: MONO,
            fontWeight: 500,
            fontSize: 30,
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.78)',
            transform: `translateY(${tagY}px)`,
            opacity: tagA,
          }}
        >
          Jordan, switched on
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Grain. Large near-black fields band without it. */
export const Grain: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      opacity: 0.045,
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='3'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E\")",
    }}
  />
);
