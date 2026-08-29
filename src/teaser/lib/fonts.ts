import {MONO as VENDORED_MONO} from '../../lib/fonts';

/**
 * One face for the whole teaser. JetBrains Mono is the terminal look, and a
 * monospace advance is what makes the ASCII art render as a grid rather than as
 * ragged text.
 *
 * It now comes from the project's vendored faces in src/lib/fonts.ts rather
 * than from @remotion/google-fonts. This was the last module fetching a font at
 * render time, and because every composition ends up in one bundle, that single
 * import was enough to make every render in the project depend on the network.
 */
export const MONO = VENDORED_MONO;
