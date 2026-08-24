import React from 'react';

// All icons in the reel are hand-authored inline SVGs — no icon libraries,
// no rasterized assets. A shared minimal stroke style keeps every icon
// (arrow, bell, search, app grid, logo mark) visually consistent.

type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

const base = (strokeWidth: number): React.SVGProps<SVGSVGElement> => ({
  viewBox: '0 0 24 24',
  fill: 'none',
  strokeWidth,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
});

export const ArrowDownIcon: React.FC<IconProps> = ({size = 48, color = '#fff', strokeWidth = 1.8}) => (
  <svg width={size} height={size} stroke={color} {...base(strokeWidth)}>
    <line x1="12" y1="3" x2="12" y2="16" />
    <polyline points="6 10 12 16 18 10" />
  </svg>
);

export const BellIcon: React.FC<IconProps> = ({size = 48, color = '#fff', strokeWidth = 1.6}) => (
  <svg width={size} height={size} stroke={color} {...base(strokeWidth)}>
    <path d="M6 9a6 6 0 0 1 12 0c0 4.6 1.6 5.8 2 6.2H4c.4-.4 2-1.6 2-6.2z" />
    <path d="M9.5 19a2.5 2.5 0 0 0 5 0" />
  </svg>
);

export const SearchIcon: React.FC<IconProps> = ({size = 24, color = '#fff', strokeWidth = 2}) => (
  <svg width={size} height={size} stroke={color} {...base(strokeWidth)}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <line x1="20" y1="20" x2="15.4" y2="15.4" />
  </svg>
);

export const MailIcon: React.FC<IconProps> = ({size = 32, color = '#fff', strokeWidth = 1.6}) => (
  <svg width={size} height={size} stroke={color} {...base(strokeWidth)}>
    <rect x="3" y="5" width="18" height="14" rx="2.4" />
    <path d="M3.5 6.5l8.5 6.5 8.5-6.5" />
  </svg>
);

export const CameraIcon: React.FC<IconProps> = ({size = 32, color = '#fff', strokeWidth = 1.6}) => (
  <svg width={size} height={size} stroke={color} {...base(strokeWidth)}>
    <path d="M4 8.2h3.2l1.8-2h6l1.8 2H20a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.2a1 1 0 0 1 1-1z" />
    <circle cx="12" cy="13.2" r="3.1" />
  </svg>
);

export const MusicIcon: React.FC<IconProps> = ({size = 32, color = '#fff', strokeWidth = 1.6}) => (
  <svg width={size} height={size} stroke={color} {...base(strokeWidth)}>
    <circle cx="6.5" cy="18" r="2.3" />
    <circle cx="16.5" cy="16" r="2.3" />
    <path d="M8.8 18V6.4L18.8 4.4V16" />
  </svg>
);

export const ChatIcon: React.FC<IconProps> = ({size = 32, color = '#fff', strokeWidth = 1.6}) => (
  <svg width={size} height={size} stroke={color} {...base(strokeWidth)}>
    <path d="M4 5.5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9.5L5 20v-3.5H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1z" />
  </svg>
);

export const HeartIcon: React.FC<IconProps> = ({size = 32, color = '#fff', strokeWidth = 1.6}) => (
  <svg width={size} height={size} stroke={color} {...base(strokeWidth)}>
    <path d="M12 20.2s-7.2-4.4-9.6-9.1C.7 7.6 3 4.2 6.3 4.2c2 0 3.4 1.2 5.7 4.5 2.3-3.3 3.7-4.5 5.7-4.5 3.3 0 5.6 3.4 3.9 6.9-2.4 4.7-9.6 9.1-9.6 9.1z" />
  </svg>
);

export const CalendarIcon: React.FC<IconProps> = ({size = 32, color = '#fff', strokeWidth = 1.6}) => (
  <svg width={size} height={size} stroke={color} {...base(strokeWidth)}>
    <rect x="3" y="5" width="18" height="16" rx="2.4" />
    <path d="M3 10h18" />
    <path d="M8 3v4" />
    <path d="M16 3v4" />
  </svg>
);

export const PhotoIcon: React.FC<IconProps> = ({size = 32, color = '#fff', strokeWidth = 1.6}) => (
  <svg width={size} height={size} stroke={color} {...base(strokeWidth)}>
    <rect x="3" y="4.5" width="18" height="15" rx="2.4" />
    <circle cx="8.6" cy="9.6" r="1.6" />
    <path d="M21 15.5l-5.6-5.6L9 16.5" />
  </svg>
);

export const CompassIcon: React.FC<IconProps> = ({size = 32, color = '#fff', strokeWidth = 1.6}) => (
  <svg width={size} height={size} stroke={color} {...base(strokeWidth)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M15.2 8.8l-2.1 5.3-5.3 2.1 2.1-5.3z" />
  </svg>
);

export const SettingsIcon: React.FC<IconProps> = ({size = 32, color = '#fff', strokeWidth = 1.6}) => (
  <svg width={size} height={size} stroke={color} {...base(strokeWidth)}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 2.5v3M12 18.5v3M4.3 4.3l2.1 2.1M17.6 17.6l2.1 2.1M2 12h3M19 12h3M4.3 19.7l2.1-2.1M17.6 6.4l2.1-2.1" />
  </svg>
);

export const LogoMark: React.FC<IconProps> = ({size = 96, color = '#fff', strokeWidth = 2}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    stroke={color}
    fill="none"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.5 7.5l6 4.5-6 4.5z" fill={color} stroke="none" />
  </svg>
);
