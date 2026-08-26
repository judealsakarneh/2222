import {CardPreview} from '@/components/CardPreview';
import {Footer} from '@/components/Footer';
import {Hero} from '@/components/Hero';
import {HowItWorks} from '@/components/HowItWorks';
import {Nav} from '@/components/Nav';
import {Rewards} from '@/components/Rewards';

/**
 * Five movements, in the order the brief sets them: show the object, explain
 * it, let the reader handle it, say what it is worth, then get out of the way.
 */
export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <CardPreview />
        <Rewards />
      </main>
      <Footer />
    </>
  );
}
