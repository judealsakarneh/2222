'use client';

import {useEffect, useState} from 'react';
import {NAV} from '@/lib/content';
import {Button} from '@/components/ui/Button';

/**
 * The bar stays. It is transparent over the hero so the composition is not
 * cropped, and resolves into a surface once the page is under it. The active
 * item is derived from which section currently owns the top of the viewport,
 * via IntersectionObserver rather than a scroll handler.
 */
export function Nav() {
  const [solid, setSolid] = useState(false);
  const [active, setActive] = useState<string>('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = Array.from(new Set(NAV.map((n) => n.href.slice(1))));
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(hit.target.id);
      },
      {rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5]},
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-colors duration-500"
        style={{
          backgroundColor: solid ? 'rgba(11,11,11,0.82)' : 'transparent',
          backdropFilter: solid ? 'blur(18px)' : 'none',
          borderBottom: `1px solid ${solid ? 'rgba(255,255,255,0.08)' : 'transparent'}`,
        }}
      >
        <div className="flex h-[74px] items-center justify-between edge">
          <a href="#top" className="flex items-baseline gap-2" aria-label="CTRL Room, home">
            <span className="display text-[20px] font-black leading-none tracking-[-0.03em] text-white">CTRL</span>
            <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-teal-lit">Room</span>
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
            {NAV.map((n) => {
              const on = active && n.href === `#${active}`;
              return (
                <a
                  key={n.label}
                  href={n.href}
                  className="relative py-1 text-[12px] font-medium uppercase tracking-[0.12em] transition-colors duration-200"
                  style={{color: on ? '#fff' : 'rgba(255,255,255,0.62)'}}
                >
                  {n.label}
                  <span
                    className="absolute -bottom-0.5 left-0 h-px bg-teal-lit transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{width: on ? '100%' : '0%'}}
                    aria-hidden
                  />
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Button href="#elite" className="hidden sm:inline-flex">
              Join CTRL
            </Button>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="flex h-11 w-11 items-center justify-center border border-white/15 lg:hidden"
            >
              <span className="relative block h-[9px] w-[18px]">
                <span
                  className="absolute left-0 block h-px w-full bg-white transition-all duration-300"
                  style={{top: open ? 4 : 0, transform: open ? 'rotate(45deg)' : 'none'}}
                />
                <span
                  className="absolute left-0 block h-px w-full bg-white transition-all duration-300"
                  style={{top: open ? 4 : 8, transform: open ? 'rotate(-45deg)' : 'none'}}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer. Opaque and inert when closed, so nothing behind it is
          intercepted and nothing inside it is reachable by keyboard. */}
      <div
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 lg:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <nav
          aria-label="Mobile"
          aria-hidden={!open}
          className="flex h-full flex-col justify-center gap-2 edge"
        >
          {NAV.map((n, i) => (
            <a
              key={n.label}
              href={n.href}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              className="display border-b border-white/[0.07] py-5 text-[clamp(2rem,9vw,3rem)] font-black uppercase leading-none tracking-[-0.03em] text-white transition-transform duration-500"
              style={{
                fontStretch: '80%',
                transform: open ? 'none' : 'translateY(12px)',
                transitionDelay: `${open ? i * 45 : 0}ms`,
              }}
            >
              {n.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
