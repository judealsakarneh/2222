/**
 * Deterministic pseudo-randomness.
 *
 * Remotion renders frames out of order and in parallel across threads, so
 * Math.random() would produce a different scatter on every frame and every
 * render. Every "random" value in RambleAd comes from this hash instead: it is
 * a pure function of its seed, so frame 40 looks the same on the tenth render
 * as it did on the first.
 */
export const hash = (seed: number): number => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Deterministic value in [min, max) for a given seed. */
export const hashRange = (seed: number, min: number, max: number): number =>
  min + hash(seed) * (max - min);
