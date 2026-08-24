import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneShell} from '../components/SceneShell';
import {MotionBlurTrail} from '../components/MotionBlurTrail';
import {
  EASE_CAMERA,
  EASE_FAST_EXIT,
  EASE_STANDARD,
  SPRING_CARD,
  SPRING_CARD_HERO,
} from '../lib/easing';
import {INTER, SERIF} from '../lib/fonts';
import {C, PANEL_MATERIAL, serifHead, uiLabel} from '../lib/tokens';

/**
 * SCENE 6 — The deck assembles. Frames 372-486 (12.40s - 16.20s)
 *
 * The payoff shot, and the only real 3D in the film.
 *
 * A 1600px perspective container holds a preserve-3d rig. Three slide cards fly
 * in from deep Z (-900 / -1400) and settle into a layered arrangement: two
 * angled flanks and a hero card pushed forward to z +120. Because they arrive
 * on springs at staggered starts (396 / 400 / 404) the deck assembles like it
 * is being built, not like a diagram fading up.
 *
 * From frame 430 the whole rig orbits 14 degrees on a sine curve. That slow
 * parallax is what makes the depth legible — a static 3D arrangement reads as a
 * flat collage.
 *
 * EXIT (470-486) is the hero transition of the whole piece: the camera rushes
 * INTO the centre card (scale 1 -> 4.2). From 474 three ghost copies render at
 * increasing scale with falling opacity, which the eye integrates as shutter
 * blur — that is the difference between "the camera passed through the deck"
 * and "the deck faded out".
 */

const START = 372;
const END = 486;

/**
 * Card geometry is tuned to the 1080px frame rather than taken at face value
 * from the brief. Three 560px cards at x +/-300, z -260 project past both frame
 * edges and bury the hero card, so the flanks are pulled back to z -300 and the
 * cards trimmed to 480x620. Same composition, but it fits with margin.
 */
const CARD_W = 480;
const CARD_H = 620;

type Bar = {label: string; value: number};
type CardSpec = {
  kicker: string;
  title: string;
  /** Body copy suggestion lines — widths as a fraction of the card interior. */
  lines: number[];
  bars: Bar[];
  /**
   * Flank cards are dimmed. They are partly occluded by the hero card, and
   * half-legible text reads as a rendering bug; dimmed, it reads as depth.
   */
  dim?: boolean;
  from: {x: number; z: number; rotateY: number; scale: number};
  to: {x: number; z: number; rotateY: number; scale: number};
  start: number;
  duration: number;
  config: {damping: number; stiffness: number; mass: number};
  /** Position in the global bar-fill stagger, so the fill sweeps left -> centre -> right. */
  barOrder: number;
};

const CARDS: CardSpec[] = [
  {
    kicker: 'Market',
    title: 'Sizing the opportunity',
    lines: [1, 0.84, 0.58],
    dim: true,
    bars: [
      {label: 'TAM', value: 76},
      {label: 'SAM', value: 54},
      {label: 'SOM', value: 88},
    ],
    from: {x: -520, z: -900, rotateY: 42, scale: 1},
    to: {x: -300, z: -300, rotateY: 28, scale: 1},
    start: 396,
    duration: 30,
    config: SPRING_CARD,
    barOrder: 0,
  },
  {
    kicker: 'Ramble',
    title: 'Your pitch, structured',
    lines: [1, 0.9, 0.66, 0.78],
    bars: [
      {label: 'Clarity', value: 82},
      {label: 'Depth', value: 60},
      {label: 'Sources', value: 92},
    ],
    from: {x: 0, z: -1400, rotateY: 0, scale: 0.7},
    to: {x: 0, z: 110, rotateY: 0, scale: 1},
    start: 404,
    duration: 36,
    config: SPRING_CARD_HERO,
    barOrder: 1,
  },
  {
    kicker: 'Model',
    title: 'How it makes money',
    lines: [1, 0.78, 0.62],
    dim: true,
    bars: [
      {label: 'ARPU', value: 90},
      {label: 'Margin', value: 66},
      {label: 'Retention', value: 78},
    ],
    from: {x: 520, z: -900, rotateY: -42, scale: 1},
    to: {x: 300, z: -300, rotateY: -28, scale: 1},
    start: 400,
    duration: 30,
    config: SPRING_CARD,
    barOrder: 2,
  },
];

const BAR_FILL_START = 424;
const BAR_FILL_STAGGER = 3;
const BAR_FILL_DURATION = 14;

