import {loadFont} from '@remotion/google-fonts/Inter';

// Loaded once and shared by every scene so text renders identically in
// Remotion Studio, in stills, and in the final render.
export const {fontFamily: INTER} = loadFont('normal', {
  weights: ['400', '600', '800'],
});
