/**
 * Revorva — brand tokens.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ EVERY VALUE BELOW MARKED "PLACEHOLDER" IS A GUESS AND MUST BE REPLACED  │
 * │ FROM revorva.com's own CSS. This session's egress policy refuses the    │
 * │ host (403 to CONNECT on revorva.com:443), so the page was never read.   │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * This file is the only place the film knows anything about the brand. Swap
 * these values and every scene follows - which is the point of putting them
 * here rather than inline, and the reason the paste is a one-file edit.
 */

/** PLACEHOLDER — replace all of these from the site's CSS custom properties. */
export const C = {
  /** Page ground. */
  bg: '#0B0D12',
  /** Raised surface: cards, the app panel, the email. */
  surface: '#141821',
  /** Surface one step up, for a card sitting on a card. */
  surface2: '#1B2029',

  /** Primary type. */
  fg: '#FFFFFF',
  /** Secondary type. Must clear 4.5:1 on `surface`. */
  fg2: 'rgba(255,255,255,0.72)',
  /** Tertiary — labels, units, timestamps. */
  fg3: 'rgba(255,255,255,0.52)',

  /** Hairlines. */
  line: 'rgba(255,255,255,0.10)',
  line2: 'rgba(255,255,255,0.18)',

  /** PLACEHOLDER — the brand accent. Almost certainly wrong. */
  accent: '#635BFF',
  accentSoft: 'rgba(99,91,255,0.16)',

  /**
   * The failure state.
   *
   * A soft notification red, not an alarm red. The distinction is the whole
   * edit: an alarm red makes the declined payment the subject of the film, and
   * the subject is the recovery. This reads as a badge on a row - the tone a
   * dashboard uses to tell you something needs attention, not that something
   * is on fire.
   *
   * #E5484D is the value: saturated enough to be unmistakably a failure, dark
   * enough not to vibrate against a dark ground the way a pure #FF0000 does.
   *
   * How the badge is built was decided by measurement, not by eye, and the
   * numbers ruled out the obvious construction:
   *
   *   white on solid #E5484D ............ 3.91:1   FAILS (badge text is small)
   *   #E5484D on its own 14% tint ....... 3.96:1   FAILS
   *   #FF6369 on that tint .............. 5.34:1   passes
   *   #FF6369 on the surface ............ 6.12:1   passes
   *
   * So: a TINTED pill with `redLit` type, never a solid red block with white
   * type. The accessible answer and the "soft notification, not an alarm"
   * answer turn out to be the same answer - a solid red badge is exactly the
   * alarm this film is not supposed to sound.
   *
   * Re-run these against the real surface once the site's ground is known.
   */
  red: '#E5484D',
  /** The badge fill behind red type. 14% keeps it a tint, not a block. */
  redSoft: 'rgba(229,72,77,0.14)',
  /** The red that carries type. See the note below - this is the one to set text in. */
  redLit: '#FF6369',

  /** The recovery state. Pairs with `red` at the same weight. */
  green: '#30A46C',
  greenSoft: 'rgba(48,164,108,0.14)',
} as const;

/** PLACEHOLDER — replace with the real stacks from the site's @font-face. */
export const FONT = {
  /** Display: the headline and the wordmark. */
  display: 'Inter',
  /** UI: everything inside the product panel. */
  ui: 'Inter',
  /** Figures: amounts, counts, timestamps. Needs tabular numerals. */
  mono: 'JetBrains Mono',
} as const;

/**
 * PLACEHOLDER — every line the film puts on screen.
 *
 * These are paraphrases of what Revorva does, not quotations from its site.
 * Replace each with the page's own words before rendering anything anyone
 * else will see: the product's real copy is sharper than a paraphrase, and a
 * launch video that misquotes the product is worse than no launch video.
 *
 * Nothing here states a recovery rate. Search results attribute "up to 70%"
 * to Revorva, but that was read on an aggregator rather than on revorva.com.
 * If the figure is on their own page, add it to `proof` and the film will use
 * it; if it is not, the film ships without a number.
 */
export const COPY = {
  wordmark: 'Revorva',
  domain: 'revorva.com',

  /** The hook. Stated as the customer's problem, before the product exists. */
  problem: 'A payment just failed.',

  /** The turn. One line, the product's actual promise. */
  headline: 'Failed Stripe payments,\nrecovered automatically.',

  /** Two or three real claims, in the product's own words. */
  claims: [
    'Smart retries on the schedule that actually converts.',
    'Personalised recovery emails, sent for you.',
    'Connects through Stripe OAuth. Never touches card numbers.',
  ],

  /** Optional. A figure only if it appears on revorva.com itself. */
  proof: null as null | {figure: string; label: string},

  /** The close. */
  cta: 'Connect Stripe in two minutes.',
} as const;

/** PLACEHOLDER — the fake ledger row the failure and recovery happen to. */
export const LEDGER = {
  customer: 'PLACEHOLDER Ltd',
  amount: '$248.00',
  plan: 'Pro · monthly',
  /** Card brand + last four, invented. Never use a real customer's. */
  card: 'Visa ···· 4242',
  declineCode: 'insufficient_funds',
} as const;
