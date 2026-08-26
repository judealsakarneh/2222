import type {ReactNode} from 'react';
import {Diamond} from './Diamond';
import {GlyphMesh} from './GlyphMesh';
import {Logo} from './Logo';
import {NfcWaves} from './NfcWaves';

/**
 * The card.
 *
 * SCALING: the root declares `container-type: inline-size` and every dimension
 * inside is expressed in `cqw` (percent of the card's own width) or in `em` off
 * a single cqw-derived font-size. That means one component renders correctly at
 * 260px in a footer and at 640px in the hero, with the type, the radius, the
 * padding and the corner glow all staying in proportion. Media queries cannot
 * do this — the card's width here depends on its container, not the viewport.
 *
 * LAYERS, back to front:
 *   1  the body gradient — lit from the top-left, like a card held under a lamp
 *   2  the debossed "ctrl" glyph, oversized and bleeding off the right edge
 *   3  the micro-pattern mesh, bottom-left, near-invisible
 *   4  a teal wash in the lower-left corner, where the light would pool
 *   5  the content
 *   6  the overlay slot (the tap shimmer, passed in by the interactive preview)
 *   7  a hairline inner edge — this is what sells it as a physical object
 */
export function LoyaltyCard({
  overlay,
  className = '',
  animateNfc = true,
}: {
  overlay?: ReactNode;
  className?: string;
  animateNfc?: boolean;
}) {
  return (
    <div
      className={`relative aspect-[1.585/1] w-full ${className}`}
      style={{containerType: 'inline-size'}}
    >
      {/* Cast shadow. Offset down and slightly left, matching the light. */}
      <div
        className="pointer-events-none absolute inset-x-[6%] bottom-[-7%] top-[10%] rounded-[6cqw] bg-black/70"
        style={{filter: 'blur(7cqw)'}}
      />
      {/* Teal spill on the lower-left, as if the edge is lit from within. */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[6cqw]"
        style={{
          background:
            'radial-gradient(60% 70% at 8% 96%, rgba(45,212,191,0.30), rgba(45,212,191,0) 70%)',
          filter: 'blur(5cqw)',
        }}
      />

      <div
        className="absolute inset-0 overflow-hidden rounded-[4.4cqw]"
        style={{fontSize: '3.4cqw'}}
      >
        {/* 1 — body */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(146deg, #1C1C1C 0%, #131313 38%, #0C0C0C 72%, #090909 100%)',
          }}
        />

        {/* 2 — the oversized deboss. Sits behind everything, bleeds off-edge. */}
        <span
          className="deboss pointer-events-none absolute select-none font-bold"
          style={{
            fontSize: '11.5em',
            letterSpacing: '-0.06em',
            right: '-0.34em',
            top: '50%',
            transform: 'translateY(-52%)',
            lineHeight: 1,
          }}
          aria-hidden="true"
        >
          ctrl
        </span>

        {/* 3 — micro-pattern, fading out as it climbs */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            maskImage:
              'linear-gradient(to top right, black, transparent 52%)',
            WebkitMaskImage:
              'linear-gradient(to top right, black, transparent 52%)',
          }}
        >
          <GlyphMesh id="card-mesh" opacity={0.055} scale={0.5} />
        </div>

        {/* 4 — teal corner wash, inside the clip this time so it hugs the radius */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(46% 62% at 2% 100%, rgba(45,212,191,0.16), rgba(45,212,191,0) 68%)',
          }}
        />

        {/* 5 — content */}
        <div className="relative flex h-full flex-col justify-between p-[1.5em]">
          <div className="flex items-start justify-between">
            <Logo size="1.55em" />
            <div className="flex flex-col items-end gap-[0.45em] text-teal">
              <NfcWaves style={{width: '1.55em', height: '1.55em'}} play={animateNfc} />
              <span
                className="font-medium text-chalk-35"
                style={{fontSize: '0.46em', letterSpacing: '0.3em'}}
              >
                NFC
              </span>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <span
                className="block font-medium text-teal"
                style={{fontSize: '0.5em', letterSpacing: '0.3em'}}
              >
                LOYALTY CARD
              </span>
              <span
                className="mt-[0.55em] block h-px w-[3.4em] bg-teal"
                aria-hidden="true"
              />
              <span
                className="mt-[0.7em] block font-medium text-white/80"
                style={{fontSize: '0.88em', letterSpacing: '-0.02em'}}
              >
                Your place. Your rewards.
              </span>
            </div>

            <div className="flex flex-col items-end gap-[0.5em]">
              <Diamond className="text-teal" style={{width: '0.5em', height: '0.5em'}} />
              <span
                className="font-medium text-chalk-35"
                style={{fontSize: '0.46em', letterSpacing: '0.26em'}}
              >
                MEMBER
              </span>
            </div>
          </div>
        </div>

        {/* 6 — overlay slot */}
        {overlay}

        {/* 7 — the edge. Two rings: a bright top-left catch and a dark base. */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[4.4cqw]"
          style={{
            boxShadow:
              'inset 0 0 0 1px rgba(255,255,255,0.055), inset 0.6px 0.6px 0 0 rgba(255,255,255,0.10)',
          }}
        />
      </div>
    </div>
  );
}
