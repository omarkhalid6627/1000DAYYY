export const GreetingScene = {
  timeline: null,
  elements: {},

  async init(ctx) {
    this.ctx = ctx;
    const { character, characterBoy } = ctx;

    // position girl + boy side by side, both visible
    gsap.set(character, { opacity: 1, x: 0, y: 0, rotate: 0, left: '2%', height: '42%' });
    gsap.set(characterBoy, { opacity: 0, x: 0, y: 0, rotate: 0, left: '24%', height: '42%' });

    const wrap = document.createElement('div');
    wrap.className = 'greeting-wrap';
    wrap.style.cssText = `
      position: absolute; right: 5%; top: 42%; transform: translateY(-50%);
      display: flex; flex-direction: column; align-items: center; gap: 18px;
      width: min(50%, 400px);
    `;

    const panel = document.createElement('div');
    panel.className = 'pixel-panel';
    panel.innerHTML = `
      <div class="pixel-panel__title" style="font-size: clamp(16px, 3vw, 24px);">HAPPY 1000</div>
      <div class="pixel-panel__title" style="font-size: clamp(16px, 3vw, 24px);">DAYS TOGETHER!</div>
      <div class="pixel-panel__subtitle">💕</div>
    `;

    const button = document.createElement('button');
    button.className = 'pixel-button';
    button.textContent = 'CONTINUE →';
    button.setAttribute('aria-label', 'Continue');

    wrap.appendChild(panel);
    wrap.appendChild(button);
    ctx.sceneUI.appendChild(wrap);
    this.elements = { wrap, panel, button };

    // boy fades/steps in next to her, then the bubble appears
    gsap.to(characterBoy, { opacity: 1, duration: 0.5, ease: 'power1.out' });
    gsap.set(panel, { opacity: 0, scale: 0.8 });
    gsap.to(panel, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)', delay: 0.4 });
    gsap.set(button, { opacity: 0, y: 8 });
    gsap.to(button, { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)', delay: 0.7 });
  },

  play() {
    const { button } = this.elements;
    const { audio } = this.ctx;
    this._onEnter = () => {
      audio.playSFX('hover');
      gsap.to(button, { scale: 1.06, duration: 0.18, ease: 'back.out(2)' });
    };
    this._onLeave = () => gsap.to(button, { scale: 1, duration: 0.18, ease: 'power1.out' });
    this._onClick = () => this.handleContinue();
    button.addEventListener('pointerenter', this._onEnter);
    button.addEventListener('pointerleave', this._onLeave);
    button.addEventListener('click', this._onClick);
  },

  async handleContinue() {
    if (this._done) return;
    this._done = true;
    const { audio, particles } = this.ctx;
    audio.playSFX('click');
    particles.burst(50, 45, 8, this.ctx.sparkleLayer, 'assets/sprites/particles/sparkle.png');
    await new Promise((r) => setTimeout(r, 150));
    this.transitionOut();
  },

  transitionOut() {
    return new Promise((resolve) => {
      const { wrap } = this.elements;
      const tl = gsap.timeline({
        onComplete: () => {
          this.ctx.sceneManager.transitionTo('password');
          resolve();
        },
      });
      tl.to(wrap, { opacity: 0, duration: 0.35 }, 0);
      this.timeline = tl;
    });
  },

  pause() { this.timeline?.pause(); },

  destroy() {
    const { button } = this.elements;
    if (button) {
      button.removeEventListener('pointerenter', this._onEnter);
      button.removeEventListener('pointerleave', this._onLeave);
      button.removeEventListener('click', this._onClick);
    }
    this.timeline?.kill();
    this._done = false;
  },

  async restart() {
    this.destroy();
    await this.init(this.ctx);
    this.play();
  },
};
