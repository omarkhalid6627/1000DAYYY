const PHOTOS = ['assets/photos/photo-1.jpg', 'assets/photos/photo-2.jpg', 'assets/photos/photo-3.jpg'];

// ================================
// PHOTO GALLERY DECORATIONS
// Add your own PNG/JPG stickers here. Each one only needs a filename,
// a position, and a size — everything else (fade-in, gentle floating,
// slight rotation) happens automatically. You do NOT need to touch
// anything else in this file or any CSS file to add a sticker.
//
//   src     path to your image, e.g. 'assets/sprites/particles/sticker1.png'
//   left    horizontal position, e.g. '12%'   (from the left edge)
//   top     vertical position,   e.g. '20%'   (from the top edge)
//   width   display size,        e.g. '80px'
//   rotate  optional starting tilt in degrees      (default 0)
//   delay   optional animation start delay, seconds (default: auto-staggered)
//   float   optional — set to false for a still, non-animated sticker
//           (default true — everything floats/sways gently by default)
//
// Upload your image into assets/sprites/particles/ first, then add a
// line here with its filename. That's it — nothing else to edit.
// ================================
const PHOTO_GALLERY_DECORATIONS = [
  { src: 'assets/sprites/particles/flower-pink.png', left: '2%', top: '26%', width: '34px', rotate: -8 },
  { src: 'assets/sprites/particles/flower-lav.png', left: '94%', top: '24%', width: '30px', rotate: 8 },
  { src: 'assets/sprites/particles/flower-lav.png', left: '3%', top: '65%', width: '32px', rotate: -6 },
  { src: 'assets/sprites/particles/flower-pink.png', left: '92%', top: '68%', width: '28px', rotate: 6 },
  { src: 'assets/sprites/particles/flower-pink.png', left: '8%', top: '13%', width: '22px' },
  { src: 'assets/sprites/particles/flower-lav.png', left: '88%', top: '13%', width: '22px' },

   // 👇 My photos
  { src: 'assets/sprites/particles/deco1.png', left: '8%', top: '12%', width: '85px', rotate: -8 },
  { src: 'assets/sprites/particles/deco2.png', left: '88%', top: '18%', width: '75px', rotate: 7 },
  { src: 'assets/sprites/particles/deco3.png', left: '4%', top: '55%', width: '80px', rotate: -6 },
  { src: 'assets/sprites/particles/deco4.png', left: '92%', top: '58%', width: '70px', rotate: 8 },
  { src: 'assets/sprites/particles/deco5.png', left: '48%', top: '82%', width: '85px', rotate: -4 },
];
function renderPhotoGalleryDecorations(layer) {
  return PHOTO_GALLERY_DECORATIONS.map((deco, i) => {
    const img = document.createElement('img');
    img.src = deco.src;
    img.className = 'pixelated';
    img.style.cssText = `
      position: absolute; left: ${deco.left}; top: ${deco.top}; width: ${deco.width};
      opacity: 0; pointer-events: none; transform: rotate(${deco.rotate || 0}deg);
      max-width: 22vw;
    `;
    // if a filename is missing/typo'd, fail quietly instead of showing a broken-image icon
    img.onerror = () => img.remove();
    layer.appendChild(img);

    gsap.to(img, { opacity: 1, duration: 0.5, delay: deco.delay ?? 0.3 + i * 0.12, ease: 'power1.out' });
    if (deco.float !== false) {
      const base = deco.rotate || 0;
      gsap.to(img, {
        rotate: base + (i % 2 === 0 ? 12 : -12),
        y: '+=6',
        duration: 2 + (i % 4) * 0.3,
        repeat: -1, yoyo: true, ease: 'sine.inOut',
        delay: (deco.delay ?? 0) + 0.5,
      });
    }
    return img;
  });
}

