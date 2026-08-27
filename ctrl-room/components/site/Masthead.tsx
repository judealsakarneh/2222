import type {ReactNode} from 'react';
import {Act, Wrap} from './Act';
import {Lede} from './UI';
import {DisplayHeadline} from './DisplayHeadline';

/**
 * Every inner page opens the same way: a kicker on a rule, the title at display
 * size, one line of lede. Repeating the exact opener is what makes six separate
 * pages read as one publication.
 */
export function Masthead({
  title,
  lede,
  aside,
}: {
  title: ReactNode;
  lede: string;
  aside?: ReactNode;
}) {
  return (
    <Act act="dark" className="pt-[140px] sm:pt-[164px]">
      <Wrap>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-9 pt-10">
            <div className="border-t" style={{borderColor: 'var(--line)'}} />
            <DisplayHeadline
              as="h1"
              className="text-[clamp(2.4rem,6.6vw,4.6rem)] leading-[1.0]"
              from={94}
              to={110}
            >
              {title}
            </DisplayHeadline>
            <Lede className="mt-8">{lede}</Lede>
          </div>
          {aside ? <div className="lg:col-span-4">{aside}</div> : null}
        </div>
      </Wrap>
    </Act>
  );
}
