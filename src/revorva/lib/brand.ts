/**
 * Revorva — brand tokens.
 *
 * ── Provenance ───────────────────────────────────────────────────────────────
 * These are NOT read from revorva.com. This session's egress policy refuses the
 * host (403 to CONNECT on revorva.com:443, retried on both apex and www), so
 * the site was never fetched. What follows is art direction, chosen and
 * defended here rather than guessed and labelled a placeholder.
 *
 * If Revorva's real palette and faces differ - and they will, at least in the
 * accent - this file is the whole diff. Nothing in the film's motion, timing or
 * choreography depends on a single value below.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const C = {
  /**
   * Ground and surfaces.
   *
   * Dark, and cool rather than neutral. Two reasons, neither of them taste:
   * the failure and recovery states are the only saturated colour in the piece
   * and they read far harder against a dark ground than a light one; and a
   * payments dashboard at 2am is the honest context for a film about a payment
   * failing, which is not a thing anyone watches happen in daylight.
   *
   * The blue bias (#0B0D12 rather than #101010) keeps the ground from going
   * muddy where the accent's glow falls across it.
   */
  bg: '#0B0D12',
  surface: '#141821',
  surface2: '#1B2029',

  fg: '#FFFFFF',
  /** 0.72 on `surface` measures 11.6:1. Secondary, not faint. */
  fg2: 'rgba(255,255,255,0.72)',
  /** 0.52 measures 6.0:1 - still comfortably past 4.5 for the small labels. */
  fg3: 'rgba(255,255,255,0.52)',

  line: 'rgba(255,255,255,0.10)',
  line2: 'rgba(255,255,255,0.18)',

  /**
   * The accent. Chosen by measurement against three alternatives.
   *
   *   candidate            white on it   vs surface   hue from red / green
   *   Stripe purple #635BFF    4.70          3.78        115° /  92°
   *   #3D63DD (this)           5.21          3.41        132° /  75°
   *   Radix blue #0090FF       3.26          5.44        152° /  55°   white FAILS
   *   deep azure #2E6BE6       4.81          3.69        138° /  69°
   *
   * #3D63DD carries white button text at 5.21:1, the best of the viable set,
   * and sits furthest from the failure red so the two never compete for the
   * same meaning.
   *
   * It is deliberately NOT Stripe's #635BFF. A tool that connects TO Stripe
   * should not wear Stripe's colour: it implies ownership the product does not
   * claim, and it is the single most-used hue in that ecosystem, which is the
   * opposite of what a brand accent is for.
   */
  accent: '#3D63DD',
  accentSoft: 'rgba(61,99,221,0.16)',

  /**
   * The failure state. A soft notification red, not an alarm.
   *
   * The subject of this film is the recovery, so the decline is allowed to be
   * noticed and not allowed to be the point. How the badge is built was settled
   * by measurement, and the numbers ruled out the obvious construction:
   *
   *   white on solid #E5484D ............ 3.91:1   FAILS (badge text is small)
   *   #E5484D on its own 14% tint ....... 3.96:1   FAILS
   *   #FF6369 on that tint .............. 5.34:1   passes
   *   #FF6369 on the surface ............ 6.12:1   passes
   *
   * So: a tinted pill with `redLit` type, never a solid red block with white
   * type. The accessible answer and the "soft, not an alarm" answer turn out to
   * be the same answer - a solid red badge is exactly the alarm this film is
   * not supposed to sound.
   */
  red: '#E5484D',
  redSoft: 'rgba(229,72,77,0.14)',
  /** The red that carries type. Set text in this one, never in `red`. */
  redLit: '#FF6369',

  /**
   * The recovery state, built the same way so the two read as one system.
   *
   * "The same way" was asserted before it was measured, and measuring it found
   * the one contrast failure in the palette: #30A46C on its own 14% tint is
   * 4.27:1, under the 4.5 floor - on the single most important label in the
   * film, the one the whole piece exists to arrive at.
   *
   *   #30A46C green 9  ..... 4.27:1   FAILS
   *   #3CB179 green 10 ..... 4.98:1   passes
   *   #4CC38A green 11 ..... 6.09:1   passes, but louder than its red sibling
   *
   * #3CB179 it is, and not only because it passes: at 4.98 it sits within 0.08
   * of the red's 4.90, so the failure and the recovery finally carry the same
   * optical weight. A green that outshouted the red would have quietly changed
   * which of the two the eye reads as the event.
   *
   * `green` stays for fills and the check mark; `greenLit` carries all type.
   */
  green: '#30A46C',
  greenSoft: 'rgba(48,164,108,0.14)',
  /** The green that carries type. Set text in this one, never in `green`. */
  greenLit: '#3CB179',
} as const;

/**
 * Type.
 *
 * A real pairing rather than one face doing both jobs. Archivo's wider, heavier
 * forms give the wordmark and the email subject presence at display size that
 * Inter is too even-tempered to carry; Inter is the better neutral for a dense
 * table where the job is to disappear. JetBrains Mono takes every figure, so
 * amounts and timestamps share one advance and the numbers do not jitter as
 * digits change.
 *
 * All three are vendored in public/fonts and loaded through src/lib/fonts.ts,
 * so the render needs no network.
 */
export const FONT = {
  display: 'Archivo',
  ui: 'Inter',
  mono: 'JetBrains Mono',
} as const;

/**
 * Copy.
 *
 * Written from what Revorva does - recover failed Stripe subscription payments
 * with smart retries and personalised emails, connected by Stripe OAuth,
 * without touching card numbers. It is not quoted from revorva.com, because
 * revorva.com was not readable from here. Their own lines will be sharper;
 * replace these with them.
 */
export const COPY = {
  wordmark: 'Revorva',
  domain: 'revorva.com',

  /** The hook, stated as the customer's problem, before the product exists. */
  problem: 'A payment just failed.',

  headline: 'Failed payments,\nrecovered automatically.',

  claims: [
    'Smart retries, on the schedule that actually converts.',
    'Personalised recovery emails, sent for you.',
    'Connects through Stripe. Never touches card numbers.',
  ],

  /**
   * No figure, deliberately.
   *
   * "Up to 70%" is attributed to Revorva by a third-party aggregator. It was
   * never read on revorva.com, so it does not go on screen. Put the real number
   * here once it is confirmed from the source and the film will carry it.
   */
  proof: null as null | {figure: string; label: string},

  cta: 'Connect Stripe in two minutes.',
} as const;

/**
 * The ledger row the film happens to.
 *
 * Fictional, and obviously so on inspection - never a real customer, a real
 * amount, or a real card. 4242 is Stripe's own published test card, which is
 * the correct number to show precisely because everyone in this audience
 * recognises it as a test.
 */
export const LEDGER = {
  customer: 'Northwind Studio',
  amount: '$248.00',
  plan: 'Pro · monthly',
  card: 'Visa ···· 4242',
  declineCode: 'insufficient_funds',
} as const;

/** The quiet rows around it. Fictional, and varied so the table reads as real. */
export const FILLER_ROWS = [
  {who: 'Halden & Co', amt: '$96.00', state: 'Paid'},
  {who: 'Meridian Labs', amt: '$412.00', state: 'Paid'},
  {who: 'Fieldnote', amt: '$129.00', state: 'Paid'},
  {who: 'Cartwright GmbH', amt: '$248.00', state: 'Paid'},
] as const;
