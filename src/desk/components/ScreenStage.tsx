import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Transition} from './transitions';
import {PgChat} from '../pages/PgChat';
import {PgResearch} from '../pages/PgResearch';
import {PgBuild} from '../pages/PgBuild';
import {PgSlide} from '../pages/PgSlide';
import {PgExport} from '../pages/PgExport';
import {PgCta} from '../pages/PgCta';
import {PAGES, WASH_FRAMES, screenStateAt} from '../lib/timeline';
import {D} from '../lib/tokens';

/**
 * Hosts the six pages and runs the transition engine.
 *
 * Pages are mounted only when visible (one, or two mid-transition), so at most
 * two page trees exist at once — which matters because the slice transition
 * clips six copies of each.
 */

const PAGE_COMPONENTS = [PgChat, PgResearch, PgBuild, PgSlide, PgExport, PgCta];

/**
 * Every page gets its OWN opaque background.
 *
 * This is load-bearing, not cosmetic. A page body with a transparent background
 * lets the page underneath show straight through it, so during a transition both
 * render at full strength and the result reads as two screenshots stacked rather
 * than one replacing the other — no amount of timing or easing can fix that.
 * The outgoing page must be genuinely occluded by the incoming one.
 */
const PAGE_BG = 'linear-gradient(180deg, #131C24 0%, #111A22 46%, #0E151C 100%)';

const renderPage = (i: number): React.ReactNode => {
  const C = PAGE_COMPONENTS[i];
  return (
    <div style={{position: 'absolute', inset: 0, background: PAGE_BG, overflow: 'hidden'}}>
      <C />
    </div>
  );
};

export const ScreenStage: React.FC = () => {
  const frame = useCurrentFrame();
  const state = screenStateAt(frame);

  // Brand colour wash — a 4-frame flash fired on the frame a transition lands.
  const wash = WASH_FRAMES.reduce((acc, f) => {
    const v = interpolate(frame, [f, f + 4], [0.1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return Math.max(acc, frame >= f ? v : 0);
  }, 0);

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      {state.kind === 'page' ? (
        <div style={{position: 'absolute', inset: 0}}>{renderPage(state.index)}</div>
      ) : (
        <Transition
          kind={state.via}
          progress={state.progress}
          outgoing={renderPage(state.from)}
          incoming={renderPage(state.to)}
        />
      )}

      {wash > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: D.signal,
            opacity: wash,
            mixBlendMode: 'screen',
            pointerEvents: 'none',
          }}
        />
      ) : null}
    </div>
  );
};

/** Which page index is dominant this frame — used to drive the room's spill light. */
export const dominantPage = (frame: number): number => {
  const s = screenStateAt(frame);
  return s.kind === 'page' ? s.index : s.progress < 0.5 ? s.from : s.to;
};

export const PAGE_COUNT = PAGES.length;
