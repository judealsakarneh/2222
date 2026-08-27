import {CardPreview} from '@/components/CardPreview';
import {Footer} from '@/components/Footer';
import {Hero} from '@/components/Hero';
import {HowItWorks} from '@/components/HowItWorks';
import {Marquee} from '@/components/Marquee';
import {Nav} from '@/components/Nav';
import {Rewards} from '@/components/Rewards';
import {Statement} from '@/components/Statement';

/**
 * Show the object, prove the network is real, state the idea, explain it, let
 * the reader handle it, say what it is worth, get out of the way.
 *
 * The marquee sits immediately after the hero for one reason: the first
 * question a loyalty card raises is "where can I actually use this", and
 * answering it before the pitch buys attention for everything after.
 */
export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Statement />
        <HowItWorks />
        <CardPreview />
        <Rewards />
      </main>
      <Footer />
    </>
  );
}
