/**
 * Frame-exact timeline. 30fps, 690 frames, 23.0s.
 *
 * PACING IS THE POINT. The previous cut ran six scenes in sixteen seconds with
 * 12-18 frame transitions, and nothing could be read. Here there are five scenes,
 * every hold is at least three seconds, every transition is 24 frames (0.8s), and
 * each scene carries ONE idea instead of a dashboard full of them.
 *
 * The worlds alternate — night, paper, night, paper, night — so the film breathes
 * instead of grinding through one dark palette.
 */

export const FPS = 30;
export const DURATION = 690;

export type TransitionKind = 'zoom' | 'grow' | 'push' | 'collapse';

export type Scene = {
  id: string;
  /** Frame at which this scene is fully settled. */
  from: number;
  via?: TransitionKind;
  /** Always 24 — long enough to actually read the move. */
  viaFrames?: number;
  /** The colour the incoming world arrives as, for shape-based transitions. */
  bg?: string;
  /** Origin of a shape transition, in % of frame. */
  originX?: number;
  originY?: number;
};

export const SCENES: Scene[] = [
  {id: 'type', from: 0},
  // The camera pushes INTO the typed phrase until it fills frame, and comes out
  // the other side on paper.
  {id: 'understand', from: 150, via: 'zoom', viaFrames: 24, bg: '#F4F1E8'},
  // The dot the mark's line resolves into swells until it IS the next world.
  {id: 'slide', from: 330, via: 'grow', viaFrames: 24, bg: '#0D141A', originX: 72, originY: 50},
  // A sheet of paper pushes up over the night scene.
  {id: 'payoff', from: 480, via: 'push', viaFrames: 24, bg: '#F4F1E8'},
  // The paper world collapses to a point, and the point is the mark.
  {id: 'cta', from: 600, via: 'collapse', viaFrames: 24, bg: '#0D141A', originX: 50, originY: 50},
];

export type ScreenState =
  | {kind: 'scene'; index: number}
  | {
      kind: 'transition';
      from: number;
      to: number;
      via: TransitionKind;
      progress: number;
      spec: Scene;
    };

export const stateAt = (frame: number): ScreenState => {
  const nextIndex = SCENES.findIndex((s) => s.from > frame);

  if (nextIndex > 0) {
    const next = SCENES[nextIndex];
    const T = next.viaFrames ?? 0;
    const start = next.from - T;
    if (T > 0 && frame >= start) {
      return {
        kind: 'transition',
        from: nextIndex - 1,
        to: nextIndex,
        via: next.via as TransitionKind,
        progress: Math.max(0, Math.min(1, (frame - start) / T)),
        spec: next,
      };
    }
    return {kind: 'scene', index: nextIndex - 1};
  }
  return {kind: 'scene', index: SCENES.length - 1};
};
