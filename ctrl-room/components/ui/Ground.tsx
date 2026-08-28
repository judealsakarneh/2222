import type {ReactNode} from 'react';

export type GroundName = 'dark' | 'paper' | 'teal';

/**
 * A section and the environment it lives in, declared together.
 *
 * Everything inside reads colour from --g-* rather than naming white or
 * black, so a block can be moved between environments without touching its
 * markup, and no section can end up painting one ground's background under
 * another ground's text.
 */
export function Ground({
  name,
  children,
  className = '',
  id,
  as: Tag = 'section',
  bleed = false,
}: {
  name: GroundName;
  children: ReactNode;
  className?: string;
  id?: string;
  as?: 'section' | 'div' | 'footer';
  /** Skip the background paint, for a block that sits over a seam's own panel. */
  bleed?: boolean;
}) {
  return (
    <Tag
      id={id}
      data-ground={name}
      className={`${bleed ? '' : 'bg-g'} t-1 ${className}`}
    >
      {children}
    </Tag>
  );
}
