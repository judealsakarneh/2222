import {hash} from '../../lib/random';

/**
 * Procedural ASCII art.
 *
 * The reference teaser cut between screenshots of generated images. There are no
 * image assets here, so the montage renders its "generated assets" as real ASCII
 * art computed from maths every frame — a shaded sphere, a rotating torus, chart
 * renders, a scan grid, an interference field.
 *
 * Every generator is a pure function of (frame, cols, rows): same input, same
 * glyphs, on every render and every thread.
 */

/** Luminance ramp, darkest to brightest. */
const RAMP = ' .:-=+*#%@';

/** Monospace advance width as a fraction of font size. Cells are 0.6 x 1.0. */
const CW = 0.6;

const shade = (t: number): string => {
  const i = Math.floor(Math.max(0, Math.min(0.999, t)) * RAMP.length);
  return RAMP[i];
};

const blank = (cols: number, rows: number): string[][] =>
  new Array(rows).fill(0).map(() => new Array(cols).fill(' '));

const join = (g: string[][]): string[] => g.map((r) => r.join(''));

export type AsciiGen = (frame: number, cols: number, rows: number) => string[];

/* ------------------------------------------------------------------ *
 * Shaded sphere — a point light orbiting a lambert-shaded ball.
 * ------------------------------------------------------------------ */
export const asciiSphere: AsciiGen = (frame, cols, rows) => {
  const g = blank(cols, rows);
  const radius = Math.min(cols * CW, rows) * 0.42;
  const a = frame * 0.07;

  // Orbiting light direction, normalised.
  let lx = Math.cos(a) * 0.8;
  let ly = -0.45;
  let lz = Math.sin(a) * 0.5 + 0.75;
  const ll = Math.hypot(lx, ly, lz);
  lx /= ll;
  ly /= ll;
  lz /= ll;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const dx = ((col - cols / 2 + 0.5) * CW) / radius;
      const dy = (row - rows / 2 + 0.5) / radius;
      const d2 = dx * dx + dy * dy;
      if (d2 > 1) continue;

      const dz = Math.sqrt(1 - d2);
      const lambert = dx * lx + dy * ly + dz * lz;
      if (lambert <= 0) {
        g[row][col] = '.';
        continue;
      }
      g[row][col] = shade(lambert * 1.05);
    }
  }
  return join(g);
};

/* ------------------------------------------------------------------ *
 * Rotating torus — the classic donut, z-buffered so the near surface wins.
 * ------------------------------------------------------------------ */
export const asciiTorus: AsciiGen = (frame, cols, rows) => {
  const g = blank(cols, rows);
  const zbuf = new Float32Array(cols * rows);

  const A = frame * 0.055;
  const B = frame * 0.026;
  const cosA = Math.cos(A);
  const sinA = Math.sin(A);
  const cosB = Math.cos(B);
  const sinB = Math.sin(B);

  const R1 = 1;
  const R2 = 2;
  const K2 = 5;
  const K1 = (cols * K2 * 3) / (8 * (R1 + R2));

  for (let theta = 0; theta < Math.PI * 2; theta += 0.09) {
    const ct = Math.cos(theta);
    const st = Math.sin(theta);
    const circleX = R2 + R1 * ct;
    const circleY = R1 * st;

    for (let phi = 0; phi < Math.PI * 2; phi += 0.03) {
      const cp = Math.cos(phi);
      const sp = Math.sin(phi);

      const x = circleX * (cosB * cp + sinA * sinB * sp) - circleY * cosA * sinB;
      const y = circleX * (sinB * cp - sinA * cosB * sp) + circleY * cosA * cosB;
      const z = K2 + cosA * circleX * sp + circleY * sinA;
      const ooz = 1 / z;

      const xp = Math.floor(cols / 2 + K1 * ooz * x);
      // Halved on Y because a character cell is roughly twice as tall as wide.
      const yp = Math.floor(rows / 2 - (K1 * ooz * y) / 2);
      if (xp < 0 || xp >= cols || yp < 0 || yp >= rows) continue;

      const lum =
        cp * ct * sinB -
        cosA * ct * sp -
        sinA * st +
        cosB * (cosA * st - ct * sinA * sp);
      if (lum <= 0) continue;

      const idx = yp * cols + xp;
      if (ooz > zbuf[idx]) {
        zbuf[idx] = ooz;
        g[yp][xp] = shade(lum * 0.7);
      }
    }
  }
  return join(g);
};

/* ------------------------------------------------------------------ *
 * Bar chart render — a deck slide, drawn in glyphs.
 * ------------------------------------------------------------------ */
export const asciiBars: AsciiGen = (frame, cols, rows) => {
  const g = blank(cols, rows);
  const count = 9;
  const barW = Math.floor((cols - 6) / count) - 1;
  const baseline = rows - 4;

  for (let b = 0; b < count; b++) {
    // Deterministic, gently animated heights.
    const h = Math.floor(
      (0.25 + 0.7 * Math.abs(Math.sin(frame * 0.05 + b * 0.9 + hash(b) * 3))) *
        (baseline - 3)
    );
    const x0 = 3 + b * (barW + 1);

    for (let i = 0; i < barW; i++) {
      for (let y = baseline - h; y < baseline; y++) {
        const t = (baseline - y) / Math.max(1, h);
        g[y][x0 + i] = t > 0.75 ? '#' : t > 0.4 ? '*' : '+';
      }
      g[baseline][x0 + i] = '─';
    }
  }

  // Axis
  for (let x = 2; x < cols - 2; x++) g[baseline][x] = g[baseline][x] === ' ' ? '─' : g[baseline][x];
  for (let y = 3; y <= baseline; y++) g[y][2] = '│';
  g[baseline][2] = '└';
  return join(g);
};

