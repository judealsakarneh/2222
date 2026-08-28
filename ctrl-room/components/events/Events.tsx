'use client';

import {EVENTS, IMAGES, type CtrlEvent} from '@/lib/content';
import {SectionLabel} from '@/components/ui/SectionLabel';
import {RevealText} from '@/components/ui/RevealText';
import {HorizontalRail} from '@/components/ui/HorizontalRail';
import {Button} from '@/components/ui/Button';

/**
 * An event is a poster, not a calendar row. The date is set large across the
 * top of the image, the format is the only label, and the description stays
 * hidden until hover, where it slides up from under the title. Everything
 * that moves is a transform on a layer that already exists, so opening a card
 * never reflows the rail.
 */
export function EventCard({event, index}: {event: CtrlEvent; index: number}) {
  const img = IMAGES[event.key];
  return (
    <article
      className="group relative w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-[27rem]"
      style={{scrollSnapAlign: 'start'}}
    >
      <a href="#events" className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-[2px]">
          <img
            src={img.src}
            alt={img.alt}
            loading={index < 2 ? 'eager' : 'lazy'}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(11,11,11,0.94) 0%, rgba(11,11,11,0.55) 38%, rgba(11,11,11,0.08) 72%)',
            }}
          />
          <div className="pointer-events-none absolute inset-0" style={{boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)'}} />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5">
            <span className="rounded-[2px] border border-white/20 bg-black/40 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-white backdrop-blur-sm">
              {event.format}
            </span>
            <span className="text-right">
              <span className="display block text-[26px] font-black leading-none tracking-[-0.03em] text-white">
                {event.day}
              </span>
              <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.16em] text-white/60">
                {event.month}
              </span>
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5">
            <h3
              className="display text-[clamp(1.25rem,2vw,1.6rem)] font-bold leading-[1.05] tracking-[-0.02em] text-white"
              style={{fontStretch: '90%'}}
            >
              {event.title}
            </h3>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10.5px] tracking-[0.1em] text-white/55">
              <span>{event.time}</span>
              <span className="h-[3px] w-[3px] rounded-full bg-white/30" aria-hidden />
              <span>{event.place}</span>
            </div>

            {/* Held at zero height until hover, so the card's geometry never
                changes and the rail never jumps. */}
            <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]">
              <div className="overflow-hidden">
                <p className="pt-3 text-[13px] leading-[1.55] text-white/70">{event.body}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-teal-lit">
                  Details
                  <svg width="12" height="9" viewBox="0 0 14 10" fill="none" aria-hidden>
                    <path d="M0 5h12M8.5 1.5 12 5l-3.5 3.5" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </a>
    </article>
  );
}

export function Events() {
  return (
    <section id="events" className="scroll-mt-24 border-y border-white/[0.09] bg-ink-950 py-[calc(var(--gap-act)/2)]">
      <div className="edge">
        <div className="grid items-end gap-x-16 gap-y-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SectionLabel n="04">What&rsquo;s on</SectionLabel>
            <RevealText
              className="display mt-7 text-[clamp(2.1rem,4.4vw,3.4rem)] font-black leading-[0.98] tracking-[-0.03em] text-white"
              lines={['Nights worth', 'leaving for.']}
            />
          </div>
          <div className="lg:col-span-3 lg:col-start-10 lg:justify-self-end">
            <Button href="#events" variant="outline">
              Full calendar
            </Button>
          </div>
        </div>

        <HorizontalRail label="Upcoming events" className="mt-14">
          {EVENTS.map((e, i) => (
            <EventCard key={e.format} event={e} index={i} />
          ))}
        </HorizontalRail>

        <p className="mt-4 max-w-[52ch] font-mono text-[10.5px] tracking-[0.12em] text-white/50">
          Listings are placeholder pending real programming
        </p>
      </div>
    </section>
  );
}
