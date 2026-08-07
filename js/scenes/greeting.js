export const GreetingScene = {
  timeline: null,
  elements: {},

  async init(ctx) {
    this.ctx = ctx;
    const { character, characterBoy } = ctx;

    // ONLY the boy — girl stays hidden for this scene
    gsap.set(character, { opacity: 0 });
    gsap.set(characterBoy, {
      opacity: 0, x: 0, y: 20, rotate: 0, scale: 0.9,
      left: '50%', height: '48%', xPercent: -50,
    });

    const title = document.createElement('div');
    title.className = 'pixel-panel';
    title.style.cssText = `
      position: absolute; left: 50%; top: 18%; transform: translateX(-50%);
      opacity: 0;
    `;
    title.innerHTML = '<div class="pixel-panel__title" style="font-size:clamp(15px,3.4vw,22px); white-space:nowrap;">Happy 1000 Days Together \u2764\ufe0f</div>';
    ctx.sceneUI.appendChild(title);
    this.elements = { title, characterBoy };

    // character entrance: fade-in, rise, small bounce (~600ms)
    const tl = gsap.timeline();
    tl.to(characterBoy, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.8)' }, 0)
      // cute animated text reveal, slightly after the character settles
      .to(title, { opacity: 1, duration: 0.35, ease: 'power1.out' }, 0.35)
      .fromTo(title, { scale: 0.85 }, { scale: 1, duration: 0.35, ease: 'back.out(2)' }, 0.35);

    this.timeline = tl;
  },

  play() {
    // whole scene is time-driven, ~2s hold, then auto-exit — no button
    this._holdTimer = setTimeout(() => this.exit(), 1900);
  },

  exit() {
    if (this._exiting) return;
    this._exiting = true;
    const { title, characterBoy } = this.elements;
    const tl = gsap.timeline({
      onComplete: () => this.ctx.sceneManager.transitionTo('password'),
    });
    tl.to(title, { opacity: 0, y: -12, duration: 0.3, ease: 'power1.in' }, 0)
      .to(characterBoy, { opacity: 0, y: -10, scale: 0.9, duration: 0.35, ease: 'power1.in' }, 0.05)
      .add(() => this.ctx.particles.burst(50, 45, 6, this.ctx.sparkleLayer, 'assets/sprites/particles/sparkle.png'), 0.15);
    this.timeline = tl;
  },

  pause() { this.timeline?.pause(); },

  destroy() {
    clearTimeout(this._holdTimer);
    this.timeline?.kill();
    this._exiting = false;
  },

  async restart() {
    this.destroy();
    await this.init(this.ctx);
    this.play();
  },
};
