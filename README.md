# Motion projects

Remotion compositions, everything drawn in code. No images, no video assets, no
AI generation — every pixel is React, SVG, CSS and frame-driven maths.

| Composition | Format | Length | What it is |
| --- | --- | --- | --- |
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
