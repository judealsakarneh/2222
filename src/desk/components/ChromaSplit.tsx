import React from 'react';

/**
 * Chromatic aberration, done properly.
 *
 * The subtree is rendered twice through feColorMatrix channel isolators — red
 * only and cyan only — offset in opposite directions and recombined with
 * `mix-blend-mode: screen`. Screen of red-only over cyan-only is a lossless
 * reconstruction at zero offset, so the effect disappears cleanly rather than
 * leaving a colour cast when it winds down.
 *
 * Two copies, not three: the "normal" layer would be redundant.
 *
 * At `amount <= 0.05` it renders the children exactly once, so it costs nothing
 * outside the handful of frames a swipe is actually happening.
 */
export const ChromaSplit: React.FC<{
  amount: number;
  children: React.ReactNode;
}> = ({amount, children}) => {
  if (amount <= 0.05) {
    return <>{children}</>;
  }

  const wrap = (filter: string, dx: number): React.CSSProperties => ({
    position: 'absolute',
    inset: 0,
    filter,
    transform: `translate3d(${dx}px, 0, 0)`,
    mixBlendMode: 'screen',
    willChange: 'transform',
  });

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id="dk-red">
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0"
          />
        </filter>
        <filter id="dk-cyan">
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 1 0"
          />
        </filter>
      </svg>
      <div style={wrap('url(#dk-red)', -amount)}>{children}</div>
      <div style={wrap('url(#dk-cyan)', amount)}>{children}</div>
    </div>
  );
};
