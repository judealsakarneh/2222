import {CardStage} from '@/components/card/CardStage';
import {Act, Wrap} from '@/components/site/Act';
import {Featured, Lists} from '@/components/site/Photo';
import {StatusLine} from '@/components/site/StatusLine';
import {Ticker} from '@/components/site/Ticker';
import {Action, Lede, Reveal, Rows, Stat, Title} from '@/components/site/UI';
import {DisplayHeadline} from '@/components/site/DisplayHeadline';

const ENGINES = [
  {n: '01', title: 'Media', body: "What's happening and what's trending in Jordan right now."},
  {n: '02', title: 'Discovery', body: 'Places, experiences, events, careers and opportunities.'},
  {n: '03', title: 'Community', body: 'Members, discounts, exclusive access and events.'},
  {n: '04', title: 'Commerce', body: 'Partnerships, transactions, leads, sponsorships and business services.'},
];

const PILLARS = [
  {n: '01', title: "What's Trending", body: 'Instagram and TikTok trends, viral conversations, new businesses and products.'},
  {n: '02', title: 'CTRL Picks', body: 'Restaurants, cafés, hidden places, weekend trips - Amman, Aqaba and beyond.'},
  {n: '03', title: 'Career Room', body: 'Companies hiring, salary insights, startups, workplace culture, LinkedIn trends.'},
  {n: '04', title: "What's On", body: 'Events, concerts, exhibitions, pop-ups, networking, sports, festivals.'},
  {n: '05', title: 'CTRL Intelligence', body: "Why everyone's talking about X - the things worth knowing this week."},
];


// Nightlife carries the band above, so it is deliberately absent here: the
// same photograph twice in one screenful reads as a thin library.
const LISTS = [
  {src: '/img/restaurant.webp', title: 'Dinner, when it matters', count: '22 places', href: '/membership'},
  {src: '/img/cafe.webp', title: 'Coffee worth the drive', count: '18 places', href: '/membership'},
  {src: '/img/food.webp', title: 'Mezze done properly', count: '11 places', href: '/membership'},
];

