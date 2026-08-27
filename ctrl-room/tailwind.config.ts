import type {Config} from 'tailwindcss';

/**
 * Monochrome plus one teal. The palette is deliberately this short: every extra
 * hue is a chance for the page to drift toward the generic SaaS look the brief
 * rules out.
 *
 * Two type roles, not one. Inter carries display and body; JetBrains Mono
 * carries every label, index and readout. That second face is what stops a
 * dark page with an accent colour from reading as a template — the mono layer
 * makes the page feel instrumented rather than decorated.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          975: '#050505', // hard floor — sections that need to recede
          950: '#0A0A0A', // page
          900: '#0D0D0D',
          850: '#101010',
          800: '#141414', // glass surface
          700: '#191919',
          600: '#1F1F1F',
        },
        teal: {
          DEFAULT: '#2DD4BF',
          soft: '#5EEAD4', // glow / highlight only
          deep: '#14B8A6',
          dim: '#0B3B36', // the ring graphic — teal family, no shouting
          ghost: 'rgba(45,212,191,0.12)',
        },
        chalk: {
          DEFAULT: '#FFFFFF',
          70: 'rgba(255,255,255,0.70)',
          50: 'rgba(255,255,255,0.50)',
          35: 'rgba(255,255,255,0.35)',
          20: 'rgba(255,255,255,0.20)',
          12: 'rgba(255,255,255,0.12)',
          6: 'rgba(255,255,255,0.06)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      letterSpacing: {
        display: '-0.05em',
        tightest: '-0.045em',
        headline: '-0.03em',
      },
      maxWidth: {content: '1240px'},
      keyframes: {
        marquee: {
          from: {transform: 'translateX(0)'},
          // Exactly half, because the track renders its content twice. Any
          // other value makes the loop visibly jump.
          to: {transform: 'translateX(-50%)'},
        },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
      },
    },
  },
  plugins: [],
};
export default config;
