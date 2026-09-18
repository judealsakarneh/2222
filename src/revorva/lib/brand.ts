/**
 * Revorva — type, copy and content.
 *
 * Colour lives in theme.ts, because there are two palettes rather than one and
 * they are never mixed. Everything here is palette-independent.
 *
 * ── Provenance ───────────────────────────────────────────────────────────────
 * Nothing here is read from revorva.com. This session's egress policy refuses
 * the host on both routes - 403 to CONNECT through the proxy, EGRESS_BLOCKED
 * through WebFetch - so the site was never seen. This is art direction, chosen
 * and defended, not guessed and labelled a placeholder. If their real brand
 * differs, theme.ts and this file are the whole diff; no motion depends on
 * either.
 * ─────────────────────────────────────────────────────────────────────────────
 */

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