/* ------------------------------------------------------------------ *
 * Signal / line chart — a waveform trace with a filled underside.
 * ------------------------------------------------------------------ */
export const asciiWave: AsciiGen = (frame, cols, rows) => {
  const g = blank(cols, rows);
  const mid = rows / 2;

  for (let col = 0; col < cols; col++) {
    const t = col / cols;
    const y =
      mid +
      Math.sin(t * 9 + frame * 0.14) * (rows * 0.22) +
      Math.sin(t * 23 - frame * 0.09) * (rows * 0.09);
    const yi = Math.round(y);
    if (yi < 0 || yi >= rows) continue;

    g[yi][col] = '#';
    // Fill toward the midline so the trace reads as a filled area chart.
    const from = Math.min(yi + 1, Math.floor(mid));
    const to = Math.max(yi, Math.floor(mid));
    for (let fy = from; fy < to; fy++) {
      if (fy >= 0 && fy < rows) g[fy][col] = ':';
    }
  }
  return join(g);
};

/* ------------------------------------------------------------------ *
 * Scan grid — a field of nodes with a bright column sweeping across.
 * ------------------------------------------------------------------ */
export const asciiGrid: AsciiGen = (frame, cols, rows) => {
  const g = blank(cols, rows);
  const sweep = (frame * 1.4) % cols;

  for (let row = 2; row < rows - 2; row += 2) {
    for (let col = 2; col < cols - 2; col += 3) {
      const seed = row * 131 + col;
      const live = hash(seed) > 0.55;
      const near = Math.abs(col - sweep) < 4;
      g[row][col] = near ? '@' : live ? '+' : '·';
      if (near && live && col + 1 < cols) g[row][col + 1] = '─';
    }
  }

  // Sweep column
  const sx = Math.floor(sweep);
  if (sx >= 0 && sx < cols) {
    for (let row = 1; row < rows - 1; row++) {
      if (g[row][sx] === ' ') g[row][sx] = '│';
    }
  }
  return join(g);
};

/* ------------------------------------------------------------------ *
 * Interference field — overlapping radial waves. Reads as abstract texture.
 * ------------------------------------------------------------------ */
export const asciiField: AsciiGen = (frame, cols, rows) => {
  const g = blank(cols, rows);
  const t = frame * 0.08;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = ((col - cols / 2) * CW) / 6;
      const y = (row - rows / 2) / 6;
      const r1 = Math.hypot(x - Math.cos(t) * 2, y - Math.sin(t) * 1.2);
      const r2 = Math.hypot(x + Math.cos(t * 0.7) * 2.4, y + Math.sin(t * 1.3));
      const v = (Math.sin(r1 * 2 - t * 2) + Math.sin(r2 * 1.6 + t)) * 0.25 + 0.5;
      g[row][col] = shade(v);
    }
  }
  return join(g);
};

/* ------------------------------------------------------------------ *
 * Portrait bust — a shaded head-and-shoulders silhouette built from two
 * ellipsoids, so the montage has a recognisable subject among the abstracts.
 * ------------------------------------------------------------------ */
export const asciiPortrait: AsciiGen = (frame, cols, rows) => {
  const g = blank(cols, rows);
  const a = Math.sin(frame * 0.05) * 0.5;

  // Light orbits slightly so the face is never a flat cutout.
  let lx = Math.cos(a + 0.6) * 0.8;
  let ly = -0.4;
  let lz = 0.8;
  const ll = Math.hypot(lx, ly, lz);
  lx /= ll;
  ly /= ll;
  lz /= ll;

  const headR = Math.min(cols * CW, rows) * 0.3;
  const headCY = rows * 0.38;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const px = (col - cols / 2 + 0.5) * CW;
      const py = row + 0.5;

      // Head: slightly tall ellipsoid.
      const hx = px / headR;
      const hy = (py - headCY) / (headR * 1.25);
      const h2 = hx * hx + hy * hy;

      if (h2 <= 1) {
        const hz = Math.sqrt(1 - h2);
        const lam = hx * lx + hy * ly + hz * lz;
        g[row][col] = lam <= 0 ? '.' : shade(lam * 1.1);
        continue;
      }

      // Shoulders: a wide, shallow ellipse below the head.
      const sx = px / (headR * 2.1);
      const sy = (py - rows * 0.92) / (headR * 0.95);
      if (sx * sx + sy * sy <= 1 && py > headCY + headR * 0.9) {
        const sz = Math.sqrt(Math.max(0, 1 - (sx * sx + sy * sy)));
        const lam = sx * lx * 0.6 + sz * lz * 0.8;
        g[row][col] = lam <= 0 ? '.' : shade(lam * 0.85);
      }
    }
  }
  return join(g);
};

/**
 * The montage playlist. Each entry is one hard cut.
 * `phase` offsets a generator's clock so the two revisits of a generator do not
 * replay identical frames.
 */
export const MONTAGE: {gen: AsciiGen; label: string; phase: number; accent?: boolean}[] = [
  {gen: asciiPortrait, label: 'PORTRAIT.RENDER', phase: 0},
  {gen: asciiBars, label: 'MARKET.CHART', phase: 0, accent: true},
  {gen: asciiTorus, label: 'GEOMETRY.PASS', phase: 0},
  {gen: asciiWave, label: 'SIGNAL.TRACE', phase: 0, accent: true},
  {gen: asciiSphere, label: 'VOLUME.SHADE', phase: 0},
  {gen: asciiGrid, label: 'INDEX.SCAN', phase: 0, accent: true},
  {gen: asciiField, label: 'DIFFUSION.FIELD', phase: 0},
  {gen: asciiTorus, label: 'GEOMETRY.PASS.02', phase: 140},
];
