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
      <span className="h-[6px] w-[6px] shrink-0 bg-teal-lit" aria-hidden />
      {n ? (
        <span className="font-mono text-[10px] tracking-[0.14em] text-white/50">{n}</span>
      ) : null}
      <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-teal-lit">
        {children}
      </span>
    </div>
  );
}

/** A full-bleed hairline. One value, used everywhere a rule is needed. */
export function Rule({className = ''}: {className?: string}) {
  return <div className={`h-px w-full bg-white/[0.09] ${className}`} aria-hidden />;
}
