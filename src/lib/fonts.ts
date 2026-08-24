import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadInstrumentSerif} from '@remotion/google-fonts/InstrumentSerif';

// Fonts are loaded at module scope so they resolve once and render identically
// in Remotion Studio, in stills, and in the final render.

// Subsets are pinned to latin. Left unpinned, @remotion/google-fonts fetches
// every subset of every weight — 28 requests per render tab, all but a couple of
// which this project never draws a glyph from.

// Inter carries every UI label, caption and body line across both compositions.
export const {fontFamily: INTER} = loadInter('normal', {
  weights: ['400', '600', '700', '800'],
  subsets: ['latin'],
});

// Instrument Serif carries every headline in RambleAd. Both styles are loaded
// because the CTA sets "Get the deck." in italic.
export const {fontFamily: SERIF} = loadInstrumentSerif('normal', {
  weights: ['400'],
  subsets: ['latin'],
});
loadInstrumentSerif('italic', {weights: ['400'], subsets: ['latin']});
