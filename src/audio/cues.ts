/**
 * The sound design cue sheet, frame-exact.
 *
 * The film is cut to these — every impact sits on a frame where something
 * visually lands, so the edit reads as sound-designed even before real audio is
 * dropped in.
 *
 * DESIGN PRINCIPLE: every impact is LAYERED. A single tone always sounds cheap.
 * Each hit wants four parts — sub (weight), mid body (punch), high transient
 * (attack) and tail (air). The `layers` note on each cue records what that hit
 * is made of, so whoever cuts the real audio builds the same stack.
 *
 * To wire real audio: drop files into `public/audio/` using the `file` name
 * below and render with <AudioDesign enabled />. See README.
 */

export type Cue = {
  id: string;
  /** Absolute frame the sound is triggered on. */
  frame: number;
  /** File to drop into public/audio/. */
  file: string;
  /** How long the cue plays, in frames. */
  durationInFrames: number;
  volume: number;
  /** What visually happens on this frame. */
  hits: string;
  /** The layer stack this hit should be built from. */
  layers: string;
};

export const CUES: Cue[] = [
  {
    id: 'mark-complete',
    frame: 45,
    file: 'ping-soft.mp3',
    durationInFrames: 30,
    volume: 0.35,
    hits: 'The mark finishes drawing',
    layers: 'high transient + long air tail, no sub — this is a glint, not an impact',
  },
  {
    id: 'to-line-1',
    frame: 66,
    file: 'whoosh-sub.mp3',
    durationInFrames: 24,
    volume: 0.4,
    hits: 'Cut to kinetic line 1',
    layers: 'air whoosh (attack) + soft sub hit (weight)',
  },
  {
    id: 'to-line-2',
    frame: 118,
    file: 'whoosh-sub.mp3',
    durationInFrames: 24,
    volume: 0.4,
    hits: 'Cut to kinetic line 2',
    layers: 'air whoosh + soft sub hit',
  },
  {
    id: 'product-enter',
    frame: 172,
    file: 'impact-medium.mp3',
    durationInFrames: 40,
    volume: 0.5,
    hits: 'Voice capture panel arrives',
    layers: 'whoosh + mid body + sub — first real impact of the film, give it size',
  },
  {
    id: 'typing',
    frame: 190,
    file: 'typing-ticks.mp3',
    durationInFrames: 78,
    volume: 0.008,
    hits: 'Transcript types out (through frame 268)',
    layers: 'dry high ticks only, every 4th character, barely audible',
  },
  {
    id: 'research-1',
    frame: 300,
    file: 'tick-up-1.mp3',
    durationInFrames: 14,
    volume: 0.3,
    hits: 'Research row 1 lands',
    layers: 'short mid tick + small tail, pitched lowest of the four',
  },
  {
    id: 'research-2',
    frame: 311,
    file: 'tick-up-2.mp3',
    durationInFrames: 14,
    volume: 0.3,
    hits: 'Research row 2 lands',
    layers: 'same tick, pitched up a step',
  },
  {
    id: 'research-3',
    frame: 322,
    file: 'tick-up-3.mp3',
    durationInFrames: 14,
    volume: 0.3,
    hits: 'Research row 3 lands',
    layers: 'same tick, pitched up a step',
  },
  {
    id: 'research-4',
    frame: 333,
    file: 'tick-up-4.mp3',
    durationInFrames: 20,
    volume: 0.32,
    hits: 'Research row 4 lands — resolves the ascending run',
    layers: 'same tick, top of the run, slightly longer tail',
  },
  {
    id: 'deck-assemble',
    frame: 396,
    file: 'impact-medium.mp3',
    durationInFrames: 40,
    volume: 0.5,
    hits: 'Flank cards fly in',
    layers: 'whoosh + mid body + sub',
  },
  {
    id: 'hero-card',
    frame: 404,
    file: 'impact-heavy.mp3',
    durationInFrames: 50,
    volume: 0.62,
    hits: 'Centre card lands',
    layers: 'deeper sub + fuller body than the 396 hit — this one has to feel heavier',
  },
  {
    id: 'riser',
    frame: 470,
    file: 'riser.mp3',
    durationInFrames: 16,
    volume: 0.55,
    hits: 'Builds through the zoom-through',
    layers: 'rising noise sweep + pitch-bent tone, ducks out exactly on 486',
  },
  {
    id: 'burst',
    frame: 486,
    file: 'impact-big.mp3',
    durationInFrames: 60,
    volume: 0.75,
    hits: 'Burst out the far side onto the counter',
    layers: 'the biggest hit in the film — sub drop + wide body + bright transient + long tail',
  },
  {
    id: 'cta-headline',
    frame: 550,
    file: 'impact-medium.mp3',
    durationInFrames: 34,
    volume: 0.45,
    hits: 'CTA headline lands',
    layers: 'mid body + short sub, no whoosh — we are settling, not travelling',
  },
  {
    id: 'cta-button',
    frame: 566,
    file: 'impact-soft.mp3',
    durationInFrames: 34,
    volume: 0.42,
    hits: 'Button lands',
    layers: 'soft mid click + warm sub, final punctuation',
  },
];

/** Constant low drone under the entire film. Two sines, 55Hz + 82.5Hz (a fifth). */
export const BED = {
  file: 'bed-drone.mp3',
  volume: 0.016,
  note: 'Two sine oscillators at 55Hz and 82.5Hz. Runs frames 0-600, never ducks.',
};
