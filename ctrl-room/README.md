# CTRL Room — website

Six-page site for CTRL Room, Jordan's discovery, community and commerce
platform. Next.js 14 (App Router), Tailwind, Framer Motion. No UI kit, no icon
library, no stock assets.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start

npm run preview  # bundle the whole site — all six pages — into ONE .html
```

Pages: `/` · `/membership` · `/business` · `/events` · `/workplace-index` · `/about`

## The design thesis

Straight from the brand deck: *"CTRL Room reads like a place where information
is being monitored — the whole identity can be built around that idea."* So the
site is instrumented rather than decorated. A live Amman clock where a landing
page would put a badge. A running feed. Mono labels, indices and readouts on
everything. Hairline panels with a 3px radius, not rounded shadowed cards.

Palette and type are fixed by the deck: Near-Black `#151515`, White, CTRL Teal
`#006563`. The deck's teal has no contrast as type on near-black, so one
brightened sibling (`#00A9A4`) carries accent text and the deck value is spent
where it belongs — as the fill of the membership card.

## The act system

The page runs through dark and light **acts**. Every section declares one with
`data-act`, and that attribute sets every colour token for everything inside it
(see `app/globals.css`). **No component ever writes a colour directly** — they
read `--fg`, `--fg-2`, `--line`, `--surface`, `--accent`. That is what lets one
`Panel`, one `Rows`, one `Title` work in both acts and never end up as light
text on a light ground.

`ActBackground` is a single fixed layer whose colour is a function of scroll
position. Giving each section its own background instead would paint its full
height and stop, so the page would change colour on a hard edge as that boundary
crossed the viewport. Reading the boundaries and interpolating across a band
means the ground changes temperature *while you are still inside a section*.
That is the difference between a site that has light sections and a site that
transitions.

## Files worth knowing about

| File | Why it matters |
| --- | --- |
| `components/site/ActBackground.tsx` | The crossfade, and the publisher of `data-act-now` on the root so the header can invert through CSS rather than React state — no frame of lag behind the background. The blend band is **clamped**: unclamped, a very tall viewport spans several acts at once and every one bleeds in, leaving a flat mid-grey with neither act legible. |
| `components/card/CardStage.tsx` | Three inputs — scroll position, pointer, and finger drag — summed into two spring-backed rotation values. One rotation fed from three places, which is why they never fight. **Any ancestor with `opacity < 1` collapses `preserve-3d` and flattens the card**, so nothing above it may animate opacity. |
| `components/card/MemberCard.tsx` | Sizes everything in container-query units off its own width, so one component renders correctly at 240px and at 620px with type, radius, padding and edge all in proportion. Media queries cannot do this — the card's width depends on its container, not the viewport. |
| `components/site/UI.tsx` | `Rows` is the workhorse: a numbered editorial list with hairline separators. It exists to replace the row of three feature cards, and it suits a media brand — a masthead lists its sections, it does not box them. |
| `preview/shim/router.tsx` | ~40 lines standing in for the Next router so the single-file build is a navigable six-page site, not a screenshot of the home page. |

## Deliberately avoided

Researched and checked off, because the brief was explicit about it:

- No pill badge floating above a headline (a live clock does that job instead)
- No Inter — Archivo, a variable grotesque with a real width axis
- No row of exactly three feature cards
- No `rounded-2xl` + `shadow-lg` on everything — panels are 3px; the card is the
  only round thing, because a real card has round corners
- No bento grid, no glassmorphism by reflex
- No arrow glyph welded to a CTA
- No four-column footer
- No fade-in-up on every element — motion marks the card and the act
  transitions, and little else

## Content

Copy is drawn from the brand deck. Placeholder data that must be replaced before
launch: the ticker feed (`components/site/Ticker.tsx`), the membership signup
form action (`app/membership/page.tsx`), and the contact address on
`/business`.
