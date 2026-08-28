import type {Metadata} from 'next';
import {Act, Wrap} from '@/components/site/Act';
import {Masthead} from '@/components/site/Masthead';
import {Action, Lede, Reveal, Rows, Title} from '@/components/site/UI';
import {DisplayHeadline} from '@/components/site/DisplayHeadline';

export const metadata: Metadata = {
  title: 'Events',
  description:
    'CTRL Nights, Sessions, Careers, Experiences and Weekends: an event ecosystem built to earn the CTRL Room name, not sponsorships for their own sake.',
};

const FORMATS = [
  {n: '01', title: 'CTRL Nights', body: 'Networking and social evenings, the room, in a room. The format that turns an audience into people who have actually met.'},
  {n: '02', title: 'CTRL Sessions', body: 'Talks with interesting people. Founders, operators, and the ones doing something worth an hour of attention.'},
  {n: '03', title: 'CTRL Careers', body: 'Career networking that connects the Career Room pillar to the companies actually hiring.'},
  {n: '04', title: 'CTRL Experiences', body: 'Exclusive partner experiences, access members cannot buy anywhere else.'},
  {n: '05', title: 'CTRL Weekends', body: 'Curated trips and activities. Amman, Aqaba, the Dead Sea, and the routes worth driving.'},
];

export default function EventsPage() {
  return (
    <>
      <Masthead
        title={<>An ecosystem, <span className="accent">not a sponsorship</span>.</>}
        lede="Five recurring formats built to earn the CTRL Room name, so that eventually the line reads &ldquo;CTRL Room presents&rdquo;. That is credibility pure sponsorship cannot buy."
      />

      <Act act="dark" className="!pt-[var(--gap-act)]">
        <Wrap>
          <div className="max-w-[46rem]">
            <DisplayHeadline className="text-[clamp(2rem,4.8vw,3.4rem)] leading-[1.05]">
              Five things worth turning up to.
            </DisplayHeadline>
          </div>
          <div className="mt-[var(--gap-block)]">
            <Rows items={FORMATS} />
          </div>
        </Wrap>
      </Act>

      <Act act="dark">
        <Wrap>
          <Reveal>
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <DisplayHeadline className="text-[clamp(1.9rem,4vw,2.8rem)] leading-[1.05]">
                  Before hosting anything, one question.
                </DisplayHeadline>
              </div>
              <div className="lg:col-span-6 lg:col-start-7">
                <p
                  className="text-[clamp(1.25rem,2.6vw,1.8rem)] font-bold leading-[1.3] tracking-headline"
                  style={{color: 'var(--fg)'}}
                >
                  &ldquo;What does this event do for CTRL Room?&rdquo;
                </p>
                <Lede className="mt-6">
                  New users, brand exposure, database growth, partnership
                  opportunities, content, revenue, or corporate relationships. If
                  the answer is none of those, it is just paid branding. We
                  do not do it.
                </Lede>
              </div>
            </div>
          </Reveal>
        </Wrap>
      </Act>

      <Act act="dark" className="!pt-0">
        <Wrap>
          <div className="border-t pt-[var(--gap-block)]" style={{borderColor: 'var(--line)'}}>
            <DisplayHeadline className="max-w-[18ch] text-[clamp(1.9rem,4.6vw,3rem)] leading-[1.05]">
              Members hear about every event first.
            </DisplayHeadline>
            <div className="mt-10 flex flex-wrap gap-4">
              <Action href="/membership#join">Join the room</Action>
              <Action href="/business" tone="ghost">
                Host with CTRL Room
              </Action>
            </div>
          </div>
        </Wrap>
      </Act>
    </>
  );
}
