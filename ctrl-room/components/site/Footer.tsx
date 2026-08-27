import Link from 'next/link';
import {NAV} from '@/lib/nav';
import {Wordmark, Bars} from './Marks';

/**
 * Not four equal link columns, that grid is one of the clearest marks of a
 * generated page. The footer is built as a masthead instead: the statement
 * first at full size, then an asymmetric block where the brand holds the left
 * and the links run as two loose groups on the right.
 */
export function Footer() {
  return (
    <footer data-act="dark" className="relative" style={{color: 'var(--fg)'}}>
      <div className="mx-auto max-w-content edge">
        <div className="border-t py-[var(--gap-block)]" style={{borderColor: 'var(--line)'}}>
          <p className="max-w-[16ch] text-[clamp(2.2rem,6.5vw,4.6rem)] font-extrabold leading-[0.98] tracking-display wide">
            Jordan, <span className="accent">switched on</span>.
          </p>

          <div className="mt-12 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Wordmark size={20} live />
              <p
                className="mt-6 max-w-[38ch] text-[15px] leading-[1.7]"
                style={{color: 'var(--fg-2)'}}
              >
                Jordan&rsquo;s discovery, community and commerce platform.
                What&rsquo;s happening, what&rsquo;s worth knowing, and the
                membership that gets you in.
              </p>
              <span
                className="label mt-7 inline-flex items-center gap-3"
                style={{color: 'var(--fg-3)'}}
              >
                <Bars size={12} />
                Amman · Jordan
              </span>
            </div>

            <div className="grid grid-cols-2 gap-10 lg:col-span-6 lg:col-start-8">
              <div>
                <h2 className="label" style={{color: 'var(--fg-3)'}}>
                  The room
                </h2>
                <ul className="mt-5 space-y-3">
                  {NAV.map((n) => (
                    <li key={n.href}>
                      <Link
                        href={n.href}
                        className="text-[15px] transition-colors duration-300 hover:text-[color:var(--accent)]"
                        style={{color: 'var(--fg-2)'}}
                      >
                        {n.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="label" style={{color: 'var(--fg-3)'}}>
                  Elsewhere
                </h2>
                <ul className="mt-5 space-y-3">
                  {['Instagram', 'TikTok', 'LinkedIn', 'Contact'].map((s) => (
                    <li key={s}>
                      <a
                        href="#"
                        className="text-[15px] transition-colors duration-300 hover:text-[color:var(--accent)]"
                        style={{color: 'var(--fg-2)'}}
                      >
                        {s}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex flex-col gap-3 border-t py-7 sm:flex-row sm:items-center sm:justify-between"
          style={{borderColor: 'var(--line)'}}
        >
          <span className="label" style={{color: 'var(--fg-3)'}}>
            © {new Date().getFullYear()} CTRL Room
          </span>
          <span className="label" style={{color: 'var(--fg-3)'}}>
            What&rsquo;s happening. What&rsquo;s worth knowing.
          </span>
        </div>
      </div>
    </footer>
  );
}
