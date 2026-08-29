# CTRL Flow — Build Sheet

`1920×1080 · 30 fps · 12.000 s (360 frames) · Motion Blur ON · 180° shutter, −90° phase`
Export: H.264, 25–30 Mbps, VBR 2-pass, square pixels, progressive, 32-bit colour.

Three files hold the same numbers, and they are the same numbers on purpose:

| File | What it is |
|---|---|
| `src/flow/lib/timeline.ts` | The beat sheet. Every time in ms; `ms()` converts once. |
| `ae/CTRL_Flow.jsx` | Builds the comp in After Effects from the same constants. |
| this file | The Graph Editor values, for building or checking by hand. |

---

## 0 · What changed from the source document, and why

The build document this is derived from describes a Wispr Flow promo. Two beats
could not be copied without putting a microphone in an app that has not got one,
so they were remapped. **Every duration, stagger, curve and overshoot is
unchanged** — only the subject moved.

| Document beat | Here | Reason |
|---|---|---|
| Waveform pulse (mic bars) | Live index activity bars | CTRL Room indexes a city, it does not listen. Same 150 ms / 30 ms stagger. |
| Dictated shopping list | CTRL Picks result rows | Same 25 ms per character, same 60 ms per line. |
| "978 words dictated / 19 emails written" | Placeholder figures | These are Wispr's numbers. Ours are **placeholder** — see §6. |

Three places where the document is internally inconsistent, and the reading taken:

1. **Slot vs. move.** The document gives both a time range and a duration, and
   they rarely match — the panel owns 2000–3200 ms but slides in over 320 ms. A
   beat animates for its *move* and then **holds** for the rest of its slot. The
   holding is the point; it is what stops the piece reading as a list of
   animations played back to back.

2. **The tab underline.** "X 0 → 120 → 240 over 250 ms" is two moves sharing one
   duration, which is 125 ms per tab — under four frames, which reads as a cut,
   not a slide. Taken as **250 ms per switch**, spaced so the middle tab is
   legible before the third arrives. A tab switch nobody can read is not a tab
   switch.

3. **Sub-frame timings.** 25 ms per character and 30 ms per bar are both finer
   than a frame at 30 fps (33.333 ms). They are kept at the stated values
   because the aggregate rate is what reads — about 1.3 characters per frame —
   rather than rounded up to a frame boundary, which would slow the typing by a
   third.

---

## 1 · The curve

Every Speed Curve value in the source document arrived blank, including the one
under "THE SECRET SAUCE". The surviving description — *fast start, slow end,
zero bounce, the Linear.app curve* — matches the house curve already pinned in
`SPEC.md`, so that is what is used throughout:

```
cubic-bezier(0.22, 1, 0.36, 1)
```

In the Graph Editor that is **out influence 1, in influence 88**: leaves
instantly, settles long. Nothing in the piece is linear except the typewriter's
Range Offset, which is linear on purpose (§4).

> **Use the Speed Graph, not the Value Graph.** The Value Graph shapes position;
> the Speed Graph shapes velocity, and velocity is what the eye reads as weight.

| Move | In inf | Out inf | Note |
|---|---|---|---|
| Anything entering and settling | 88 | 1 | The house curve. |
| Overshoot peak (mark, card pop) | 62 | 8 | Passes *through* the peak rather than resting on it. |
| Typewriter Range Offset | 50 | 50 | Linear. Constant character rate. |
| Anything leaving frame | 70 | 1 | Slower to release than to arrive. |

---

## 2 · Layer stack

Bottom-up, as the comp stacks. All times in **ms from comp start**.

