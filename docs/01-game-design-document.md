# Game Design Document — "1000 Days" Pixel Love Letter

## Concept
A single-page interactive pixel-art "game" that plays like a tiny handheld
love letter rather than a website. The player never fills out a form or reads
a wall of text — they press Start, pick a heart, open an envelope, unwrap
gifts, and end up holding a slideshow console. Every screen keeps moving,
even when the player does nothing.

## Core Pillars (in priority order)
1. **Feels handcrafted, not generated.** Pixel art, imperfect/organic motion,
   overshoot on entrances. Nothing snaps into place.
2. **Nothing is ever fully static.** Background, character and UI all idle-
   animate continuously, independent of user input.
3. **Emotional pacing over feature count.** Each scene has one job and one
   feeling; motion serves the feeling, not the other way round.
4. **Personal, not generic.** Copy, colors and pacing read as made for one
   specific person, not a template.

## Platform & Stack
- Static site: `index.html` + modular CSS/JS, no build step required.
- Animation: GSAP (vendored locally in `js/vendor/gsap.min.js`, no CDN
  dependency).
- No UI frameworks. Explicitly **not** using Bootstrap / Tailwind /
  Material UI / glassmorphism / modern flat-gradient card styling —
  everything is bespoke pixel-art.
- Responsive: desktop (centered stage), tablet (slight scale), phone
  (vertical rearrange) — character and primary buttons always stay visible
  and reachable.

## Scene List

| # | Scene | Player goal | Emotional beat |
|---|-------|-------------|-----------------|
| 1 | Intro | Press Start | Curiosity |
| 2 | Letter Select | Pick a heart → read the letter | Warmth → Emotion |
| 3 | Gifts | Open 3 gifts | Joy |
| 4 | Console | Watch the slideshow, press "Find You" | Nostalgia |
| 5 | Ending | Read the closing message | Peace |
| — | Replay | Restart, no reload | Excitement |

## Art Direction (summary — full detail in Asset Production Plan)
Pastel sunset palette (lavender → pink → cream), warm "black" (dark brown)
and warm "white," purple-tinted shadows. Native low-resolution sprites
(16–64px) scaled with `image-rendering: pixelated`. Pixel display font for
headings, a more legible pixel font for body/letter text.

## Audio Direction
Soft pixel-lofi background bed, quiet throughout. Short, non-jarring SFX
tied to specific animation events (hover, click, envelope, typing, gift,
replay). **Not produced by Claude** — see Asset Production Plan for the
hand-off plan, since audio synthesis isn't something this build can
generate; the code ships with the hooks wired and silently no-ops if a
file is missing so the experience never breaks without sound.

## Non-Goals
No login, no backend, no analytics, no scroll-jacking outside the scene
transitions themselves. No realistic lighting/shading. No stock icons or
emoji standing in for bespoke sprites.

## Definition of Done (per scene)
Scene is "done" when: all listed animations are implemented with GSAP
timelines (not CSS-only where the spec calls for eased/overshoot motion),
all sprites are real pixel-art files (no colored `<div>` placeholders),
the scene is fully keyboard/click operable, and it hands off cleanly to
the next scene via `SceneManager`.
