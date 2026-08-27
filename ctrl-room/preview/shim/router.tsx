/**
 * A ~40-line router for the standalone bundle.
 *
 * The real site is six Next routes. A single inlined HTML file has no server
 * and no Next router, so this stands in for both: one module-level store holds
 * the current path, the Link shim writes to it, and usePathname reads it. That
 * makes the one-file preview a genuinely navigable six-page site rather than a
 * screenshot of the home page.
 *
 * It also drives the History API, so the phone's back gesture works.
 */
import {useEffect, useState, type AnchorHTMLAttributes, type ReactNode} from 'react';

type Fn = (p: string) => void;
const subs = new Set<Fn>();
let current = '/';

export function navigate(to: string, push = true) {
  const [path, hash] = to.split('#');
  const next = path || '/';
  if (next !== current) {
    current = next;
    subs.forEach((f) => f(current));
  }
  if (push) history.pushState({p: current}, '', `#${current}${hash ? `#${hash}` : ''}`);
  // Let the new page paint before jumping to an anchor within it.
  requestAnimationFrame(() => {
    const el = hash && document.getElementById(hash);
    if (el) el.scrollIntoView({behavior: 'smooth'});
    else window.scrollTo({top: 0, behavior: 'instant' as ScrollBehavior});
  });
}

export function usePathname() {
  const [p, setP] = useState(current);
  useEffect(() => {
    subs.add(setP);
    const onPop = () => {
      const raw = location.hash.replace(/^#/, '') || '/';
      navigate(raw, false);
    };
    window.addEventListener('popstate', onPop);
    return () => {
      subs.delete(setP);
      window.removeEventListener('popstate', onPop);
    };
  }, []);
  return p;
}

export default function Link({
  href,
  children,
  ...rest
}: {href: string; children: ReactNode} & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const external = /^(https?:|mailto:|tel:)/.test(href);
  return (
    <a
      href={external ? href : `#${href}`}
      onClick={(e) => {
        if (external) return;
        e.preventDefault();
        navigate(href);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
