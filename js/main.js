import { AudioManager } from './audio.js';
import { ParticleSystem } from './particles.js';
import { CameraController } from './camera.js';
import { SceneManager } from './sceneManager.js';
import { IntroScene } from './scenes/intro.js';
import { GreetingScene } from './scenes/greeting.js';
import { PasswordScene } from './scenes/password.js';
import { GiftScene } from './scenes/gift.js';
import { SurpriseScene } from './scenes/surprise.js';
import { EndingScene } from './scenes/ending.js';
import { LetterScene } from './scenes/letter.js';
import { PhotosScene } from './scenes/photos.js';
import { SongScene } from './scenes/song.js';
import { el, rand } from './utils.js';

function buildCloudLayer(container, src, count, duration, opacity, widthPx) {
  for (let i = 0; i < count; i++) {
    const cloud = el('img', 'cloud-sprite pixelated', container);
    cloud.src = src;
    cloud.style.width = `${widthPx}px`;
    cloud.style.top = `${rand(4, 55)}%`;
    cloud.style.opacity = opacity;
    gsap.fromTo(cloud,
      { xPercent: -30 },
      {
        xPercent: 130,
        duration,
        ease: 'none',
        repeat: -1,
        delay: (duration / count) * i,
      }
    );
  }
}

function showMissingScenePlaceholder(sceneUI, id) {
  const note = document.createElement('div');
  note.style.cssText = `
    position: absolute; left: 50%; bottom: 6%; transform: translateX(-50%);
    background: rgba(61,45,41,0.85); color: #FFF8EF; font-family: var(--font-body);
    font-size: 15px; padding: 8px 16px; border-radius: 4px; white-space: nowrap;
  `;
  note.textContent = `Scene "${id}" isn't built yet — continuing here for now.`;
  sceneUI.appendChild(note);
  gsap.from(note, { opacity: 0, y: 10, duration: 0.4 });
}

async function boot() {
  const stage = document.getElementById('stage');
  const stageInner = document.getElementById('stage-inner');
  const character = document.getElementById('character');
  const characterBoy = document.getElementById('character-boy');
  const sceneUI = document.getElementById('scene-ui');
  const starsLayer = document.getElementById('stars-layer');
  const heartsLayer = document.getElementById('hearts-layer');
  const sparkleLayer = document.getElementById('sparkle-layer');

  const audio = new AudioManager();
  const particles = new ParticleSystem({ starsLayer, heartsLayer, sparkleLayer });
  const camera = new CameraController(stageInner);

  // ---- background timeline: never stops, never owned by a scene ----
  buildCloudLayer(document.getElementById('clouds-back'), 'assets/sprites/backgrounds/cloud-back.png', 3, 35, 0.5, 140);
  buildCloudLayer(document.getElementById('clouds-mid'), 'assets/sprites/backgrounds/cloud-mid.png', 3, 26, 0.7, 100);
  buildCloudLayer(document.getElementById('clouds-front'), 'assets/sprites/backgrounds/cloud-front.png', 4, 18, 0.9, 70);
  particles.spawnStars(45);
  particles.startHeartLoop();
  camera.floatLoop(3, 8);

  // ---- character ambient idle: breathing loop, 2px, 2s yoyo ----
  gsap.to(character, {
    y: -2,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
  // very subtle idle sway so a hijab/jacket silhouette still reads as alive
  gsap.to(character, {
    rotate: 0.6,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    transformOrigin: '50% 100%',
  });

  // boy idle loop — same treatment, runs harmlessly while opacity:0 until a scene shows him
  gsap.to(characterBoy, {
    y: -2,
    duration: 2.2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    delay: 0.3,
  });
  gsap.to(characterBoy, {
    rotate: -0.6,
    duration: 3.2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    transformOrigin: '50% 100%',
  });

  const context = {
    audio, particles, camera, stage, sceneUI, character, characterBoy,
    starsLayer, heartsLayer, sparkleLayer,
    onMissingScene: (id) => showMissingScenePlaceholder(sceneUI, id),
  };
  const sceneManager = new SceneManager(context);
  context.sceneManager = sceneManager;

  sceneManager.register('greeting', GreetingScene);
  sceneManager.register('password', PasswordScene);
  sceneManager.register('intro', IntroScene);
  sceneManager.register('surprise', SurpriseScene);
  sceneManager.register('gift', GiftScene);
  sceneManager.register('ending', EndingScene);
  sceneManager.register('letter', LetterScene);
  sceneManager.register('photos', PhotosScene);
  sceneManager.register('song', SongScene);

  stage.classList.add('is-ready');
  audio.playMusic();
  await sceneManager.transitionTo('greeting');
}

boot();
