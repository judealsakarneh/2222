# AE Demo Reel — Remotion

A single Remotion composition that remakes six After Effects–style motion
animations back to back, entirely in code — no images, no video, no AI
generation, no design tools. 1080×1080, 30fps, 15 seconds.

## Setup

```bash
npm install
```

## Preview (Remotion Studio)

```bash
npm start
```

Opens Remotion Studio with live-reload scrubbing across all 450 frames.

## Render the final MP4

```bash
npm run build
```

Outputs to `out/demo-reel.mp4`.

## Render a thumbnail

```bash
npm run still
```

## Project structure

```
src/
  index.ts                 Remotion entry point (registerRoot)
  Root.tsx                 <Composition> definition (1080x1080 @ 30fps, 450f)
  DemoReel.tsx              Sequences every scene on the timeline
  style.css                 Tailwind directives
  lib/
    sceneTimings.ts         Frame ranges for all six scenes
    easing.ts                Shared cubic-bezier(0.22, 1, 0.36, 1) + accent colors
    fonts.ts                 Inter, loaded via @remotion/google-fonts
    transitions.tsx          SceneWrapper: crossfade + motion-blur between scenes
  components/
    Background.tsx           #0b0b0e radial-gradient backdrop
    icons.tsx                 Every SVG icon used in the reel, hand-authored
  scenes/
    Scene1Arrow.tsx           0:00–0:02.5  Glowing Arrow
    Scene2Logo.tsx             0:02.5–0:05  Logo Reveal
    Scene3Search.tsx           0:05–0:07.5  Search Bar
    Scene4AppGrid.tsx          0:07.5–0:10.5 App Icon Grid
    Scene5Notification.tsx     0:10.5–0:13  Notification
    Scene6Outro.tsx             0:13–0:15   Outro
```

## Scene notes

1. **Glowing Arrow** — "Keep Moving" fades/rises in, then a downward arrow
   fades in beneath it and settles into a continuous sine-driven glow pulse
   (animated `box-shadow`) and a gentle bob.
2. **Logo Reveal** — a ring draws itself via `stroke-dashoffset`, the
   play-mark logo scales in once the ring nears completion, then the
   "YouMotion" wordmark rises in.
3. **Search Bar** — the pill bar pops in, then "Search anything" types out
   character by character with a blinking caret.
4. **App Icon Grid** — nine hand-drawn SVG icons (mail, camera, music,
   chat, heart, calendar, photo, compass, settings) pop into a 3×3 grid
   with a 100ms stagger, using a spring for a tactile overshoot.
5. **Notification** — a bell icon scales in, then rings out exactly three
   sonar-style pulses (expanding ring + subtle scale "ding").
6. **Outro** — the closing line rises in, holds, then fades to black.

## Technical notes

- **Timing/easing** — every entrance/exit shares one bezier,
  `cubic-bezier(0.22, 1, 0.36, 1)` (see `lib/easing.ts`), applied via
  Remotion's `interpolate(..., {easing: Easing.bezier(...)})`. The icon
  grid and notification pulses intentionally use `spring()` instead, for a
  tactile bounce — the rest of the reel stays on the shared curve.
- **Framer Motion + Remotion** — Remotion renders frame-by-frame on the
  server, so it needs every value to be a pure function of the current
  frame. Framer Motion's own `animate`/`transition` timers are wall-clock
  driven and would desync from the render. This project uses Framer
  Motion's `motion.*` components as styled elements, but every animated
  value (opacity, transform, box-shadow) is computed from
  `useCurrentFrame()` via Remotion's `interpolate`/`spring` and passed in
  as plain `style` — deterministic, frame-accurate, and safe to render at
  any frame in any order.
- **Motion blur transitions** — `SceneWrapper` (`lib/transitions.tsx`)
  crossfades each scene in/out over 12 frames and applies a `blur()`
  filter proportional to how far into the transition it is, giving scene
  changes a soft swoosh instead of a hard cut.
- **60fps-safe** — every animated element sets `will-change: transform` (plus
  `opacity`/`filter` where relevant) so the compositor promotes it to its
  own layer instead of repainting.
- **Tailwind** — wired in via `@remotion/tailwind`'s webpack override
  (`remotion.config.ts`) for static layout/utility classes; per-frame
  animated values (which need continuous numeric interpolation, not
  discrete utility classes) are set via inline `style`.
