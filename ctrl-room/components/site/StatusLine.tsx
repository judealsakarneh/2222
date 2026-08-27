'use client';

import {useEffect, useState} from 'react';
import {Signal} from './Marks';

/**
 * A live clock on Amman time.
 *
 * This is what sits where a landing page would normally put a rounded pill
 * badge above the headline. It carries the same weight in the layout and it
 * means something: the brand is a room where information is monitored, and the
 * first thing a monitoring room shows is the time.
 *
 * Rendered empty on the server and filled after mount — the server has no idea
 * what time it is where the reader is, and a hydration mismatch on the first
 * line of the page is not worth the half-second.
 */
export function StatusLine({place = 'Amman'}: {place?: string}) {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setNow(
        new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Amman',
        }).format(new Date())
      );
    tick();
    const id = setInterval(tick, 20_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="flex items-center gap-3.5 border-t pt-4"
      style={{borderColor: 'var(--line)'}}
    >
      <Signal size={6} className="accent" />
      <span className="label" style={{color: 'var(--fg-2)'}}>
        Live
      </span>
      <span className="label" style={{color: 'var(--fg-3)'}}>
        {place}
      </span>
      <span className="label nums" style={{color: 'var(--fg-3)', minWidth: '4ch'}}>
        {now ?? ' '}
      </span>
    </div>
  );
}
