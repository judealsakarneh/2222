import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Caption} from '../components/Caption';
import {INTER} from '../../lib/fonts';
import {STATIONS} from '../lib/camera';
import {EASE, L, PANEL, label} from '../lib/tokens';

/**
 * STATION 2 — Transcript + entity extraction. Arrives 230, holds 85.
 *
 * The transcript types itself, and as it goes, certain phrases get *lifted* out
 * of the running text into chips — a box draws around them and they shift to the
 * brand colour. That is the visual claim of this station: it isn't transcribing,
 * it's understanding, and you can watch it decide.
 *
 * Chips fire on their own schedule slightly after their phrase has been typed,
 * so the extraction reads as a consequence of the reading.
 */

const A = STATIONS[2].arrive;

/** The transcript, pre-split so phrases can be individually chipped. */
type Tok = {t: string; chip?: number}; // chip = frames after A when it lifts

/**
 * Chip frames are set from where each phrase finishes typing, not picked by eye:
 * the phrase ends at its character offset / FULL.length through the type window,
 * and its chip fires ~4 frames later so the lift reads as a consequence.
 */
const TOKENS: Tok[] = [
  {t: 'so it’s a tool for '},
  {t: 'early-stage founders', chip: -36},
  {t: ' who need a deck, and the market is around '},
  {t: '$4.2B', chip: -1},
  {t: ' growing '},
  {t: '18% a year', chip: 13},
  {t: '…'},
];

const FULL = TOKENS.map((x) => x.t).join('');
const TYPE_START = -70; // relative to arrival — the transcript writes itself on the approach
const TYPE_FRAMES = 80;

export const StTranscript: React.FC = () => {
  const frame = useCurrentFrame();

  const panelIn = interpolate(frame, [A - 84, A - 58], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  const shown = Math.floor(
    interpolate(
      frame,
      [A + TYPE_START, A + TYPE_START + TYPE_FRAMES],
      [0, FULL.length],
      {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
    )
  );
  const caretOn = Math.floor(frame / 8) % 2 === 0;

  // Walk the tokens, emitting only the characters typed so far.
  let cursor = 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 60,
      }}
    >
      <div
        style={{
          ...PANEL,
          width: 860,
          borderRadius: 34,
          padding: '46px 48px 52px',
          opacity: panelIn,
          transform: `translateY(${(1 - panelIn) * 40}px) scale(${0.95 + 0.05 * panelIn})`,
          willChange: 'transform, opacity',
        }}
      >
        <div style={{...label(L.mist, 16), fontFamily: INTER, marginBottom: 32}}>
          Transcript
        </div>

        <div
          style={{
            fontFamily: INTER,
            fontSize: 34,
            lineHeight: 1.65,
            color: L.mist,
            minHeight: 250,
          }}
        >
          {TOKENS.map((tok, i) => {
            const start = cursor;
            cursor += tok.t.length;
            const visible = Math.max(0, Math.min(tok.t.length, shown - start));
            if (visible <= 0) return null;
            const piece = tok.t.slice(0, visible);

            if (tok.chip === undefined) {
              return <span key={i}>{piece}</span>;
            }

            // Chip lifts once the phrase is fully typed.
            const typed = visible >= tok.t.length;
            const lift = interpolate(frame, [A + tok.chip, A + tok.chip + 14], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: EASE,
            });
            const on = typed ? lift : 0;

            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  padding: on > 0 ? '2px 14px' : 0,
                  margin: on > 0 ? '0 2px' : 0,
                  borderRadius: 10,
                  color: on > 0.5 ? L.signal : L.text,
                  border: `1px solid rgba(23,232,168,${0.5 * on})`,
                  background: `rgba(23,232,168,${0.10 * on})`,
                  transform: `translateY(${on * -3}px)`,
                  willChange: 'transform',
                }}
              >
                {piece}
              </span>
            );
          })}
          <span
            style={{
              display: 'inline-block',
              width: 3,
              height: 34,
              marginLeft: 4,
              background: L.signal,
              verticalAlign: 'text-bottom',
              opacity: shown >= FULL.length ? (caretOn ? 1 : 0) : 1,
            }}
          />
        </div>
      </div>

      <Caption text="Every word, understood." from={A + 6} size={58} />
    </div>
  );
};
