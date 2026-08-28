import {NAV, AREAS} from '@/lib/content';
import {MagneticButton} from '@/components/ui/Button';

/**
 * The close. One statement at display scale, then the index. The final CTA
 * is not a separate section with its own heading: putting it in the footer's
 * top half is what stops the page ending on two consecutive call-to-actions.
 */
export function Footer() {
  return (
    <footer className="border-t border-white/[0.09] bg-ink-950">
      <div className="py-[calc(var(--gap-act)/2)] edge">
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2
              className="display text-[clamp(2.4rem,6vw,4.6rem)] font-black uppercase leading-[0.9] tracking-[-0.035em] text-white"
              style={{fontStretch: '82%'}}
            >
              Jordan,
              <br />
              <span className="text-teal-lit">switched on.</span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="max-w-[32ch] text-[15px] leading-[1.62] text-grey-2">
              New places, new events, no noise. Join the room, or bring your
              business into it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <MagneticButton href="#elite">Join CTRL</MagneticButton>
              <MagneticButton href="#partners" variant="outline">
                Partner with CTRL
              </MagneticButton>
            </div>
          </div>
        </div>

        <div className="mt-[var(--gap-block)] grid gap-x-10 gap-y-10 border-t border-white/[0.09] pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="flex items-baseline gap-2">
              <span className="display text-[18px] font-black leading-none tracking-[-0.03em] text-white">CTRL</span>
              <span className="text-[9px] font-medium uppercase tracking-[0.28em] text-teal-lit">Room</span>
            </span>
            <p className="mt-4 max-w-[24ch] text-[13px] leading-[1.55] text-white/55">
              Jordan&rsquo;s discovery, community and commerce platform.
            </p>
          </div>

          <FooterCol title="Sections" items={NAV.map((n) => ({label: n.label, href: n.href}))} />
          <FooterCol title="Coverage" items={AREAS.map((a) => ({label: a, href: '#discover'}))} />

          <div>
            <h3 className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">Contact</h3>
            <ul className="mt-5 space-y-2.5">
              <li className="text-[13.5px] text-white/55">REPLACE with contact details</li>
              <li className="font-mono text-[11px] tracking-[0.1em] text-white/50">31.9539° N 35.9106° E</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.09] pt-7">
          <p className="font-mono text-[10.5px] tracking-[0.1em] text-white/50">© 2026 CTRL Room</p>
          <p className="font-mono text-[10.5px] tracking-[0.1em] text-white/50">Amman, Jordan</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({title, items}: {title: string; items: {label: string; href: string}[]}) {
  return (
    <div>
      <h3 className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">{title}</h3>
      <ul className="mt-5 space-y-2.5">
        {items.map((it) => (
          <li key={it.label}>
            <a href={it.href} className="text-[13.5px] text-white/55 transition-colors duration-200 hover:text-white">
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
