'use client';

import {useRef} from 'react';
import {motion, useReducedMotion, useScroll, useTransform, type MotionValue} from 'framer-motion';
import {IMAGES} from '@/lib/images';
import {MagneticButton} from '@/components/ui/Button';

/**
 * The hero is one composition, not a column of text beside a picture.
 *
 * Three planes, and the whole effect depends on them moving at different
 * rates as you scroll:
 *
 *   back    AMMAN, oversized and nearly invisible, drifting fastest
 *   middle  the building, drifting slowly and closing into a framed panel
 *   front   JORDAN, SWITCHED ON. rising at its own rate
 *
 * The building's left edge is masked to transparent, so the headline does not
 * sit beside the photograph, it sits inside it. Nothing here animates colour
 * or layout: every moving property is transform or opacity, which keeps the
 * whole sequence on the compositor.
 *
 * Under prefers-reduced-motion the planes are pinned at their resting values
 * and the section is a still composition, which is the honest fallback.
 */
export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // The sequence runs while the sticky panel is pinned, and is finished by the
  // time the section releases.
  const {scrollYProgress} = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Hooks are called unconditionally and in a fixed order; `still` only
  // chooses between a live value and a constant at render time.
  const still = <T,>(v: MotionValue<T>, resting: T) => (reduce ? resting : v);

  const bgY = useTransform(scrollYProgress, [0, 1], [0, -260]);
  const bgOpacity = useTransform(scrollYProgress, [0, 1], [0.055, 0]);
  const buildX = useTransform(scrollYProgress, [0, 1], ['0%', '-7%']);
  const buildScale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const frameClip = useTransform(scrollYProgress, (v) => `inset(${(v * 7).toFixed(2)}%)`);
  const frameLine = useTransform(scrollYProgress, [0.25, 0.75], [0, 1]);
  const line1Y = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const line2Y = useTransform(scrollYProgress, [0, 1], [0, -66]);
  const tailOpacity = useTransform(scrollYProgress, [0, 0.42], [1, 0]);
  const tailY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <section ref={ref} className="relative h-[210vh]" aria-label="Jordan, switched on">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* BACK - the city name as texture, not as information. */}
        <motion.div
          aria-hidden
          style={{y: still(bgY, 0), opacity: still(bgOpacity, 0.055)}}
          className="pointer-events-none absolute inset-x-0 top-[16vh] flex justify-center will-change-transform"
        >
          <span
            className="display select-none whitespace-nowrap font-black leading-none text-white"
            style={{fontSize: 'clamp(9rem,26vw,26rem)', fontStretch: '75%', letterSpacing: '-0.03em'}}
          >
            AMMAN
          </span>
        </motion.div>

        {/* MIDDLE - the building, closing into a panel as the page moves. */}
        <motion.div
          style={{
            x: still(buildX, '0%'),
            scale: still(buildScale, 1),
            clipPath: reduce ? 'inset(0%)' : frameClip,
          }}
          className="absolute inset-y-0 right-0 w-full will-change-transform lg:w-[68%]"
        >
          <div
            className="absolute inset-0"
            style={{
              // The photograph dissolves leftward and downward instead of
              // ending at an edge, so the headline can cross into it.
              WebkitMaskImage:
                'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.45) 22%, #000 52%), linear-gradient(180deg, #000 62%, transparent 100%)',
              maskImage:
                'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.45) 22%, #000 52%), linear-gradient(180deg, #000 62%, transparent 100%)',
              WebkitMaskComposite: 'source-in',
              maskComposite: 'intersect',
            }}
          >
            <img
              src={IMAGES.hero.src}
              alt={IMAGES.hero.alt}
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover object-[62%_center]"
            />
          </div>
        </motion.div>

        {/* Below lg the building sits under the headline rather than beside
            it, so it gets a scrim. Removed at lg, where the mask alone does
            the work and a scrim would only flatten the picture. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 lg:hidden"
          style={{
            background:
              'linear-gradient(to right, rgba(11,11,11,0.94) 0%, rgba(11,11,11,0.82) 46%, rgba(11,11,11,0.5) 100%)',
          }}
        />

        {/* The frame that resolves out of the photograph as it settles. */}
        <motion.div
          aria-hidden
          style={{opacity: reduce ? 0 : frameLine}}
          className="pointer-events-none absolute inset-[6vh_var(--edge)] border border-white/12"
        />

        {/* Coordinates. Amman, stated once, in the margin. */}
        <div className="pointer-events-none absolute right-[calc(var(--edge)-2px)] top-1/2 hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex">
          <span className="font-mono text-[10px] tracking-[0.18em] text-white/50" style={{writingMode: 'vertical-rl'}}>
            31.9539° N
          </span>
          <span className="h-14 w-px bg-white/15" />
          <span className="h-[5px] w-[5px] rotate-45 bg-teal-lit" />
          <span className="h-14 w-px bg-white/15" />
          <span className="font-mono text-[10px] tracking-[0.18em] text-white/50" style={{writingMode: 'vertical-rl'}}>
            35.9106° E
          </span>
        </div>

        {/* FRONT - the headline, crossing into the photograph. */}
        <div className="relative flex h-full flex-col justify-center edge">
          <h1 className="display max-w-[min(100%,17ch)] font-black uppercase leading-[0.84] tracking-[-0.04em] text-white">
            <motion.span
              style={{y: still(line1Y, 0)}}
              className="block will-change-transform"
              // Condensed by the width axis rather than a second family, so
              // the display face and the UI face stay the same typeface.
            >
              <span style={{fontSize: 'clamp(2.6rem,8.6vw,8.2rem)', fontStretch: '76%'}}>Jordan,</span>
            </motion.span>
            <motion.span style={{y: still(line2Y, 0)}} className="block will-change-transform">
              <span className="text-teal-lit lg:whitespace-nowrap" style={{fontSize: 'clamp(2.6rem,8.6vw,8.2rem)', fontStretch: '76%'}}>
                Switched on.
              </span>
            </motion.span>
          </h1>

          <motion.div style={{opacity: still(tailOpacity, 1), y: still(tailY, 0)}} className="will-change-transform">
            <p className="mt-9 max-w-[30ch] text-[15px] leading-[1.6] text-grey-2">
              What&rsquo;s happening. What&rsquo;s worth knowing.
              <br />
              The city, as the people in it actually use it.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <MagneticButton href="#discover">Explore CTRL</MagneticButton>
              <MagneticButton href="#elite" variant="outline">
                Join CTRL
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
