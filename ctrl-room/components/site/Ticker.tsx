import {Signal} from './Marks';

/** Placeholder feed items, replace with the live editorial feed. */
const FEED = [
  'New café opened in Jabal Amman',
  '3 events this weekend in Amman',
  '7 companies hiring in Jordan right now',
  'CTRL Picks - Aqaba, updated',
  'Workplace Index methodology published',
  'CTRL Nights returns next month',
  'Weekend trip routes worth driving',
];

/**
 * The live strip. The brand is named after a room where information is
 * monitored, so the page carries a feed, this is the motif made literal, and
 * it is the one piece of ambient motion the design allows itself.
 *
 * The track holds the list twice and translates exactly -50%, so the second
 * copy sits where the first was when the loop restarts. Any other distance
 * shows a jump. Pure CSS, so it keeps moving while the main thread is busy -
 * which is precisely when a JS-driven ticker starts to stutter.
 */
export function Ticker() {
  const strip = (
    <ul className="flex shrink-0 items-center">
      {FEED.map((item) => (
        <li key={item} className="flex items-center gap-5 whitespace-nowrap pr-5">
          <Signal size={5} className="accent" live={false} />
          <span className="label" style={{color: 'var(--fg-2)'}}>
            {item}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className="relative overflow-hidden border-y py-3.5"
      style={{borderColor: 'var(--line)'}}
      aria-label="What's happening now"
    >
      <div className="ticker-mask overflow-hidden">
        <div className="flex w-max animate-ticker motion-reduce:animate-none">
          {strip}
          <div aria-hidden="true" className="flex">
            {strip}
          </div>
        </div>
      </div>
    </div>
  );
}
