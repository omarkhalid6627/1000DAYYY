export const IntroScene = {
  timeline: null,
  elements: {},

  async init(ctx) {
    this.ctx = ctx;
    // this scene owns the original solo-girl staging; restore it explicitly
    // in case we arrived here from a scene that repositioned/hid characters
    gsap.set(ctx.character, { opacity: 1, x: 0, y: 0, rotate: 0, left: '4%', height: '46%' });
    gsap.set(ctx.characterBoy, { opacity: 0 });

    const wrap = document.createElement('div');
    wrap.className = 'intro-wrap';
    wrap.style.cssText = `
      position: absolute; right: 5%; top: 50%; transform: translateY(-50%);
      display: flex; flex-direction: column; align-items: center; gap: 18px;
      width: min(48%, 380px);
    `;

    const panel = document.createElement('div');
    panel.className = 'pixel-panel';
    panel.innerHTML = `
      <div class="pixel-panel__title">WELCOME!!</div>
      <div class="pixel-panel__subtitle">PRESS START</div>
    `;

    const button = document.createElement('button');
    button.className = 'pixel-button';
    button.textContent = 'START';
    button.setAttribute('aria-label', 'Press start');

    wrap.appendChild(panel);
    wrap.appendChild(button);
    ctx.sceneUI.appendChild(wrap);

    this.elements = { wrap, panel, button };

    // entrance: opacity 0->1, scale 0.8 -> 1.0 with overshoot, 500ms back.out
    gsap.set(panel, { opacity: 0, scale: 0.8, transformOrigin: '50% 50%' });
    gsap.to(panel, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)', delay: 0.15 });
    gsap.set(button, { opacity: 0, y: 8 });
    gsap.to(button, { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)', delay: 0.45 });
  },

  play() {
    const { button } = this.elements;
    const { audio, particles } = this.ctx;

    this._onEnter = () => {
      audio.playSFX('hover');
      gsap.to(button, { scale: 1.08, duration: 0.18, ease: 'back.out(2)' });
    };
    this._onLeave = () => {
      gsap.to(button, { scale: 1, duration: 0.18, ease: 'power1.out' });
    };
    this._onClick = () => this.handleStart();

    button.addEventListener('pointerenter', this._onEnter);
    button.addEventListener('pointerleave', this._onLeave);
    button.addEventListener('click', this._onClick);
  },

  async handleStart() {
    if (this._started) return;
    this._started = true;
    const { button, panel, wrap } = this.elements;
    const { audio, particles, camera, character } = this.ctx;

    audio.playSFX('click');

    // click squash: 108% -> 95% -> 100%, moves down 2px
    const clickTl = gsap.timeline();
    clickTl
      .to(button, { scale: 0.95, y: 2, duration: 0.08, ease: 'power1.in' })
      .to(button, { scale: 1, y: 0, duration: 0.08, ease: 'power1.out' });

    const rect = button.getBoundingClientRect();
    const stageRect = this.ctx.stage.getBoundingClientRect();
    const xPct = ((rect.left + rect.width / 2 - stageRect.left) / stageRect.width) * 100;
    const yPct = ((rect.top + rect.height / 2 - stageRect.top) / stageRect.height) * 100;
    particles.burst(xPct, yPct, 8, this.ctx.sparkleLayer, 'assets/sprites/particles/sparkle.png');

    await clickTl.then();
    this.transitionOut();
  },

  // "Scene Transition" (Part 1) + "Transition Into Scene 2" (Part 2), 900-1200ms
  transitionOut() {
    return new Promise((resolve) => {
      const { panel, wrap } = this.elements;
      const { camera, character, particles, sceneManager } = this.ctx;
      const tl = gsap.timeline({
        onComplete: () => {
          sceneManager.transitionTo('letter');
          resolve();
        },
      });

      tl.to(panel, { opacity: 0, scale: 0.9, duration: 0.35, ease: 'power1.in' }, 0)
        .to(wrap, { opacity: 0, duration: 0.35 }, 0.05)
        .to(character, { x: -14, duration: 0.5, ease: 'power2.inOut' }, 0)
        .add(() => particles.burst(30, 45, 10, this.ctx.starBurstLayer || this.ctx.sparkleLayer, 'assets/sprites/particles/star.png'), 0.1)
        .add(() => camera.zoomTo(1.05, 1.0, 'power2.inOut'), 0.15);

      this.timeline = tl;
    });
  },

  pause() {
    this.timeline?.pause();
  },

  destroy() {
    const { button } = this.elements;
    if (button) {
      button.removeEventListener('pointerenter', this._onEnter);
      button.removeEventListener('pointerleave', this._onLeave);
      button.removeEventListener('click', this._onClick);
    }
    this.timeline?.kill();
    this._started = false;
  },

  async restart() {
    this.destroy();
    await this.init(this.ctx);
    this.play();
  },
};
