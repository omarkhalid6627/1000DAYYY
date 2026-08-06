# Component Tree

```
index.html
 └─ js/main.js                     bootstraps everything below, owns the
    │                              always-on ambient + character timelines
    │
    ├─ js/utils.js                 rand(), randInt(), pick(), clamp(),
    │                              delay(), DOM helpers — no state
    │
    ├─ js/audio.js       AudioManager
    │     .playSFX(name)           hover / click / envelope / typeKey /
    │                              giftOpen / replayChime — no-ops silently
    │                              if the file isn't present yet
    │     .playMusic() / .fadeMusic(vol, duration)
    │
    ├─ js/particles.js   ParticleSystem
    │     .spawnHeart() .spawnStar() .spawnSparkle()
    │     .burst(x, y, count, type)   — used by heart-select and gift-open
    │
    ├─ js/camera.js      CameraController
    │     .zoomTo(scale, duration)  .floatLoop()  .shake(px, duration)
    │     (single source of truth for the "camera" transform so scenes
    │      never fight each other over it)
    │
    └─ js/sceneManager.js  SceneManager
          .register(id, sceneInstance)
          .transitionTo(id)          runs current.pause() → transition fx
                                      → current.destroy() → next.init()
                                      → next.play()
          .restartAll()              replay button entry point

          js/scenes/intro.js      IntroScene    { init, play, pause, destroy, restart }
          js/scenes/letter.js     LetterScene   { init, play, pause, destroy, restart }
          js/scenes/gift.js       GiftScene     { init, play, pause, destroy, restart }
          js/scenes/console.js    ConsoleScene  { init, play, pause, destroy, restart }
          js/scenes/ending.js     EndingScene   { init, play, pause, destroy, restart }
```

## Ownership rules (so scenes stay independent)
- **Ambient world (sky/clouds/stars/hearts/sparkles) and the character's
  idle loop live in `main.js`**, not inside any scene — they must survive
  every `transitionTo()` untouched, per Part 4 of the spec ("nothing in
  the world freezes").
- **Every scene is a plain object with the same five-method interface.**
  `SceneManager` never reaches into a scene's internals; it only calls
  those five methods. This is what makes "implement scene by scene"
  possible without the earlier scenes breaking.
- **Only one GSAP timeline per scene is exposed** (`this.timeline`) so
  `destroy()` can always do `this.timeline.kill()` and guarantee no leaked
  tweens — matches the spec's "every timeline must be killable" rule.
- **CameraController is the only thing allowed to transform the stage
  wrapper.** Scenes ask the camera for a zoom/shake; they never set
  `transform` on the root element directly.
