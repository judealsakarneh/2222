# Motion projects

Remotion compositions, everything drawn in code. No images, no video assets, no
AI generation — every pixel is React, SVG, CSS and frame-driven maths.

| Composition | Format | Length | What it is |
| --- | --- | --- | --- |
| `ZambleStory` | 1920×1080 @ 30fps | 690 frames / 23.0s | Night/paper worlds, shape-driven transitions — the slow cut |
| `ScreenCut` | 1920×1080 @ 30fps | 480 frames / 16.0s | Screen content — five transition mechanics inside one app shell |
| `LongTake` | 1080×1920 @ 30fps | 900 frames / 30.0s | zamble product film in one unbroken camera move |
| `ZambleTeaser` | 1080×1920 @ 30fps | 360 frames / 12.0s | Cyberpunk glitch teaser for zamble v2 |
| `RambleAd` | 1080×1920 @ 30fps | 600 frames / 20.0s | The ramble. product film, for Reels / TikTok |
| `AEDemoReel` | 1080×1080 @ 30fps | 450 frames / 15.0s | Square reel of six After Effects style animations |

## Setup

```bash
npm install
```

## Preview

```bash
npm start          # Remotion Studio — scrub the whole timeline
```

## Render

```bash
npm run build:story  # ZambleStory  -> out/zamble-story.mp4
npm run build:screen # ScreenCut    -> out/zamble-screencut.mp4
npm run build:long   # LongTake     -> out/zamble-longtake.mp4
npm run build:teaser # ZambleTeaser -> out/zamble-teaser.mp4
npm run build        # RambleAd     -> out/ramble.mp4
npm run build:reel   # AEDemoReel   -> out/demo-reel.mp4
npm run still        # single frame -> out/ramble-thumbnail.png
```

Or directly:

```bash
npx remotion studio src/index.ts
npx remotion render src/index.ts RambleAd out/ramble.mp4
```

## Structure

```
src/
  index.ts                  registerRoot
  Root.tsx                  both <Composition> definitions
  RambleAd.tsx              the product film — layer stack + scene timeline

  lib/
    easing.ts               the four shared curves + spring configs
    tokens.ts               colours, panel material, type ramp
    fonts.ts                Instrument Serif + Inter via @remotion/google-fonts
    random.ts               deterministic hash (never Math.random)

  components/
    AmbientGlow.tsx         breathing/drifting emerald bloom  (persistent, z0)
    Vignette.tsx            inner falloff                      (persistent, z89)
    Grain.tsx               jittering film grain               (persistent, z90)
    Panel.tsx               the panel material
    MotionBlurTrail.tsx     ghost-copy shutter blur
    SceneShell.tsx          mount gating + scene overlap
    KineticWords.tsx        word-staggered headline reveal
    DustMotes.tsx           18 drifting motes

  scenes/
    Scene01Mark.tsx         000-066  cold open, the mark draws on
    Scene02Line1.tsx        066-118  "You know the idea cold."
    Scene03Line2.tsx        118-172  "You just never sit down / and build the deck."
    Scene04Voice.tsx        172-286  voice capture — waveform + live transcript
    Scene05Research.tsx     286-372  research streaming — four rows complete
    Scene06Deck.tsx         372-486  3D deck assembly + zoom-through
    Scene07Payoff.tsx       486-540  the payoff — 47s, counted up
    Scene08Cta.tsx          540-600  CTA

  audio/
    cues.ts                 frame-exact cue sheet + layer notes
    AudioDesign.tsx         wires cues to files (off by default)
```

## Design system

| Token | Value | |
| --- | --- | --- |
| `bg-deep` | `#060A08` | base |
| `bg-panel-1` / `bg-panel-2` | `#0E1A16` / `#070E0C` | panel gradient ends |
| `ink` | `#17E8A8` | primary emerald |
| `ink-dim` / `ink-bright` | `#0C6B4E` / `#43F0BB` | |
| `text` / `text-mute` / `text-faint` | `#F1F3F0` / `#68786F` / `#3E4A44` | |

Headlines are Instrument Serif 400 at 1.12 leading and −0.01em tracking. UI labels
are Inter 700 / 10px / 0.16em / uppercase. Body is Inter 400.

**Panel material** — every surface, never a flat fill:

