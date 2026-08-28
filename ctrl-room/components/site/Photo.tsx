import Link from 'next/link';
import {Reveal} from './UI';

/**
 * Photography lives in two shapes on this site, and they are deliberately
 * unlike each other and unlike the ledger sections around them.
 *
 * Featured is a full-width media band: the archetype that resets the page's
 * rhythm after a run of type-led sections. Lists is a bento row where the
 * first tile is wider than the rest, so the eye is given somewhere to land
 * instead of scanning three identical cards.
 */

export function Featured({
  src,
  eyebrow,
  title,
  body,
  href,
  cta,
}: {
  src: string;
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <Reveal>
      <div className="relative overflow-hidden rounded-[3px]">
        <div className="relative aspect-[16/11] w-full sm:aspect-[2/1] lg:aspect-[21/8]">
          {/* A plain img, not next/image: these are pre-sized and already
              compressed for their slots, the site exports statically so there
              is no optimiser to run, and the single-file preview bundle has no
              Next runtime to satisfy. */}
          <img
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Scrim, weighted to the corner the type sits in, so the headline
              holds its contrast wherever the photograph happens to be light. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(10,10,11,0.94) 0%, rgba(10,10,11,0.72) 32%, rgba(10,10,11,0.22) 62%, rgba(10,10,11,0.06) 100%)',
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.09)'}}
          />
        </div>

        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-14">
          <div className="max-w-[34rem]">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">
              {eyebrow}
            </p>
            <h3 className="display mt-4 text-[clamp(1.6rem,3.4vw,2.6rem)] font-bold leading-[1.04] tracking-[-0.02em] t-1">
              {title}
            </h3>
            <p className="mt-4 max-w-[42ch] text-[15px] leading-[1.6] text-white/70">
              {body}
            </p>
            <Link
              href={href}
              className="mt-7 inline-block border b-line-2 bg-white/5 px-5 py-3 text-[13px] tracking-[0.04em] t-1 backdrop-blur-sm transition-colors duration-[160ms] hover:border-white/50 hover:bg-white/10"
            >
              {cta}
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export type ListCard = {src: string; title: string; count: string; href: string};

export function Lists({items, href}: {items: ListCard[]; href: string}) {
  return (
    <div>
      <div className="flex items-end justify-between gap-6 border-b pb-5" style={{borderColor: 'var(--line)'}}>
        <h3 className="text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">
          CTRL Lists
        </h3>
        <Link
          href={href}
          className="text-[13px] text-[var(--fg-2)] transition-colors duration-[160ms] hover:text-[var(--fg)]"
        >
          View all
        </Link>
      </div>

      {/* Bento: the first tile takes two columns on desktop. Three equal cards
          would be the flattest thing on the page. */}
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <Reveal key={it.title} delay={i * 0.06} className={i === 0 ? 'lg:col-span-2' : ''}>
            <Link href={it.href} className="group block">
              <div
                className={`relative overflow-hidden rounded-[3px] ${
                  i === 0 ? 'aspect-[16/10]' : 'aspect-[4/3]'
                }`}
              >
                <img
                  src={it.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.09)'}}
                />
              </div>
              <p className="mt-4 text-[15px] font-medium leading-[1.3] text-[var(--fg)]">
                {it.title}
              </p>
              <p className="mt-1.5 text-[13px] text-[var(--fg-3)]">{it.count}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
