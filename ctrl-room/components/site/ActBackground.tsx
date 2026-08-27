'use client';

import {useEffect} from 'react';

const INK: [number, number, number] = [11, 11, 11];
const PAPER: [number, number, number] = [242, 243, 243];

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
 * the header can inverct through CSS rather than React state — no frame of lag
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
      let c: [number, number, number] = acts[0].light ? PAPER : INK;
      for (let i = 1; i < acts.length; i++) {
        const t = smooth(clamp01((y - (acts[i].top - band / 2)) / band));
        if (t <= 0) break;
        const target = acts[i].light ? PAPER : INK;
        c = [lerp(c[0], target[0], t), lerp(c[1], target[1], t), lerp(c[2], target[2], t)];
      }
      layer.style.backgroundColor = `rgb(${c[0]|0} ${c[1]|0} ${c[2]|0})`;

      // Which act sits under the header right now.
      const hy = window.scrollY + 90;
      let light = acts[0].light;
      for (const a of acts) if (hy >= a.top) light = a.light;
      root.dataset.actNow = light ? 'light' : 'dark';
      // Keep the browser UI (iOS status bar, overscroll) in step.
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', light ? '#F2F3F3' : '#0B0B0B');
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
    // Fonts landing changes section heights, so the boundaries move.
    document.fonts?.ready.then(onResize).catch(() => {});

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      id="act-bg"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
      style={{backgroundColor: '#0B0B0B'}}
    />
  );
}
