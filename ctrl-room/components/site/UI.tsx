'use client';

import {motion} from 'framer-motion';
import type {ReactNode} from 'react';

/**
 * Shared primitives. Everything reads its colour from the act variables, so a
 * block dropped into a light section inverts without a second component.
 *
 * ON MOTION: there is one reveal here and it is used on section openings only.
 * The craft floor is explicit that a page gets one authored moment, not the
 * same entrance on every element. This site spends that moment on the hero
 * card and the act crossfade; everything else either arrives quietly or does
 * not animate at all.
 *
 * There is deliberately no `Eyebrow` component. A kicker above a heading is a
 * ban, not a default, and no brief earns it back. The heading carries its own
 * weight.
 */
export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{opacity: 0, y: 8}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '0px 0px -14% 0px'}}
      transition={{duration: 0.5, delay, ease: [0.22, 1, 0.36, 1]}}
    >
      {children}
    </motion.div>
  );
}

/** Display heading. Archivo, one size ramp, capped at the craft floor's 6rem. */
export function Title({
  children,
  className = '',
  as: Tag = 'h2',
}: {
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
}) {
  return (
    <Tag className={`display ${className}`} style={{color: 'var(--fg)'}}>
      {children}
    </Tag>
  );
}

/** Body copy. Measure held to the craft floor's 65-75ch. */
export function Lede({children, className = ''}: {children: ReactNode; className?: string}) {
  return (
    <p
      className={`max-w-measure text-[clamp(1rem,1.4vw,1.125rem)] leading-[1.65] ${className}`}
      style={{color: 'var(--fg-2)'}}
    >
      {children}
    </p>
  );
}

/**
 * A figure and what it measures. Geist Mono on the number because it is data;
 * Geist Sans on the label because it is not.
 */
export function Stat({
  value,
  label,
  source,
}: {
  value: string;
  label: string;
  source?: string;
}) {
  return (
    <div className="border-t pt-6" style={{borderColor: 'var(--line)'}}>
      <div
        className="measure text-[clamp(1.75rem,3.6vw,2.5rem)] font-medium leading-none tracking-[-0.02em]"
        style={{color: 'var(--fg)'}}
      >
        {value}
      </div>
      <div className="mt-4 max-w-[28ch] text-[14px] leading-[1.55]" style={{color: 'var(--fg-2)'}}>
        {label}
      </div>
      {source ? (
        <div className="measure mt-3 text-[11px]" style={{color: 'var(--fg-3)'}}>
          {source}
        </div>
      ) : null}
    </div>
  );
}

/**
 * The workhorse layout: a ledger of rows with hairline separators. It replaces
 * the row of three feature cards, which is the layout every generated page
 * reaches for, and it suits a media brand. A masthead lists its sections; it
 * does not box them.
 *
 * `numbered` is off by default and should only be turned on where the order
 * genuinely carries information the reader needs. Numbering an unordered set is
 * decoration pretending to be structure.
 */
export function Rows({
  items,
  numbered = false,
}: {
  items: {n?: string; title: string; body: string; meta?: string}[];
  numbered?: boolean;
}) {
  return (
    <ul>
      {items.map((it, i) => (
        <li key={it.title}>
          <div
            className="group grid grid-cols-1 gap-x-8 gap-y-2 border-t py-8 transition-colors duration-[160ms] md:grid-cols-12 md:py-10"
            style={{borderColor: 'var(--line)'}}
          >
            {numbered ? (
              <div className="md:col-span-1">
                <span className="measure text-[11px]" style={{color: 'var(--fg-3)'}}>
                  {it.n ?? String(i + 1).padStart(2, '0')}
                </span>
              </div>
            ) : null}
            <h3
              className={`text-[clamp(1.25rem,2.4vw,1.65rem)] font-semibold leading-[1.2] tracking-headline ${
                numbered ? 'md:col-span-4' : 'md:col-span-5'
              }`}
              style={{color: 'var(--fg)'}}
            >
              {it.title}
            </h3>
            <p
              className={`max-w-measure text-[15px] leading-[1.65] ${
                numbered ? 'md:col-span-6' : 'md:col-span-6'
              }`}
              style={{color: 'var(--fg-2)'}}
            >
              {it.body}
            </p>
            {it.meta ? (
              <span
                className="measure text-[11px] md:col-span-1 md:text-right"
                style={{color: 'var(--fg-3)'}}
              >
                {it.meta}
              </span>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

/**
 * Solid accent action. Hover is a 2px lift over 160ms, inside Emil's
 * 100-160ms button-feedback band. No arrow glyph welded to the label.
 */
export function Action({
  href,
  children,
  tone = 'solid',
  className = '',
}: {
  href: string;
  children: ReactNode;
  tone?: 'solid' | 'ghost';
  className?: string;
}) {
  const solid = tone === 'solid';
  return (
    <a
      href={href}
      className={`inline-block px-6 py-4 text-[13.5px] font-medium tracking-[-0.01em] no-underline transition-[transform,background-color,border-color,color] duration-[160ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[2px] ${className}`}
      style={
        solid
          ? {background: 'var(--accent)', color: 'var(--on-accent)'}
          : {border: '1px solid var(--line-strong)', color: 'var(--fg)'}
      }
    >
      {children}
    </a>
  );
}
