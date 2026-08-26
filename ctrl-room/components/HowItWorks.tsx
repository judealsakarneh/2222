import {IconEarn, IconEnjoy, IconReward} from './Icons';
import {RevealGroup, RevealItem} from './Reveal';
import {SectionHead} from './SectionHead';

const STEPS = [
  {
    n: '01',
    title: 'Earn Points',
    Icon: IconEarn,
    body: 'Tap your card at the counter. Points land before your receipt prints — no codes, no phone number, no app to open.',
  },
  {
    n: '02',
    title: 'Get Rewards',
    Icon: IconReward,
    body: 'Points turn into something worth having. Free rounds, early access, a table held for you on a Friday night.',
  },
  {
    n: '03',
    title: 'Enjoy More',
    Icon: IconEnjoy,
    body: 'The more rooms you visit, the better it gets. Your tier follows you across every place that carries the card.',
  },
];

/**
 * The three steps share one hairline rail with a diamond node on each. On
 * desktop the rail is horizontal and runs behind the row; on mobile it becomes
 * a vertical spine down the left. Same idea, one component, no duplicated
 * markup — the rail is drawn per-item as a pseudo-element rather than as a
 * single line, which is what lets it change axis without a second layout.
 */
export function HowItWorks() {
  return (
    <section
      id="how"
      className="relative border-t border-white/[0.05] py-[var(--gap-section)]"
    >
      <div className="mx-auto max-w-content px-6 sm:px-8">
        <SectionHead
          label="How it works"
          title="Three taps. That is the whole system."
          body="No punch cards, no stamps, no barcode screenshots. One card that knows where you have been and what you are owed."
        />

        <RevealGroup
          className="mt-[var(--gap-block)] grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.05] sm:grid-cols-3"
          stagger={0.11}
        >
          {STEPS.map(({n, title, body, Icon}) => (
            <RevealItem key={n} className="group relative bg-ink-950">
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
                    size={26}
                    className="text-white/80 transition-colors duration-500 group-hover:text-white"
                  />
                  <span className="text-[11px] font-medium tracking-[0.22em] text-chalk-35">
                    {n}
                  </span>
                </div>

                <h3 className="mt-8 text-[19px] font-semibold tracking-tight text-white">
                  {title}
                </h3>
                <p className="mt-3.5 text-[14.5px] leading-[1.7] text-chalk-50">
                  {body}
                </p>

                {/* Teal rule that grows on hover — the panel's only reaction. */}
                <span
                  className="mt-8 block h-px w-8 origin-left scale-x-100 bg-teal/60 transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-[2.6]"
                  aria-hidden="true"
                />
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
