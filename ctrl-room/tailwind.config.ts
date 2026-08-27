import type {Config} from 'tailwindcss';

/**
 * Palette straight from the brand deck: Near-Black #151515, White, CTRL Teal
 * #006563. The deck's teal is deep — it works as a solid fill and as the ground
 * of a light section, but it has no contrast as type on near-black, so one
 * brightened sibling carries accent text. Two teals, one family, no drift.
 *
 * Archivo, not Inter. A variable grotesque with a real width axis, drawn for
 * news setting — which is what CTRL Room is. Inter is the single most common
 * tell of a generated page and the brand deserves a face with a jaw.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          base: '#0B0B0B',
          900: '#101010',
          800: '#151515', // brand near-black
          700: '#1C1C1C',
          600: '#242424',
          500: '#333333',
        },
        teal: {
          DEFAULT: '#006563', // brand
          bright: '#00A9A4', // accent type on dark
          light: '#4FD1CA', // rare highlight, glow only
          deep: '#00403F',
        },
        paper: {
          DEFAULT: '#F2F3F3', // light-act ground, cooled off pure white
          card: '#FFFFFF',
          line: '#D9DCDB',
          soft: '#E7EAE9',
        },
      },
      fontFamily: {
        // Geist Sans is the voice of the site. Archivo is reserved for display
        // scale only, where its variable width axis does work Geist cannot.
        sans: ['var(--font-geist-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      letterSpacing: {
        // Craft floor puts the tracking floor at -0.04em. Nothing goes tighter.
        display: '-0.04em',
        headline: '-0.022em',
      },
      borderRadius: {
        // Panels are near-square. Uniform 16px rounding on every surface is one
        // of the loudest generated-page tells; the card is the only round thing
        // here, because a real card has round corners.
        panel: '3px',
        card: '14px',
      },
      maxWidth: {content: '1280px', text: '68ch', measure: '72ch'},
      keyframes: {
        ticker: {from: {transform: 'translateX(0)'}, to: {transform: 'translateX(-50%)'}},
        blip: {'0%,100%': {opacity: '1'}, '50%': {opacity: '0.25'}},
      },
      animation: {
        ticker: 'ticker 46s linear infinite',
        blip: 'blip 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;
