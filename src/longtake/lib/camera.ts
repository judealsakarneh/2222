import {EASE_CAMERA} from './tokens';

/**
 * THE CAMERA. This one function drives the entire film.
 *
 * There are no cuts and no scene gating in this piece. Instead the eight
 * stations sit at fixed depths in one 3D world, and a single monotonically
 * increasing `cameraZ` flies through all of them. Everything else in the film —
 * which station is visible, how blurred it is, how bright the speed streaks are,
 * how much the lens fringes — is derived from this value or its derivative.
 *
 * Deriving everything from one continuous quantity is what makes it impossible
 * for the piece to judder: there is nothing to get out of sync with.
 *
 * The camera NEVER fully stops. At each station it decelerates into a slow
 * forward drift (a gentle push-in while you read), then accelerates out. A
 * camera that halts completely reads as a cut with extra steps.
 */

export const FPS = 30;
export const DURATION = 900; // 30.0s

/** CSS perspective for the world container. */
export const PERSPECTIVE = 1400;

/** Distance between consecutive stations, in world units. */
export const GAP = 3000;

/** How far the camera creeps forward during a station hold. */
const HOLD_DRIFT = 210;

export type StationDef = {
  id: string;
  /** Frame at which the camera reaches this station's plane (translateZ 0). */
  arrive: number;
  /** Frames spent drifting through it before accelerating away. */
  hold: number;
};

/**
 * Eight stations across 900 frames. Holds run 1.5-3.2s, travels 1.2-1.7s, so a
 * new idea lands roughly every two seconds without the camera ever stopping.
 */
export const STATIONS: StationDef[] = [
  {id: 'hook', arrive: 0, hold: 55},
  {id: 'voice', arrive: 105, hold: 75},
  {id: 'transcript', arrive: 230, hold: 85},
  {id: 'research', arrive: 355, hold: 95},
  {id: 'outline', arrive: 500, hold: 85},
  {id: 'deck', arrive: 630, hold: 80},
  {id: 'metric', arrive: 745, hold: 70},
  {id: 'cta', arrive: 855, hold: 45},
];

/** World depth of station i. */
export const stationZ = (i: number): number => i * GAP;

/**
 * Keyframes alternate: [arrive_i, z_i], [holdEnd_i, z_i + drift], [arrive_i+1, …]
 * Even-indexed segments are holds (linear slow drift), odd are travels (eased).
 */
const KEYS: {f: number; z: number}[] = [];
STATIONS.forEach((s, i) => {
  KEYS.push({f: s.arrive, z: stationZ(i)});
  KEYS.push({f: s.arrive + s.hold, z: stationZ(i) + HOLD_DRIFT});
});

export const cameraZAt = (frame: number): number => {
  const first = KEYS[0];
  const last = KEYS[KEYS.length - 1];

  // Before frame 0 / after the end, extend at the hold drift rate so the
  // derivative used by the speed-driven effects never spikes at the boundaries.
  if (frame <= first.f) return first.z + (frame - first.f) * 3;
  if (frame >= last.f) return last.z + (frame - last.f) * 3;

  for (let i = 0; i < KEYS.length - 1; i++) {
    const a = KEYS[i];
    const b = KEYS[i + 1];
    if (frame <= b.f) {
      const t = (frame - a.f) / (b.f - a.f);
      const isHold = i % 2 === 0;
      const e = isHold ? t : EASE_CAMERA(t);
      return a.z + (b.z - a.z) * e;
    }
  }
  return last.z;
};

/**
 * Camera speed in world units per frame, by central difference.
 * Peaks around 90 mid-travel and sits near 3 during a hold.
 */
export const cameraSpeedAt = (frame: number): number =>
  cameraZAt(frame + 0.5) - cameraZAt(frame - 0.5);

/**
 * Speed normalised to 0-1, for driving streaks and lens aberration.
 *
 * The divisor is calibrated to the actual curve: peak velocity is ~247 units per
 * frame on the shortest travel, and a hold sits at 3. Normalising against a
 * guessed value saturates the streaks flat across every travel and throws away
 * all the dynamics the camera curve is producing.
 */
export const speedNorm = (frame: number): number => {
  const s = cameraSpeedAt(frame);
  return Math.max(0, Math.min(1, (s - 6) / 180));
};

/* ------------------------------------------------------------------ *
 * Depth response — one place that decides how a thing at depth `tz`
 * looks. Used by stations and by the particle field so they share
 * exactly the same falloff.
 * ------------------------------------------------------------------ */

/** Fade in from far, hold sharp through the middle, blow out as it passes. */
export const depthOpacity = (tz: number): number => {
  if (tz < -3600) return 0;
  if (tz < -2600) return (tz + 3600) / 1000;
  if (tz <= 250) return 1;
  if (tz < 1000) return 1 - (tz - 250) / 750;
  return 0;
};

/**
 * Depth of field. Sharp only in a band around the screen plane — far things are
 * hazy, and anything rushing past the lens goes soft. This is the single biggest
 * contributor to the shot reading as a real camera move rather than as sprites
 * being scaled.
 */
export const depthBlur = (tz: number): number => {
  if (tz < -1200) return Math.min(8, ((-1200 - tz) / 2400) * 8);
  if (tz > 250) return Math.min(16, ((tz - 250) / 750) * 16);
  return 0;
};

/** Perspective scale of something at depth `tz`, for laying out in world units. */
export const depthScale = (tz: number): number =>
  PERSPECTIVE / Math.max(1, PERSPECTIVE - tz);
