/**
 * Sound design cue sheet, frame-exact against the picture cut.
 *
 * The teaser's audio identity is four elements: a low synth pad under
 * everything, digital whooshes on camera moves, keyboard ticks on the typed
 * lines, and glitch stutters on the hard cuts.
 *
 * Every impact is LAYERED — a single tone always sounds cheap. Each `layers`
 * note records the stack the hit should be built from.
 *
 * Audio is off by default (see AudioDesign.tsx) so the project renders on a
 * clean checkout. Drop files into public/audio/ and enable.
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
    id: 'counter-run',
    frame: 3,
    file: 'digital-counter.mp3',
    durationInFrames: 36,
    volume: 0.22,
    hits: 'The counter climbs 3277 -> 62000',
    layers: 'dry ticking transient repeated, rising in density then settling — no tail',
  },
  {
    id: 'glitch-cut-1',
    frame: 40,
    file: 'glitch-stutter.mp3',
    durationInFrames: 16,
    volume: 0.55,
    hits: 'RGB-split hard cut into the montage',
    layers: 'bit-crushed noise burst + sub thump + high transient; no reverb, must feel dry',
  },
  {
    id: 'montage-ticks',
    frame: 45,
    file: 'shutter-ticks.mp3',
    durationInFrames: 72,
    volume: 0.3,
    hits: 'One tick per hard cut, every 9 frames through the montage',
    layers: 'short mid click + tiny air tail; pitch alternates so eight in a row do not fatigue',
  },
  {
    id: 'whip-pan',
    frame: 111,
    file: 'digital-whoosh.mp3',
    durationInFrames: 20,
    volume: 0.6,
    hits: 'Whip pan out of the montage',
    layers: 'filtered noise sweep (attack) + doppler-bent tone (body) + sub drop on the landing',
  },
  {
    id: 'typing',
    frame: 126,
    file: 'keyboard-typing.mp3',
    durationInFrames: 72,
    volume: 0.14,
    hits: 'The three feature lines type out',
    layers: 'mechanical key ticks, dry, low in the mix — texture not rhythm',
  },
  {
    id: 'glitch-cut-2',
    frame: 205,
    file: 'glitch-stutter.mp3',
    durationInFrames: 16,
    volume: 0.55,
    hits: 'Digital distortion into the product reveal',
    layers: 'same stack as glitch-cut-1, pitched down a little for weight',
  },
  {
    id: 'reveal-impact',
    frame: 216,
    file: 'impact-reveal.mp3',
    durationInFrames: 60,
    volume: 0.75,
    hits: 'The wordmark locks',
    layers: 'the biggest hit in the film — sub drop + wide body + bright transient + long reverb tail',
  },
  {
    id: 'sweep',
    frame: 250,
    file: 'scan-sweep.mp3',
    durationInFrames: 50,
    volume: 0.18,
    hits: 'Scanline sweep crosses the wordmark',
    layers: 'slow band-passed noise rise, very quiet — felt more than heard',
  },
  {
    id: 'chroma-out',
    frame: 285,
    file: 'digital-whoosh.mp3',
    durationInFrames: 20,
    volume: 0.4,
    hits: 'Chromatic fade to the end card',
    layers: 'reversed whoosh into silence — the only cue that decays to nothing',
  },
];

/** Low synth pad under all 360 frames. */
export const BED = {
  file: 'synth-pad.mp3',
  volume: 0.13,
  note: 'Sustained low pad, root around 55Hz with a slow filter drift. Never ducks.',
};
