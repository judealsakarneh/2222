# CTRL Room — Motion Reel · Build Sheet

`1920×1080 · 30 fps · 5.000 s (150 frames) · Motion Blur ON · 180° shutter, −90° phase`
Export: H.264, 20 Mbps, VBR 2-pass, Square pixels, Progressive.

---

## 1 · Layer stack

Listed bottom-up, exactly as the comp stacks. Every time is in **ms from comp start**.

| # | Layer | Type | In | Out | What it does |
|---|---|---|---|---|---|
| 01 | `01 FIELD` | Solid + Ramp | 0 | 5000 | Radial teal→ink, opacity 0→100 over 0–300 |
| 01b | `01b FIELD BLOOM` | Solid + Ramp + 180px blur | 0 | 5000 | Screen @38%, drifts on a 3.9s / 4.7s expression |
| 02 | `02 SWEEP` | Shape + Trim + Glow | 2200 | 3720 | Trim End 0→100, stroke 1→3→1 px |
| 03 | `03 PULSE ×5` | Shape + 30px Gaussian | 1800 | 3600 | 3 circles + 2 triangles, scale 0→140→110→100 |
| 04 | `04 MARK SLAB` | Shape (glass) | 0 | 620 | 196×196 r34, fill 7%, stroke 22% |
| 04 | `04 MARK CORE` | Shape + Glow | 0 | 620 | 52×52 teal square, glow intensity 0→2.2→0.7 |
| 05 | `05 KEYWORD` | Text + animator | 300 | 3560 | `SWITCHED`, per-char Y+60→0 + opacity |
| 06 | `06 LOCKUP` | Text | 3500 | 5000 | `CTRL ROOM`, scale 0→110→100 |
| 06 | `06 RULE` | Solid 340×1 | 3820 | 5000 | Scale X 0→100, teal hairline |
| 06 | `06 TAGLINE` | Text (mono) | 3920 | 5000 | Y+10→0, opacity 0→78 |
| 07 | `07 GRAIN` | Fractal Noise | 0 | 5000 | Overlay @5% |
| 07 | `07 VIGNETTE` | Solid + subtract mask | 0 | 5000 | 320px feather, −260 expansion, @52% |

---

## 2 · Graph Editor velocity values

Read as **Speed Graph** influence %, the number in the keyframe dialog.
The house curve is `cubic-bezier(0.22, 1, 0.36, 1)` → **out-influence 1, in-influence 88**: leaves instantly, settles long. Nothing is linear except the sweep's first half, which is deliberate.

| Layer · property | ms | Value | In inf | Out inf | Speed |
|---|---|---|---|---|---|
| **FIELD** Opacity | 0 | 0 | 1 | 1 | 0 |
| | 300 | 100 | 82 | 1 | 0 |
| **MARK** Scale | 0 | 95 | 1 | 1 | 0 |
| | 500 | 100 | **88** | 1 | 0 |
| | 620 | 150 | 1 | 60 | 0 |
| **MARK** Opacity | 220 | 100 | 78 | 1 | 0 |
| | 620 | 0 | 70 | 1 | 0 |
| **MARK CORE** Glow Intensity | 120 | 0 | 1 | 1 | 0 |
| | 420 | 2.2 | 70 | 8 | 0 |
| | 900 | 0.7 | 80 | 1 | 0 |
| **KEYWORD** Range Offset | 300 | −100 | 1 | 1 | 0 |
| | 1800 | 100 | 80 | 12 | 0 |
| **KEYWORD** Position Y | 300 | +60 | 1 | 1 | 0 |
| | 3560 | +34 | 60 | 60 | 0 |
| **PULSE** Scale *(t₀ = 1800 + delay)* | t₀ | 0 | 1 | 1 | 0 |
| | t₀+420 | **140** | 62 | 8 | 0 |
| | t₀+760 | **110** | 50 | 50 | 0 |
| | t₀+1000 | 100 | **88** | 1 | 0 |
| **PULSE** Opacity | t₀ | 0 | 1 | 1 | 0 |
| | t₀+260 | 100 | 78 | 1 | 0 |
| | 3600 | 35 | 70 | 1 | 0 |
| **SWEEP** Trim End | 2200 | 0 | 1 | 1 | 0 |
| | 2850 | 50 | **50** | **50** | — *linear through* |
| | 3500 | 100 | 1 | 30 | 0 — *ease in, accelerates out* |
| **SWEEP** Stroke Width | 2200 | 1 | 1 | 1 | 0 |
| | 2850 | 3 | 70 | 70 | 0 |
| | 3500 | 1 | 70 | 1 | 0 |
| **LOCKUP** Scale | 3500 | 0 | 1 | 1 | 0 |
| | 3800 | **110** | 58 | 6 | 0 |
| | 4000 | 100 | **88** | 1 | 0 |
| **TAGLINE** Position Y | 3920 | +10 | 1 | 1 | 0 |
| | 4320 | 0 | 85 | 1 | 0 |

**Per-character stagger.** 40 ms at 30 fps is **1.2 frames** — do not round it to 1. Across eight characters, rounding drifts the last glyph 1.6 frames early and the word stops landing with the 808. The Range Selector carries it: Offset −100 → 100 over 300–1800 ms, Shape **Ramp Up**, **Ease High 45%**, Ease Low 0%.

**Delays on the pulse group:** Circle A 0 · Circle B 90 · Circle C 180 · Tri A 250 · Tri B 330 ms.

---

## 3 · Palette + fonts

### Colour

| Token | Hex | Use |
|---|---|---|
| Ink | `#07090A` | Comp background, deepest field |
| Ink 2 | `#0B0B0B` | Secondary ground |
| **CTRL Teal** | `#006563` | Brand value. Solid fills, the far mass of the gradient |
| Teal Bright | `#00A9A4` | Accent type, sweep stroke, mark core, rule |
| Teal Light | `#4FD1CA` | Sweep highlight only — never as a fill |
| White | `#FFFFFF` | Display type, 20% strokes |

`#006563` is the brand deck value. It has no contrast as type on near-black, so it stays a **fill** colour and `#00A9A4` carries anything that has to be read. Two teals, one family, no drift.

### Type

| Role | Face | Size | Tracking | Weight |
|---|---|---|---|---|
| Keyword | **Archivo Bold** | 172 px | −45 | 700 |
| Lockup | **Archivo Black** | 152 px | −35 | 900 |
| Tagline | **JetBrains Mono Medium** | 30 px | +340 | 500 |

Archivo, not Inter. A variable grotesque drawn for news setting, with a real width axis — Inter is the single most common tell of a generated piece. JetBrains Mono is the instrumentation layer, and it is what makes the frame read as a control room rather than a title card.

---

## 4 · Sound design cue sheet

128 BPM = one beat every **468.75 ms**. All SFX high-passed above 2 kHz.

| ms | Cue | Note |
|---|---|---|
| 0 | Whoosh | Tail into the field fade; duck the bed 3 dB under it |
| 300 | Tick ×3 | 300 / 340 / 380 — lands on the first three characters |
| 1800 | 808 hit | On the pulse, sidechain the bed 40 ms |
| 2200 | Ping | On the sweep head leaving frame left |
| 3500 | Pop | On the lockup scale, tight — under 90 ms |
| 4500–5000 | Bed only | Let it breathe on the hold |

---

## 5 · Run it

1. Install **Archivo** and **JetBrains Mono**.
2. `File ▸ Scripts ▸ Run Script File…` → `CTRL_Room_Reel.jsx`
3. The script builds the comp, sets 180° shutter, and keys every value above.
4. Check the text layers — if a font is missing, AE substitutes silently.
