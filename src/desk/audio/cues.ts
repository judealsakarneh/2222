/**
 * Sound design cue sheet, frame-exact.
 *
 * The concept: this is a ROOM, so the sound is diegetic first. Key clicks, a
 * mouse, the hum of a desk. The transitions get UI whooshes rather than cinema
 * impacts, because what is moving is a screen, not a camera.
 *
 * Every impact is layered — a single tone always sounds cheap. Each `layers`
 * note records the stack the hit should be built from.
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
    id: 'room-settle',
    frame: 0,
    file: 'room-tone.mp3',
    durationInFrames: 40,
    volume: 0.2,
    hits: 'Camera pushes in, room establishes',
    layers: 'low room hum + a distant desk creak; no music yet, let the room exist first',
  },
  {
    id: 'typing',
    frame: 46,
    file: 'keys-mech.mp3',
    durationInFrames: 40,
    volume: 0.32,
    hits: 'The prompt types out (46-84)',
    layers: 'real mechanical switches, uneven timing, slight room reverb — must not sound quantised',
  },
  {
    id: 'enter',
    frame: 86,
    file: 'key-enter.mp3',
    durationInFrames: 14,
    volume: 0.5,
    hits: 'Enter goes down, send button flashes',
    layers: 'deeper switch thock + a soft UI confirm tone layered on top, 30ms apart',
  },
  {
    id: 'swipe',
    frame: 82,
    file: 'ui-swipe.mp3',
    durationInFrames: 18,
    volume: 0.45,
    hits: 'Parallax swipe to the research page',
    layers: 'short filtered noise sweep + a pitch-bent tone; dry, close, no cinematic tail',
  },
  {
    id: 'steps',
    frame: 102,
    file: 'ui-ticks.mp3',
    durationInFrames: 76,
    volume: 0.22,
    hits: 'Five research rows complete, 13 frames apart',
    layers: 'soft bell partials rising a step per row, each with a tiny air tail',
  },
  {
    id: 'wipe',
    frame: 170,
    file: 'ui-wipe.mp3',
    durationInFrames: 20,
    volume: 0.38,
    hits: 'Feathered mask wipe to the build grid',
    layers: 'band-passed noise moving left to right in the stereo field — pan it, it is a wipe',
  },
  {
    id: 'cards',
    frame: 172,
    file: 'card-pops.mp3',
    durationInFrames: 70,
    volume: 0.26,
    hits: '14 slide cards populate, 4 frames apart',
    layers: 'tiny granular pops, randomised pitch, density following the stagger',
  },
  {
    id: 'iris',
    frame: 258,
    file: 'ui-open.mp3',
    durationInFrames: 22,
    volume: 0.42,
    hits: 'Iris opens onto the finished slide',
    layers: 'a rising filter sweep + soft sub bloom as it lands — the one warm moment',
  },
  {
    id: 'slices',
    frame: 344,
    file: 'ui-shuffle.mp3',
    durationInFrames: 20,
    volume: 0.4,
    hits: 'Six columns shuffle to the export page',
    layers: 'six short clicks staggered left to right + a noise wash underneath',
  },
  {
    id: 'export-done',
    frame: 400,
    file: 'ui-confirm.mp3',
    durationInFrames: 20,
    volume: 0.4,
    hits: 'Render hits 100%, flips to Ready',
    layers: 'two-note confirm + a small sub; the sound of a job finishing',
  },
  {
    id: 'whip',
    frame: 414,
    file: 'whip.mp3',
    durationInFrames: 16,
    volume: 0.55,
    hits: 'Whip pan to the CTA',
    layers: 'fast noise sweep with doppler bend + a sub drop on the landing',
  },
  {
    id: 'cta',
    frame: 428,
    file: 'cta-bloom.mp3',
    durationInFrames: 52,
    volume: 0.5,
    hits: 'Mark draws, wordmark and button land',
    layers: 'the fullest moment — sub bloom + wide pad + high shimmer sustaining past the last frame',
  },
];

/** Bed: a quiet room tone under everything, with a pad that arrives at the swipe. */
export const BED = {
  file: 'bed-room.mp3',
  volume: 0.12,
  note:
    'Room tone for frames 0-96, then a low pad fades under from the first swipe onward. Duck it 2dB under each UI cue.',
};
