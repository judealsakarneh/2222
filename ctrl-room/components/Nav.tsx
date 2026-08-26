'use client';

import {useEffect, useState} from 'react';
import {LogoInline} from './Logo';
import {Diamond} from './Diamond';

const LINKS = [
  {label: 'How it works', href: '#how'},
  {label: 'The card', href: '#card'},
  {label: 'Rewards', href: '#rewards'},
];

/**
 * The bar starts fully transparent over the hero and only acquires a surface
 * once the page has scrolled — so the first thing anyone sees is the card, not
 * a chrome bar. The blur and the hairline arrive together; either one on its
 * own reads as an accident.
 */
export function Nav() {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        stuck
          ? 'border-b border-white/[0.07] bg-ink-950/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-content items-center justify-between px-6 sm:px-8">
        <a href="#top" className="shrink-0" aria-label="ctrl ROOM — home">
          <LogoInline size={19} />
        </a>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="link-underline text-[13.5px] font-medium tracking-tight text-chalk-50 transition-colors duration-300 hover:text-white"
            >
              {l.label}
            </a>
          ))}
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
