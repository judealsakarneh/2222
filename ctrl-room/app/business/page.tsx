import type {Metadata} from 'next';
import {Act, Wrap} from '@/components/site/Act';
import {Masthead} from '@/components/site/Masthead';
import {Action, Eyebrow, Lede, Reveal, Rows, Title} from '@/components/site/UI';

export const metadata: Metadata = {
  title: 'For Business',
  description:
    'CTRL Room for Business — featured placement, sponsored content, member-only offers, qualified lead generation, recruitment and employer branding across Jordan.',
};

const PRODUCTS = [
  {n: '01', title: 'Featured placement', body: 'Your venue or product in "Featured this week", in front of an audience already looking for somewhere to go.', meta: 'Reach'},
  {n: '02', title: 'Sponsored content', body: 'A "presented by" slot inside the editorial formats people already open — not a post that reads like an ad.', meta: 'Reach'},
  {n: '03', title: 'Exclusive offers', body: 'A member-only deal that brings you incremental customers instead of discounting the ones you already had.', meta: 'Traffic'},
  {n: '04', title: 'Lead generation', body: 'Pay for qualified, consented customers who have signalled real intent in your category.', meta: 'Leads'},
  {n: '05', title: 'Recruitment', body: 'Promote open roles into the Career Room pillar, in front of Jordanian talent that is already reading it.', meta: 'Hiring'},
  {n: '06', title: 'Employer branding', body: 'Show what working at your company is actually like, to the people deciding where to apply.', meta: 'Hiring'},
  {n: '07', title: 'Event promotion', body: 'Put your event in front of the audience that plans its week around What’s On.', meta: 'Events'},
  {n: '08', title: 'Market insights', body: 'Aggregated, anonymised consumer trends from the network — what Jordan is actually doing.', meta: 'Data'},
];

export default function BusinessPage() {
  return (
    <>
      <Masthead
        kicker="CTRL Room for Business"
        title={<>Bring customers, <span className="accent">not favours</span>.</>}
        lede="A two-sided marketplace, not a favour economy. Consumers get real discounts and experiences, businesses get incremental sales, and CTRL Room gets paid for delivering the match."
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
                  Worked example
                </span>
              </div>
              <div className="lg:col-span-8">
                <p
                  className="text-[clamp(1.3rem,2.8vw,1.95rem)] font-bold leading-[1.28] tracking-headline"
                  style={{color: 'var(--fg)'}}
                >
                  A restaurant offers members 20% off. CTRL Room brings paying
                  customers. The restaurant gets sales it would not otherwise
                  have had —{' '}
                  <span className="accent">
                    a completely different conversation
                  </span>{' '}
                  than &ldquo;give us a free meal so we can post about you&rdquo;.
                </p>
              </div>
            </div>
          </Reveal>
        </Wrap>
      </Act>

      <Act act="light">
        <Wrap>
          <div className="max-w-[46rem]">
            <Eyebrow index="01">What you can buy</Eyebrow>
            <Title className="mt-7 text-[clamp(2rem,4.8vw,3.4rem)]">
              Eight ways into the room.
            </Title>
            <Lede className="mt-6">
              B2C builds the audience. B2B monetises it — that combination is
              where the economics get interesting.
            </Lede>
          </div>
          <div className="mt-[var(--gap-block)]">
            <Rows items={PRODUCTS} />
          </div>
        </Wrap>
      </Act>

      <Act act="light" className="!pt-0">
        <Wrap>
          <div
            className="grid gap-10 border-t pt-[var(--gap-block)] lg:grid-cols-12"
            style={{borderColor: 'var(--line)'}}
          >
            <div className="lg:col-span-5">
              <Title className="text-[clamp(1.8rem,3.8vw,2.6rem)]">
                How a partnership is priced.
              </Title>
            </div>
            <ul className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
              {[
                'Fixed partnership fee',
                'Commission per transaction',
                'Sponsored placement',
                'Featured content fee',
                'Membership revenue share',
              ].map((m) => (
                <li
                  key={m}
                  className="border-t pt-4 text-[15.5px]"
                  style={{borderColor: 'var(--line)', color: 'var(--fg-2)'}}
                >
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </Wrap>
      </Act>

      <Act act="dark">
        <Wrap>
          <div className="max-w-[36rem]">
            <Eyebrow index="02">Start a conversation</Eyebrow>
            <Title className="mt-7 text-[clamp(2.1rem,5.2vw,3.4rem)]">
              Tell us what a good customer looks like.
            </Title>
            <Lede className="mt-6">
              Partner conversations are opening now, ahead of the membership
              launch. Early partners set the categories.
            </Lede>
            <div className="mt-10 flex flex-wrap gap-4">
              <Action href="mailto:hello@ctrlroom.jo">Email the team</Action>
              <Action href="/events" tone="ghost">
                See the event formats
              </Action>
            </div>
          </div>
        </Wrap>
      </Act>
    </>
  );
}
