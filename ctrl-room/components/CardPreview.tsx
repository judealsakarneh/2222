import {CardStage} from './CardStage';
import {Diamond} from './Diamond';
import {IconTap} from './Icons';
import {Reveal} from './Reveal';
import {SectionHead} from './SectionHead';

const SPECS = [
  ['Contactless', 'Tap and go. Reads in under a second at any counter.'],
  ['One card, every room', 'Works across every venue in the network.'],
  ['Nothing to install', 'No app, no login, no QR code to fumble for.'],
  ['Balance on tap', 'Hold it to your phone to see where you stand.'],
];

/**
 * The card gets a section to itself, because it is the product.
 *
 * The copy is kept to four short specifications with diamond markers — anything
 * longer competes with the object for attention, and the object is what this
 * section exists to show.
 */
export function CardPreview() {
  return (
    <section
      id="card"
      className="grain relative overflow-hidden border-t border-white/[0.05] py-[var(--gap-section)]"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vw] max-h-[760px] w-[70vw] max-w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(45,212,191,0.10), rgba(45,212,191,0) 65%)',
          filter: 'blur(48px)',
        }}
      />

      <div className="relative mx-auto grid max-w-content grid-cols-1 items-center gap-16 px-6 sm:px-8 lg:grid-cols-12 lg:gap-10">
        <Reveal y={22} className="order-2 lg:order-1 lg:col-span-7">
          <div className="mx-auto w-full max-w-[420px] sm:max-w-[520px] lg:max-w-none">
            <CardStage restY={8} restX={3} maxTilt={15} />
          </div>

          <div className="mt-9 flex items-center justify-center gap-2.5 lg:justify-start">
            <IconTap size={16} className="text-teal" />
            <span className="text-[12.5px] tracking-tight text-chalk-35">
              Move across the card to catch the light
            </span>
          </div>
        </Reveal>

        <div className="order-1 lg:order-2 lg:col-span-5">
          <SectionHead
            label="The card"
            title="Built to be tapped, not explained."
          />

          <ul className="mt-[var(--gap-block)] space-y-7">
            {SPECS.map(([title, body], i) => (
              <Reveal as="li" key={title} delay={0.06 * i} className="flex gap-4">
                <Diamond size={7} className="mt-[7px] shrink-0 text-teal" />
                <div>
                  <span className="block text-[15px] font-semibold tracking-tight text-white">
                    {title}
                  </span>
                  <span className="mt-1.5 block text-[14.5px] leading-[1.68] text-chalk-50">
                    {body}
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
