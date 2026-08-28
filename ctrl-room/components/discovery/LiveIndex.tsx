'use client';

import {useState} from 'react';
import {AREAS, INDEX_ROWS} from '@/lib/content';
import {SectionLabel} from '@/components/ui/SectionLabel';
import {Ground} from '@/components/ui/Ground';
import {RevealText, Reveal} from '@/components/ui/RevealText';

/**
 * Discovery as an index, not a map. Rows of categories, an area filter that
 * reads as a set of tabs rather than a control panel, and a number column
 * that stays empty until there is real data behind it.
 *
 * The composition is an asymmetric split with a sticky left column: the
 * heading holds while the index scrolls past it.
 */
export function LiveIndex() {
  const [area, setArea] = useState<(typeof AREAS)[number] | 'All'>('All');
  const [hover, setHover] = useState<string | null>(null);

  return (
    <Ground name="dark" id="discover" className="scroll-mt-24 py-[calc(var(--gap-act)/2)]">
      <div className="edge">
        <div className="grid gap-x-16 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[124px]">
              <SectionLabel n="02">Live discovery</SectionLabel>
              <RevealText
                className="display mt-7 text-[clamp(2.1rem,4.4vw,3.4rem)] font-black leading-[0.98] tracking-[-0.03em] t-1"
                lines={['What is happening,', 'right now.']}
              />
              <p className="mt-6 max-w-[34ch] text-[15px] leading-[1.62] t-2">
                Not a directory. An index of the city kept by the people who are
                already out in it.
              </p>

              <div className="mt-9 flex max-w-[26rem] flex-wrap gap-2" role="group" aria-label="Filter by area">
                {(['All', ...AREAS] as const).map((a) => {
                  const on = area === a;
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setArea(a)}
                      aria-pressed={on}
                      className="rounded-[2px] border px-3.5 py-2 text-[11.5px] tracking-[0.04em] transition-colors duration-200"
                      style={{
                        borderColor: on ? 'transparent' : 'var(--g-chip)',
                        background: on ? 'var(--g-accent)' : 'transparent',
                        color: on ? 'var(--g-bg)' : 'var(--g-fg-3)',
                      }}
                    >
                      {a}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <ul>
              {INDEX_ROWS.map((row, i) => (
                <Reveal key={row.label} delay={i * 0.05}>
                  <li
                    onMouseEnter={() => setHover(row.label)}
                    onMouseLeave={() => setHover(null)}
                    className="group border-t b-line last:border-b"
                  >
                    <a
                      href="#events"
                      className="grid grid-cols-[auto_1fr_auto] items-baseline gap-6 py-7 transition-colors duration-300 md:py-9"
                      style={{color: hover && hover !== row.label ? 'var(--g-fg-3)' : 'var(--g-fg)'}}
                    >
                      <span className="font-mono text-[10px] tracking-[0.14em] t-3">{row.n}</span>
                      <span>
                        <span
                          className="display block text-[clamp(1.3rem,2.6vw,2rem)] font-bold leading-none tracking-[-0.02em] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2"
                          style={{fontStretch: '88%'}}
                        >
                          {row.label}
                        </span>
                        <span className="mt-2.5 block text-[13px] leading-[1.5] t-3">{row.note}</span>
                      </span>
                      <span className="font-mono text-[11px] t-3">{row.count}</span>
                    </a>
                  </li>
                </Reveal>
              ))}
            </ul>
            <p className="mt-6 max-w-[52ch] font-mono text-[10.5px] tracking-[0.12em] t-3">
              Counts pending live data
            </p>
          </div>
        </div>
      </div>
    </Ground>
  );
}
