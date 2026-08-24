import React from 'react';

// ---------------------------------------------------------------------------
// ramble. design system
// Every color, material and type ramp used by RambleAd lives here. Nothing in
// the scene files hardcodes a hex value that isn't in this file.
// ---------------------------------------------------------------------------

export const C = {
  bgDeep: '#060A08',
  bgPanel1: '#0E1A16',
  bgPanel2: '#070E0C',
  ink: '#17E8A8', // primary emerald
  inkDim: '#0C6B4E',
  inkBright: '#43F0BB',
  text: '#F1F3F0',
  textMute: '#68786F',
  textFaint: '#3E4A44',
  // Secondary tints used for UI copy inside product panels.
  label: '#5E7167',
  caption: '#C6CFC9',
  rowText: '#A9B5AE',
  deckLabel: '#4E5F57',
} as const;

/**
 * The panel material. This is the single biggest thing separating a premium
 * frame from a flat one: a directional gradient (never a flat fill), a hairline
 * emerald border, an inner top highlight that reads as a lit edge, and a deep
 * soft drop shadow that lifts the panel off the background.
 */
export const PANEL_MATERIAL: React.CSSProperties = {
  background: `linear-gradient(165deg, ${C.bgPanel1} 0%, #0A1310 60%, ${C.bgPanel2} 100%)`,
  border: '1px solid rgba(23,232,168,0.16)',
  boxShadow:
    '0 30px 70px -24px rgba(0,0,0,0.9), inset 0 1px 0 rgba(23,232,168,0.14)',
};

/** Emerald elements get a real light bloom, not just a bright fill. */
export const EMERALD_GLOW = 'drop-shadow(0 0 14px rgba(23,232,168,0.55))';

/** Uppercase micro-label used for every UI eyebrow in the product panels. */
export const uiLabel = (
  color: string = C.label,
  size = 10
): React.CSSProperties => ({
  fontWeight: 700,
  fontSize: size,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color,
});

/** Headline ramp — Instrument Serif, tight leading, slight negative tracking. */
export const serifHead = (size: number, color: string = C.text): React.CSSProperties => ({
  fontWeight: 400,
  fontSize: size,
  lineHeight: 1.12,
  letterSpacing: '-0.01em',
  color,
  margin: 0,
});
