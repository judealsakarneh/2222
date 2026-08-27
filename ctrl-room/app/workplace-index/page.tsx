import type {Metadata} from 'next';
import {Act, Wrap} from '@/components/site/Act';
import {Masthead} from '@/components/site/Masthead';
import {Action, Lede, Reveal, Title} from '@/components/site/UI';
import {DisplayHeadline} from '@/components/site/DisplayHeadline';

export const metadata: Metadata = {
  title: 'The CTRL Workplace Index',
  description:
    "A ranked, methodology-backed index of the best places to work in Jordan, built on defined criteria, not opinion.",
};

const CRITERIA = [
  'Employee feedback',
  'Benefits',
  'Career development',
  'Work environment',
  'Flexibility',
  'Compensation transparency',
  'Growth opportunities',
  'Employer reputation',
];

export default function IndexPage() {
  return (
    <>
      <Masthead
        title={<>The CTRL <span className="accent">Workplace Index</span>.</>}
        lede="A ranked view of the best places to work in Jordan, built on a published methodology, so the answer to “based on what?” is a document, not a shrug."
      />

      <Act act="dark" className="!pt-[var(--gap-block)]">
        <Wrap>
          <Reveal>
            <div
              className="grid gap-10 border-t pt-[var(--gap-block)] lg:grid-cols-12"
              style={{borderColor: 'var(--line)'}}
            >
              <div className="lg:col-span-4">
                <span className="label" style={{color: 'var(--fg-3)'}}>
                  The problem with lists
                </span>
              </div>
              <div className="lg:col-span-8">
                <p
                  className="text-[clamp(1.3rem,2.8vw,1.95rem)] font-bold leading-[1.28] tracking-headline"
                  style={{color: 'var(--fg)'}}
                >
                  Anyone can declare &ldquo;the 10 best companies in
                  Jordan&rdquo;. The first question is always{' '}
                  <span className="accent">based on what?</span> - and without an
                  answer, the list is worth nothing to the reader and nothing to
                  the companies on it.
                </p>
              </div>
            </div>
          </Reveal>
        </Wrap>
      </Act>

      <Act act="light">
        <Wrap>
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <DisplayHeadline className="text-[clamp(2rem,4.4vw,3rem)] leading-[1.05]">
                Eight inputs, published in full.
              </DisplayHeadline>
              <Lede className="mt-6">
                Every company is scored on the same criteria, and the weighting
                is published alongside the results. A methodology is what turns
                a list into a property CTRL Room owns.
              </Lede>
            </div>

            {/* A scored table rather than a card grid, this is an index, and an
                index looks like a table. */}
            <div className="lg:col-span-6 lg:col-start-7">
              <ul>
                {CRITERIA.map((c, i) => (
                  <li
                    key={c}
                    className="flex items-baseline gap-6 border-t py-4"
                    style={{borderColor: 'var(--line)'}}
                  >
                    <span className="label nums" style={{color: 'var(--fg-3)'}}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[16px]" style={{color: 'var(--fg)'}}>
                      {c}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Wrap>
      </Act>

      <Act act="dark">
        <Wrap>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <DisplayHeadline className="text-[clamp(1.9rem,4vw,2.8rem)] leading-[1.05]">
                Eventually companies ask to be included.
              </DisplayHeadline>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <Lede>
                Built on defensible criteria, the Index becomes a major annual
                piece of content, and the direction of the conversation
                reverses. It reinforces the Career Room pillar and feeds directly
                into the recruitment and employer-branding lines in CTRL Room for
                Business.
              </Lede>
              <div className="mt-10 flex flex-wrap gap-4">
                <Action href="/business">Get your company assessed</Action>
                <Action href="/membership#join" tone="ghost">
                  Get the Index first
                </Action>
              </div>
            </div>
          </div>
        </Wrap>
      </Act>
    </>
  );
}