| # | Layer | Type | In | Out | What it does |
|---|---|---|---|---|---|
| 01 | `01 WALL` | Footage | 0 | 12000 | Blur 100→0, scale 105→100 over 600–2000 |
| 02 | `02 MARK GLOW` | Solid + 40px blur | 0 | 920 | White @20%, opacity 0→30 over 500 |
| 02 | `02 MARK SLAB` | Shape (glass) | 0 | 920 | 196×196 r44, fill 9%, stroke 16% |
| 02 | `02 MARK C` | Text | 0 | 920 | Archivo Black 62 |
| 02 | `02 MARK TILE` | Shape | 0 | 920 | 26×26 r7 teal |
| 02 | `02 MARK CTRL` | Null | 0 | 920 | Drives all four: scale 0→110→100 |
| 03 | `03 PANEL` | Shape + Drop Shadow | 2000 | 10200 | 1120×566 r26, fill 87% |
| 03 | `03 PANEL CTRL` | Null | 2000 | 10200 | Y +120→0 over 320 |
| 03 | `03 WORDMARK` / `SUB` / `READOUT` | Text | 2000 | 10200 | Window head |
| 04 | `04 TAB ×3` | Text | 2000 | 10200 | Active 100%, inactive 42% |
| 04 | `04 TAB UNDERLINE` | Solid 84×2 | 2000 | 10200 | Slides 0→120→240 |
| 05 | `05 TAB BODY 0/1/2` | Null | 2000 | 10200 | Crossfade weights |
| 06 | `06 BAR ×26` | Solid 4×104 | 3200 | 6450 | Expression-driven scale Y |
| 07 | `07 ROW ×3` | Text + animator | 4500 | 6450 | Range Offset per row |
| 07 | `07 CARET` | Solid 2×20 | 4500 | 6450 | 500 ms cycle |
| 08 | `08 EVENT ×3` | Text | 6450 | 7300 | Tab two |
| 09 | `09 CARD ×2` | Shape | 7300 | 10200 | Pop 95→105→100 |
| 09 | `09 FIGURE ×2` | Text + Slider | 7300 | 10200 | 0→target over 1200 |
| 10 | `10 LOCKUP` / `RULE` / `TAGLINE` | Text + Solid | 10000 | 12000 | Staggered 0 / 160 / 280 |
| 11 | `11 LIFT` / `BLOOM` / `VIGNETTE` / `GRAIN` | Solids | 0 | 12000 | The grade |

---

## 3 · Graph Editor values

Read as **Speed Graph influence %** — the number in the keyframe dialog.

### 0–600 ms · Mark load

Three properties on three different durations. That is the whole trick: if they
shared one duration the mark would arrive as a single flat pop. Staggered, the
shape lands first and the light catches up, and the eye reads it as an object.

| Property | ms | Value | In inf | Out inf |
|---|---|---|---|---|
| `MARK CTRL` Scale | 0 | 0 | 1 | 1 |
| | 372 | **110** | 62 | 8 |
| | 600 | 100 | **88** | 1 |
| `MARK CTRL` Opacity | 0 | 0 | 1 | 1 |
| | 300 | 100 | 88 | 1 |
| `MARK GLOW` Opacity | 0 | 0 | 1 | 1 |
| | 500 | 30 | 88 | 1 |
| `MARK CTRL` Scale *(handoff)* | 600 | 100 | 1 | 1 |
| | 920 | 118 | 88 | 1 |
| `MARK CTRL` Opacity *(handoff)* | 600 | 100 | 1 | 1 |
| | 920 | 0 | 88 | 1 |

The exit grows and dissolves rather than shrinking, so it reads as the camera
moving past the mark, not as an element being deleted.

### 600–2000 ms · Wallpaper

Blur and scale **must share the curve and the duration**. A blur that lands
before the scale does reads as two effects; together they read as one lens
finding focus.

| Property | ms | Value | In inf | Out inf |
|---|---|---|---|---|
| `WALL` Gaussian Blur | 600 | 100 | 1 | 1 |
| | 2000 | 0 | 88 | 1 |
| `WALL` Scale | 600 | 105% | 1 | 1 |
| | 2000 | 100% | 88 | 1 |
| `WALL` Gaussian Blur *(DoF)* | 2000 | 0 | 1 | 1 |
| | 2320 | **16** | 88 | 1 |
| `WALL` Opacity | 9700 | 72 | 1 | 1 |
| | 10300 | 24 | 88 | 1 |

