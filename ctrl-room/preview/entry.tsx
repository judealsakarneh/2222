/**
 * Single-file preview entry.
 *
 * Renders the same page components the Next app renders — no forks, no
 * simplified copies. Next supplies two things a standalone file does not have:
 * the font variables (set by hand on :root in the host page) and the router,
 * which the shim in ./shim replaces so all six routes work inside one file.
 */
import {createRoot} from 'react-dom/client';
import {Footer} from '../components/footer/Footer';
import {Nav} from '../components/navigation/Nav';
import {usePathname} from './shim/router';

import Home from '../app/page';
import Membership from '../app/membership/page';
import Business from '../app/business/page';
import Events from '../app/events/page';
import WorkplaceIndex from '../app/workplace-index/page';
import About from '../app/about/page';

const ROUTES: Record<string, () => JSX.Element> = {
  '/': Home,
  '/membership': Membership,
  '/business': Business,
  '/events': Events,
  '/workplace-index': WorkplaceIndex,
  '/about': About,
};

function Site() {
  const path = usePathname();
  const Page = ROUTES[path] ?? Home;
  return (
    <>
      <Nav />
      {/* Keyed so a route change remounts the page and every scroll-driven
          value re-measures against the new document. */}
      <main className="relative" key={path}>
        <Page />
      </main>
      <Footer />
    </>
  );
}

createRoot(document.getElementById('root')!).render(<Site />);
