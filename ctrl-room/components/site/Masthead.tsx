import type {ReactNode} from 'react';
import {Act, Wrap} from './Act';
import {Lede, Title} from './UI';
import {Signal} from './Marks';

/**
 * Every inner page opens the same way: a kicker on a rule, the title at display
 * size, one line of lede. Repeating the exact opener is what makes six separate
 * pages read as one publication.
 */
export function Masthead({
  kicker,
  title,
  lede,
  aside,
}: {
  kicker: string;
  title: ReactNode;
  lede: string;
  aside?: ReactNode;
}) {
  return (
    <Act act="dark" className="grain pt-[140px] sm:pt-[164px]">
      <Wrap>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div
              className="flex items-center gap-3.5 border-t pt-4"
              style={{borderColor: 'var(--line)'}}
            >
              <Signal size={6} className="accent" />
              <span className="label" style={{color: 'var(--fg-2)'}}>
                {kicker}
              </span>
            </div>
            <Title as="h1" className="mt-8 text-[clamp(2.6rem,7.4vw,5.2rem)]">
              {title}
            </Title>
            <Lede className="mt-8">{lede}</Lede>
          </div>
          {aside ? <div className="lg:col-span-4">{aside}</div> : null}
        </div>
      </Wrap>
    </Act>
  );
}
