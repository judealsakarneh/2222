import {IconEarn, IconEnjoy, IconReward} from './Icons';
import {RevealGroup, RevealItem} from './Reveal';
import {SectionHead} from './SectionHead';

const STEPS = [
  {
    n: '01',
    title: 'Earn Points',
    Icon: IconEarn,
    body: 'Tap your card at the counter. Points land before your receipt prints — no codes, no phone number, no app to open.',
    tags: ['Contactless tap', 'Instant balance', 'No receipt scan'],
  },
  {
    n: '02',
    title: 'Get Rewards',
    Icon: IconReward,
    body: 'Points turn into something worth having. Free rounds, early access, a table held for you on a Friday night.',
    tags: ['Auto-applied', 'No expiry', 'Room-specific perks'],
  },
  {
    n: '03',
    title: 'Enjoy More',
    Icon: IconEnjoy,
    body: 'The more rooms you visit, the better it gets. Your tier follows you across every place that carries the card.',
    tags: ['Tiers that travel', 'Network-wide'],
  },
];

/**
 * Three panels, each ending in a row of chips.
 *
 * The chips are not decoration — they are the specifics the body copy cannot
 * carry without turning into a paragraph. A prospect skimming the page reads
 * the heading and the chips and has the whole feature set; a prospect who
 * stops reads the body. Both are served by the same panel.
 *
 * `mt-auto` on the chip row pins it to the bottom of every panel regardless of
 * how long its body runs, so the three bottom edges line up. Without it the
 * chips float at three different heights and the row looks unset.
 */
export function HowItWorks() {
  return (
    <section
      id="how"
      className="relative py-[var(--gap-section)]"
    >
      <div className="mx-auto max-w-content px-6 sm:px-8">
        <SectionHead
          index="01"
          label="How it works"
          title="Three taps. That is the whole system."
          body="No punch cards, no stamps, no barcode screenshots. One card that knows where you have been and what you are owed."
        />

        <RevealGroup
          className="mt-[var(--gap-block)] grid grid-cols-1 gap-3 sm:grid-cols-3"
          stagger={0.11}
        >
          {STEPS.map(({n, title, body, Icon, tags}) => (
            <RevealItem key={n} className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-900 transition-colors duration-500 hover:border-white/[0.13]">
              {/* The teal wash only appears on hover, and only on the panel the
                  pointer is over — the one moment the accent is allowed to
                  cover an area rather than a detail. */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    'radial-gradient(80% 70% at 50% 0%, rgba(45,212,191,0.07), rgba(45,212,191,0) 72%)',
                }}
              />
              <div className="relative flex h-full flex-col p-7 sm:p-8 lg:p-10">
                <div className="flex items-center justify-between">
                  <Icon
                    size={30}
                    className="text-white/80 transition-colors duration-500 group-hover:text-white"
                  />
                  <span className="label nums text-chalk-20">{n}</span>
                </div>

                <h3 className="mt-8 text-[21px] font-bold tracking-tight text-white">
                  {title}
                </h3>
                <p className="mt-3.5 text-[14.5px] leading-[1.7] text-chalk-50">
                  {body}
                </p>

                <ul className="mt-auto flex flex-wrap gap-2 pt-9">
                  {tags.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[11.5px] font-medium tracking-tight text-chalk-50 transition-colors duration-500 group-hover:border-white/[0.14] group-hover:text-chalk-70"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
