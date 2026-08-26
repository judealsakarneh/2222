import base from '../tailwind.config';
import type {Config} from 'tailwindcss';

/** Same theme as the site; only the content globs differ. */
const config: Config = {
  ...base,
  content: ['./components/**/*.{ts,tsx}', './preview/**/*.{ts,tsx}'],
};
export default config;
