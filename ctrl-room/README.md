# ctrl ROOM — landing site

A single-page site for the ctrl ROOM loyalty card. Next.js 14 (App Router),
Tailwind, Framer Motion. No UI kit, no icon library, no stock assets — every
mark on the page is drawn in this repo.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## The rules the design runs on

**One accent, and it is rationed.** Monochrome plus `#2DD4BF`. The teal appears
on the diamond, the section labels, the CTA, one rule per card, and the NFC
arcs — nowhere else. The palette in `tailwind.config.ts` is deliberately short:
every extra hue is a chance for the page to drift toward the generic SaaS look.

**The diamond is one shape doing several jobs.** It is the tittle over the
wordmark, the marker in every list, the accent in every icon, and the separator
in the footer. Repetition is what turns a rotated square into a brand asset.

**Nothing on the page is an emoji.** `components/Icons.tsx` is the whole set,
hand-drawn on a 24 grid at 1.25 stroke. Each icon is a white line drawing with
exactly one teal diamond in it — that single repeated accent is what makes three
unrelated shapes read as a family.

**Motion is small.** Reveals travel 14px, not 60. Hover states move a rule or a
wash, never the whole card. The one loud moment is the light sweep across the
card, and it only fires every ~5.8 seconds.

## Files worth knowing about

| File | Why it matters |
| --- | --- |
| `components/LoyaltyCard.tsx` | The card face. Declares `container-type: inline-size` and sizes **everything** inside in `cqw`/`em`, so one component renders correctly at 260px in a footer and 640px in the hero — type, radius, padding and corner glow all staying in proportion. Media queries cannot do this, because the card's width depends on its container, not the viewport. |
| `components/CardStage.tsx` | Tilt, specular and sweep. The tilt runs through springs so the card has mass; the highlight tracks the pointer through the *same* springs so it can never separate from the rotation. **Any ancestor with `opacity < 1` collapses `preserve-3d` and flattens the card** — which is why the reveal wraps the outer container and settles at opacity 1. |
| `app/globals.css` | The `.deboss` / `.emboss` recipes. A real press is two offset copies of the shape: a dark edge on the light side, a light edge on the dark side. The fill is transparent, so the letterform exists only as those two edges. Keep the two edges close in weight — let the dark one run away and the press becomes a black outline drawn on the page. |
| `components/Watermark.tsx` | The foil-stamped `ctrl` and the micro-pattern, both masked so they fade out before they reach the content. The wordmark is additionally masked to the left of the frame so it never crosses the card: two near-black shapes overlapping cancel each other out. |
| `components/Reveal.tsx` | `Reveal` for single elements; `RevealGroup` + `RevealItem` when children must arrive in sequence. They are separate because staggering needs the *parent* to own the viewport trigger — give each child its own observer and the sequence falls apart on a fast scroll. |

## Things that will bite you

- **The grain is required, not decorative.** Large near-black fields band badly
  on 8-bit displays. `.grain` is an inline `feTurbulence` at 0.035 — invisible
  as texture, but it breaks up the flat areas.
- **`ctrl` has no dotted letter.** The brief's "diamond as the dot on the i"
  is implemented as a floating tittle above the t/r junction, positioned in `em`
  so the whole lockup scales from one font-size.
- **On a phone there is no pointer to track.** `CardStage` detects
  `(hover: none)` and drives the tilt from two sine terms with periods that do
  not divide each other, so the sway never repeats visibly. It must never chase
  a touch.
- **Screenshotting the page needs care.** A `fullPage: true` capture resizes the
  viewport, which fires every remaining `whileInView` at once — capture too soon
  and half the page is photographed mid-fade at opacity 0. Resize first, then
  wait, then shoot.

## Copy

All placeholder. `HowItWorks.tsx`, `CardPreview.tsx` and `Rewards.tsx` hold their
text in a single array at the top of the file, so replacing it is one edit each.