/** One slide card. Renders in 3D space; all its own transforms come from the rig. */
const SlideCard: React.FC<{spec: CardSpec; frame: number; fps: number}> = ({
  spec,
  frame,
  fps,
}) => {
  const p = spring({
    frame: frame - spec.start,
    fps,
    config: spec.config,
    durationInFrames: spec.duration,
  });

  const lerp = (a: number, b: number) => a + (b - a) * p;
  const x = lerp(spec.from.x, spec.to.x);
  const z = lerp(spec.from.z, spec.to.z);
  const rotateY = lerp(spec.from.rotateY, spec.to.rotateY);
  const scale = lerp(spec.from.scale, spec.to.scale);

  // Opacity on its own clamped ramp — a spring-driven fade lingers near zero.
  const opacity = interpolate(
    frame,
    [spec.start, spec.start + spec.duration * 0.4],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_STANDARD}
  );

  return (
    <div
      style={{
        ...PANEL_MATERIAL,
        position: 'absolute',
        inset: 0,
        borderRadius: 32,
        padding: 48,
        display: 'flex',
        flexDirection: 'column',
        opacity: opacity * (spec.dim ? 0.5 : 1),
        transform: `translate3d(${x}px, 0, ${z}px) rotateY(${rotateY}deg) scale(${scale})`,
        willChange: 'transform, opacity',
      }}
    >
      <div style={{...uiLabel(C.label), fontFamily: INTER}}>{spec.kicker}</div>

      <h3
        style={{
          ...serifHead(42, C.text),
          fontFamily: SERIF,
          marginTop: 16,
        }}
      >
        {spec.title}
      </h3>

      {/* Body copy, suggested rather than set — at this scale real paragraph
          text would be unreadable noise, but the rhythm of ragged lines is what
          makes the card read as a finished slide instead of a title card. */}
      <div style={{marginTop: 30, display: 'flex', flexDirection: 'column', gap: 14}}>
        {spec.lines.map((w, i) => (
          <div
            key={i}
            style={{
              width: `${w * 100}%`,
              height: 7,
              borderRadius: 999,
              background: 'rgba(23,232,168,0.09)',
            }}
          />
        ))}
      </div>

      <div style={{flex: 1}} />

      {spec.bars.map((bar, i) => {
        const barStart =
          BAR_FILL_START + (spec.barOrder * 3 + i) * BAR_FILL_STAGGER;
        const fill = interpolate(
          frame,
          [barStart, barStart + BAR_FILL_DURATION],
          [0, bar.value],
          {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: EASE_STANDARD,
          }
        );

        return (
          <div key={bar.label} style={{marginBottom: i === spec.bars.length - 1 ? 0 : 22}}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: 10,
              }}
            >
              <span style={{...uiLabel(C.label), fontFamily: INTER}}>{bar.label}</span>
              <span style={{...uiLabel(C.ink), fontFamily: INTER}}>
                {Math.round(fill)}%
              </span>
            </div>
            <div
              style={{
                height: 10,
                borderRadius: 999,
                background: 'rgba(23,232,168,0.10)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${fill}%`,
                  height: '100%',
                  borderRadius: 999,
                  background: `linear-gradient(90deg, ${C.inkDim}, ${C.ink})`,
                  boxShadow: '0 0 10px rgba(23,232,168,0.55)',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * The complete 3D scene: perspective -> camera -> rig -> cards.
 *
 * This is rendered in full by every motion-blur ghost. It has to establish its
 * own perspective internally, because an ancestor with opacity < 1 flattens the
 * 3D context and the cards would collapse to z = 0.
 */
const Deck3D: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Camera dolly, 372-396.
  const camScale = interpolate(frame, [START, 396], [0.92, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_CAMERA,
  });
  const camRotateX = interpolate(frame, [START, 396], [6, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_CAMERA,
  });

  // Slow orbit so the depth stays legible, 430-486.
  const orbit = interpolate(frame, [430, END], [0, 14], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.sin),
  });

  return (
    <div
      style={{
        perspective: 1600,
        perspectiveOrigin: '50% 50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          transformStyle: 'preserve-3d',
          transform: `scale(${camScale}) rotateX(${camRotateX}deg)`,
          willChange: 'transform',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: CARD_W,
            height: CARD_H,
            transformStyle: 'preserve-3d',
            transform: `rotateY(${orbit}deg)`,
            willChange: 'transform',
          }}
        >
          {CARDS.map((spec) => (
            <SlideCard key={spec.kicker} spec={spec} frame={frame} fps={fps} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const Scene06Deck: React.FC = () => {
  const frame = useCurrentFrame();

  // Zoom-through, 470-486.
  const zoomScale = interpolate(frame, [470, END], [1, 4.2], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_FAST_EXIT,
  });
  const zoomOpacity = interpolate(frame, [470, END], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_FAST_EXIT,
  });
  // Ghost trails only while the move is genuinely fast (>1.5x inside 20 frames).
  const blurActive = frame >= 474;

  // Caption under the rig. Sits 440px below rig centre so it clears the 700px
  // cards (the centre card is scaled up by perspective, so 300px would overlap).
  const labelIn = interpolate(frame, [446, 458], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_STANDARD,
  });
  const labelOut = interpolate(frame, [470, 480], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_FAST_EXIT,
  });

  return (
    <SceneShell start={START} end={END}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <MotionBlurTrail
          active={blurActive}
          scale={zoomScale}
          opacity={zoomOpacity}
          style={{
            width: 1080,
            height: 900,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Deck3D />
        </MotionBlurTrail>

        <div
          style={{
            position: 'absolute',
            top: '50%',
            marginTop: 440,
            fontFamily: INTER,
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: C.deckLabel,
            opacity: labelIn * labelOut,
            transform: `translate3d(0, ${(1 - labelIn) * 20}px, 0)`,
            willChange: 'transform, opacity',
          }}
        >
          14 slides · fully sourced
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