```
linear-gradient(165deg, #0E1A16 0%, #0A1310 60%, #070E0C 100%)
border: 1px solid rgba(23,232,168,0.16)
box-shadow: 0 30px 70px -24px rgba(0,0,0,0.9), inset 0 1px 0 rgba(23,232,168,0.14)
```

**Easing** — four curves, nothing linear, nothing default:

| Use | Curve |
| --- | --- |
| Standard move | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Fast exit | `cubic-bezier(0.55, 0, 1, 0.45)` |
| Camera | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Settle | `spring({ damping: 14, stiffness: 110, mass: 0.8 })` |

## How it works

**Everything is a pure function of the frame.** No CSS `@keyframes`, no
`transition`, no wall-clock timers. Remotion renders frames out of order and in
parallel, so any animation that isn't derived from `useCurrentFrame()` would
desync. That includes the "random" bits: the dust motes and every scattered value
come from the seeded hash in `lib/random.ts`, so frame 40 is identical on the
tenth render as on the first. The waveform is the clearest case — 34 bars driven
by two multiplied sine terms over `(frame, barIndex)`, which looks organic and is
bit-for-bit reproducible.

**Scenes overlap; they are not `<Sequence>`s.** Each scene reads absolute frame
numbers and `SceneShell` mounts it 6 frames before its nominal start, so the
outgoing scene is still exiting as the incoming one arrives. There is never an
empty frame, and every cut is a camera action — a push-in, a dolly, or the
zoom-through — rather than a dissolve between unrelated states.

**Motion blur is real ghost geometry.** Remotion has no shutter blur, so on the
scene 6 zoom-through (`scale 1 → 4.2` in 16 frames) `MotionBlurTrail` renders the
subject three extra times at *trailing* scale offsets with falling opacity
(0.35 / 0.2 / 0.1). Trailing matters: ghosts placed ahead of the motion read as
double-vision, ghosts behind it read as a smear.

**Nothing is ever fully static.** The ambient glow breathes on a 180-frame loop
and drifts on a 270-frame loop; the grain reseeds and jumps position every 4
frames; the 3D rig orbits 14°; the CTA rings pulse through the final frame.

**GPU-safe only.** Animated values are `transform`, `opacity` and `filter`, with
`will-change` on every animated wrapper. The brief specified the CTA pulse as an
animated `box-shadow` spread; that would force paint every frame, so it is a
scaling ring element instead — pixel-equivalent, and it stays on the compositor.

**3D needs its own perspective.** In scene 6 the perspective is established
*inside* the element the ghosts duplicate, because an ancestor with `opacity < 1`
flattens `transform-style: preserve-3d` and would collapse every card to z = 0.

### Where this deviates from the brief, and why

- **Deck cards are 480×620 at z −300, not 560×700 at z −260.** At the briefed
  values three cards project past both edges of a 1080px frame and bury the hero
  card. Same composition, now with margin.
- **Flank cards are dimmed to 50%.** They are partly occluded by the hero card,
  and half-legible text reads as a rendering bug; dimmed, it reads as depth.
- **The payoff number is 300px, not 200px.** At 200px in a 9:16 frame it reads as
  a caption rather than a claim.
- **Grain steps via `floor(frame / 4) % 8`.** The brief said `frame % 4` into an
  8-entry table, which only ever reaches 4 of them and changes every frame; this
  re-randomises every 4 frames and cycles all 8, which is what was asked for.
- **The waveform's 6px bars are distributed across the panel** rather than sitting
  at a fixed 6px gap, which would leave a 400px cluster in a 748px panel.

## Sound

The film is cut to a frame-exact cue sheet in `src/audio/cues.ts` — every impact
sits on a frame where something visually lands. Each entry records the layer stack
the hit should be built from, because a single tone always sounds cheap: sub for
weight, mid body for punch, a high transient for attack, and a tail for air.

Audio is **off by default** so the project renders on a clean checkout. To enable:

1. Drop files into `public/audio/` using the `file` names listed in `cues.ts`
   (`impact-big.mp3`, `riser.mp3`, `whoosh-sub.mp3`, `bed-drone.mp3`, …).
2. In `RambleAd.tsx`, change `<AudioDesign />` to `<AudioDesign enabled />`.

