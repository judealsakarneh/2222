import {Easing} from 'remotion';

// Shared "expo out" bezier used for every entrance/exit in the reel so the
// whole video accelerates and settles with the same signature feel.
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);

// One accent color, reused across every scene, ties the reel together.
export const ACCENT = '#8b5cf6';
export const ACCENT_SOFT = '#a78bfa';
export const INK = '#f5f5f7';
export const INK_DIM = 'rgba(245,245,247,0.6)';
