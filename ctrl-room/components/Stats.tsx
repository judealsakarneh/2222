import {Reveal} from './Reveal';

/**
 * Placeholder figures — swap for real ones before launch.
 * Kept to three: a fourth turns a confident claim into a dashboard.
 */
const STATS = [
  {value: '3.2M', label: 'Taps logged', note: 'across the network' },
  {value: '240+', label: 'Rooms', note: 'carrying the card' },
  {value: '92%', label: 'Come back', note: 'within 30 days' },
];

/**
 * The readout strip under the hero.
 *
 * Numerals are set in the mono face with tabular figures, which is what makes
 * three unequal-length numbers sit on a shared optical baseline. In a
 * proportional face "3.2M" and "240+" have different digit widths and the row
 * looks accidental.
 */
export function Stats({className = ''}: {className?: string}) {
  return (
    <div className={`grid grid-cols-3 gap-2 sm:gap-3 ${className}`}>
      {STATS.map((s, i) => (
        <Reveal key={s.label} delay={0.06 * i}>
          <div className="glass h-full rounded-2xl px-4 py-5 sm:px-6 sm:py-6">
            <div className="nums font-mono text-[clamp(1.5rem,4.4vw,2.15rem)] font-medium leading-none tracking-tight text-white">
              {s.value}
            </div>
            <div className="mt-3 text-[12.5px] font-medium tracking-tight text-white/80 sm:text-[13.5px]">
              {s.label}
            </div>
            <div className="mt-1 hidden text-[12px] leading-snug text-chalk-35 sm:block">
              {s.note}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