The bed is a constant low drone — two sine oscillators at 55Hz and 82.5Hz at gain
0.016 — running under all 600 frames.

---

# zamble v2 teaser

A 12-second cyberpunk product teaser: growth flex → asset montage → feature
callouts → product reveal → CTA. Built from a frame-by-frame breakdown of a
reference reel, rebuilt for zamble.

## Structure

```
src/
  ZambleTeaser.tsx            layer stack + scene timeline

  teaser/lib/
    timeline.ts               scene windows + global transition windows
    tokens.ts                 colours, copy, brand name, easing
    fonts.ts                  JetBrains Mono
    ascii.ts                  the procedural ASCII generators

  teaser/components/
    GlitchLayer.tsx           RGB channel split + slice displacement (global)
    GlitchText.tsx            chromatic-split text with glyph-noise resolve
    Scanlines.tsx             CRT lines + sweeping band
    TeaserGrain.tsx           reseeding film grain
    CodeRain.tsx              upward code particles
    DataCoords.tsx            scrolling telemetry
    WireframeGrid.tsx         rotating grid + floating data points
    AsciiCanvas.tsx           renders a generated ASCII frame
    SceneGate.tsx             hard-cut scene mounting

  teaser/scenes/
    S1Counter.tsx             000-045  3277 -> 62000+ with digit scramble
    S2Montage.tsx             045-120  8 hard cuts of ASCII art
    S3Features.tsx            120-210  three lines typed into a terminal
    S4Reveal.tsx              210-300  wordmark resolves out of noise
    S5Cta.tsx                 300-360  "coming soon", flickering

  teaser/audio/
    cues.ts                   frame-exact cue sheet + layer notes
    AudioDesign.tsx           wires cues to files (off by default)
```

## Design system

| Token | Value |
| --- | --- |
| background | `#0a0a0a` |
| primary (all live text) | `#00ffcc` |
| accent | `#9333ea` |
| highlight | `#ffffff` |
| face | JetBrains Mono 400 / 700 / 800 |
| easing | `cubic-bezier(0.22, 1, 0.36, 1)` — every move, no exceptions |

## How the effects actually work

**The glitch is real channel separation, not a coloured shadow.** `GlitchLayer`
wraps the entire scene stack and renders it twice through `feColorMatrix`
isolators — red-only and cyan-only — offset in opposite directions and
recombined with `mix-blend-mode: screen`. Screen of red-only over cyan-only
reconstructs the original exactly at zero offset, so the effect vanishes cleanly
when intensity hits zero. On top of that, four horizontal slices are clipped
copies of the same subtree torn sideways, re-rolled every 2 frames so the tear
stutters instead of sliding.

**Transitions are global, not per-scene.** Because `GlitchLayer` sits above all
five scenes, a cut is one event that tears the whole frame — which is what a hard
glitch cut is. Building it inside each scene would produce two crossfades wearing
a glitch costume. Scenes themselves cut hard, with no dissolve.

**The montage assets are generated, not drawn.** There are no images anywhere.
`lib/ascii.ts` computes each frame's art from maths: a lambert-shaded sphere with
an orbiting light, a z-buffered rotating torus, a bar-chart render, a signal
trace, a scan grid, an interference field, and a shaded portrait bust. All are
pure functions of `(frame, cols, rows)`.

**Everything is frame-driven and reproducible.** No CSS keyframes, no
transitions, no wall-clock timers, no `Math.random` — all scatter comes from the
seeded hash in `src/lib/random.ts`, so every render is identical.

**The glitch envelope is asymmetric** — fast build, fast decay. A symmetric ramp
reads as a dissolve rather than a fault.

### Things worth knowing if you edit it

- **Rebranding is one line.** `BRAND` and `PRODUCT` in `teaser/lib/tokens.ts`.
  All on-screen copy lives in `COPY` in the same file.
- **The growth numbers are placeholders** carried over from the reference
  (`STATS` in tokens.ts). Swap them for real figures before publishing.
- **Only the last two digits of the counter scramble.** Scrambling all of them
  destroys the number — the viewer stops reading a figure and sees noise.
- **Glyphs are limited to the latin subset.** The tagline uses `->` rather than
  `→` because U+2192 is not in the subset the font loads.
