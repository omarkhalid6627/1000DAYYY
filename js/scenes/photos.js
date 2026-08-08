export const PhotosScene = {
  timeline: null,
  elements: {},

  async init(ctx) {
    this.ctx = ctx;
    gsap.set(ctx.character, { opacity: 0 });
    gsap.set(ctx.characterBoy, { opacity: 0 });

    const root = document.createElement('div');
    root.style.cssText = `
      position: absolute; inset: 0;
      background: linear-gradient(135deg, var(--color-lavender), var(--color-pink) 60%, var(--color-cream));
      opacity: 0;
    `;

    const heading = document.createElement('div');
    heading.className = 'pixel-panel';
    heading.style.cssText = 'position:absolute; left:50%; top:6%; transform:translateX(-50%); opacity:0;';
    heading.innerHTML = '<div class="pixel-panel__title" style="font-size:clamp(15px,2.8vw,20px);">Happy Birthday Sayang!</div>';

    const grid = document.createElement('div');
    grid.style.cssText = 'position:absolute; inset:20% 6% 16%; display:flex; flex-wrap:wrap; align-items:center; justify-content:center; gap:16px;';
    grid.innerHTML = [1, 2, 3].map((n) => `
      <div class="photo-frame" data-idx="${n}" style="--tilt:${n === 2 ? '2deg' : n === 1 ? '-4deg' : '4deg'}; opacity:0;">
        <div class="photo-frame__inner">your photo ${n}<br>goes here</div>
      </div>
    `).join('');

    // decorative flying pixel hearts/sparkles
    const deco = document.createElement('div');
    deco.style.cssText = 'position:absolute; inset:0; pointer-events:none;';

    const backBtn = document.createElement('button');
    backBtn.className = 'pixel-button';
    backBtn.textContent = '← BACK';
    backBtn.style.cssText = 'position:absolute; left:50%; bottom:5%; transform:translateX(-50%); opacity:0; pointer-events:none; z-index:50;';

    root.appendChild(heading);
    root.appendChild(grid);
    root.appendChild(deco);
    ctx.sceneUI.appendChild(root);
    ctx.sceneUI.appendChild(backBtn);
    this.elements = { root, heading, grid, backBtn, frames: [...grid.querySelectorAll('.photo-frame')] };

    // unique transition-in: pixel-dissolve feel via a quick stagger fade of a grid overlay
    gsap.to(root, { opacity: 1, duration: 0.4, ease: 'power1.out' });

    gsap.to(heading, { opacity: 1, duration: 0.35, ease: 'power1.out', delay: 0.15 });

    this.elements.frames.forEach((frame, i) => {
      gsap.fromTo(frame,
        { opacity: 0, y: 30, scale: 0.7, rotate: 0 },
        { opacity: 1, y: 0, scale: 1, rotate: `+=${i === 1 ? 2 : i === 0 ? -4 : 4}`,
          duration: 0.5, ease: 'back.out(1.6)', delay: 0.5 + i * 0.25,
          onComplete: i === this.elements.frames.length - 1 ? () => this.finishEntrance() : undefined,
        });
    });

    for (let i = 0; i < 5; i++) {
      ctx.particles.spawnSparkle(10 + Math.random() * 80, 10 + Math.random() * 20, deco);
    }
  },

  finishEntrance() {
    const { backBtn } = this.elements;
    backBtn.style.pointerEvents = 'auto';
    gsap.to(backBtn, { opacity: 1, duration: 0.4, ease: 'back.out(1.8)' });
  },

  play() {
    const { backBtn } = this.elements;
    const { audio } = this.ctx;
    this._onEnter = () => { audio.playSFX('hover'); gsap.to(backBtn, { scale: 1.06, duration: 0.18 }); };
    this._onLeave = () => gsap.to(backBtn, { scale: 1, duration: 0.18 });
    this._onClick = () => this.goBack();
    backBtn.addEventListener('pointerenter', this._onEnter);
    backBtn.addEventListener('pointerleave', this._onLeave);
    backBtn.addEventListener('click', this._onClick);
  },

  goBack() {
    const { audio } = this.ctx;
    audio.playSFX('click');
    const tl = gsap.timeline({ onComplete: () => this.ctx.sceneManager.transitionTo('gift') });
    tl.to(this.elements.frames, { opacity: 0, scale: 0.6, duration: 0.3, stagger: 0.05, ease: 'power1.in' }, 0)
      .to([this.elements.heading, this.elements.backBtn], { opacity: 0, duration: 0.3 }, 0.1)
      .to(this.elements.root, { opacity: 0, duration: 0.4 }, 0.2);
    this.timeline = tl;
  },

  pause() { this.timeline?.pause(); },

  destroy() {
    const { backBtn, root } = this.elements;
    if (backBtn) {
      backBtn.removeEventListener('pointerenter', this._onEnter);
      backBtn.removeEventListener('pointerleave', this._onLeave);
      backBtn.removeEventListener('click', this._onClick);
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