The 16 px is the depth of field the document asks a 50 mm camera for. It has to
be a real amount — at 8 px the frame has two sharp planes and reads flat.

The opacity drop at 9700 is not decoration: the lockup is white type with no
panel behind it, and the brightest part of the photograph runs straight through
where it sits.

### 2000–2320 ms · Panel

Shadow blooms on the same curve over the same duration as the move. A panel that
arrives before its shadow looks pasted on; tying them together is what makes it
read as an object with weight.

| Property | ms | Value | In inf | Out inf |
|---|---|---|---|---|
| `PANEL CTRL` Position Y | 2000 | +120 | 1 | 1 |
| | 2320 | 0 | 88 | 1 |
| `PANEL CTRL` Opacity | 2000 | 0 | 1 | 1 |
| | 2320 | 100 | 88 | 1 |
| `PANEL` Drop Shadow Blur | 2000 | 0 | 1 | 1 |
| | 2320 | 40 | 88 | 1 |
| `PANEL` Drop Shadow Opacity | 2000 | 0 | 1 | 1 |
| | 2320 | 15% | 88 | 1 |

**Panel material.** The document says "85% opacity + 15 px Gaussian Blur + 1 px
white stroke at 10%". The 85% is the load-bearing number and it is easy to
misread: it means a panel that is nearly **opaque**, not a white wash over a
photograph. Built the other way the wallpaper reads through at full contrast and
the UI type has to fight it — the difference between glass and cellophane.

- Fill `#121414` at **87%**
- Stroke `#FFFFFF` 1 px at **10%**
- A separate sheen layer, `linear-gradient(163°, white 7% → 0%)`, for the lit
  top edge — over the fill, not mixed into it

### 3200–4500 ms · Signal bars

| Property | Value |
|---|---|
| Bars | 26 × (4 × 104 px), 11 px pitch |
| Cycle | Scale Y 20 → 100 → 60 → 20 |
| Per bar | **150 ms** |
| Stagger | **30 ms** |
| Colour | Every 5th `#00A9A4`, rest white @55% |

The stagger is why it reads as organic. Every bar on the same phase is an
equaliser graphic; each one 30 ms behind its neighbour is a wave travelling
along the row. Expression-driven, not keyed — 26 bars × 3 keys is 78 keyframes
nobody wants to re-time.

### 4500–6450 ms · Typewriter

| Property | Value |
|---|---|
| Per character | **25 ms** |
| Between lines | **60 ms** |
| Per glyph | Opacity 0→100, Position X **+8→0** |
| Caret | 500 ms cycle, 250 lit / 250 dark |

The X offset is what separates this from a fade: every glyph arrives from
slightly ahead of its slot, so the line has direction.

**Do not ease the Range Offset.** It is linear (50/50) so characters arrive at a
constant rate. Eased, the typing reads mechanical at one end and rushed at the
other.

### 6300–7400 ms · Tab switch

| Property | ms | Value | In inf | Out inf |
|---|---|---|---|---|
| `UNDERLINE` Position X | 6300 | 0 | 1 | 1 |
| | 6550 | 120 | 88 | 1 |
| | 7150 | 120 | 1 | 1 |
| | 7400 | 240 | 88 | 1 |
| Outgoing body Opacity | *switch* | 100 → 0 over **150** | 88 | 1 |
| Incoming body Opacity | *switch + 100* | 0 → 100 over **200** | 88 | 1 |

The incoming panel starts 50 ms **before** the outgoing one finishes. That
overlap is the entire difference between a crossfade and a blink.

The underline is **one layer that slides**. Three underlines fading in and out
would lose the sense of a single indicator moving between destinations.

### 8000–9200 ms · Counters

| Property | ms | Value | In inf | Out inf |
|---|---|---|---|---|
| `FIGURE` Slider | 8000 | 0 | 1 | 1 |
| | 9200 | target | **88** | 1 |
| `CARD` Scale | 8960 | 95 | 1 | 1 |
| | 9140 | **105** | 62 | 8 |
| | 9360 | 100 | 88 | 1 |