- **`S2Montage` returns early when off-screen.** A scene component's body runs on
  every frame of the film even when its gate renders null, so the montage bails
  before computing ASCII (and before indexing its playlist with a negative cut
  index).

## Sound

Frame-exact cue sheet in `src/teaser/audio/cues.ts` — low synth pad under
everything, digital whooshes on the camera moves, keyboard ticks on the typed
lines, glitch stutters on the hard cuts. Each entry records the layer stack the
hit should be built from, because a single tone always sounds cheap.

Off by default so the project renders on a clean checkout. To enable: drop files
into `public/audio/` using the names in `cues.ts`, then change `<AudioDesign />`
to `<AudioDesign enabled />` in `ZambleTeaser.tsx`.

---

# The Long Take

Thirty seconds, eight ideas, **zero cuts**. The whole film is one unbroken camera
move through a single 3D world, flying *through* eight stations that sit at fixed
depths along the Z axis.

## The architecture

Everything on screen is derived from one continuous quantity — the camera
position `cameraZ(frame)` in `longtake/lib/camera.ts` — or from its derivative:

| Effect | Derived from |
| --- | --- |
| which station is visible | depth relative to camera |
| depth of field (blur) | depth relative to camera |
| atmospheric fade | depth relative to camera |
| particle positions | depth relative to camera |
| speed streaks | camera velocity |
| lens fringing | camera velocity |
| exposure lift | camera velocity |

That coupling is the entire reason the piece feels smooth. It is not a set of
animations timed to agree with each other — it is one move, and everything else
is a consequence of it. There is nothing that *can* fall out of sync.

**The camera never stops.** At each station it decelerates into a slow forward
drift while you read, then accelerates away. A camera that halts completely is
just a cut with extra steps — and the final frame is still drifting.

## Structure

```
src/
  LongTake.tsx                layer stack + the world rig

  longtake/lib/
    camera.ts                 THE camera curve, station depths, depth response
    tokens.ts                 palette, brand, easing

  longtake/components/
    Station.tsx               places a station in world Z, applies depth response
    ParticleField.tsx         the 3D field the camera flies through
    SpeedFx.tsx               velocity-driven streaks + lens fringing
    Caption.tsx               word-staggered line with per-word Z parallax

  longtake/stations/
    StHook.tsx        arr 000  "Everyone has the idea."
    StVoice.tsx       arr 105  radial waveform aperture
    StTranscript.tsx  arr 230  typing + entities lifting into chips
    StResearch.tsx    arr 355  source graph wires itself up
    StOutline.tsx     arr 500  six slide titles rule themselves in
    StDeck.tsx        arr 630  fourteen slides as a breathing 3D wall
    StMetric.tsx      arr 745  a bar collapsing to 2.4% of its width
    StCta.tsx         arr 855  mark draws, button lands, still drifting

  longtake/audio/
    cues.ts                   frame-exact cue sheet, no stingers by design
    AudioDesign.tsx           wires cues to files (off by default)
```

## Palette

The world is cold data; the brand is the one warm signal in it. Emerald appears
only at product moments, so it carries meaning rather than being decoration.

| Token | Value | Role |
| --- | --- | --- |
| `void` | `#04060A` | deep space |
| `mist` | `#6E8CA0` | secondary text, cold |
| `ice` | `#A8D8F0` | the data colour |
| `signal` | `#17E8A8` | BRAND — used sparingly |
| `text` | `#EDF3F7` | headlines |

## Things worth knowing if you edit it

- **Stations enter view 125-160 frames before arrival**, not 40. Content is timed
  to *assemble during the approach* and be complete on arrival, with one payoff
  beat saved for the hold. If you retime a station, check it against
  `depthOpacity` or it will be visibly empty as it comes into view.
- **Peak camera velocity is ~247 units/frame**, so `speedNorm` normalises against
  180. Normalising against a guessed value saturates the streaks flat across
  every travel and throws away the dynamics the camera curve is producing.
- **Any station wanting internal depth must establish its own `perspective`.**
  `Station` sets `opacity`, which forces `transform-style: flat` on everything
  below it — without a local perspective, `StDeck`'s per-card Z collapses and the
  wall becomes a flat grid.
