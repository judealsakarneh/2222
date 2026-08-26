import {Diamond} from './Diamond';
import {IconArrow, IconSignal} from './Icons';
import {Reveal, RevealGroup, RevealItem} from './Reveal';
import {SectionHead} from './SectionHead';

const REWARDS = [
  {
    title: 'Every tenth is on us',
    body: 'Ten taps at the same counter and the next one costs nothing. It just happens — no card to hand over, no stamp to chase.',
    span: true,
  },
  {title: 'Birthday month', body: 'Something waiting for you, the whole month, not just the day.'},
  {title: 'Early access', body: 'Tables, tickets and drops open to members first.'},
  {title: 'Points never expire', body: 'What you earn stays yours for as long as you want it.'},
  {title: 'Tiers that travel', body: 'Status earned in one room is recognised in all of them.'},
];

/**
 * A five-tile grid where the first tile spans two columns.
 *
 * The asymmetry is the point: five equal tiles read as a feature list, and a
 * feature list is what every SaaS page on earth already looks like. One tile
 * carrying the headline benefit at twice the width gives the eye somewhere to
 * land first, and the rest fall in behind it.
 */
export function Rewards() {
  return (
    <section
      id="rewards"
      className="relative border-t border-white/[0.05] py-[var(--gap-section)]"
    >
      <div className="mx-auto max-w-content px-6 sm:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead
            label="Rewards"
            title="Worth carrying. Worth using."
          />
          <Reveal delay={0.12} className="hidden lg:block">
            <span className="inline-flex items-center gap-3 text-chalk-35">
              <IconSignal size={20} />
              <span className="text-[12px] tracking-[0.2em]">TAP TO REDEEM</span>
            </span>
          </Reveal>
        </div>

        <RevealGroup
          className="mt-[var(--gap-block)] grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.08}
        >
          {REWARDS.map(({title, body, span}) => (
            <RevealItem
              key={title}
              className={span ? 'sm:col-span-2' : undefined}
            >
              <article
                className={`group relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-900 p-7 transition-colors duration-500 hover:border-white/[0.12] sm:p-8 ${
                  span ? 'lg:p-10' : ''
                }`}
              >
                {span ? (
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'radial-gradient(70% 90% at 100% 0%, rgba(45,212,191,0.10), rgba(45,212,191,0) 62%)',
                    }}
                  />
                ) : null}

                <div className="relative">
                  <Diamond
                    size={7}
                    className="text-teal opacity-70 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <h3
                    className={`mt-6 font-semibold tracking-tight text-white ${
                      span ? 'text-[22px] sm:text-[26px]' : 'text-[17px]'
                    }`}
                  >
                    {title}
                  </h3>
                  <p
                    className={`mt-3 leading-[1.7] text-chalk-50 ${
                      span ? 'max-w-[42ch] text-[15.5px]' : 'text-[14.5px]'
                    }`}
                  >
                    {body}
                  </p>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Closing call. One line, one link — the page has already made its case. */}
        <RevealGroup className="mt-[var(--gap-block)]" delay={0.1}>
          <RevealItem>
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-ink-900 px-7 py-12 text-center sm:px-10 sm:py-16">
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'radial-gradient(60% 120% at 50% 120%, rgba(45,212,191,0.14), rgba(45,212,191,0) 68%)',
                }}
              />
              <div className="relative">
                <h3 className="mx-auto max-w-[16ch] text-balance text-[clamp(1.7rem,4vw,2.4rem)] font-bold leading-[1.08] tracking-headline text-white">
                  Get your card. Start tapping.
                </h3>
                <p className="mx-auto mt-4 max-w-[38ch] text-[15.5px] leading-[1.7] text-chalk-50">
                  Free to join, free to keep. Pick one up at any room in the
                  network.
                </p>
                <a
                  href="#join"
                  className="group mt-9 inline-flex items-center gap-2.5 rounded-full bg-teal px-6 py-3.5 text-[14.5px] font-semibold tracking-tight text-ink-950 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_34px_-10px_rgba(45,212,191,0.65)]"
                >
                  Tap to join
                  <IconArrow
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </a>
              </div>
            </div>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
