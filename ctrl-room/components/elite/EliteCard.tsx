'use client';

import {useRef, useState} from 'react';
import {motion} from 'framer-motion';
import {useReducedMotion} from '@/lib/useReducedMotion';

/**
 * The Elite card, built rather than photographed.
 *
 * NOTE: the CTRL Room loyalty card artwork was not supplied, so this is drawn
 * from the brand palette and the reference: near-black body, one teal mark,
 * a debossed wordmark, an NFC glyph. Swap in the real artwork when it exists;
 * the tilt and reflection wrap whatever sits inside.
 *
 * Two things move on hover, both driven by the same pointer position: the
 * card tilts a few degrees, and a specular band slides across it. The tilt
 * alone reads as a gimmick; the light moving with it is what makes it read as
 * a surface. Both are disabled under reduced motion and on coarse pointers.
 */
export function EliteCard() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [t, setT] = useState({rx: 0, ry: 0, mx: 50, my: 50, on: false});

  const move = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || reduce) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setT({rx: (0.5 - py) * 13, ry: (px - 0.5) * 17, mx: px * 100, my: py * 100, on: true});
  };

  return (
    <div className="[perspective:1400px]">
      <motion.div
        ref={ref}
        onMouseMove={move}
        onMouseLeave={() => setT({rx: 0, ry: 0, mx: 50, my: 50, on: false})}
        animate={{rotateX: t.rx, rotateY: t.ry}}
        transition={{type: 'spring', stiffness: 190, damping: 20, mass: 0.5}}
        className="relative aspect-[1.585/1] w-full max-w-[30rem] rounded-[3.2cqw] will-change-transform md:max-w-[36rem] lg:max-w-[30rem]"
        style={{
          // The card is its own containment context, so every value below is a
          // fraction of the card's width rather than a fixed rem. At 576px and
          // at 293px it is the same object at three sizes, which is why nothing
          // inside it can outgrow it, and why the wider cap in the tablet band
          // - where the card had 211px of empty paper beside it - needed no
          // other change.
          containerType: 'inline-size',
          transformStyle: 'preserve-3d',
          background:
            'linear-gradient(152deg, #252525 0%, #1C1C1C 34%, #151515 62%, #0B0B0B 100%)',
          // Cooled a few degrees toward the brand rather than pure black.
          // On a near-black page a neutral shadow reads as a smudge; a tinted
          // one reads as a surface lifted off the ground.
          boxShadow:
            '0 2px 6px rgba(2,10,10,0.55), 0 18px 44px rgba(2,12,12,0.5), 0 44px 96px rgba(0,14,14,0.38)',
        }}
      >
        {/* Edge: a bright top-left catch over a full hairline. */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[3.2cqw]"
          style={{
            boxShadow:
              'inset 0 0 0 1px rgba(255,255,255,0.11), inset 1px 1px 0 0 rgba(255,255,255,0.2)',
          }}
        />

        {/* Specular band, following the pointer. */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[3.2cqw] transition-opacity duration-500"
          style={{
            opacity: t.on ? 1 : 0,
            background: `radial-gradient(38rem circle at ${t.mx}% ${t.my}%, rgba(255,255,255,0.12), transparent 46%)`,
          }}
        />

        {/* Debossed wordmark, pressed into the surface rather than printed on
            it, and cut by the card edge the way a real deboss would be. The
            clip lives on this layer so the card's drop shadow stays outside it. */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[3.2cqw]" aria-hidden>
          <span
            className="display absolute select-none font-black leading-none tracking-[-0.05em]"
            style={{
              right: '-1.5cqw',
              bottom: '-1cqw',
              fontSize: '26cqw',
              color: 'transparent',
              fontStretch: '82%',
              textShadow: '0 0.3cqw 0 rgba(255,255,255,0.055), 0 -0.2cqw 0 rgba(0,0,0,0.55)',
            }}
          >
            CTRL
          </span>
        </div>

        <div className="relative flex h-full flex-col justify-between" style={{padding: '5.4cqw'}}>
          <div className="flex items-start justify-between">
            <span className="flex items-baseline" style={{gap: '1.6cqw'}}>
              <span className="display font-black leading-none tracking-[-0.03em] text-white" style={{fontSize: '3.7cqw'}}>
                CTRL
              </span>
              <span className="font-medium uppercase tracking-[0.3em] text-teal-lit" style={{fontSize: '1.85cqw'}}>
                Room
              </span>
            </span>

            {/* NFC. Three arcs and a dot, drawn small and left alone. */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className="text-white/55">
              <path d="M6.4 4.6a7.6 7.6 0 0 1 0 10.8" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
              <path d="M9.9 6.9a4.3 4.3 0 0 1 0 6.2" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
              <path d="M13.4 9.2a1.1 1.1 0 0 1 0 1.6" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
            </svg>
          </div>

          <div className="flex items-end justify-between" style={{gap: '4cqw'}}>
            <span>
              <span className="block font-mono uppercase tracking-[0.24em] text-white/55" style={{fontSize: '1.85cqw'}}>
                Member
              </span>
              <span className="mt-[1.4cqw] block font-mono tracking-[0.16em] text-white/85" style={{fontSize: '3.2cqw'}}>
                0001
              </span>
            </span>

            <span className="flex items-center" style={{gap: '2.4cqw'}}>
              <span className="rotate-45 bg-teal-lit" style={{width: '1.5cqw', height: '1.5cqw'}} aria-hidden />
              <span className="font-mono uppercase tracking-[0.26em] text-white/55" style={{fontSize: '1.95cqw'}}>
                Elite
              </span>
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
