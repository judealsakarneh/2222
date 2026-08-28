'use client';

import {useEffect} from 'react';

/**
 * Two DARK grounds, not a dark and a light one.
 *
 * The page used to cross from near-black to paper, and that is where the bug
 * lived: a section's `data-act` flips its text tokens the instant its boundary
 * crosses, while this layer takes most of a viewport to follow. On desktop the
 * gap fell in empty transition runway. On a phone, where sections are tall and
 * text-dense, it fell in the middle of a paragraph and rendered near-black type
 * on a near-black ground.
 *
 * The reference design system is dark throughout, so the light act is gone. The
 * crossfade survives as a subtle elevation drift, which reads as depth and
 * cannot desynchronise from anything, because no text colour depends on it.
 */
const BASE: [number, number, number] = [18, 18, 18];
const RAISED: [number, number, number] = [23, 23, 24];

/** Blend band, in viewport heights. The crossfade happens across this much
 *  scroll either side of an act boundary. Wide enough to feel like a dissolve,
 *  narrow enough that neither act is ever washed out for long. */
const BAND = 0.72;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * One fixed layer behind the whole document, whose colour is a function of
 * scroll position.
 *
 * WHY NOT just give each section its own background: because a section with a
 * background paints its full height and then stops, so the page changes colour
 * on a hard edge as that boundary crosses the viewport. Reading the boundaries
 * and interpolating across a band means the ground changes temperature while
 * you are still inside a section, and by the time the next act's content
 * arrives the page is already there. That is the difference between a site that
 * has light sections and a site that transitions.
 *
 * The same pass publishes which act is under the header on the root element, so
 * the header can inverct through CSS rather than React state, no frame of lag
 * between the two.
 */
export function ActBackground() {
  useEffect(() => {
    const root = document.documentElement;
    const layer = document.getElementById('act-bg');
    if (!layer) return;

    let acts: {top: number; light: boolean}[] = [];
    let raf = 0;

    const measure = () => {
      acts = Array.from(document.querySelectorAll<HTMLElement>('[data-act]')).map(
        (el) => ({
          top: el.getBoundingClientRect().top + window.scrollY,
          light: el.dataset.act === 'light',
        })
      );
    };

    const paint = () => {
      raf = 0;
      if (!acts.length) return;
      const vh = window.innerHeight;
      // Clamped: on an unusually tall viewport an unclamped band spans several
      // acts at once and every one of them bleeds into the result, leaving the
      // page a flat mid-grey with neither act's text legible.
      const band = Math.min(vh, 1000) * BAND;
      const y = window.scrollY + vh * 0.5;

      // Walk the boundaries in order, easing toward each act as its boundary
      // passes. Because they are ordered, the accumulated result is the colour
      // for this scroll position with every crossfade already applied.
      let c: [number, number, number] = acts[0].light ? RAISED : BASE;
      for (let i = 1; i < acts.length; i++) {
        const t = smooth(clamp01((y - (acts[i].top - band / 2)) / band));
        if (t <= 0) break;
        const target = acts[i].light ? RAISED : BASE;
        c = [lerp(c[0], target[0], t), lerp(c[1], target[1], t), lerp(c[2], target[2], t)];
      }
      layer.style.backgroundColor = `rgb(${c[0]|0} ${c[1]|0} ${c[2]|0})`;

      // Which act sits under the header right now.
      // The page is one temperature now, so the header never inverts and the
      // browser UI stays put.
      root.dataset.actNow = 'dark';
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    paint();
    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', onResize);

    /**
     * Anything that changes the document's height moves every act boundary:
     * fonts landing, an image decoding, a reveal expanding a section. Listening
     * for `resize` and `fonts.ready` only catches two of those, and when one is
     * missed the layer keeps a colour computed from stale offsets and the page
     * sits at the wrong temperature until the user happens to scroll.
     *
     * Observing the document element catches all of them, which is why this is
     * a ResizeObserver and not another one-shot listener.
     */
    const ro = new ResizeObserver(onResize);
    ro.observe(document.documentElement);
    document.fonts?.ready.then(onResize).catch(() => {});

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      id="act-bg"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
      style={{backgroundColor: '#121212'}}
    >
      {/* Grain sits on the ground, once, for the whole document. Applied
          per-section it lifts that section by ~3% and leaves a visible seam at
          its edge. */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.032,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
