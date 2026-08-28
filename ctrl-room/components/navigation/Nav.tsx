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
  const [ground, setGround] = useState<string>('dark');

  /**
   * The bar is fixed and the page moves through three environments under it,
   * so it has to read the ground it is currently sitting on rather than
   * assume one. It samples the element under its own baseline and takes that
   * element's data-ground, which means the seams get it right mid-wipe too:
   * the seam declares its destination ground, so the bar changes over as the
   * new colour arrives rather than after it.
   *
   * Sampling is coalesced into one rAF per scroll burst, so a fast flick does
   * one hit test per frame instead of one per event.
   */
  useEffect(() => {
    let queued = false;
    const sample = () => {
      queued = false;
      setSolid(window.scrollY > 24);
      const bar = document.getElementById('nav-bar');
      // Measure the baseline rather than hard-coding it: the bar is shorter on
      // a phone, and a sample line below the real one would read the section
      // after the one the bar is actually sitting on.
      const line = (bar?.getBoundingClientRect().bottom ?? 74) + 10;
      // elementsFromPoint, not elementFromPoint: the bar itself is over that
      // pixel and carries a data-ground of its own, so a single hit test would
      // read back the value it just wrote and never change again.
      const stack = document.elementsFromPoint(Math.round(window.innerWidth / 2), line);
      const under = stack.find((el) => !bar?.contains(el));
      const g = under?.closest('[data-ground]')?.getAttribute('data-ground');
      if (g) setGround(g);
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(sample);
    };
    sample();
    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
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
        id="nav-bar"
        data-ground={ground}
        className="fixed inset-x-0 top-0 z-50 transition-colors duration-500"
        style={{
          backgroundColor: solid
            ? 'color-mix(in srgb, var(--g-bg) 84%, transparent)'
            : 'transparent',
          backdropFilter: solid ? 'blur(18px)' : 'none',
          borderBottom: `1px solid ${solid ? 'var(--g-line)' : 'transparent'}`,
        }}
      >
        <div className="flex h-[74px] items-center justify-between edge">
          <a href="#top" className="flex items-baseline gap-2" aria-label="CTRL Room, home">
            <span className="display t-1 text-[20px] font-black leading-none tracking-[-0.03em]">CTRL</span>
            <span className="text-[10px] font-medium uppercase tracking-[0.28em] t-a">Room</span>
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
            {NAV.map((n) => {
              const on = active && n.href === `#${active}`;
              return (
                <a
                  key={n.label}
                  href={n.href}
                  className="relative py-1 text-[12px] font-medium uppercase tracking-[0.12em] transition-colors duration-200"
                  style={{color: on ? 'var(--g-fg)' : 'var(--g-fg-3)'}}
                >
                  {n.label}
                  <span
                    className="absolute -bottom-0.5 left-0 h-px bg-a transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
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
              className="flex h-11 w-11 items-center justify-center border b-line-2 lg:hidden"
            >
              <span className="relative block h-[9px] w-[18px]">
                <span
                  className="absolute left-0 block h-px w-full bg-current transition-all duration-300"
                  style={{top: open ? 4 : 0, transform: open ? 'rotate(45deg)' : 'none'}}
                />
                <span
                  className="absolute left-0 block h-px w-full bg-current transition-all duration-300"
                  style={{top: open ? 4 : 8, transform: open ? 'rotate(-45deg)' : 'none'}}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer. Inert when closed in every sense that matters: no
          pointer events, nothing focusable, hidden from assistive technology,
          and visibility: hidden so it is not merely a transparent sheet lying
          over the hero. visibility is transitioned with a delay equal to the
          fade so the panel is still painted while it fades out and only then
          leaves the hit test. */}
      <div
        className={`fixed inset-0 z-40 bg-black lg:hidden ${
          open ? 'pointer-events-auto visible opacity-100' : 'pointer-events-none invisible opacity-0'
        }`}
        style={{
          transition: open
            ? 'opacity 300ms ease, visibility 0s'
            : 'opacity 300ms ease, visibility 0s linear 300ms',
        }}
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
              className="display border-b border-white/[0.07] py-5 text-[clamp(2rem,9vw,3rem)] font-black uppercase leading-none tracking-[-0.03em] t-1 transition-transform duration-500"
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
