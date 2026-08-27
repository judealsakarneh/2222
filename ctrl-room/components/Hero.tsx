import {CardStage} from './CardStage';
import {Diamond} from './Diamond';
import {IconArrow} from './Icons';
import {Reveal} from './Reveal';
import {Ring} from './Ring';
import {Stats} from './Stats';
import {Watermark} from './Watermark';

/**
 * Full-bleed, and the card is the subject.
 *
 * The composition is borrowed from product photography rather than from
 * landing-page convention: one lit object, one hard graphic behind it, and
 * everything else — the annotation, the readouts, the scroll rail — set small
 * in the mono face so nothing competes with the object for attention.
 *
 * The card overlaps the ring's edge on purpose. A subject placed neatly inside
 * a shape looks pasted on; a subject crossing the edge is what creates the
 * depth, and it is the only reason the disc reads as sitting behind rather than
 * next to the card.
 */
export function Hero() {
  return (
    <section
      id="top"
      className="grain relative overflow-hidden pb-[var(--gap-section)] pt-[118px] sm:pt-[140px] lg:pt-[168px]"
    >
      <Watermark showWord={false} />

      {/* Scroll rail, right edge. Desktop only — on a phone the gesture is
          obvious and the rail would just be furniture. */}
      <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 xl:block">
        <div className="flex flex-col items-center gap-4">
          <span
            className="label text-chalk-20"
            style={{writingMode: 'vertical-rl'}}
          >
            Scroll
          </span>
          <span className="h-16 w-px bg-gradient-to-b from-white/25 to-transparent" />
        </div>
      </div>

      <div className="relative mx-auto grid max-w-content grid-cols-1 items-center gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <Reveal>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.02] px-3.5 py-1.5">
              <Diamond size={6} className="text-teal" />
              <span className="label text-chalk-50">Membership</span>
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            {/* The annotation is positioned, not laid out beside the heading.
                In a flex row it steals width from the h1 and the headline wraps
                a line early — which is exactly what it must never do. */}
            <div className="relative mt-8">
              <h1 className="text-[clamp(2.9rem,7.2vw,5rem)] font-extrabold leading-[0.94] tracking-display text-white">
                Your place.
                <br />
                Your <span className="hot">rewards</span>.
              </h1>
              <span className="label absolute right-0 top-2 hidden leading-[1.9] text-chalk-35 xl:block">
                No app.
                <br />
                No punch card.
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-8 max-w-[30rem] text-[16.5px] leading-[1.72] text-chalk-50">
              One card for everywhere you already go. Tap to collect, tap to
              redeem — nothing to download, nothing to lose in a wallet.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <a
                id="join"
                href="#how"
                className="group inline-flex items-center gap-2.5 rounded-full bg-teal px-7 py-4 text-[15px] font-semibold tracking-tight text-ink-950 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_44px_-12px_rgba(45,212,191,0.7)]"
              >
                Tap to join
                <IconArrow
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </a>

              {/* Circle-arrow secondary. The ring expands into the accent on
                  hover, which gives the quiet action somewhere to go. */}
              <a href="#card" className="group inline-flex items-center gap-3.5">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.14] text-white transition-colors duration-300 group-hover:border-teal group-hover:text-teal">
                  <IconArrow
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </span>
                <span className="text-[14.5px] font-medium tracking-tight text-chalk-50 transition-colors duration-300 group-hover:text-white">
                  See the card
                </span>
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.18} y={22} className="lg:col-span-6">
          <div className="relative mx-auto w-full max-w-[430px] sm:max-w-[510px] lg:ml-auto lg:mr-0 lg:max-w-[580px]">
            <Ring className="left-1/2 top-1/2 aspect-square w-[92%] -translate-x-1/2 -translate-y-[54%]" />
            <div className="relative">
              <CardStage restY={-13} restX={5} restZ={-3} float />
            </div>
          </div>
        </Reveal>
      </div>

      <div className="relative mx-auto mt-16 max-w-content px-5 sm:mt-20 sm:px-8">
        <Stats />
      </div>
    </section>
  );
}
