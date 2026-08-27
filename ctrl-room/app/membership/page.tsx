import type {Metadata} from 'next';
import {CardStage} from '@/components/card/CardStage';
import {Act, Wrap} from '@/components/site/Act';
import {Masthead} from '@/components/site/Masthead';
import {Action, Lede, Reveal, Rows, Title} from '@/components/site/UI';
import {DisplayHeadline} from '@/components/site/DisplayHeadline';

export const metadata: Metadata = {
  title: 'Membership',
  description:
    'CTRL Room Membership: discounts at restaurants, cafés, gyms and hotels, member-only events, early access and partner experiences across Jordan.',
};

const PERKS = [
  {n: '01', title: 'Restaurants & cafés', body: 'Standing discounts at partner venues across Amman, Aqaba and beyond, applied at the table, not claimed through an app.'},
  {n: '02', title: 'Gyms & activities', body: 'Member rates on memberships, classes, courts and studios with partners across the country.'},
  {n: '03', title: 'Hotels & shopping', body: 'Weekend rates, retail offers and seasonal partner promotions reserved for members.'},
  {n: '04', title: 'Member-only events', body: 'CTRL Nights, Sessions and Experiences, with tickets released to members before anyone else.'},
  {n: '05', title: 'Early access & giveaways', body: 'New openings, limited tables, launches and partner drops, first.'},
];

export default function MembershipPage() {
  return (
    <>
      <Masthead
        title={<>One card. <span className="accent">Every room.</span></>}
        lede="CTRL Room Membership turns a following into a network: real discounts and real access at partner venues across Jordan, with one membership behind all of them."
      />

      <Act act="dark" className="!pt-[var(--gap-block)]">
        <Wrap>
          <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <CardStage
                className="mx-auto w-full max-w-[470px] lg:max-w-none"
                scrollTurn={20}
                member="0142"
              />
              <p className="label mt-8 text-center lg:text-left" style={{color: 'var(--fg-3)'}}>
                Drag to turn the card
              </p>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <DisplayHeadline className="text-[clamp(1.9rem,4.2vw,2.9rem)] leading-[1.05]">
                Show it, or don&rsquo;t. It still works.
              </DisplayHeadline>
              <Lede className="mt-6">
                Membership is tied to you, not to a piece of plastic. The card is
                the physical version, the discount applies whether you hand it
                over or just give your name.
              </Lede>
            </div>
          </div>
        </Wrap>
      </Act>

      <Act act="light">
        <Wrap>
          <div className="max-w-[46rem]">
            <DisplayHeadline className="text-[clamp(2rem,4.8vw,3.4rem)] leading-[1.05]">
              Discounts, access, and the things that sell out.
            </DisplayHeadline>
          </div>
          <div className="mt-[var(--gap-block)]">
            <Rows items={PERKS} />
          </div>
        </Wrap>
      </Act>

      <Act act="light" className="!pt-0">
        <Wrap>
          <Reveal>
            <div className="grid gap-10 border-t pt-[var(--gap-block)] lg:grid-cols-12" style={{borderColor: 'var(--line)'}}>
              <div className="lg:col-span-5">
                <DisplayHeadline className="text-[clamp(1.8rem,3.8vw,2.6rem)] leading-[1.05]">
                  Your data is the deal, so we say what happens to it.
                </DisplayHeadline>
              </div>
              <div className="lg:col-span-6 lg:col-start-7">
                <Lede>
                  Joining means giving us your email, phone, city and the
                  categories you care about, with clear consent, from the first
                  member. That database is the business, which is exactly why we
                  will not sell raw data. Businesses can compete for members who
                  have volunteered real intent; nobody buys a list.
                </Lede>
              </div>
            </div>
          </Reveal>
        </Wrap>
      </Act>

      <Act act="dark" id="join">
        <Wrap>
          <div className="max-w-[34rem]">
            <DisplayHeadline className="text-[clamp(2.1rem,5.4vw,3.6rem)] leading-[1.05]">
              Membership opens with the first partner wave.
            </DisplayHeadline>
            <Lede className="mt-6">
              Leave your details and you&rsquo;ll be in the first group through
              the door, before public launch.
            </Lede>
            {/* Placeholder, wire to the real list provider before launch. */}
            <form className="mt-10 flex max-w-[30rem] flex-col gap-3 sm:flex-row">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="you@email.com"
                className="min-w-0 flex-1 bg-transparent px-4 py-4 text-[15px] outline-none transition-colors duration-300"
                style={{border: '1px solid var(--line-strong)', color: 'var(--fg)'}}
              />
              <button
                type="submit"
                className="label px-6 py-4"
                style={{background: 'var(--accent)', color: 'var(--on-accent)'}}
              >
                Request access
              </button>
            </form>
            <p className="label mt-5" style={{color: 'var(--fg-3)'}}>
              No spam. Unsubscribe any time.
            </p>
            <div className="mt-12">
              <Action href="/business" tone="ghost">
                Run a venue? Partner with us
              </Action>
            </div>
          </div>
        </Wrap>
      </Act>
    </>
  );
}
