import {Diamond} from './Diamond';
import {Logo} from './Logo';
import {IconSignal} from './Icons';

const COLUMNS = [
  {
    heading: 'Explore',
    links: [
      {label: 'How it works', href: '#how'},
      {label: 'The card', href: '#card'},
      {label: 'Rewards', href: '#rewards'},
    ],
  },
  {
    heading: 'Company',
    links: [
      {label: 'About', href: '#'},
      {label: 'Partner rooms', href: '#'},
      {label: 'Contact', href: '#'},
    ],
  },
  {
    heading: 'Legal',
    links: [
      {label: 'Terms', href: '#'},
      {label: 'Privacy', href: '#'},
      {label: 'Card agreement', href: '#'},
    ],
  },
];

/**
 * The footer restates the lockup at full size — this is the last thing on the
 * page, so it is the right place to let the mark be large — then three short
 * link columns and one rule. Nothing else. Every link carries the same teal
 * underline that grows from the left, which is the page's one interaction
 * signature repeated where it will be seen most.
 */
export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-ink-950 pt-[var(--gap-block)]">
      <div className="mx-auto max-w-content px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-14 py-14 lg:grid-cols-12 lg:py-16">
          <div className="lg:col-span-5">
            <Logo size={34} />
            <p className="mt-7 max-w-[26ch] text-[14.5px] leading-[1.7] text-chalk-50">
              A loyalty card for the rooms you already call yours.
            </p>
            <span className="mt-7 inline-flex items-center gap-3 text-chalk-35">
              <IconSignal size={18} />
              <span className="text-[11px] tracking-[0.22em]">
                CONTACTLESS · NFC
              </span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
          {COLUMNS.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h4 className="text-[10.5px] font-medium uppercase tracking-[0.24em] text-chalk-35">
                {col.heading}
              </h4>
              <ul className="mt-6 space-y-3.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="link-underline text-[14px] tracking-tight text-chalk-70 transition-colors duration-300 hover:text-white"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          </div>
        </div>

        <div className="rule-fade" />

        <div className="flex flex-col items-start justify-between gap-4 py-8 sm:flex-row sm:items-center">
          <span className="text-[12.5px] tracking-tight text-chalk-35">
            © {new Date().getFullYear()} ctrl ROOM. All rights reserved.
          </span>
          <span className="inline-flex items-center gap-3 text-[12.5px] tracking-tight text-chalk-35">
            Your place.
            <Diamond size={6} className="text-teal" />
            Your rewards.
          </span>
        </div>
      </div>

      {/* The wordmark half-sunk below the fold — the page ends on the mark, and
          cropping it is what keeps that from feeling like a title card. */}
      <div className="pointer-events-none relative h-[13vw] max-h-[150px] overflow-hidden">
        <span
          className="deboss absolute left-1/2 top-0 -translate-x-1/2 select-none text-[26vw] font-bold leading-[0.8] tracking-tightest"
          aria-hidden="true"
        >
          ctrl
        </span>
      </div>
    </footer>
  );
}
