'use client';

import {PICKS, IMAGES, PILLARS} from '@/lib/content';
import {SectionLabel} from '@/components/ui/SectionLabel';
import {Ground} from '@/components/ui/Ground';
import {RevealText, Reveal} from '@/components/ui/RevealText';

/**
 * CTRL Picks. A bento rather than a row of equal cards: the lead pick takes
 * two columns and a wider crop, the rest sit beside it. On hover the image
 * scales inside a fixed frame and the caption line draws across, so the
 * motion is contained instead of nudging the layout.
 */
export function PlaceCard({
  pick,
  lead = false,
  index,
}: {
  pick: (typeof PICKS)[number];
  lead?: boolean;
  index: number;
}) {
  const img = IMAGES[pick.key];
  return (
    <Reveal delay={index * 0.06} className={lead ? 'lg:col-span-2 lg:row-span-2' : ''}>
      <a href="#events" className="group block h-full">
        <div
          className={`relative overflow-hidden rounded-[2px] ${
            lead ? 'aspect-[16/11] lg:aspect-[4/3.25]' : 'aspect-[4/3]'
          }`}
        >
          <img
            src={img.src}
            alt={img.alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          />
          <div className="pointer-events-none absolute inset-0" style={{boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12)'}} />
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{background: 'linear-gradient(to top, rgba(11,11,11,0.7), transparent 55%)'}}
          />
          <span className="absolute left-4 top-4 rounded-[2px] bg-black/70 px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] text-white/90 backdrop-blur-sm">
            {pick.area}
          </span>
        </div>

        <div className="mt-5 flex items-baseline justify-between gap-4 border-t b-line pt-4">
          <span>
            <span
              className={`display block font-bold leading-tight tracking-[-0.02em] t-1 ${
                lead ? 'text-[clamp(1.2rem,2vw,1.6rem)]' : 'text-[15.5px]'
              }`}
            >
              {pick.name}
            </span>
            <span className="mt-1.5 block text-[12.5px] t-3">{pick.kind}</span>
          </span>
          <span className="relative h-px w-8 shrink-0 self-center overflow-hidden bg-white/20">
            <span className="absolute inset-0 -translate-x-full bg-teal-lit transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0" />
          </span>
        </div>
      </a>
    </Reveal>
  );
}

export function Picks() {
  return (
    <Ground name="paper" className="py-[calc(var(--gap-act)/2)]">
      <div className="edge">
        <div className="grid items-end gap-x-16 gap-y-8 border-b b-line pb-9 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SectionLabel n="03">CTRL Picks</SectionLabel>
            <RevealText
              className="display mt-7 text-[clamp(2.1rem,4.4vw,3.4rem)] font-black leading-[0.98] tracking-[-0.03em] t-1"
              lines={['The city is yours.', 'We just know it better.']}
            />
          </div>
          <p className="text-[14.5px] leading-[1.6] t-2 lg:col-span-3 lg:col-start-10">
            Rooms, tables and corners worth the drive. Kept current, not
            crowdsourced.
          </p>
        </div>

        <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {PICKS.map((p, i) => (
            <PlaceCard key={p.name} pick={p} lead={i === 0} index={i} />
          ))}
        </div>

        {/* The five pillars, set as an index line rather than another card grid. */}
        <div className="mt-[var(--gap-block)] grid gap-x-16 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <SectionLabel>Built on five</SectionLabel>
          </div>
          <ul className="lg:col-span-9">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.04}>
                <li className="grid grid-cols-[auto_1fr] items-baseline gap-6 border-t b-line py-5 last:border-b md:grid-cols-[auto_minmax(0,14rem)_1fr]">
                  <span className="font-mono text-[10px] tracking-[0.14em] t-3">{p.n}</span>
                  <span className="text-[15px] font-semibold tracking-[-0.01em] t-1">{p.title}</span>
                  <span className="col-span-2 text-[13.5px] leading-[1.55] t-3 md:col-span-1">{p.body}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </Ground>
  );
}
