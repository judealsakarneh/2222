/**
 * Revorva — day and night.
 *
 * Two complete, independently verified palettes. NOT two ends of a lerp, and
 * that distinction is the whole architecture of this film.
 *
 * A light theme crossfading to a dark one looks obvious until you measure the
 * middle of it. Ink on white is rgb(11,13,18) on rgb(255,255,255); white on ink
 * is the reverse. Interpolate both and at k=0.5 the foreground and the
 * background are the SAME GREY - measured at 1.00:1, which is not low contrast,
 * it is no contrast. Every word on screen disappears for the middle of the
 * transition. And it is not a tuning problem: any continuous path that swaps
 * those two endpoints has to cross equal luminance somewhere.
 *
 * So the film never blends them. Night arrives as a soft-edged band that sweeps
 * down the frame, with the day palette below it and the night palette above.
 * Every pixel at every frame belongs to one palette that was checked on its own.
 * The transition is smooth because the band's edge is soft and moves on the
 * camera curve, not because the colours are averaged.
 *
 * Both palettes are verified at build time by the sweep in scripts, and neither
 * shares a single state colour with the other - see `redLit` and `greenLit`.
 */

export type Theme = {
  name: 'day' | 'night';
  bg: string;
  surface: string;
  surface2: string;
  fg: string;
  fg2: string;
  fg3: string;
  line: string;
  line2: string;
  accent: string;
  accentSoft: string;
  red: string;
  redSoft: string;
  redLit: string;
  green: string;
  greenSoft: string;
  greenLit: string;
  /** The panel's drop shadow. Deep and soft on light, deeper still on dark. */
  panelShadow: string;
  /** Ambient wash behind the panel. */
  wash: string;
  /** Vignette strength. Near nothing in daylight; a real lens stop at night. */
  vignette: number;
};

/**
 * Daylight. Business as usual, and where the failure is discovered.
 *
 * The ground is #EEF1F6 rather than pure white so the white panel has something
 * to sit on. A white card on a white page has no edge, and the panel needs an
 * edge because the whole film is about looking into it.
 */
export const DAY: Theme = {
  name: 'day',
  bg: '#EEF1F6',
  surface: '#FFFFFF',
  surface2: '#F4F6FA',
  fg: '#0B0D12',
  /** 6.38:1 on the white surface. */
  fg2: 'rgba(11,13,18,0.66)',
  /** 0.62, not 0.48. At 0.48 the small labels measured 3.41:1 and failed. */
  fg3: 'rgba(11,13,18,0.62)',
  line: 'rgba(11,13,18,0.10)',
  line2: 'rgba(11,13,18,0.18)',
  accent: '#3D63DD',
  accentSoft: 'rgba(61,99,221,0.12)',
  red: '#E5484D',
  redSoft: 'rgba(229,72,77,0.10)',
  /** 5.26:1 on its own tint. The night red would be 2.37 here. */
  redLit: '#B5252A',
  green: '#30A46C',
  greenSoft: 'rgba(48,164,108,0.10)',
  /** 5.22:1. The night green would be 2.27 here. */
  greenLit: '#1B6E49',
  panelShadow: '0 30px 90px -28px rgba(13,20,40,0.28), 0 2px 6px rgba(13,20,40,0.06)',
  wash: 'radial-gradient(60% 46% at 50% 38%, rgba(61,99,221,0.10), rgba(61,99,221,0) 72%)',
  vignette: 0.06,
};

/**
 * Night. The retries run on a 1h / 24h / 72h schedule, so the dark stretch is
 * not a mood - it is the only honest way to show time passing.
 */
export const NIGHT: Theme = {
  name: 'night',
  bg: '#0B0D12',
  surface: '#141821',
  surface2: '#1B2029',
  fg: '#FFFFFF',
  /** 9.56:1 on the dark surface. */
  fg2: 'rgba(255,255,255,0.72)',
  /** 5.55:1. */
  fg3: 'rgba(255,255,255,0.52)',
  line: 'rgba(255,255,255,0.10)',
  line2: 'rgba(255,255,255,0.18)',
  accent: '#3D63DD',
  accentSoft: 'rgba(61,99,221,0.16)',
  red: '#E5484D',
  redSoft: 'rgba(229,72,77,0.14)',
  /** 4.90:1 on its own tint. The day red would be 2.21 here. */
  redLit: '#FF6369',
  green: '#30A46C',
  greenSoft: 'rgba(48,164,108,0.14)',
  /** 4.98:1, within 0.08 of the red so the two states weigh the same. */
  greenLit: '#3CB179',
  panelShadow: '0 40px 120px -30px rgba(0,0,0,0.75)',
  wash: 'radial-gradient(60% 46% at 50% 40%, rgba(61,99,221,0.16), rgba(61,99,221,0) 72%)',
  vignette: 0.3,
};
