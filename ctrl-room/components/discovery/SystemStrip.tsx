import {SYSTEM} from '@/lib/content';
import {Ground} from '@/components/ui/Ground';

/**
 * The strip directly under the hero. It is the closest thing the site has to
 * a control surface: five entry points, evenly weighted, separated by
 * hairlines rather than boxed into cards. It says "this is a system you
 * operate" before any section says it in words.
 */
export function SystemStrip() {
  return (
    <Ground name="dark" className="border-y b-line" aria-label="CTRL Room sections">
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {SYSTEM.map((s, i) => (
          <li
            key={s.label}
            className={`b-line ${i % 2 === 0 ? 'border-r md:border-r' : ''} ${
              i < 4 ? 'border-b lg:border-b-0' : ''
            } lg:border-b-0 lg:border-r lg:last:border-r-0`}
          >
            <a
              href={s.href}
              className="group flex h-full flex-col justify-between gap-6 px-6 py-7 transition-colors duration-200 hover:bg-white/[0.025] lg:px-8 lg:py-9"
            >
              <span className="font-mono text-[10px] tracking-[0.16em] t-3">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>
                <span className="block text-[15px] font-semibold tracking-[-0.01em] t-1">{s.label}</span>
                <span className="mt-1.5 block text-[12.5px] leading-[1.45] t-3">{s.note}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Ground>
  );
}
