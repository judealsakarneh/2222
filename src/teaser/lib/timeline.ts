/**
 * Frame-exact timeline. 30fps, 360 frames, 12.0s.
 *
 * Transitions are listed separately from scenes because they are GLOBAL — the
 * glitch is applied to the whole frame, not inside either scene, which is what
 * makes a hard glitch cut read as one event rather than as two crossfades.
 */

export const FPS = 30;
export const DURATION = 360;

export const S = {
  counter: {start: 0, end: 45}, // 0.0 - 1.5s  growth flex
  montage: {start: 45, end: 120}, // 1.5 - 4.0s  asset montage
  features: {start: 120, end: 210}, // 4.0 - 7.0s  feature callouts
  reveal: {start: 210, end: 300}, // 7.0 - 10.0s product reveal
  cta: {start: 300, end: 360}, // 10.0 - 12.0s CTA end card
} as const;

export type GlitchKind = 'rgb' | 'whip' | 'digital' | 'chroma';

/**
 * Transition windows. `peak` is where the displacement is strongest; the
 * envelope ramps in fast and decays, because a glitch that fades in symmetrically
 * reads as a dissolve.
 */
export const TRANSITIONS: {
  kind: GlitchKind;
  start: number;
  peak: number;
  end: number;
}[] = [
  {kind: 'rgb', start: 36, peak: 45, end: 54}, // hard glitch cut into montage
  {kind: 'whip', start: 111, peak: 120, end: 129}, // whip pan into features
  {kind: 'digital', start: 201, peak: 210, end: 219}, // digital distortion into reveal
  {kind: 'chroma', start: 285, peak: 300, end: 312}, // fade to black + chromatic aberration
];
