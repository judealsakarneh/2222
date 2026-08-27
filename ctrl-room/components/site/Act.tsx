import type {ReactNode} from 'react';

/**
 * A section that declares its act.
 *
 * The `data-act` attribute does two jobs: it sets every colour token for
 * everything inside (see globals.css), and it is what ActBackground reads to
 * work out where the ground should change. Nothing inside an Act should ever
 * hard-code a colour — that is how a block ends up unreadable when its act
 * flips.
 *
 * Acts are transparent. The ground is the fixed layer behind them.
 */
export function Act({
  act,
  id,
  children,
  className = '',
  bleed = false,
}: {
  act: 'dark' | 'light';
  id?: string;
  children: ReactNode;
  className?: string;
  /** Skip the standard vertical rhythm — for full-bleed bands like the ticker. */
  bleed?: boolean;
}) {
  return (
    <section
      id={id}
      data-act={act}
      className={`relative ${bleed ? '' : 'py-[var(--gap-act)]'} ${className}`}
      style={{color: 'var(--fg)'}}
    >
      {children}
    </section>
  );
}

/** Standard measure. Every section shares it so the page has one spine. */
export function Wrap({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-content edge ${className}`}>{children}</div>
  );
}
