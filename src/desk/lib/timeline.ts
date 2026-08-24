/**
 * Frame-exact timeline. 30fps, 480 frames, 16.0s.
 *
 * THE STRUCTURE: the camera does almost nothing after the opening push-in. Every
 * scene change happens INSIDE the screen, and each one uses a DIFFERENT
 * transition. The monitor bezel, the desk and the room never move during a
 * transition, so the eye anchors to them and reads the change as content
 * swapping on a display — not as a cut to a new shot.
 *
 * That is the whole trick, and it is why five very different transitions can sit
 * inside sixteen seconds without the film feeling chopped up.
 */

export const FPS = 30;
export const DURATION = 480;

export type TransitionKind = 'swipe' | 'mask' | 'iris' | 'slices' | 'whip';

export type Page = {
  id: string;
  /** Frame at which this page is fully in place. */
  from: number;
  /** How the film gets INTO this page (undefined for the first). */
  via?: TransitionKind;
  /** Length of that transition, in frames, ending exactly at `from`. */
  viaFrames?: number;
};

export const PAGES: Page[] = [
  {id: 'chat', from: 0},
  {id: 'research', from: 96, via: 'swipe', viaFrames: 18},
  {id: 'build', from: 186, via: 'mask', viaFrames: 16},
  {id: 'slide', from: 276, via: 'iris', viaFrames: 18},
  {id: 'export', from: 360, via: 'slices', viaFrames: 16},
  {id: 'cta', from: 426, via: 'whip', viaFrames: 12},
];

/**
 * Resolve what the screen should be showing this frame.
 * Either one settled page, or two mid-transition.
 */
export type ScreenState =
  | {kind: 'page'; index: number}
  | {
      kind: 'transition';
      from: number;
      to: number;
      via: TransitionKind;
      /** 0 -> 1 across the transition window. */
      progress: number;
    };

export const screenStateAt = (frame: number): ScreenState => {
  // Find the next page boundary ahead of this frame.
  const nextIndex = PAGES.findIndex((p) => p.from > frame);

  if (nextIndex > 0) {
    const next = PAGES[nextIndex];
    const T = next.viaFrames ?? 0;
    const start = next.from - T;
    if (T > 0 && frame >= start) {
      return {
        kind: 'transition',
        from: nextIndex - 1,
        to: nextIndex,
        via: next.via as TransitionKind,
        progress: Math.max(0, Math.min(1, (frame - start) / T)),
      };
    }
    return {kind: 'page', index: nextIndex - 1};
  }

  // Past the last boundary.
  return {kind: 'page', index: PAGES.length - 1};
};

/**
 * Brand colour wash beats — a 4-frame flash at 10% over the whole screen, fired
 * on the frame a transition lands. Cheap, and it welds the cut to the music.
 */
export const WASH_FRAMES = [96, 276, 426];
