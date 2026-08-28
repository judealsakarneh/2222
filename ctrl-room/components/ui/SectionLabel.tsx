/**
 * The eyebrow. A teal square, a number, and a word in wide caps. It is the
 * only place a section announces itself, which is what lets the headlines
 * stay silent about what they are.
 */
export function SectionLabel({
  n,
  children,
  className = '',
}: {
  n?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="h-[6px] w-[6px] shrink-0 bg-a" aria-hidden />
      {n ? (
        <span className="font-mono text-[10px] tracking-[0.14em] t-3">{n}</span>
      ) : null}
      <span className="text-[10px] font-medium uppercase tracking-[0.2em] t-a">
        {children}
      </span>
    </div>
  );
}

/** A full-bleed hairline. One value, used everywhere a rule is needed. */
export function Rule({className = ''}: {className?: string}) {
  return <div className={`h-px w-full ${className}`} style={{background: 'var(--g-line)'}} aria-hidden />;
}
