import {continueRender, delayRender, staticFile} from 'remotion';

/**
 * Fonts for every composition, served from public/ rather than from Google.
 *
 * This module used to call @remotion/google-fonts, which fetches from
 * fonts.gstatic.com while the render is running. That is a network dependency
 * inside a deterministic pipeline, and it fails in exactly the situation you
 * least want it to: behind a TLS-terminating proxy the render browser does not
 * trust, every face returns ERR_CERT_AUTHORITY_INVALID and the render quietly
 * completes in a system fallback. Nothing errors. You find out by looking at
 * the finished file.
 *
 * Each file is the latin subset of the variable font, so one file covers the
 * whole weight range a family is used at. The exported constants are unchanged,
 * so no scene file needed editing.
 */

type Face = {
  family: string;
  file: string;
  weight: string;
  style?: 'normal' | 'italic';
};

const FACES: Face[] = [
  // CTRL Room brand faces. Archivo carries display and body; JetBrains Mono
  // carries every label, index and readout.
  {family: 'Archivo', file: 'fonts/archivo-latin.woff2', weight: '100 900'},
  {family: 'JetBrains Mono', file: 'fonts/jetbrains-latin.woff2', weight: '100 800'},
  // Inter carries every UI label, caption and body line elsewhere.
  {family: 'Inter', file: 'fonts/inter-latin.woff2', weight: '100 900'},
  // Instrument Serif carries the headlines in RambleAd. Both styles, because
  // the CTA sets "Get the deck." in italic.
  {family: 'Instrument Serif', file: 'fonts/instrument-serif-latin.woff2', weight: '400'},
  {
    family: 'Instrument Serif',
    file: 'fonts/instrument-serif-italic-latin.woff2',
    weight: '400',
    style: 'italic',
  },
];

export const ARCHIVO = 'Archivo';
export const MONO = 'JetBrains Mono';
export const INTER = 'Inter';
export const SERIF = 'Instrument Serif';

let loaded: Promise<void> | null = null;

/**
 * Blocks the render until every face is parsed and ready.
 *
 * delayRender is the load-bearing part. Without it Remotion captures a frame as
 * soon as React has painted, which is reliably before a woff2 has finished
 * decoding, and the opening frames come out in a fallback face.
 *
 * Called at module scope below, so the handle is registered while the bundle is
 * evaluating - before the first frame is ever scheduled.
 */
export const loadFonts = (): Promise<void> => {
  if (loaded) return loaded;
  loaded = (async () => {
    const handle = delayRender('Loading fonts');
    try {
      await Promise.all(
        FACES.map(async (f) => {
          const face = new FontFace(
            f.family,
            `url(${staticFile(f.file)}) format('woff2')`,
            {weight: f.weight, style: f.style ?? 'normal'},
          );
          await face.load();
          // The lib DOM types model FontFaceSet without the mutation methods it
          // has had in every shipping browser for a decade.
          (document.fonts as unknown as Set<FontFace>).add(face);
        }),
      );
      await document.fonts.ready;
    } finally {
      continueRender(handle);
    }
  })();
  return loaded;
};

loadFonts();
