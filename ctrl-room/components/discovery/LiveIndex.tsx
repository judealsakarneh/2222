'use client';

import {useState} from 'react';
import {AREAS, INDEX_ROWS} from '@/lib/content';
import {SectionLabel} from '@/components/ui/SectionLabel';
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
    <section id="discover" className="scroll-mt-24 py-[calc(var(--gap-act)/2)]">
      <div className="edge">
        <div className="grid gap-x-16 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[124px]">
              <SectionLabel n="02">Live discovery</SectionLabel>
              <RevealText
                className="display mt-7 text-[clamp(2.1rem,4.4vw,3.4rem)] font-black leading-[0.98] tracking-[-0.03em] text-white"
                lines={['What is happening,', 'right now.']}
              />
              <p className="mt-6 max-w-[34ch] text-[15px] leading-[1.62] text-grey-2">
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
                        borderColor: on ? 'transparent' : 'rgba(255,255,255,0.14)',
                        background: on ? '#006563' : 'transparent',
                        color: on ? '#fff' : 'rgba(255,255,255,0.6)',
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
                    className="group border-t border-white/[0.09] last:border-b"
                  >
                    <a
                      href="#events"
                      className="grid grid-cols-[auto_1fr_auto] items-baseline gap-6 py-7 transition-colors duration-300 md:py-9"
                      style={{color: hover && hover !== row.label ? 'rgba(255,255,255,0.4)' : '#fff'}}
                    >
                      <span className="font-mono text-[10px] tracking-[0.14em] text-white/50">{row.n}</span>
                      <span>
                        <span
                          className="display block text-[clamp(1.3rem,2.6vw,2rem)] font-bold leading-none tracking-[-0.02em] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2"
                          style={{fontStretch: '88%'}}
                        >
                          {row.label}
                        </span>
                        <span className="mt-2.5 block text-[13px] leading-[1.5] text-white/55">{row.note}</span>
                      </span>
                      <span className="font-mono text-[11px] text-white/50">{row.count}</span>
                    </a>
                  </li>
                </Reveal>
              ))}
            </ul>
            <p className="mt-6 max-w-[52ch] font-mono text-[10.5px] tracking-[0.12em] text-white/50">
              Counts pending live data
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
