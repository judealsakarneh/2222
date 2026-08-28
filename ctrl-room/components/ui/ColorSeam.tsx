'use client';

import {useRef} from 'react';
import {motion, useScroll, useTransform} from 'framer-motion';
import {useReducedMotion} from '@/lib/useReducedMotion';
import type {GroundName} from './Ground';

const BG: Record<GroundName, string> = {
  dark: '#0B0B0B',
  paper: '#F6F4F1',
  teal: '#006563',
};

/**
 * The seam between two environments.
 *
 * A panel of the incoming ground rises through a pinned stage while one
 * oversized word holds still in front of it. The word is painted white in
 * mix-blend-mode: difference, so it inverts itself as the panel passes:
 * against #0B0B0B the difference is 244 and it reads white, against #F6F4F1
 * it is 9 and it reads black. Nothing measures the background and decides a
 * colour - the compositor does it per pixel, which is why the word stays
 * correct mid-wipe with half of it over each ground.
 *
 * Difference is only used between dark and paper. Against teal it would give
 * (255,154,156), a pink, so TealSeam uses a different device.
 *
 * Two things are deliberate and were both learned the hard way here.
 *
 * The scroll offset is 'start start' to 'end end', not 'start end'. Measured
 * from the seam's approach, the wipe finishes before the stage is ever pinned
 * and nobody sees it; measured this way, 0 and 1 land exactly on the pinned
 * span, which is the only span that is on screen.
 *
 * Reduced motion changes values, never the tree. An earlier version returned
 * a different component, which kept the pixels right but changed the element
 * order between the two modes, so anything comparing them by position saw
 * content that had supposedly vanished. Same elements, same order, motion
 * removed: the panel simply starts arrived and the band is short.
 */
