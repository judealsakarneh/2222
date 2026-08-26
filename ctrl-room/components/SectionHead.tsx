import {Diamond} from './Diamond';
import {Reveal} from './Reveal';

/**
 * Every section opens the same way: a teal diamond and a tracked label, then
 * the heading, then at most one line of support. Repeating the exact same
 * three-part opener is what gives the page its rhythm — the reader learns the
 * shape once and can then skim by it.
 */
export function SectionHead({
  label,
  title,
  body,
  align = 'left',
}: {
  label: string;
  title: React.ReactNode;
  body?: string;
  align?: 'left' | 'center';
}) {
  const centered = align === 'center';
  return (
    <div className={centered ? 'text-center' : ''}>
      <Reveal>
        <span
          className={`inline-flex items-center gap-2.5 ${
            centered ? 'justify-center' : ''
          }`}
        >
          <Diamond size={6} className="text-teal" />
          <span className="text-[10.5px] font-medium uppercase tracking-[0.24em] text-teal">
            {label}
          </span>
        </span>
      </Reveal>

      <Reveal delay={0.07}>
        <h2
          className={`mt-5 text-balance text-[clamp(2rem,4.6vw,2.9rem)] font-bold leading-[1.06] tracking-headline text-white ${
            centered ? 'mx-auto max-w-[20ch]' : 'max-w-[18ch]'
          }`}
        >
          {title}
        </h2>
      </Reveal>

      {body ? (
        <Reveal delay={0.13}>
          <p
            className={`mt-5 text-[16px] leading-[1.72] text-chalk-50 ${
              centered ? 'mx-auto max-w-[46ch]' : 'max-w-[44ch]'
            }`}
          >
            {body}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