- **The research constellation is re-centred on its node centroid.** A jittered
  golden-angle spiral is not symmetric about its origin, so without that it hangs
  off to one side of frame.
- **Particles recycle by lap, not by mutation.** Remotion renders frames out of
  order, so a particle's depth is derived by wrapping the camera position into a
  repeating slab, and its lap number reseeds its x/y — a recycled particle comes
  back as a genuinely different one, deterministically.
- **Rebranding is one line**: `BRAND` in `longtake/lib/tokens.ts`.

## Sound

No stingers — there are no cuts, so a hard impact anywhere would imply an edit
that does not exist. Instead: one continuous pad whose low-pass cutoff is
automated to `speedNorm(frame)` (closed at stations, open mid-travel), plus soft
arrival blooms and travel swells. That single automation does more for the feel
than any individual cue. Frame-exact sheet in `src/longtake/audio/cues.ts`.

Off by default. Drop files into `public/audio/` and set `<AudioDesign enabled />`.

---

# Screen Cut

Sixteen seconds, six views, **five completely different transitions**. Built as
SCREEN CONTENT: play it full-screen and film it off a monitor, or post it as-is.

## What this is not

The reference reel this was modelled on shows a desk, plants and a keyboard —
but those are the poster's **real room, filmed on a phone**. Only what is on the
display is motion graphics. An AI breakdown of that reel described the desk as
"3D layers with depth", which is a hallucination, and an earlier version of this
composition wasted its effort building a CSS desk to match it. That is deleted.
This renders the thing that goes on the display.

## The anchor

Every change happens inside a **persistent app shell**. The top bar and the
bottom progress strip render once, outside the transition engine, and never move.
They do the job a monitor bezel does in a filmed ad: the eye holds a fixed frame,
so however violent the body gets, the change reads as a view swapping inside an
application rather than as a cut to a different shot.

That anchoring is what buys the variety — five mechanics in sixteen seconds and
it still reads as one continuous take.

## The five transitions

| Frame | Mechanic | How it works |
| --- | --- | --- |
| 096 | **Parallax swipe** | Outgoing exits left 120%; incoming enters from right 120% **and 50px lower**, rising to rest. The vertical offset is the whole reason it reads as parallax and not a conveyor belt. 12px motion blur + 2.4px real chromatic aberration. |
| 186 | **Feathered wipe** | 25px soft gradient mask with a hot emerald line riding the boundary. The leading edge turns "a rectangle growing" into "something being drawn". |
| 276 | **Iris** | Circular reveal opening from 37% / 29% — the measured centre of the highlighted card in the grid, which is also the slide the next page shows. Motivated, not decorative. |
| 360 | **Slice shuffle** | Six columns, alternating up/down, staggered left to right so the break sweeps rather than snaps. |
| 426 | **Whip pan** | Horizontal stretch with **true directional blur** — `feGaussianBlur stdDeviation="N 0"` blurs on X only. CSS `blur()` is isotropic and reads as out-of-focus rather than as fast. |

No two adjacent transitions share an axis or a mechanism.

## Details that sell it

- **Chromatic aberration is real channel separation** — the subtree rendered twice
  through `feColorMatrix` red-only and cyan-only isolators, offset opposite ways,
  recombined with `mix-blend-mode: screen`. That reconstructs losslessly at zero
  offset, so it vanishes cleanly instead of leaving a colour cast. Two copies, and
  only while a swipe is happening.
- **The hook line morphs into the input field** rather than cross-fading — it
  scales 68px → 30px and travels onto the field's line, so the sentence becomes
  the control you're about to use.
- **Brand colour wash** — a 4-frame 10% flash on the frames transitions land.
- **The crumb hands over out-then-in, never overlapping.** Cross-dissolving two
  different strings on top of each other renders as illegible mush.

## The character

`desk/components/ZambleMark.tsx` — a tangle that resolves into one clean line,
with two eyes at the moment it works out what you meant. Chosen from three
sketches because it is the only one that is a logo AND a character: it states the
product in a single stroke. The other two are charming creatures but say nothing
about what the product does.

It is authored as ONE continuous path, left to right, so `pathLength` +
`strokeDashoffset` makes the reveal literal — the stroke enters as chaos and
leaves as structure because that is the order the path is drawn in. The eyes only
open once the stroke has travelled past them: the character doesn't exist until
the line has made sense of itself. It blinks on an uneven cycle and the whole
mark keeps a small breath so it never freezes solid.

