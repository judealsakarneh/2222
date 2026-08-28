'use client';

import {IMAGES} from '@/lib/images';
import {SectionLabel} from '@/components/ui/SectionLabel';
import {RevealText} from '@/components/ui/RevealText';
import {Button} from '@/components/ui/Button';
import {Ground} from '@/components/ui/Ground';

/**
 * The feed, as an editorial strip rather than an embed. Frames of uneven
 * width in one row, scrolling horizontally, cropped so the strip reads as a
 * contact sheet. An Instagram grid here would undo the rest of the page.
 */
const STRIP = [
  {key: 'nightlife', w: 'w-[62vw] sm:w-[26rem]'},
  {key: 'food', w: 'w-[44vw] sm:w-[17rem]'},
  {key: 'restaurant', w: 'w-[62vw] sm:w-[24rem]'},
  {key: 'cafe', w: 'w-[44vw] sm:w-[19rem]'},
  {key: 'venue', w: 'w-[52vw] sm:w-[15rem]'},
  {key: 'session', w: 'w-[52vw] sm:w-[15rem]'},
] as const;

export function Social() {
  return (
    <Ground name="dark" id="community" className="scroll-mt-24 py-[calc(var(--gap-act)/2)]">
      <div className="edge">
        <div className="grid items-end gap-x-16 gap-y-8 border-b b-line pb-9 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SectionLabel n="08">Community</SectionLabel>
            <RevealText
              className="display mt-7 text-[clamp(2.1rem,4.4vw,3.4rem)] font-black leading-[0.98] tracking-[-0.03em] t-1"
              lines={['Real people.', 'Real recommendations.']}
            />
          </div>
          <div className="lg:col-span-3 lg:col-start-10 lg:justify-self-end">
            <Button href="#community" variant="outline">
              Follow CTRL Room
            </Button>
          </div>
        </div>
      </div>

      <div className="hide-scrollbar mt-12 flex gap-3 overflow-x-auto px-[var(--edge)] pb-2">
        {STRIP.map((s, i) => {
          const img = IMAGES[s.key];
          return (
            <figure key={`${s.key}-${i}`} className={`group relative aspect-[3/4] shrink-0 overflow-hidden rounded-[2px] ${s.w}`}>
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover grayscale-[0.35] transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] group-hover:grayscale-0"
              />
              <div className="pointer-events-none absolute inset-0" style={{boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12)'}} />
            </figure>
          );
        })}
      </div>

      <p className="mt-6 max-w-[52ch] font-mono text-[10.5px] tracking-[0.12em] t-3 edge">
        Feed imagery is placeholder
      </p>
    </Ground>
  );
}
