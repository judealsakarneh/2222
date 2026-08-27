import {Diamond} from './Diamond';
import {Reveal} from './Reveal';

/**
 * Every section opens the same way: an index, a mono label, the heading, then
 * at most one line of support. Repeating the exact same opener is what gives
 * the page its rhythm — the reader learns the shape once and can skim by it.
 *
 * The index is optional and should only be passed where the sections really do
 * form a sequence. Numbering a set of unordered panels is decoration pretending
 * to be structure.
 */
export function SectionHead({
  index,
  label,
  title,
  body,
  align = 'left',
}: {
  index?: string;
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
          className={`inline-flex items-center gap-3 ${centered ? 'justify-center' : ''}`}
        >
          {index ? (
            <span className="label nums text-chalk-20">{index}</span>
          ) : (
            <Diamond size={6} className="text-teal" />
          )}
          <span className="label text-teal">{label}</span>
        </span>
      </Reveal>

      <Reveal delay={0.07}>
        <h2
          className={`mt-6 text-balance text-[clamp(2.1rem,5.4vw,3.4rem)] font-bold leading-[1.04] tracking-display text-white ${
            centered ? 'mx-auto max-w-[20ch]' : 'max-w-[17ch]'
          }`}
        >
          {title}
        </h2>
      </Reveal>

      {body ? (
        <Reveal delay={0.13}>
          <p
            className={`mt-6 text-[16px] leading-[1.75] text-chalk-50 ${
              centered ? 'mx-auto max-w-[48ch]' : 'max-w-[44ch]'
            }`}
          >
            {body}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
