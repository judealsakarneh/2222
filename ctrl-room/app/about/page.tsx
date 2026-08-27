import type {Metadata} from 'next';
import {Act, Wrap} from '@/components/site/Act';
import {Masthead} from '@/components/site/Masthead';
import {Action, Lede, Reveal, Rows, Title} from '@/components/site/UI';
import {DisplayHeadline} from '@/components/site/DisplayHeadline';

export const metadata: Metadata = {
  title: 'About',
  description:
    'CTRL Room is not an Instagram page. Five stages built in order: attention, community, partnerships, events, leads. Plus the guardrails we will not break.',
};

const STAGES = [
  {n: '01', title: 'Attention', body: 'Get people to follow CTRL Room. Do not monetise yet.', meta: 'M1–3'},
  {n: '02', title: 'Community', body: 'Launch CTRL Room Membership, discounts and exclusive access, and the consented database begins.', meta: 'M4–6'},
  {n: '03', title: 'Partnerships', body: 'A two-sided marketplace: consumers get value, businesses get customers.', meta: 'M7–9'},
  {n: '04', title: 'Events', body: 'Build an event ecosystem that earns the CTRL Room name.', meta: 'M10–12'},
  {n: '05', title: 'Leads', body: 'Sell qualified, consented leads, the highest-value stage, and the one trust pays for.', meta: 'M10–12'},
];

const GUARDRAILS = [
  {n: '01', title: 'Do not monetise too early', body: 'Audience, then trust, then habit, then community, then transactions, then monetisation. Not audience → sell.'},
  {n: '02', title: 'Do not sell raw data', body: 'Sell qualified, consented leads. Trust is part of the business model, not an afterthought bolted on later.'},
  {n: '03', title: 'Do not rank without a methodology', body: '“Best companies to work for” needs a defined index, or it invites “based on what?”'},
  {n: '04', title: 'Do not sponsor things because they are cool', body: 'Every event must earn its place: users, exposure, database growth, revenue, or relationships.'},
];

export default function AboutPage() {
  return (
    <>
      <Masthead
        title={<>Not an Instagram page. <span className="accent">A front door.</span></>}
        lede="Don’t start by asking “what can I post?” - start by asking what information would make a Jordanian check CTRL Room every day. Everything else follows from the answer."
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
                  The moat
                </span>
              </div>
              <div className="lg:col-span-8">
                <p
                  className="text-[clamp(1.3rem,2.8vw,1.95rem)] font-bold leading-[1.28] tracking-headline"
                  style={{color: 'var(--fg)'}}
                >
                  Instagram could change its algorithm tomorrow. A CTRL Room
                  member database is an asset{' '}
                  <span className="accent">Instagram can never take away</span>.
                </p>
              </div>
            </div>
          </Reveal>
        </Wrap>
      </Act>

      <Act act="light">
        <Wrap>
          <div className="max-w-[46rem]">
            <DisplayHeadline className="text-[clamp(2rem,4.8vw,3.4rem)] leading-[1.05]">
              Five stages, built in order.
            </DisplayHeadline>
            <Lede className="mt-6">
              Each stage is a prerequisite for the next. Monetising early kills
              the trust the later stages depend on. Each phase is a
              checkpoint, not a deadline.
            </Lede>
          </div>
          <div className="mt-[var(--gap-block)]">
            <Rows items={STAGES} numbered />
          </div>
        </Wrap>
      </Act>

      <Act act="light" className="!pt-0">
        <Wrap>
          <div className="max-w-[46rem]">
            <DisplayHeadline className="text-[clamp(2rem,4.8vw,3.4rem)] leading-[1.05]">
              Principles we won&rsquo;t break.
            </DisplayHeadline>
          </div>
          <div className="mt-[var(--gap-block)]">
            <Rows items={GUARDRAILS} />
          </div>
        </Wrap>
      </Act>

      <Act act="dark">
        <Wrap>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <DisplayHeadline className="text-[clamp(1.9rem,4vw,2.8rem)] leading-[1.05]">
                A category of one.
              </DisplayHeadline>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <Lede>
                Lifestyle pages have reach but no structure and no owned data.
                Discount apps have offers but no reason to open them daily.
                Agencies sell services, not an audience. CTRL Room is the only
                one combining a daily content habit, an owned membership and
                multiple compounding revenue lines.
              </Lede>
              <div className="mt-10 flex flex-wrap gap-4">
                <Action href="/membership#join">Join the room</Action>
                <Action href="/business" tone="ghost">
                  Partner with us
                </Action>
              </div>
            </div>
          </div>
        </Wrap>
      </Act>
    </>
  );
}
