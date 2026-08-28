import {PARTNER_REACH} from '@/lib/content';
import {SectionLabel} from '@/components/ui/SectionLabel';
import {RevealText, Reveal} from '@/components/ui/RevealText';
import {MagneticButton} from '@/components/ui/Button';

/**
 * The B2B section. It is the one place the page raises its voice, so it gets
 * the teal ground and the largest type on the site after the hero. White on
 * #006563 measures 6.9:1, so the brand colour can carry the whole block
 * without lightening.
 *
 * Deliberately not a SaaS pricing table: no tiers, no checkmarks, no logos of
 * customers that do not exist yet.
 */
export function Partners() {
  return (
    <section id="partners" className="scroll-mt-24">
      <div className="bg-teal text-white">
        <div className="py-[calc(var(--gap-act)/2)] edge">
          <div className="grid gap-x-16 gap-y-14 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3">
                <span className="h-[6px] w-[6px] shrink-0 bg-white" aria-hidden />
                <span className="font-mono text-[10px] tracking-[0.14em] text-white/85">07</span>
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/85">Partners</span>
              </div>

              <RevealText
                className="display mt-8 text-[clamp(2.4rem,6.4vw,5.2rem)] font-black uppercase leading-[0.88] tracking-[-0.035em]"
                lines={['Your audience', 'is already here.']}
              />

              <p className="mt-8 max-w-[42ch] text-[15.5px] leading-[1.62] text-white/85">
                CTRL Room is where people decide where to go, what to book and
                who to work for. Partners reach them at that moment, not after
                it.
              </p>

              <div className="mt-11">
                <MagneticButton href="#partners" variant="outline" className="border-white/40 hover:border-white hover:bg-white/10">
                  Partner with CTRL
                </MagneticButton>
              </div>
            </div>

            <ul className="lg:col-span-4 lg:col-start-9">
              {PARTNER_REACH.map((r, i) => (
                <Reveal key={r.label} delay={i * 0.05}>
                  <li className="border-t border-white/25 py-5 last:border-b">
                    <div className="flex items-baseline gap-5">
                      <span className="font-mono text-[10px] tracking-[0.14em] text-white/85">{r.n}</span>
                      <span>
                        <span className="block text-[15.5px] font-semibold text-white">{r.label}</span>
                        <span className="mt-1.5 block text-[13px] leading-[1.5] text-white/85">{r.body}</span>
                      </span>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
