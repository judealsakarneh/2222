import React from 'react';
import {PANEL_MATERIAL} from '../lib/tokens';

/**
 * The product panel material.
 *
 * Every surface in the film routes through this so no panel is ever a flat
 * fill: directional gradient + hairline emerald border + inner top highlight
 * (a lit edge) + deep drop shadow. Layout and per-scene transforms are passed
 * in by the caller.
 */
export const Panel: React.FC<{
  width?: number | string;
  padding?: number | string;
  radius?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({width = 860, padding = 56, radius = 44, style, children}) => (
  <div
    style={{
      ...PANEL_MATERIAL,
      width,
      padding,
      borderRadius: radius,
      willChange: 'transform',
      ...style,
    }}
  >
    {children}
  </div>
);
