/**
 * Every image the site uses, in one place. Swap a path here and the whole
 * site follows; nothing else references a file name.
 *
 * The current files are generated placeholders, art-directed to the brief:
 * Amman at night, architectural, monochrome-leaning, no signage. Replace them
 * with real photography at the same aspect ratios and nothing needs to move.
 */

export type ImageAsset = {
  /** Path under /public. */
  src: string;
  /** Intrinsic pixels, where known, so the box is reserved before load. */
  width?: number;
  height?: number;
  /** Intrinsic ratio, so layout can reserve space before the file loads. */
  ratio: number;
  /** Empty string: every image here is decorative and captioned in the DOM. */
  alt: string;
  /** REPLACE: what this slot should eventually hold. */
  brief: string;
};

export const IMAGES = {
  hero: {
    src: '/img/hero.webp',
    /** 940x537. Keep any replacement at or near 16:9 so the crop holds. */
    ratio: 940 / 537,
    width: 940,
    height: 537,
    alt: '',
    brief:
      'REPLACE - contemporary Amman architecture at night. Dark, geometric, warm light from within, deep shadow on the left third so the headline has ground to sit on. Not a landmark, not a skyline.',
  },
  venue: {
    src: '/img/venue.webp',
    ratio: 3 / 4,
    alt: '',
    brief: 'REPLACE - live music, crowd in silhouette against stage haze',
  },
  session: {
    src: '/img/session.webp',
    ratio: 3 / 4,
    alt: '',
    brief: 'REPLACE - a talk or panel, speaker lit, audience in shadow',
  },
  nightlife: {
    src: '/img/nightlife.webp',
    ratio: 3 / 2,
    alt: '',
    brief: 'REPLACE - late night room, warm light, movement',
  },
  restaurant: {
    src: '/img/restaurant.webp',
    ratio: 3 / 2,
    alt: '',
    brief: 'REPLACE - dining room at night, pendant light, occupied tables',
  },
  cafe: {
    src: '/img/cafe.webp',
    ratio: 3 / 2,
    alt: '',
    brief: 'REPLACE - specialty coffee, morning light, concrete and ceramic',
  },
  food: {
    src: '/img/food.webp',
    ratio: 4 / 3,
    alt: '',
    brief: 'REPLACE - Levantine plates on stone, overhead, warm side light',
  },
} as const satisfies Record<string, ImageAsset>;

export type ImageKey = keyof typeof IMAGES;