export const PhotosScene = {
  timeline: null,
  elements: {},

  async init(ctx) {
    this.ctx = ctx;
    gsap.set(ctx.character, { opacity: 0 });
    gsap.set(ctx.characterBoy, { opacity: 0 });

    const root = document.createElement('div');
    root.style.cssText = `
      position: absolute; inset: 0; overflow: hidden;
      background: linear-gradient(135deg, var(--color-lavender), var(--color-pink) 55%, var(--color-cream));
      opacity: 0;
    `;

    // ambient layers, purely decorative, sit below everything interactive
    const decoBack = document.createElement('div');
    decoBack.style.cssText = 'position:absolute; inset:0; pointer-events:none; z-index:1;';
    const decoFront = document.createElement('div');
    decoFront.style.cssText = 'position:absolute; inset:0; pointer-events:none; z-index:6;';

    const heading = document.createElement('div');
    heading.className = 'pixel-panel';
    heading.dir = 'rtl';
    heading.style.cssText = 'position:absolute; left:50%; top:5%; transform:translateX(-50%); opacity:0; z-index:5; max-width:88%;';
    heading.innerHTML = '<div class="pixel-panel__title" style="font-size:clamp(14px,2.6vw,19px); white-space:normal;">\u0627\u062d\u0646\u0627 \u0639\u064a\u0634\u0646\u0627 \u0645\u0639 \u0628\u0639\u0636 \u0643\u062a\u064a\u0631 \u0627\u0648\u064a\ud83d\ude02\u2764\ufe0f</div>';

    const grid = document.createElement('div');
    grid.style.cssText = 'position:absolute; inset:22% 4% 16%; display:flex; flex-wrap:wrap; align-items:center; justify-content:center; gap:min(3vw,18px); z-index:5;';
    grid.innerHTML = PHOTOS.map((src, n) => `
      <button class="photo-frame" data-idx="${n}" style="--tilt:${n === 1 ? '2deg' : n === 0 ? '-5deg' : '5deg'}; opacity:0; cursor:pointer;">
        <div class="photo-frame__inner" style="background:none;">
          <img src="${src}" alt="" style="width:100%; height:100%; object-fit:cover; image-rendering:auto;">
        </div>
      </button>
    `).join('');

    const backBtn = document.createElement('button');
    backBtn.className = 'pixel-button';
    backBtn.textContent = '\u2190 BACK';
    backBtn.style.cssText = 'position:absolute; left:50%; bottom:4%; transform:translateX(-50%); opacity:0; pointer-events:none; z-index:50;';

    root.appendChild(decoBack);
    root.appendChild(heading);
    root.appendChild(grid);
    root.appendChild(decoFront);
    ctx.sceneUI.appendChild(root);
    ctx.sceneUI.appendChild(backBtn);
    this.elements = { root, heading, grid, backBtn, frames: [...grid.querySelectorAll('.photo-frame')], decoBack, decoFront };

    // decoFront sits above the photos/heading (z-index:6) so stickers are
    // always visible and never trapped behind another layer; pointer-events
    // stays "none" on the layer itself so nothing here can block a click.
    this._decorations = renderPhotoGalleryDecorations(decoFront);

    gsap.to(root, { opacity: 1, duration: 0.4, ease: 'power1.out' });
    gsap.to(heading, { opacity: 1, y: 0, duration: 0.35, ease: 'back.out(1.6)', delay: 0.15 });

    this.elements.frames.forEach((frame, i) => {
      gsap.fromTo(frame,
        { opacity: 0, y: 30, scale: 0.7, rotate: 0 },
        { opacity: 1, y: 0, scale: 1, rotate: `+=${i === 1 ? 2 : i === 0 ? -5 : 5}`,
          duration: 0.5, ease: 'back.out(1.6)', delay: 0.5 + i * 0.25,
          onComplete: i === this.elements.frames.length - 1 ? () => this.finishEntrance() : undefined,
        });
      // gentle continuous bob once settled, staggered per frame
      gsap.to(frame, { y: -6, duration: 1.8 + i * 0.25, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 + i * 0.3 });
    });

    this.startAmbient();
  },

  startAmbient() {
    const { decoBack, decoFront } = this.elements;
    const { particles } = this.ctx;
    // floating hearts/stars/sparkles drifting through the scene
    this._ambientTimer = setInterval(() => {
      const layer = Math.random() > 0.5 ? decoFront : decoBack;
      const x = 5 + Math.random() * 90;
      const el = document.createElement('img');
      const kinds = ['heart', 'star', 'star', 'flower-pink', 'flower-lav'];
      const kind = kinds[Math.floor(Math.random() * kinds.length)];
      el.src = `assets/sprites/particles/${kind}.png`;
      el.className = 'pixelated';
      el.style.cssText = `position:absolute; left:${x}%; top:100%; width:${kind.startsWith('flower') ? 14 : kind === 'heart' ? 12 : 8}px; opacity:0.8;`;
      layer.appendChild(el);
      gsap.to(el, {
        y: '-=420', opacity: 0, rotate: Math.random() > 0.5 ? 40 : -40,
        duration: 5 + Math.random() * 3, ease: 'none',
        onComplete: () => el.remove(),
      });
    }, 700);
  },

  finishEntrance() {
    const { backBtn } = this.elements;
    backBtn.style.pointerEvents = 'auto';
    gsap.to(backBtn, { opacity: 1, duration: 0.4, ease: 'back.out(1.8)' });
  },

  play() {
    const { backBtn, frames } = this.elements;
    const { audio, particles } = this.ctx;
    this._onEnter = (e) => { audio.playSFX('hover'); gsap.to(e.currentTarget, { scale: 1.08, duration: 0.2, ease: 'back.out(2)' }); };
    this._onLeave = (e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 });
    this._onFrameClick = (e) => {
      const frame = e.currentTarget;
      audio.playSFX('click');
      gsap.timeline()
        .to(frame, { scale: 1.18, rotate: 0, duration: 0.15, ease: 'back.out(2)' })
        .to(frame, { scale: 1, duration: 0.2, ease: 'power1.out' });
      const rect = frame.getBoundingClientRect();
      const stageRect = this.ctx.stage.getBoundingClientRect();
      particles.burst(
        ((rect.left + rect.width / 2 - stageRect.left) / stageRect.width) * 100,
        ((rect.top + rect.height / 2 - stageRect.top) / stageRect.height) * 100,
        8, this.elements.decoFront, 'assets/sprites/particles/sparkle.png'
      );
    };
    frames.forEach((f) => {
      f.addEventListener('pointerenter', this._onEnter);
      f.addEventListener('pointerleave', this._onLeave);
      f.addEventListener('click', this._onFrameClick);
    });

    this._onBackEnter = () => { audio.playSFX('hover'); gsap.to(backBtn, { scale: 1.06, duration: 0.18 }); };
    this._onBackLeave = () => gsap.to(backBtn, { scale: 1, duration: 0.18 });
    this._onBackClick = () => this.goBack();
    backBtn.addEventListener('pointerenter', this._onBackEnter);
    backBtn.addEventListener('pointerleave', this._onBackLeave);
    backBtn.addEventListener('click', this._onBackClick);
  },

  goBack() {
    const { audio } = this.ctx;
    audio.playSFX('click');
    clearInterval(this._ambientTimer);
    const tl = gsap.timeline({ onComplete: () => this.ctx.sceneManager.transitionTo('gift') });
    tl.to(this.elements.frames, { opacity: 0, scale: 0.6, duration: 0.3, stagger: 0.05, ease: 'power1.in' }, 0)
      .to([this.elements.heading, this.elements.backBtn], { opacity: 0, duration: 0.3 }, 0.1)
      .to(this.elements.root, { opacity: 0, duration: 0.4 }, 0.2);
    this.timeline = tl;
  },

  pause() { this.timeline?.pause(); },

  destroy() {
    clearInterval(this._ambientTimer);
    const { backBtn, root, frames } = this.elements;
    this._decorations?.forEach((img) => gsap.killTweensOf(img));
    frames?.forEach((f) => {
      f.removeEventListener('pointerenter', this._onEnter);
      f.removeEventListener('pointerleave', this._onLeave);
      f.removeEventListener('click', this._onFrameClick);
      gsap.killTweensOf(f);
    });
    if (backBtn) {
      backBtn.removeEventListener('pointerenter', this._onBackEnter);
      backBtn.removeEventListener('pointerleave', this._onBackLeave);
      backBtn.removeEventListener('click', this._onBackClick);
      backBtn.remove();
    }
    root?.remove();
    this.timeline?.kill();
  },

  async restart() {
    this.destroy();
    await this.init(this.ctx);
    this.play();
  },
};
