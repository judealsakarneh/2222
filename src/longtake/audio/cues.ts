/**
 * Sound design cue sheet, frame-exact against the camera move.
 *
 * The sound concept follows the picture concept: there are no cuts, so there are
 * no stingers. Instead there is ONE continuous bed whose filter opens with
 * camera speed, plus soft arrivals at each station. A hard impact anywhere in
 * this film would imply an edit that does not exist.
 *
 * Each `layers` note records the stack the sound should be built from — a single
 * tone always sounds cheap.
 */

export type Cue = {
  id: string;
  frame: number;
  file: string;
  durationInFrames: number;
  volume: number;
  hits: string;
  layers: string;
};

export const CUES: Cue[] = [
  {
    id: 'depart-hook',
    frame: 55,
    file: 'travel-swell.mp3',
    durationInFrames: 50,
    volume: 0.34,
    hits: 'Camera accelerates away from the hook',
    layers: 'filtered noise rise + low tone bend; opens and closes with the move, no transient',
  },
  {
    id: 'arrive-voice',
    frame: 100,
    file: 'arrive-soft.mp3',
    durationInFrames: 30,
    volume: 0.3,
    hits: 'Waveform aperture reaches the lens',
    layers: 'warm sub bloom + faint air; the attack must be slow, never a hit',
  },
  {
    id: 'depart-voice',
    frame: 180,
    file: 'travel-swell.mp3',
    durationInFrames: 50,
    volume: 0.34,
    hits: 'Travel to the transcript',
    layers: 'same swell, pitched up a tone so the four travels are not identical',
  },
  {
    id: 'typing',
    frame: 218,
    file: 'keys-soft.mp3',
    durationInFrames: 80,
    volume: 0.1,
    hits: 'Transcript types out',
    layers: 'dry key ticks, very low — texture under the bed, not rhythm on top of it',
  },
  {
    id: 'chips',
    frame: 260,
    file: 'chip-lift.mp3',
    durationInFrames: 50,
    volume: 0.26,
    hits: 'Three entity chips lift out of the transcript (260 / 282 / 296)',
    layers: 'short bell partial + tiny air tail, each pitched a third above the last',
  },
  {
    id: 'depart-transcript',
    frame: 315,
    file: 'travel-swell.mp3',
    durationInFrames: 40,
    volume: 0.34,
    hits: 'Travel to the research graph',
    layers: 'swell, up another tone',
  },
  {
    id: 'graph-wire',
    frame: 339,
    file: 'graph-ticks.mp3',
    durationInFrames: 70,
    volume: 0.2,
    hits: 'Edges draw and nodes land',
    layers: 'sparse granular ticks, spatialised wide; density follows the edge stagger',
  },
  {
    id: 'depart-research',
    frame: 450,
    file: 'travel-swell.mp3',
    durationInFrames: 50,
    volume: 0.34,
    hits: 'Travel to the outline',
    layers: 'swell, back down to the root — the arc resets before the deck',
  },
  {
    id: 'outline-rules',
    frame: 474,
    file: 'rule-ticks.mp3',
    durationInFrames: 60,
    volume: 0.22,
    hits: 'Six rules draw, 7 frames apart',
    layers: 'short filtered noise strokes, one per rule, panned slightly left to right',
  },
  {
    id: 'deck-wall',
    frame: 596,
    file: 'wall-bloom.mp3',
    durationInFrames: 70,
    volume: 0.4,
    hits: 'Fourteen slides populate the wall',
    layers: 'granular cloud that thickens with the card stagger + a sub swell underneath',
  },
  {
    id: 'collapse',
    frame: 739,
    file: 'collapse.mp3',
    durationInFrames: 34,
    volume: 0.44,
    hits: 'The three-day bar collapses to 47s',
    layers: 'descending filtered sweep + a soft landing thump on the stub; the only downward gesture in the film',
  },
  {
    id: 'arrive-cta',
    frame: 850,
    file: 'arrive-bloom.mp3',
    durationInFrames: 50,
    volume: 0.5,
    hits: 'Mark completes, wordmark and button land',
    layers: 'the fullest moment — sub bloom + wide body + a high shimmer that sustains past the last frame',
  },
];

/**
 * The bed. One continuous pad under all 900 frames.
 *
 * Automate its low-pass cutoff to the camera speed exported by
 * `speedNorm(frame)` in longtake/lib/camera.ts — the bed should open on the
 * travels and close at the stations. That single automation does more for the
 * feel of the piece than any of the individual cues.
 */
export const BED = {
  file: 'bed-pad.mp3',
  volume: 0.15,
  note:
    'Sustained pad, root ~55Hz with a fifth. Low-pass cutoff automated to camera speed: closed (~400Hz) at stations, open (~6kHz) mid-travel.',
};
