import type {Config} from 'tailwindcss';

/**
 * Monochrome plus one teal. The palette is deliberately this short: every extra
 * hue is a chance for the page to drift toward the generic SaaS look the brief
 * rules out.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0A0A0A', // page floor
          900: '#0D0D0D', // section
          850: '#101010',
          800: '#121212', // raised surface
          700: '#171717',
          600: '#1F1F1F', // hairline-ish fills
        },
        teal: {
          DEFAULT: '#2DD4BF',
          soft: '#5EEAD4',
          deep: '#14B8A6',
          ghost: 'rgba(45,212,191,0.12)',
        },
        chalk: {
          DEFAULT: '#FFFFFF',
          70: 'rgba(255,255,255,0.70)',
          50: 'rgba(255,255,255,0.50)',
          35: 'rgba(255,255,255,0.35)',
          12: 'rgba(255,255,255,0.12)',
          6: 'rgba(255,255,255,0.06)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.045em',
        headline: '-0.03em',
      },
      maxWidth: {content: '1180px'},
    },
  },
  plugins: [],
};
export default config;
