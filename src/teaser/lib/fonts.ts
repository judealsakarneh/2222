import {loadFont} from '@remotion/google-fonts/JetBrainsMono';

/**
 * One face for the whole teaser. JetBrains Mono is the terminal look, and a
 * monospace advance is what makes the ASCII art render as a grid rather than as
 * ragged text.
 *
 * Subsets pinned to latin — unpinned, every subset of every weight is fetched.
 */
export const {fontFamily: MONO} = loadFont('normal', {
  weights: ['400', '700', '800'],
  subsets: ['latin'],
});
