import {CardStage} from '@/components/card/CardStage';
import {Act, Wrap} from '@/components/site/Act';
import {StatusLine} from '@/components/site/StatusLine';
import {Ticker} from '@/components/site/Ticker';
import {Action, Eyebrow, Lede, Reveal, Rows, Stat, Title} from '@/components/site/UI';

const ENGINES = [
  {n: '01', title: 'Media', body: "What's happening and what's trending in Jordan right now."},
  {n: '02', title: 'Discovery', body: 'Places, experiences, events, careers and opportunities.'},
  {n: '03', title: 'Community', body: 'Members, discounts, exclusive access and events.'},
  {n: '04', title: 'Commerce', body: 'Partnerships, transactions, leads, sponsorships and business services.'},
];

const PILLARS = [
  {n: '01', title: "What's Trending", body: 'Instagram and TikTok trends, viral conversations, new businesses and products.'},
  {n: '02', title: 'CTRL Picks', body: 'Restaurants, cafés, hidden places, weekend trips — Amman, Aqaba and beyond.'},
  {n: '03', title: 'Career Room', body: 'Companies hiring, salary insights, startups, workplace culture, LinkedIn trends.'},
  {n: '04', title: "What's On", body: 'Events, concerts, exhibitions, pop-ups, networking, sports, festivals.'},
  {n: '05', title: 'CTRL Intelligence', body: "Why everyone's talking about X — the things worth knowing this week."},
];

export default function Home() {
  return (
    <>
      {/* ACT I — dark. The masthead. */}
      <Act act="dark" className="grain !pb-0 pt-[132px] sm:pt-[150px]">
        <Wrap>
          <div className="grid items-end gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <StatusLine />
              <Title
                as="h1"
                className="mt-9 text-[clamp(2.9rem,8vw,5.4rem)]"
              >
                Jordan,
                <br />
                <span className="accent">switched on</span>.
              </Title>
              <Lede className="mt-9">
                CTRL Room is Jordan&rsquo;s discovery, community and commerce
                platform — what&rsquo;s happening, where to go, who&rsquo;s
                hiring, and the membership that gets you in.
              </Lede>
              <div className="mt-11 flex flex-wrap gap-4">
                <Action href="/membership#join">Join the room</Action>
                <Action href="/business" tone="ghost">
                  CTRL Room for Business
                </Action>
              </div>
            </div>

            <div className="lg:col-span-5">
              <CardStage className="mx-auto w-full max-w-[430px] lg:max-w-none" />
              <p className="label mt-8 text-center lg:text-left" style={{color: 'var(--fg-3)'}}>
                Drag the card · it turns as you scroll
              </p>
            </div>
          </div>
        </Wrap>

        <div className="mt-[var(--gap-act)]">
          <Ticker />
        </div>
      </Act>

      {/* ACT I continued — the market case. */}
      <Act act="dark">
        <Wrap>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Eyebrow index="01">The opportunity</Eyebrow>
              <Title className="mt-7 text-[clamp(2rem,4.4vw,3.1rem)]">
                Young, mobile, and already scrolling.
              </Title>
              <Lede className="mt-6">
                Youth unemployment sits at 38.9% and digital ad costs run 50–70%
                below Gulf markets. Jordan is an unusually cheap, unusually
                young, unusually online market to build an owned audience in —
                before the regional platforms saturate it.
              </Lede>
            </div>
            <div className="grid gap-10 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
              <Stat value="11.6M" label="Population, 2026 — median age 24.9" source="Worldometer" />
              <Stat value="92.5%" label="Internet penetration — 10.7M users" source="DataReportal" />
              <Stat value="6.8M" label="Social media users — 59% of the population" source="DataReportal" />
              <Stat value="$66M→$100M" label="Social ad spend, 2025 to 2029 (+10.9% CAGR)" source="Statista" />
            </div>
          </div>
        </Wrap>
      </Act>

      {/* ACT II — light. The ground has been warming through the section above. */}
      <Act act="light">
        <Wrap>
          <div className="max-w-[46rem]">
            <Eyebrow index="02">The model</Eyebrow>
            <Title className="mt-7 text-[clamp(2rem,4.8vw,3.4rem)]">
              Four engines, not one Instagram page.
            </Title>
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

      <Act act="light" className="!pt-0">
        <Wrap>
          <div className="max-w-[46rem]">
            <Eyebrow index="03">Content</Eyebrow>
            <Title className="mt-7 text-[clamp(2rem,4.8vw,3.4rem)]">
              Five pillars that build a daily habit.
            </Title>
            <Lede className="mt-6">
              Together these turn CTRL Room from an account you follow into a
              media brand you check.
            </Lede>
          </div>
          <div className="mt-[var(--gap-block)]">
            <Rows items={PILLARS} />
          </div>
        </Wrap>
      </Act>

      {/* ACT III — back to dark for the membership. */}
      <Act act="dark">
        <Wrap>
          <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-12">
            <div className="order-2 lg:order-1 lg:col-span-6">
              <CardStage
                className="mx-auto w-full max-w-[460px] lg:max-w-none"
                restY={9}
                scrollTurn={22}
                member="0142"
              />
            </div>
            <div className="order-1 lg:order-2 lg:col-span-5 lg:col-start-8">
              <Eyebrow index="04">Membership</Eyebrow>
              <Title className="mt-7 text-[clamp(2rem,4.6vw,3.2rem)]">
                From followers to a network.
              </Title>
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
              <Title className="max-w-[20ch] text-[clamp(1.9rem,5.2vw,3.6rem)]">
                Businesses won&rsquo;t ask{' '}
                <span style={{color: 'var(--fg-3)'}}>&ldquo;can you post about us?&rdquo;</span>{' '}
                They&rsquo;ll ask{' '}
                <span className="accent">&ldquo;how do we get access?&rdquo;</span>
              </Title>
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
