# Asset Production Plan

All sprites are produced as native low-resolution PNGs (hand-authored pixel
grids via a Python/Pillow script, not upscaled photos, not AI illustration)
and rendered in-browser with `image-rendering: pixelated`. Everything here
is original, generated for this project.

Legend: ✅ built this pass · ⏳ planned for a later scene pass · 🎧 needs
Omar to supply the actual file (Claude cannot synthesize audio)

## Characters — `assets/sprites/characters/`
**Superseded:** the hand-drawn layered sprites originally planned below were
replaced with Omar's own approved production art (`girl.png`, `boy.png`) —
flat, higher-fidelity character illustrations, background-removed for use
on the site, used as-is per his direction. No further character art is to
be generated; only extra animation frames if a specific animation turns
out to need one, in the same style as the approved art.

| Asset | Notes | Status |
|---|---|---|
| girl.png | Approved sprite — main on-screen character (Scenes 1, 5) | ✅ in use |
| boy.png | Approved sprite — reserved for wherever the spec calls for both (e.g. gift/photo content) | ✅ in use |
| ~~girl-body/hair/eyes/mouth.png~~ | Superseded, removed from the project | — |

## UI — `assets/sprites/ui/`
| Asset | Size | Notes | Status |
|---|---|---|---|
| dialogue-box-9slice.png | 48×48, 16px slices | Border-image for every text box/panel | ✅ |
| button-pink-9slice.png | 24×24, 8px slices | Start / Continue / Replay base | ✅ |
| button-cream-9slice.png | 24×24, 8px slices | Secondary buttons | ⏳ |
| cursor.png | 16×16 | Custom pixel cursor | ⏳ |
| envelope.png | 40×28 | ⏳ Scene 2 |
| letter-paper.png | 48×64 | ⏳ Scene 2 |
| gift-pink.png / gift-lavender.png / gift-mint.png | 32×32 | ⏳ Scene 3 |
| console-body.png | 96×128 | GBA-style shell | ⏳ Scene 4 |

## Particles — `assets/sprites/particles/`
| Asset | Size | Notes | Status |
|---|---|---|---|
| heart.png | 12×10 | Floating hearts + burst particles | ✅ |
| star.png | 6×6 | Background twinkle | ✅ |
| sparkle.png | 8×8 | Interaction sparkle | ✅ |
| confetti.png | 6×6 | ⏳ Scene 3 |
| petal.png | 8×8 | ⏳ Scene 3 |

## Backgrounds — `assets/sprites/backgrounds/`
| Asset | Size | Notes | Status |
|---|---|---|---|
| cloud-back.png | 64×24 | Slowest, most transparent layer | ✅ |
| cloud-mid.png | 48×20 | ✅ |
| cloud-front.png | 32×16 | Fastest, brightest | ✅ |

## Fonts — `assets/fonts/`
Using **Pixelify Sans** (headings/UI, bold+rounded, reads well at small
sizes) and **VT323** (body/letter text — narrower, better for longer
typewriter passages than Press Start 2P). Both are open-license pixel
fonts; self-hosted as woff2 rather than linked from Google Fonts, so the
page still works offline. ⏳ to be fetched in the implementation pass.

## Audio — `assets/audio/`
The code wires up `AudioManager` with the exact hook points from the spec
(hover, click, envelope-open, typing loop, gift-open, replay-chime,
background loop) and fails silently if a file is absent, so missing audio
never breaks an animation. Actual files are 🎧 — Omar will need to source
or record: one soft lofi loop, and six short SFX. Freesound.org (CC0
filter) is a reasonable source if he doesn't want to record originals.

## Palette (derived from Part 5's color language)
```
--color-lavender:   #C9B6E4
--color-pink:       #F4B6C2
--color-cream:      #FCEFDD
--color-peach:      #F6CBA6
--color-sky-blue:   #BFD7EA
--color-ink:        #4A3B36   /* "black" → warm dark brown */
--color-paper:      #FFF8EF   /* "white" → warm white */
--color-shadow:     #8E6A9C   /* shadows → purple, not gray */
```
