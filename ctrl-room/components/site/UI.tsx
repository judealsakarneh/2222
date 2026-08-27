'use client';

import {motion} from 'framer-motion';
import type {ReactNode} from 'react';

/**
 * Shared primitives. Everything reads its colour from the act variables, so a
 * block dropped into a light section inverts without a second component.
 *
 * On motion: there is deliberately one reveal here and it is used on headings
 * and section openings only. The same fade-in-up applied to every element on a
 * page is a generated-page signature — motion should mark a few moments, and on
 * this site the moments that matter are the card and the act transitions.
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
      initial={{opacity: 0, y: 12}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '0px 0px -12% 0px'}}
      transition={{duration: 0.65, delay, ease: [0.22, 1, 0.36, 1]}}
    >
      {children}
    </motion.div>
  );
}

/** A section marker: index, then label, sitting on a rule. */
export function Eyebrow({
  index,
  children,
}: {
  index?: string;
  children: ReactNode;
}) {
  return (
    <div
      className="flex items-baseline gap-4 border-t pt-4"
      style={{borderColor: 'var(--line)'}}
    >
      {index ? (
        <span className="label nums" style={{color: 'var(--fg-3)'}}>
          {index}
        </span>
      ) : null}
      <span className="label" style={{color: 'var(--accent)'}}>
        {children}
      </span>
    </div>
  );
}

/** Display heading. One size ramp across the whole site. */
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
    <Tag
      className={`text-balance font-extrabold leading-[1.02] tracking-display wide ${className}`}
      style={{color: 'var(--fg)'}}
    >
      {children}
    </Tag>
  );
}

export function Lede({children, className = ''}: {children: ReactNode; className?: string}) {
  return (
    <p
      className={`max-w-[52ch] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.7] ${className}`}
      style={{color: 'var(--fg-2)'}}
    >
      {children}
    </p>
  );
}

/** A figure with its source, as the deck presents them. */
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
    <div className="border-t pt-5" style={{borderColor: 'var(--line)'}}>
      <div
        className="nums font-extrabold leading-none tracking-display wide text-[clamp(2rem,4.6vw,3.1rem)]"
        style={{color: 'var(--fg)'}}
      >
        {value}
      </div>
      <div className="mt-3.5 max-w-[26ch] text-[14px] leading-[1.55]" style={{color: 'var(--fg-2)'}}>
        {label}
      </div>
      {source ? (
        <div className="label mt-3" style={{color: 'var(--fg-3)'}}>
          {source}
        </div>
      ) : null}
    </div>
  );
}

/**
 * The workhorse layout of this site: a numbered editorial list with hairline
 * separators. It replaces the row of three feature cards, which is the layout
 * every generated page reaches for — and it suits a media brand, because a
 * masthead lists its sections, it does not put them in boxes.
 */
export function Rows({
  items,
}: {
  items: {n?: string; title: string; body: string; meta?: string}[];
}) {
  return (
    <ul>
      {items.map((it, i) => (
        <li key={it.title}>
          <Reveal delay={Math.min(i * 0.05, 0.2)}>
            <div
              className="grid grid-cols-1 gap-x-8 gap-y-3 border-t py-8 md:grid-cols-12 md:py-10"
              style={{borderColor: 'var(--line)'}}
            >
              <div className="md:col-span-1">
                <span className="label nums" style={{color: 'var(--fg-3)'}}>
                  {it.n ?? String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3
                className="text-[clamp(1.35rem,2.6vw,1.85rem)] font-bold leading-[1.12] tracking-headline md:col-span-4"
                style={{color: 'var(--fg)'}}
              >
                {it.title}
              </h3>
              <p
                className="max-w-[54ch] text-[15.5px] leading-[1.68] md:col-span-6"
                style={{color: 'var(--fg-2)'}}
              >
                {it.body}
              </p>
              {it.meta ? (
                <span className="label md:col-span-1 md:text-right" style={{color: 'var(--fg-3)'}}>
                  {it.meta}
                </span>
              ) : null}
            </div>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

/** Solid accent action. No arrow glyph welded to it. */
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
      className={`label inline-block px-6 py-4 transition-[background-color,color,border-color] duration-300 ${className}`}
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
