import {CardStage} from './CardStage';
import {Diamond} from './Diamond';
import {IconArrow, IconEarn, IconEnjoy, IconReward} from './Icons';
import {Reveal} from './Reveal';
import {Watermark} from './Watermark';

const PILLARS = [
  {label: 'Earn Points', Icon: IconEarn},
  {label: 'Get Rewards', Icon: IconReward},
  {label: 'Enjoy More', Icon: IconEnjoy},
];

/**
 * Full-bleed, and the card is the subject.
 *
 * On desktop the copy holds the left five columns and the card sits in the
 * right seven, rotated the way a card is photographed for a press shot — not
 * flat-on, and not so far over that the wordmark distorts. On mobile the order
 * flips to copy-then-card, because a card that fills the first screen leaves
 * nothing to read.
 */
export function Hero() {
  return (
    <section
      id="top"
      className="grain relative overflow-hidden pb-[var(--gap-section)] pt-[128px] sm:pt-[150px] lg:pb-40 lg:pt-[184px]"
    >
      <Watermark />

      {/* A single soft teal source behind the card, low and to the right. */}
      <div
        className="pointer-events-none absolute right-[-10%] top-[38%] h-[60vw] max-h-[720px] w-[60vw] max-w-[720px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(45,212,191,0.12), rgba(45,212,191,0) 68%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="relative mx-auto grid max-w-content grid-cols-1 items-center gap-14 px-6 sm:px-8 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <Reveal>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.02] px-3.5 py-1.5">
              <Diamond size={6} className="text-teal" />
              <span className="text-[10.5px] font-medium uppercase tracking-[0.24em] text-chalk-50">
                Membership
              </span>
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-7 text-balance text-[clamp(2.85rem,7.6vw,4rem)] font-bold leading-[0.98] tracking-tightest text-white">
              Your place.
              <br />
              Your rewards.
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-6 max-w-[27rem] text-[16.5px] leading-[1.72] text-chalk-50">
              One card for everywhere you already go. Tap to collect, tap to
              redeem — nothing to download, nothing to lose in a wallet.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                id="join"
                href="#how"
                className="group inline-flex items-center gap-2.5 rounded-full bg-teal px-6 py-3.5 text-[14.5px] font-semibold tracking-tight text-ink-950 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_34px_-10px_rgba(45,212,191,0.65)]"
              >
                Tap to join
                <IconArrow
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </a>
              <a
                href="#card"
                className="link-underline text-[14.5px] font-medium tracking-tight text-chalk-50 transition-colors duration-300 hover:text-white"
              >
                See the card
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.34}>
            <div className="mt-14 flex flex-wrap items-center gap-x-7 gap-y-4">
              {PILLARS.map(({label, Icon}) => (
                <span key={label} className="inline-flex items-center gap-2.5">
                  <Icon size={17} className="text-chalk-35" />
                  <span className="text-[12.5px] font-medium tracking-tight text-chalk-50">
                    {label}
                  </span>
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal
          delay={0.18}
          y={22}
          className="lg:col-span-7 lg:pl-6"
        >
          <div className="mx-auto w-full max-w-[420px] sm:max-w-[500px] lg:ml-auto lg:mr-0 lg:max-w-[560px]">
            <CardStage restY={-13} restX={5} restZ={-3} float />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
