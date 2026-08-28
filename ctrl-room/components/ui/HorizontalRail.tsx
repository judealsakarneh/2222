'use client';

import {useCallback, useEffect, useRef, useState, type ReactNode} from 'react';

/**
 * A horizontal rail: native overflow scrolling with snap, plus arrows for
 * pointer users. Native scroll is load-bearing rather than a fallback. It
 * gives trackpad and touch momentum, keyboard access and screen-reader order
 * for free, and no JS runs while the user is dragging.
 *
 * The arrows page by one viewport width of the rail and disable themselves at
 * each end, so they never lie about what they will do.
 */
export function HorizontalRail({
  children,
  label,
  className = '',
}: {
  children: ReactNode;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({start: true, end: false});

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdge({start: el.scrollLeft <= 2, end: el.scrollLeft >= max - 2});
  }, []);

  useEffect(() => {
    measure();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  const page = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({left: dir * el.clientWidth * 0.86, behavior: 'smooth'});
  };

  return (
    <div className={className}>
      <div
        ref={ref}
        onScroll={measure}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="hide-scrollbar -mx-[var(--edge)] flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-[var(--edge)] pb-1 focus-visible:outline-none"
        // Snap positions ignore the container's padding unless scroll-padding
        // says otherwise, so without this the first card snaps flush to the
        // viewport edge and loses its margin.
        style={{scrollPaddingLeft: 'var(--edge)', scrollPaddingRight: 'var(--edge)'}}
      >
        {children}
      </div>

      <div className="mt-8 flex items-center gap-2">
        <RailArrow dir={-1} disabled={edge.start} onClick={() => page(-1)} />
        <RailArrow dir={1} disabled={edge.end} onClick={() => page(1)} />
      </div>
    </div>
  );
}

function RailArrow({
  dir,
  disabled,
  onClick,
}: {
  dir: 1 | -1;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 1 ? 'Scroll right' : 'Scroll left'}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors duration-200 hover:border-white/40 hover:bg-white/[0.05] disabled:pointer-events-none disabled:opacity-25"
    >
      <svg width="15" height="11" viewBox="0 0 14 10" fill="none" aria-hidden style={{transform: dir === -1 ? 'rotate(180deg)' : undefined}}>
        <path d="M0 5h12M8.5 1.5 12 5l-3.5 3.5" stroke="currentColor" strokeWidth="1.25" />
      </svg>
    </button>
  );
}