## Things worth knowing if you edit it

- **Every page needs its OWN opaque background.** This is load-bearing. A
  transparent page body lets the page underneath show straight through, so during
  a transition both render at full strength and it reads as two screenshots
  stacked — no amount of timing or easing can fix that. The outgoing page has to
  be genuinely occluded. (This broke when the pages were unwrapped from their old
  frame component, which had been supplying the background.)
- **Incoming pages must be populated before their transition lands.** A page whose
  content starts at its own `from` frame renders as an empty blur for the whole
  transition. Every page here starts its content during the approach.
- **Swipe easing is calibrated, not guessed.** A hard ease-out like
  `(0.16, 1, 0.3, 1)` is 93% complete at the halfway frame — the visible motion is
  over in five frames and the rest of the window is a blurred still. The curve
  used spreads travel across the window and keeps the deceleration at the end.
- **Blur is 12px, not the reference's 20.** That figure was for a 1400px screen
  inset in a 1920 frame; full-bleed over sparse dark UI, 20px stops being a smear
  and just fogs the page.
- **`SEND_FRAME` fires before the swipe window opens**, not during it — the send
  causes the transition, so it has to precede it.

## Sound

Diegetic first — this is an app, not a film, so the transitions get UI whooshes
rather than cinema impacts. Frame-exact sheet in `src/desk/audio/cues.ts`, off by
default; drop files into `public/audio/` and set `<AudioDesign enabled />`.

---

# Story

23 seconds, five scenes, two worlds. A rebuild of `ScreenCut` around two notes:
it was too fast to read, and every scene carried too much.

## What changed, and why

**Pacing.** Five scenes instead of six. Every hold is at least three seconds and
every transition is 24 frames (0.8s) instead of 12–18. The payoff number counts up
and then simply *sits there* for two seconds — a number nobody has time to read is
decoration, not a claim.

**Density.** One idea per scene. The grid of fourteen unreadable slide thumbnails
is gone: a single slide at full size makes the same point and can actually be
taken in. Type is much larger throughout.

**Two worlds.** Night for the product at work, cream paper for the moments of
understanding, alternating N–P–N–P–N. The light scenes are the film's breath — an
all-dark piece gives the eye nowhere to rest. The paper palette (cream `#F4F1E8`,
deep green `#0E7A5A`) is lifted straight from the brand sketches.

## The transitions — shapes, not page flips

| Frame | Mechanic | What happens |
| --- | --- | --- |
| 150 | **Zoom** | The camera pushes **through** the phrase being typed and comes out the other side on paper. The outgoing scene holds full opacity through the first 55% — that's what sells *through* rather than *fade*. |
| 330 | **Grow** | The dot the mark's line resolves into swells until it **is** the next scene. Three layers: outgoing, a plain circle of the new world's colour, and the new scene clipped to that circle but fading in **later** — you read "a shape is growing", then "the shape is a place". |
| 480 | **Push** | A sheet of paper slides up over the night scene, which drifts up and dims as it goes so both layers move together. |
| 600 | **Collapse** | The paper world shrinks to a point, and the point is the mark. The inverse of `grow`, closing the film's shape language. |

Scene 1 lays its prompt on two lines with the key phrase alone on the second,
pinned to the exact vertical centre of frame — not a layout accident. The zoom
pushes through it with transform-origin at dead centre, so the phrase has to *be*
the centre for the camera to travel into it cleanly. Scene 1 also starts its own
push-in at frame 118, so the camera is already moving when the transition takes
over and the handover is invisible.

## Things worth knowing if you edit it

- **Every scene owns an opaque background.** A transparent scene lets the one
  underneath show through, and both render at full strength — reading as two
  screenshots stacked. The outgoing scene has to be genuinely occluded.
- **Scene content must be underway before its transition lands.** A scene whose
  animations start at its own `from` frame arrives empty, and the transition has
  nothing to reveal. Every scene here starts its content 14–20 frames early.
- **Transition length is the readability lever.** 24 frames is the floor for a
  mechanic the eye can actually follow; below ~18 it registers as "something
  happened" rather than as a move.
