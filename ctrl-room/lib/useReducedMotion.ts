'use client';

import {useSyncExternalStore} from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(cb: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

/**
 * Whether the visitor has asked for reduced motion.
 *
 * This exists because framer-motion's own useReducedMotion cannot be trusted
 * under server rendering. It reads the media query during render and stores it
 * with useState, so the server renders false, the client's hydration render
 * returns true, and React - which does not patch attribute mismatches during
 * hydration - keeps the server's markup. The result was a page that read the
 * setting correctly and then ignored it: matchMedia reported reduce, and all
 * four seams still rendered their full-motion class names.
 *
 * useSyncExternalStore is the shape that survives that. Server and first client
 * render agree on false, so hydration is clean, and the store is re-read
 * immediately afterwards - an ordinary update, which React does apply to the
 * DOM. It also keeps following the setting if the visitor changes it mid-visit.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
