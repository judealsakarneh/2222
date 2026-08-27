/**
 * Single-file preview entry.
 *
 * Renders exactly the same components the Next app renders — no forks, no
 * simplified copies — into one bundle that can be inlined in a standalone HTML
 * page. The only thing Next was providing that this has to replace is the font
 * variable, which the host page sets on :root.
 *
 * Kept out of the Next build by tsconfig/tailwind globs pointing at app/ and
 * components/ only, so this file can never affect the real site.
 */
import {createRoot} from 'react-dom/client';
import {CardPreview} from '../components/CardPreview';
import {Footer} from '../components/Footer';
import {Hero} from '../components/Hero';
import {HowItWorks} from '../components/HowItWorks';
import {Marquee} from '../components/Marquee';
import {Nav} from '../components/Nav';
import {Rewards} from '../components/Rewards';
import {Statement} from '../components/Statement';

function Site() {
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

createRoot(document.getElementById('root')!).render(<Site />);
