'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect, useState} from 'react';
import {NAV} from '@/lib/nav';
import {Wordmark} from './Marks';

/**
 * The bar inverts with whichever act is under it, through CSS variables set on
 * the root by ActBackground, not React state, so it never lags the background
 * crossfade by a frame.
 *
 * The link row is left-aligned against the wordmark rather than centred. A
 * centred nav with a pill around it is one of the most recognisable marks of a
 * generated page, and this brand is a media desk: mastheads run their sections
 * along the left.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const path = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Route change closes the drawer; an open drawer locks the page behind it.
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header
        className="site-header fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500"
        style={{
          color: 'var(--hdr-fg)',
          borderBottom: `1px solid ${scrolled ? 'var(--hdr-line)' : 'transparent'}`,
          backgroundColor: scrolled ? 'var(--hdr-bg)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
        }}
      >
        <div className="mx-auto flex h-[68px] max-w-content items-center gap-10 edge">
          <Link href="/" aria-label="CTRL Room, home" className="shrink-0">
            <span style={{['--fg' as string]: 'var(--hdr-fg)'}}>
              <Wordmark size={17} live />
            </span>
          </Link>

          <nav className="hidden flex-1 items-center gap-7 lg:flex" aria-label="Primary">
            {NAV.map((n) => {
              const on = path === n.href;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  aria-current={on ? 'page' : undefined}
                  className="label transition-opacity duration-300"
                  style={{
                    color: on ? 'var(--accent)' : 'var(--hdr-fg-2)',
                    opacity: on ? 1 : 0.9,
                  }}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/membership#join"
              className="label hidden px-4 py-2.5 transition-colors duration-300 sm:inline-block"
              style={{
                background: 'var(--accent)',
                color: 'var(--on-accent)',
              }}
            >
              Join the room
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="flex h-9 w-9 items-center justify-center lg:hidden"
              style={{border: '1px solid var(--hdr-line)'}}
            >
              <span className="relative block h-[9px] w-4">
                <span
                  className="absolute left-0 block h-px w-full transition-transform duration-300"
                  style={{
                    background: 'var(--hdr-fg)',
                    top: open ? 4 : 0,
                    transform: open ? 'rotate(45deg)' : 'none',
                  }}
                />
                <span
                  className="absolute left-0 block h-px w-full transition-transform duration-300"
                  style={{
                    background: 'var(--hdr-fg)',
                    top: open ? 4 : 8,
                    transform: open ? 'rotate(-45deg)' : 'none',
                  }}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer. Its own act, so it is legible regardless of what the
          page behind it is doing. */}
      <div
        data-act="dark"
        className={`fixed inset-0 z-40 transition-opacity duration-300 lg:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        style={{background: '#121212'}}
      >
        <nav
          className="mx-auto flex h-full max-w-content flex-col justify-center gap-1 edge"
          aria-label="Mobile"
          aria-hidden={!open}
        >
          {NAV.map((n, i) => (
            <Link
              key={n.href}
              href={n.href}
              tabIndex={open ? 0 : -1}
              className="flex items-baseline gap-5 border-b py-5 transition-transform duration-500"
              style={{
                borderColor: 'var(--line)',
                transform: open ? 'none' : 'translateY(14px)',
                transitionDelay: `${60 + i * 45}ms`,
              }}
            >
              <span className="label nums" style={{color: 'var(--fg-3)'}}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className="text-[7vw] font-extrabold tracking-display wide sm:text-[38px]"
                style={{color: path === n.href ? 'var(--accent)' : 'var(--fg)'}}
              >
                {n.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
