# Scene Flow Diagram

Every arrow is a `SceneManager.transitionTo()` call; the background/star/
cloud/heart timeline never stops, even across transitions.

```mermaid
stateDiagram-v2
    [*] --> Loading
    Loading --> Intro: fade in (400-600ms)

    Intro --> LetterSelect: Start clicked (camera zoom +5%, 900-1200ms)

    state LetterSelect {
        [*] --> HeartGrid
        HeartGrid --> EnvelopeSpawn: heart clicked (8-particle burst)
        EnvelopeSpawn --> EnvelopeOpen: after 500ms delay
        EnvelopeOpen --> LetterTypewriter: flap+ribbon animation done
        LetterTypewriter --> ContinueReady: last character typed
    }

    LetterSelect --> GiftScene: Continue clicked (fold-away + fall, 1000-1200ms)

    state GiftScene {
        [*] --> ThreeGifts
        ThreeGifts --> ThreeGifts: gift opened (repeats until 3/3)
        ThreeGifts --> AllOpened: 3rd gift opened
    }

    GiftScene --> ConsoleScene: vignette to near-black

    state ConsoleScene {
        [*] --> ConsoleBoot
        ConsoleBoot --> Slideshow: LCD boot sequence (1.4s)
        Slideshow --> Slideshow: auto-advance every 4s
    }

    ConsoleScene --> Ending: "Find You" clicked (white flash)

    Ending --> [*]: experience complete
    Ending --> Intro: Replay clicked (JS timeline reset, no page reload)
```

## Notes for implementation
- `LetterSelect`, `GiftScene` and `ConsoleScene` are drawn as sub-states
  because each owns an internal mini-flow, but externally `SceneManager`
  only ever sees five top-level scenes plus the replay loop.
- Replay resets scene state objects and re-runs each scene's `init()` —
  it does not reload `index.html`, per the spec.
- The background/character ambient timelines belong to `main.js`, not to
  any individual scene, precisely so they can survive every transition
  above without being torn down and rebuilt.