The pop starts at **80% of the run** and therefore lands *before* the number
stops. That is deliberate: the card is reacting to the count finishing, and a
reaction that arrives after the event it is reacting to reads as lag.

Expression on the text source:

```js
Math.round(effect("Slider Control")("Slider")).toFixed(0)
```

Set `font-variant-numeric: tabular-nums` (or a monospaced figure set) or the
number will jitter horizontally as digits change width.

### 10000–12000 ms · Lockup

| Element | Delay | Move | Y | Opacity |
|---|---|---|---|---|
| `LOCKUP` | 0 | 400 | +10 → 0 | 0 → 100 |
| `RULE` | 160 | 400 | — | Scale X 0 → 100 |
| `TAGLINE` | 280 | 400 | +10 → 0 | 0 → 78 |

Then a **500 ms hold**. The three elements resolve in reading order rather than
together — the same staggered arrival as the mark at the top, which is what
makes the piece close its loop instead of just stopping.

---

## 4 · Grade

One layer set over the whole frame. Grading per element is how a frame ends up
incoherent: every element gets graded by the amount whoever built it remembered,
rather than by the same amount.

| Layer | Mode | Value |
|---|---|---|
| `11 LIFT` | Screen | `#1C2222` @ 5% — raises the shadow floor without touching highlights |
| `11 BLOOM` | Screen | Radial teal from 50%/92%, @13% — the dark frame is never flat black |
| `11 VIGNETTE` | Normal | Subtract mask, 320 px feather, −40 expansion, @15% |
| `11 GRAIN` | Overlay | Fractal noise, 4 octaves, @13%, **reseeded every frame** |

Grain that does not reseed reads as a texture overlay rather than as film. In
AE: `evolution = time * 900`. In the Remotion build the filter id is keyed to a
4-frame step so the browser cannot reuse the previous frame's result.

Grain sits **over** the grade so it is not itself graded.

---

## 5 · Sound (not built)

From the source document, unbuilt in both the Remotion and AE versions:

| ms | Cue |
|---|---|
| 0 | Soft digital whoosh |
| 2000 | UI click on the panel landing |
| 4500 | Keystrokes synced to characters |
| 8000 | Clean "ding" as the counter settles |

High-pass all SFX above 3 kHz. Music 95–100 BPM — at 12.000 s that is 19–20
beats, so the panel landing at 2000 ms and the counter finishing at 9200 ms both
sit close to a bar line at 100 BPM.

---

## 6 · Placeholder content — read before publishing

**None of the figures or names in this piece is a claim CTRL Room has made.**

| Item | Status |
|---|---|
| `978 places indexed` | **PLACEHOLDER.** Replace with a real figure or cut the counter beat. |
| `19 areas covered` | **PLACEHOLDER.** Same. |
| Placeholder Roastery / Kitchen / Rooftop | **PLACEHOLDER.** Shape of a CTRL Picks result, not real venues. |
| Placeholder Night / Session / Weekend | **PLACEHOLDER.** |
| `TBC` dates | Intentional — no event dates exist yet. |

They live in one place in each build: `COUNTERS` and `LIST_ROWS` in
`src/flow/lib/timeline.ts`, and `COUNT_A` / `COUNT_B` / `ROWS` at the top of
`CTRL_Flow.jsx`.

---

## 7 · Status

| Build | Verified |
|---|---|
| `src/flow` (Remotion) | **Yes.** Rendered at 1920×1080 and inspected frame by frame at every beat. |
| `ae/CTRL_Flow.jsx` | **No.** Written against the same beat sheet, but no After Effects exists in the environment it was authored in. The timings are known good; the ExtendScript is not. Run it on a scratch project first. |

Known gaps in the AE script, reported by the script itself when it finishes:

- The wallpaper import needs a PNG or JPG on AE versions that cannot read
  `.webp`. It falls back to a flat solid and says so.
- The caret is a static bar at the first row's start rather than following the
  typing head. Parent it to the end of the typing row, or delete it.
