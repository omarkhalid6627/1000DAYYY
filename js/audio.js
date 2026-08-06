/**
 * AudioManager
 * Every hook point named in the spec (Part 4 "Audio Timeline") is wired up
 * here. Claude cannot synthesize the actual audio files — drop real files
 * into assets/audio/ using the names below and they'll play automatically;
 * until then every call below fails silently so animations never break.
 */
const SFX_FILES = {
  hover: 'assets/audio/sfx/hover.mp3',
  click: 'assets/audio/sfx/click.mp3',
  envelope: 'assets/audio/sfx/envelope.mp3',
  typeKey: 'assets/audio/sfx/type-key.mp3',
  giftOpen: 'assets/audio/sfx/gift-open.mp3',
  replayChime: 'assets/audio/sfx/replay-chime.mp3',
};
const MUSIC_FILE = 'assets/audio/music/bg-loop.mp3';

export class AudioManager {
  constructor() {
    this.enabled = true;
    this.sfx = {};
    for (const [name, src] of Object.entries(SFX_FILES)) {
      const a = new Audio(src);
      a.volume = 0.5;
      a.onerror = () => { this.sfx[name] = null; };
      this.sfx[name] = a;
    }
    this.music = new Audio(MUSIC_FILE);
    this.music.loop = true;
    this.music.volume = 0;
    this.music.onerror = () => { this.music = null; };
  }

  playSFX(name) {
    if (!this.enabled) return;
    const a = this.sfx[name];
    if (!a) return;
    try {
      const instance = a.cloneNode();
      instance.volume = a.volume;
      instance.play().catch(() => {});
    } catch (e) { /* no audio file yet — fine */ }
  }

  playMusic() {
    if (!this.music) return;
    this.music.play().catch(() => {});
    this.fadeMusic(0.35, 2000);
  }

  fadeMusic(targetVol, durationMs) {
    if (!this.music) return;
    const start = this.music.volume;
    const startTime = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - startTime) / durationMs);
      this.music.volume = start + (targetVol - start) * t;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
}
