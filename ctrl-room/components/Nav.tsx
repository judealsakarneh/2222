'use client';

import {useEffect, useState} from 'react';
import {LogoInline} from './Logo';
import {Diamond} from './Diamond';

const LINKS = [
  {label: 'How it works', href: '#how', id: 'how'},
  {label: 'The card', href: '#card', id: 'card'},
  {label: 'Rewards', href: '#rewards', id: 'rewards'},
];

/**
 * A pill rail whose active segment slides between items.
 *
 * The indicator is one absolutely positioned element driven by the active
 * index, not a background on each link. That matters: a per-link background
 * can only cross-fade, while a single moving element travels — and the travel
 * is the whole reason the pattern feels expensive.
 *
 * Which section is active comes from an IntersectionObserver with a band across
 * the middle of the viewport, so the highlight changes when a section actually
 * occupies the screen rather than the instant its top edge appears.
 */
export function Nav() {
  const [stuck, setStuck] = useState(false);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(LINKS.findIndex((l) => l.id === e.target.id));
          }
        }
      },
      {rootMargin: '-45% 0px -45% 0px'}
    );
    for (const l of LINKS) {
      const el = document.getElementById(l.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        stuck
          ? 'border-b border-white/[0.06] bg-ink-950/70 backdrop-blur-xl'
          : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-[76px] max-w-content items-center justify-between px-5 sm:px-8">
        <a href="#top" className="shrink-0" aria-label="ctrl ROOM — home">
          <LogoInline size={19} />
        </a>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 md:block"
          aria-label="Primary"
        >
          <div className="relative flex items-center rounded-full border border-white/[0.07] bg-white/[0.025] p-1 backdrop-blur-xl">
            {/* The travelling indicator. Width is 1/3 of the rail minus the
                padding, so it lands exactly on each item at any font size. */}
            <span
              className="pointer-events-none absolute inset-y-1 rounded-full bg-white/[0.075] transition-[transform,opacity] duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                width: `calc((100% - 0.5rem) / ${LINKS.length})`,
                left: '0.25rem',
                transform: `translateX(${Math.max(active, 0) * 100}%)`,
                opacity: active < 0 ? 0 : 1,
              }}
              aria-hidden="true"
            />
            {LINKS.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                aria-current={active === i ? 'true' : undefined}
                className={`relative z-10 flex-1 whitespace-nowrap px-5 py-2 text-center text-[13px] font-medium tracking-tight transition-colors duration-300 ${
                  active === i ? 'text-white' : 'text-chalk-50 hover:text-white'
                }`}
              >
                {l.label}
              </a>
            ))}
          </div>
        </nav>

        <a
          href="#join"
          className="group inline-flex items-center gap-2 rounded-full border border-white/[0.10] bg-white/[0.03] px-4 py-2 text-[13px] font-medium tracking-tight text-white transition-colors duration-300 hover:border-teal/40 hover:bg-teal/[0.07]"
        >
          <Diamond size={6} className="text-teal" />
          Join
        </a>
      </div>
    </header>
  );
}
