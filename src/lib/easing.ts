import {Easing} from 'remotion';

// ---------------------------------------------------------------------------
// AEDemoReel (1080x1080 demo reel)
// ---------------------------------------------------------------------------

// Shared "expo out" bezier used for every entrance/exit in the reel so the
// whole video accelerates and settles with the same signature feel.
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);

// One accent color, reused across every scene, ties the reel together.
export const ACCENT = '#8b5cf6';
export const ACCENT_SOFT = '#a78bfa';
export const INK = '#f5f5f7';
export const INK_DIM = 'rgba(245,245,247,0.6)';

// ---------------------------------------------------------------------------
// RambleAd (1080x1920 product film)
//
// Four curves, four jobs. Nothing in the film uses linear or a default easing:
// every move is on one of these so the whole piece shares a single physique.
// ---------------------------------------------------------------------------

/** Standard move — anything entering and settling into place. */
export const EASE_STANDARD = Easing.bezier(0.22, 1, 0.36, 1);

/** Fast exit — anything leaving frame. Starts slow, rips out. */
export const EASE_FAST_EXIT = Easing.bezier(0.55, 0, 1, 0.45);

/** Camera — push-ins, dollies, zoom-throughs. Longest, softest tail. */
export const EASE_CAMERA = Easing.bezier(0.16, 1, 0.3, 1);

/** Settle — the default spring for text and panels arriving. */
export const SPRING_SETTLE = {damping: 14, stiffness: 110, mass: 0.8} as const;

/** Side deck cards — a touch stiffer so they arrive with authority. */
export const SPRING_CARD = {damping: 15, stiffness: 100, mass: 0.8} as const;

/** Hero (center) deck card — looser damping, lands with a visible settle. */
export const SPRING_CARD_HERO = {damping: 13, stiffness: 115, mass: 0.8} as const;

/** CTA button — deliberately under-damped so it overshoots then settles. */
export const SPRING_BUTTON = {damping: 12, stiffness: 130, mass: 0.8} as const;
