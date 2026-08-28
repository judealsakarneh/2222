import base from '../tailwind.config';
import type {Config} from 'tailwindcss';

/**
 * Same theme as the site; only the content globs differ.
 *
 * `./app` MUST be in this list. Tailwind scans files by glob, not by import
 * graph, so leaving it out silently drops every class that appears only in a
 * page file, including the hero's font size. The page still renders, the class
 * is still in the markup, and the browser falls back to its default h1 size,
 * which reads as a cramped broken layout rather than as a missing stylesheet.
 */
const config: Config = {
  ...base,
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './preview/**/*.{ts,tsx}',
  ],
};
export default config;
