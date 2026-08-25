import React from 'react';

/**
 * Nine slide-type glyphs, hand-authored. No icon library, no assets — the whole
 * point of the format is that everything on screen is code.
 *
 * They read as the KINDS of slide zamble builds, not as generic app icons: a bar
 * chart, a bullet list, a pull quote, a pie, a trend line, a table, an image
 * slide, a timeline, a title card.
 */

const base = (sw: number): React.SVGProps<SVGSVGElement> => ({
  viewBox: '0 0 24 24',
  fill: 'none',
  strokeWidth: sw,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
});

type P = {size?: number; color?: string; sw?: number};

export const IcBars: React.FC<P> = ({size = 34, color = '#fff', sw = 1.8}) => (
  <svg width={size} height={size} stroke={color} {...base(sw)}>
    <line x1="5" y1="20" x2="5" y2="12" /><line x1="10" y1="20" x2="10" y2="7" />
    <line x1="15" y1="20" x2="15" y2="14" /><line x1="20" y1="20" x2="20" y2="4" />
  </svg>
);
export const IcList: React.FC<P> = ({size = 34, color = '#fff', sw = 1.8}) => (
  <svg width={size} height={size} stroke={color} {...base(sw)}>
    <circle cx="5" cy="7" r="1.4" fill={color} stroke="none" /><line x1="10" y1="7" x2="20" y2="7" />
    <circle cx="5" cy="12" r="1.4" fill={color} stroke="none" /><line x1="10" y1="12" x2="20" y2="12" />
    <circle cx="5" cy="17" r="1.4" fill={color} stroke="none" /><line x1="10" y1="17" x2="17" y2="17" />
  </svg>
);
export const IcTarget: React.FC<P> = ({size = 34, color = '#fff', sw = 1.8}) => (
  <svg width={size} height={size} stroke={color} {...base(sw)}>
    <circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="1.2" fill={color} stroke="none" />
  </svg>
);
export const IcPie: React.FC<P> = ({size = 34, color = '#fff', sw = 1.8}) => (
  <svg width={size} height={size} stroke={color} {...base(sw)}>
    <circle cx="12" cy="12" r="8.5" /><path d="M12 3.5V12l6 6" />
  </svg>
);
export const IcTrend: React.FC<P> = ({size = 34, color = '#fff', sw = 1.8}) => (
  <svg width={size} height={size} stroke={color} {...base(sw)}>
    <polyline points="4 16 9 11 13 14 20 6" /><polyline points="15 6 20 6 20 11" />
  </svg>
);
export const IcTable: React.FC<P> = ({size = 34, color = '#fff', sw = 1.8}) => (
  <svg width={size} height={size} stroke={color} {...base(sw)}>
    <rect x="4" y="5" width="16" height="14" rx="2" />
    <line x1="4" y1="10" x2="20" y2="10" /><line x1="12" y1="10" x2="12" y2="19" />
  </svg>
);
export const IcImage: React.FC<P> = ({size = 34, color = '#fff', sw = 1.8}) => (
  <svg width={size} height={size} stroke={color} {...base(sw)}>
    <rect x="4" y="5" width="16" height="14" rx="2" />
    <circle cx="9" cy="10" r="1.6" /><path d="M20 16l-4.5-4.5L7 19" />
  </svg>
);
export const IcTimeline: React.FC<P> = ({size = 34, color = '#fff', sw = 1.8}) => (
  <svg width={size} height={size} stroke={color} {...base(sw)}>
    <line x1="4" y1="12" x2="20" y2="12" />
    <circle cx="7.5" cy="12" r="2" /><circle cx="13" cy="12" r="2" /><circle cx="18" cy="12" r="2" />
  </svg>
);
export const IcTitle: React.FC<P> = ({size = 34, color = '#fff', sw = 1.8}) => (
  <svg width={size} height={size} stroke={color} {...base(sw)}>
    <line x1="5" y1="9" x2="19" y2="9" /><line x1="5" y1="14" x2="15" y2="14" />
    <line x1="5" y1="18" x2="11" y2="18" />
  </svg>
);

export const SLIDE_ICONS = [
  IcTitle, IcBars, IcList,
  IcTrend, IcPie, IcTarget,
  IcTable, IcImage, IcTimeline,
];