export default function Home() {
  return (
    <>
      {/* ACT I - dark. The masthead. */}
      <Act act="dark" className="!pb-0 pt-[132px] sm:pt-[150px]">
        <Wrap>
          <div className="grid items-center gap-20 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <StatusLine />
              <div className="mt-8">
                <DisplayHeadline
                  as="h1"
                  className="text-[clamp(2.9rem,7.6vw,5.5rem)] leading-[0.98]"
                  from={90}
                  to={112}
                >
                  Jordan,
                  <br />
                  <span className="accent">switched on.</span>
                </DisplayHeadline>
              </div>
              <Lede className="mt-10">
                Where to go, what is on this weekend, who is hiring, and the
                membership that gets you in.
              </Lede>
              <div className="mt-14 flex flex-wrap gap-4">
                <Action href="/membership#join">Join the room</Action>
                <Action href="/business" tone="ghost">
                  CTRL Room for Business
                </Action>
              </div>
            </div>

            <div className="lg:col-span-5">
              <CardStage className="mx-auto w-full max-w-[430px] lg:max-w-none" />
              <p className="label mt-6 text-center lg:text-left" style={{color: 'var(--fg-3)'}}>
                Drag the card. It turns as you scroll.
              </p>
            </div>
          </div>
        </Wrap>

        <div className="mt-[var(--gap-act)]">
          <Ticker />
        </div>
      </Act>

      {/* ACT I continued, the market case. */}
      <Act act="dark">
        <Wrap>
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <DisplayHeadline className="text-[clamp(1.9rem,4vw,2.9rem)] leading-[1.05]">
                Young, mobile, and already scrolling.
              </DisplayHeadline>
              <Lede className="mt-6">
                Youth unemployment sits at 38.9% and digital ad costs run 50–70%
                below Gulf markets. Jordan is an unusually cheap, unusually
                young, unusually online market to build an owned audience in -
                before the regional platforms saturate it.
              </Lede>
            </div>
            <div className="grid gap-x-12 gap-y-14 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
              <Stat value="11.6M" label="Population, 2026 - median age 24.9" source="Worldometer" />
              <Stat value="92.5%" label="Internet penetration - 10.7M users" source="DataReportal" />
              <Stat value="6.8M" label="Social media users - 59% of the population" source="DataReportal" />
              <Stat value="$66M→$100M" label="Social ad spend, 2025 to 2029 (+10.9% CAGR)" source="Statista" />
            </div>
          </div>
        </Wrap>
      </Act>

      {/* ACT II - light. The ground has been warming through the section above. */}
      <Act act="dark">
        <Wrap>
          <div className="max-w-[46rem]">
            <DisplayHeadline className="text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.04]">
              Four engines, not one Instagram page.
            </DisplayHeadline>
            <Lede className="mt-6">
              Instagram is the distribution channel. CTRL Room is the company
              built underneath it.
            </Lede>
          </div>
          <div className="mt-[var(--gap-block)]">
            <Rows items={ENGINES} />
          </div>
        </Wrap>
      </Act>

      {/* Asymmetric split, deliberately unlike the section above it: the
          heading holds still in a narrow column while the pillars run past it.
          Two ledger sections stacked with the same intro-then-rows shape read
          as one long template, which is the loudest tell a page is generated. */}
      <Act act="dark" className="!pt-0">
        <Wrap>
          <div className="grid gap-x-16 gap-y-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-[132px]">
                <DisplayHeadline className="text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.04]">
                  Five pillars that build a daily habit.
                </DisplayHeadline>
                <Lede className="mt-6">
                  Together these turn CTRL Room from an account you follow into
                  a media brand you check.
                </Lede>
              </div>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <Rows items={PILLARS} />
            </div>
          </div>
        </Wrap>
      </Act>

      {/* A full-width media band. After two ledger sections the page needs a
          change of register, and this is the archetype that resets rhythm. */}
      <Act act="dark">
        <Wrap>
          <Featured
            src="/img/nightlife.webp"
            eyebrow="Featured"
            title="Late nights. Good people. Real energy."
            body="The city fills up after ten. We keep track of where, so you are not guessing on a Thursday."
            href="/events"
            cta="Explore tonight"
          />
          <div className="mt-[var(--gap-block)]">
            <Lists items={LISTS} href="/membership" />
          </div>
        </Wrap>
      </Act>

      {/* ACT III - back to dark for the membership. */}
      <Act act="dark">
        <Wrap>
          <div className="grid items-center gap-20 lg:grid-cols-12 lg:gap-16">
            <div className="order-2 lg:order-1 lg:col-span-6">
              <CardStage
                className="mx-auto w-full max-w-[460px] lg:max-w-none"
                restY={9}
                scrollTurn={22}
                member="0142"
              />
            </div>
            <div className="order-1 lg:order-2 lg:col-span-5 lg:col-start-8">
              <DisplayHeadline className="text-[clamp(1.9rem,4.2vw,3rem)] leading-[1.05]">
                From followers to a network.
              </DisplayHeadline>
              <Lede className="mt-6">
                Discounts at restaurants, cafés, gyms and hotels. Member-only
                events, early access and giveaways. One card, one membership,
                across every partner in the room.
              </Lede>
              <div className="mt-10">
                <Action href="/membership#join">Join the room</Action>
              </div>
            </div>
          </div>
        </Wrap>
      </Act>

      {/* Closing statement. */}
      <Act act="dark" className="!pt-0">
        <Wrap>
          <Reveal>
            <div className="border-t pt-[var(--gap-block)]" style={{borderColor: 'var(--line)'}}>
              <DisplayHeadline className="max-w-[20ch] text-[clamp(1.9rem,4.8vw,3.4rem)] leading-[1.04]">
                Businesses won&rsquo;t ask{' '}
                <span style={{color: 'var(--fg-3)'}}>&ldquo;can you post about us?&rdquo;</span>{' '}
                They&rsquo;ll ask{' '}
                <span className="accent">&ldquo;how do we get access?&rdquo;</span>
              </DisplayHeadline>
              <div className="mt-11 flex flex-wrap gap-4">
                <Action href="/business">Partner with CTRL Room</Action>
                <Action href="/about" tone="ghost">
                  Read the strategy
                </Action>
              </div>
            </div>
          </Reveal>
        </Wrap>
      </Act>
    </>
  );
}
