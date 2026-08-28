import {ELITE_BENEFITS, ENGINES} from '@/lib/content';
import {SectionLabel} from '@/components/ui/SectionLabel';
import {RevealText, Reveal} from '@/components/ui/RevealText';
import {MagneticButton} from '@/components/ui/Button';
import {EliteCard} from './EliteCard';
import {Ground} from '@/components/ui/Ground';

/**
 * Elite and membership are one section, because they are one proposition:
 * the card is the membership. Splitting them would have produced two thin
 * sections saying the same thing.
 *
 * The card leads on the left at desktop and the benefits run as a numbered
 * list rather than a grid of tiles, so the section does not repeat the card
 * geometry that CTRL Picks already used.
 */
export function Elite() {
  return (
    <Ground name="paper" id="elite" className="scroll-mt-24 py-[calc(var(--gap-act)/2)]">
      <div className="edge">
        <div className="grid items-center gap-x-16 gap-y-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <EliteCard />
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <SectionLabel n="05">CTRL Elite</SectionLabel>
            <RevealText
              className="display mt-7 text-[clamp(2.1rem,4.4vw,3.4rem)] font-black leading-[0.98] tracking-[-0.03em] t-1"
              lines={['More than a card.', 'Access to more.']}
            />
            <p className="mt-6 max-w-[36ch] text-[15px] leading-[1.62] t-2">
              One membership across every partner in the room. It works whether
              you show it or not.
            </p>

            <ul className="mt-10">
              {ELITE_BENEFITS.map((b, i) => (
                <Reveal key={b} delay={i * 0.05}>
                  <li className="flex items-baseline gap-5 border-t b-line py-4 last:border-b">
                    <span className="font-mono text-[10px] tracking-[0.14em] t-3">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[15px] t-1">{b}</span>
                  </li>
                </Reveal>
              ))}
            </ul>

            <div className="mt-10">
              <MagneticButton href="#partners">Join CTRL</MagneticButton>
            </div>
          </div>
        </div>

        {/* The four engines, as a footnote to the membership rather than a
            section of their own. They explain what the card is part of. */}
        <div className="mt-[var(--gap-block)] grid gap-x-16 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <SectionLabel>Four engines</SectionLabel>
            <p className="mt-5 max-w-[26ch] text-[13.5px] leading-[1.55] t-3">
              Not one Instagram page. A company built underneath it.
            </p>
          </div>
          <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:col-span-9">
            {ENGINES.map((e, i) => (
              <Reveal key={e.title} delay={i * 0.05}>
                <div className="border-t b-line pt-5">
                  <span className="font-mono text-[10px] tracking-[0.14em] t-3">{e.n}</span>
                  <h3 className="mt-3 text-[17px] font-semibold tracking-[-0.015em] t-1">{e.title}</h3>
                  <p className="mt-2 max-w-[32ch] text-[13.5px] leading-[1.55] t-3">{e.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Ground>
  );
}