export function ColorSeam({
  from,
  to,
  word,
}: {
  from: GroundName;
  to: GroundName;
  word: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const {scrollYProgress} = useScroll({target: ref, offset: ['start start', 'end end']});

  const panelY = useTransform(scrollYProgress, [0.16, 0.78], ['100%', '0%']);
  const wordY = useTransform(scrollYProgress, [0, 1], ['26%', '-26%']);
  const wordScale = useTransform(scrollYProgress, [0, 1], [1.07, 0.97]);

  const blendable = from !== 'teal' && to !== 'teal';

  return (
    <div
      ref={ref}
      data-ground={to}
      // The height beyond 100vh is the pin duration. Shorter on a phone, where
      // the same sequence in viewport heights costs far more thumb travel.
      className={reduce ? 'relative bg-g' : 'relative h-[165vh] bg-g lg:h-[215vh]'}
    >
      {/* The stage shows the outgoing ground; the panel carries the incoming
          one. The nav samples whatever is painted under its own baseline, so
          marking the panel rather than the wrapper is what makes the bar
          change over as the colour reaches it, not when the seam begins. */}
      <div
        data-ground={from}
        className={
          reduce
            ? 'relative w-full overflow-hidden'
            : 'sticky top-0 h-screen w-full overflow-hidden'
        }
        style={{backgroundColor: reduce ? BG[to] : BG[from]}}
      >
        <motion.div
          data-ground={to}
          className="absolute inset-0 will-change-transform"
          style={{y: reduce ? '0%' : panelY, backgroundColor: BG[to]}}
        />

        {/* pointer-events-none is load-bearing, not tidiness. The nav reads
            the ground by hit-testing the pixel under its own baseline; a
            decorative layer that answers that test would report the outgoing
            stage's ground long after the panel had covered it, leaving a paper
            bar over black type. Transparent to the hit test, the panel answers
            instead and the bar changes exactly when the colour reaches it. */}
        <div
          className={
            reduce
              ? 'pointer-events-none relative flex items-center justify-center py-[15vh]'
              : 'pointer-events-none absolute inset-0 flex items-center justify-center'
          }
        >
          <motion.span
            className="display select-none whitespace-nowrap font-black uppercase leading-none tracking-[-0.04em]"
            style={{
              y: reduce ? 0 : wordY,
              scale: reduce ? 1 : wordScale,
              fontSize: 'clamp(2.4rem,12vw,11rem)',
              fontStretch: '74%',
              color: '#ffffff',
              mixBlendMode: blendable ? 'difference' : 'normal',
              willChange: 'transform',
            }}
          >
            {word}
          </motion.span>
        </div>
      </div>
    </div>
  );
}

/**
 * The teal arrival, which cannot use difference.
 *
 * The teal ground opens from a band at the centre outward until it fills the
 * frame, so the colour arrives as an expansion rather than a wipe. Repeating
 * the wipe here would have made the second transition read as a device rather
 * than as part of the journey.
 *
 * The word only fades in from progress 0.42, by which point the panel has
 * opened past it. White on paper is unreadable, and the word must never be
 * caught over the outgoing ground.
 */
export function TealSeam({from, word}: {from: GroundName; word: string}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const {scrollYProgress} = useScroll({target: ref, offset: ['start start', 'end end']});

  const openY = useTransform(scrollYProgress, [0.18, 0.8], [0.05, 1]);
  const wordOpacity = useTransform(scrollYProgress, [0.42, 0.6, 0.95], [0, 1, 1]);
  const wordY = useTransform(scrollYProgress, [0, 1], ['18%', '-18%']);

  return (
    <div
      ref={ref}
      data-ground="teal"
      className={reduce ? 'relative bg-g' : 'relative h-[165vh] bg-g lg:h-[215vh]'}
    >
      <div
        data-ground={from}
        className={
          reduce
            ? 'relative flex w-full items-center justify-center overflow-hidden'
            : 'sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden'
        }
        style={{backgroundColor: reduce ? BG.teal : BG[from]}}
      >
        <motion.div
          data-ground="teal"
          className="absolute inset-x-0 top-1/2 h-full origin-center will-change-transform"
          style={{y: '-50%', scaleY: reduce ? 1 : openY, backgroundColor: BG.teal}}
        />
        <motion.span
          className="display pointer-events-none relative select-none whitespace-nowrap py-[15vh] font-black uppercase leading-none tracking-[-0.04em] text-white"
          style={{
            opacity: reduce ? 1 : wordOpacity,
            y: reduce ? 0 : wordY,
            fontSize: 'clamp(2.4rem,11vw,10rem)',
            fontStretch: '74%',
            willChange: 'transform, opacity',
          }}
        >
          {word}
        </motion.span>
      </div>
    </div>
  );
}

/**
 * The quiet transition, for a change of ground that has not earned a word.
 *
 * The teal act was the one place on the page where an environment ended on a
 * straight horizontal line, because it is the only handoff without a seam in
 * front of it. A full seam there would have been a third pinned word inside
 * two screens of the second one, so this is the same idea at a whisper: the
 * incoming ground rises over the outgoing one across a short band that keeps
 * scrolling normally. No pin, no word, no extra thumb travel beyond the space
 * the gap between the two sections was already taking.
 *
 * offset is 'start end' to 'end start' here, not the seam's 'start start' to
 * 'end end': nothing is pinned, so the useful span is the band's whole passage
 * through the viewport rather than any pinned portion of it.
 */
export function GroundFold({from, to}: {from: GroundName; to: GroundName}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const {scrollYProgress} = useScroll({target: ref, offset: ['start end', 'end start']});

  // Arrived by 0.72, well before the band clears the top of the screen, so the
  // outgoing colour never reappears above the fold on the way out.
  const panelY = useTransform(scrollYProgress, [0.3, 0.72], ['100%', '0%']);

  return (
    <div
      ref={ref}
      aria-hidden
      data-ground={from}
      className="relative h-[34vh] w-full overflow-hidden lg:h-[42vh]"
      style={{backgroundColor: BG[from]}}
    >
      <motion.div
        data-ground={to}
        className="absolute inset-0 will-change-transform"
        style={{y: reduce ? '0%' : panelY, backgroundColor: BG[to]}}
      />
    </div>
  );
}
