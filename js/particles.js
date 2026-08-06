import { rand, randInt, el } from './utils.js';

const ASSET = {
  heart: 'assets/sprites/particles/heart.png',
  star: 'assets/sprites/particles/star.png',
  sparkle: 'assets/sprites/particles/sparkle.png',
};

export class ParticleSystem {
  constructor({ starsLayer, heartsLayer, sparkleLayer }) {
    this.starsLayer = starsLayer;
    this.heartsLayer = heartsLayer;
    this.sparkleLayer = sparkleLayer;
    this._heartTimer = null;
  }

  // ---- stars: gentle continuous twinkle field, spawned once ----
  spawnStars(count = 45) {
    for (let i = 0; i < count; i++) {
      const star = el('img', 'star-sprite pixelated', this.starsLayer);
      star.src = ASSET.star;
      star.style.left = `${rand(2, 98)}%`;
      star.style.top = `${rand(2, 60)}%`;
      const size = rand(6, 14);
      star.style.width = `${size}px`;
      gsap.set(star, { opacity: rand(0.3, 0.5) });
      gsap.to(star, {
        opacity: 1,
        duration: rand(1, 2.5),
        delay: rand(0, 4),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }
  }

  // ---- hearts: continuous stream rising from the bottom ----
  startHeartLoop() {
    const spawnOne = () => {
      const heart = el('img', 'heart-sprite pixelated', this.heartsLayer);
      heart.src = ASSET.heart;
      const size = rand(10, 22);
      heart.style.width = `${size}px`;
      heart.style.left = `${rand(0, 100)}%`;
      heart.style.top = '110%';
      const rot = rand(-8, 8);
      gsap.set(heart, { opacity: 0, rotate: rot, y: 0 });
      const duration = rand(5, 9);
      gsap.timeline({ onComplete: () => heart.remove() })
        .to(heart, { opacity: 1, duration: duration * 0.15, ease: 'sine.out' }, 0)
        .to(heart, { y: `-=${window.innerHeight ? (this.heartsLayer.offsetHeight + 100) : 700}`, duration, ease: 'none' }, 0)
        .to(heart, { rotate: rot > 0 ? rot + 10 : rot - 10, duration, ease: 'sine.inOut' }, 0)
        .to(heart, { opacity: 0, duration: duration * 0.2, ease: 'sine.in' }, duration * 0.8);

      this._heartTimer = setTimeout(spawnOne, rand(400, 900));
    };
    spawnOne();
  }

  stopHeartLoop() {
    clearTimeout(this._heartTimer);
  }

  // ---- one-off burst (heart-select clicks, gift opens, etc.) ----
  burst(xPercent, yPercent, count = 8, layer = this.sparkleLayer, asset = ASSET.heart) {
    for (let i = 0; i < count; i++) {
      const p = el('img', 'sparkle-sprite pixelated', layer);
      p.src = asset;
      p.style.width = '10px';
      p.style.left = `${xPercent}%`;
      p.style.top = `${yPercent}%`;
      const angle = (Math.PI * 2 * i) / count + rand(-0.3, 0.3);
      const dist = rand(40, 90);
      gsap.set(p, { opacity: 1, scale: 0.6, xPercent: -50, yPercent: -50 });
      gsap.to(p, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        rotate: rand(-180, 180),
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => p.remove(),
      });
    }
  }

  spawnSparkle(xPercent, yPercent, layer = this.sparkleLayer) {
    const s = el('img', 'sparkle-sprite pixelated', layer);
    s.src = ASSET.sparkle;
    s.style.width = '12px';
    s.style.left = `${xPercent}%`;
    s.style.top = `${yPercent}%`;
    gsap.set(s, { opacity: 1, scale: 0, xPercent: -50, yPercent: -50 });
    gsap.timeline({ onComplete: () => s.remove() })
      .to(s, { scale: 1, rotate: 360, duration: 0.8, ease: 'power1.out' }, 0)
      .to(s, { opacity: 0, duration: 0.3 }, 0.5);
  }
}
