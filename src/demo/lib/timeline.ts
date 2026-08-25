import {ms} from './tokens';

/**
 * The spec, transcribed. 30fps, 540 frames, 18.0s.
 *
 * Every cue below is the millisecond value from the brief converted through
 * `ms()`, so the code and the spec can be diffed line by line rather than
 * trusting hand-converted frame numbers.
 *
 * OVERLAP: each section begins 200ms before the previous ends, and the outgoing
 * one scales to 60% at 40% opacity as it goes. That handoff is the reason the
 * film reads as one continuous piece and not five clips.
 */

export const DURATION = 540;
export const OVERLAP = ms(200); // 6 frames

export type SceneDef = {id: string; start: number; end: number};

export const SCENES: SceneDef[] = [
  {id: 'logo', start: ms(0), end: ms(2000)},
  {id: 'dashboard', start: ms(2000), end: ms(6000)},
  {id: 'updates', start: ms(6000), end: ms(9000)},
  {id: 'chat', start: ms(9000), end: ms(13000)},
  {id: 'carousel', start: ms(13000), end: ms(18000)},
];

/** Per-scene internal cues, all straight from the brief. */
export const CUE = {
  logo: {
    fadeIn: [ms(400), ms(1000)] as const,
    scale: [ms(1000), ms(1400), ms(1800)] as const, // 95% -> 102% overshoot -> 100%
    pulse: ms(1900),
  },
  dash: {
    panel: [ms(2000), ms(2200)] as const,
    hello: ms(2200),
    name: ms(2350), // 150ms stagger
    widget: [ms(2800), ms(3600)] as const,
    counter: [ms(3600), ms(4400)] as const, // 0 -> 86 over 800ms
    cursor: ms(4200),
    chart: [ms(4400), ms(5600)] as const, // draws over 1200ms
  },
  upd: {
    text: [ms(6000), ms(6400)] as const,
    circles: [ms(6400), ms(7600)] as const,
    pulse: [ms(7600), ms(8800)] as const, // 1200ms cycle
  },
  chat: {
    container: [ms(9000), ms(9150), ms(9300)] as const, // 90% -> 105% -> 100%
    header: [ms(9300), ms(9500)] as const,
    bubble: [ms(9500), ms(9800)] as const,
    typeStart: ms(9800),
    msPerChar: 70,
    dots: ms(11500),
  },
  carousel: {
    chatOut: [ms(13000), ms(14500)] as const,
    spin: [ms(14500), ms(16000)] as const, // 360deg over 1500ms
    logo: [ms(16000), ms(16800)] as const,
    cta: [ms(16800), ms(17300)] as const,
    finalPulse: ms(17200),
    fadeOut: [ms(17600), ms(18000)] as const,
  },
} as const;
