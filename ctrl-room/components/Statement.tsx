import {Diamond} from './Diamond';
import {Reveal} from './Reveal';

/**
 * The thesis, set large.
 *
 * One idea, three lines, two words in the accent. The accent inside running
 * type is the page's boldest move and it is spent here — which is why the
 * words chosen for it are the two that carry the argument, not whichever ones
 * happened to look good highlighted.
 */
export function Statement() {
  return (
    <section className="relative overflow-hidden bg-ink-975 py-[var(--gap-section)]">
      {/* A single wide bloom, low, so the block is not floating on flat black. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-[-40%] h-[80%]"
        style={{
          background:
            'radial-gradient(60% 100% at 50% 100%, rgba(45,212,191,0.10), rgba(45,212,191,0) 70%)',
        }}
      />
      <div className="relative mx-auto max-w-content px-5 sm:px-8">
        <Reveal>
          <span className="label inline-flex items-center gap-2.5 text-chalk-35">
            <Diamond size={6} className="text-teal" />
            The idea
          </span>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-8 max-w-[19ch] text-balance text-[clamp(2.1rem,6.2vw,4.1rem)] font-bold leading-[1.04] tracking-display text-white sm:max-w-[22ch]">
            A card people <span className="hot">actually carry</span>, because
            the best reward is the one you{' '}
            <span className="hot">never asked for</span>.
          </p>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-9 max-w-[52ch] text-[16px] leading-[1.75] text-chalk-50">
            Loyalty schemes fail because they make you do the work — open the
            app, find the code, remember the card. Take all of that away and
            what is left is the only part anyone wanted.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
