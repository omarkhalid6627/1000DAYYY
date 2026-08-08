export const IntroScene = {
  timeline: null,
  elements: {},

  async init(ctx) {
    this.ctx = ctx;
    // Start screen shows HIS character alone, on the left
    ctx.character.className = '';
    gsap.set(ctx.character, { opacity: 0 });
    ctx.characterBoy.className = 'char-pos-solo-left';
    ctx.characterBoy.querySelector('img').src = 'assets/sprites/characters/boy.png';
    gsap.set(ctx.characterBoy, { opacity: 0, x: 0, y: 14, rotate: 0, scale: 0.92 });

    const wrap = document.createElement('div');
    wrap.className = 'intro-wrap';
    wrap.style.cssText = `
      position: absolute; right: 5%; top: 50%; transform: translateY(-50%);
      display: flex; flex-direction: column; align-items: center; gap: 18px;
      width: min(52%, 400px);
    `;

    const panel = document.createElement('div');
    panel.className = 'pixel-panel';
    panel.innerHTML = `
      <div class="pixel-panel__title" style="font-size:clamp(13px,2.6vw,18px); line-height:1.3; white-space:normal;">Happy 1000 day together my lil prof princess \u2764\ufe0f\u2764\ufe0f</div>
    `;

    const button = document.createElement('button');
    button.className = 'pixel-button';
    button.textContent = 'START';
    button.setAttribute('aria-label', 'Press start');

    wrap.appendChild(panel);
    wrap.appendChild(button);
    ctx.sceneUI.appendChild(wrap);

    this.elements = { wrap, panel, button };

    // character: off-position + transparent -> fade/move in -> small bounce
    gsap.to(ctx.characterBoy, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)' });

    // title: subtle entrance
    gsap.set(panel, { opacity: 0, scale: 0.8, transformOrigin: '50% 50%' });
    gsap.to(panel, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)', delay: 0.3 });
    gsap.set(button, { opacity: 0, y: 8 });
    gsap.to(button, { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)', delay: 0.6,
      onComplete: () => {
        this._idleTween = gsap.to(button, {
          y: -4, scale: 1.03, duration: 1.1, repeat: -1, yoyo: true, ease: 'sine.inOut',
        });
      },
    });
  },

  play() {
    const { button } = this.elements;
    const { audio } = this.ctx;

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
    const { button } = this.elements;
    const { audio, particles } = this.ctx;

    audio.playSFX('click');
    this._idleTween?.kill();
    gsap.set(button, { y: 0, scale: 1 });

    const clickTl = gsap.timeline();
    clickTl
      .to(button, { scale: 0.95, y: 2, duration: 0.08, ease: 'power1.in' })
      .to(button, { scale: 1, y: 0, duration: 0.08, ease: 'power1.out' });

    const rect = button.getBoundingClientRect();
    const stageRect = this.ctx.stage.getBoundingClientRect();
    const xPct = ((rect.left + rect.width / 2 - stageRect.left) / stageRect.width) * 100;
    const yPct = ((rect.top + rect.height / 2 - stageRect.top) / stageRect.height) * 100;
    particles.burst(xPct, yPct, 8, this.ctx.sparkleLayer, 'assets/sprites/particles/heart.png');

    await clickTl.then();
    this.transitionOut();
  },

  transitionOut() {
    return new Promise((resolve) => {
      const { panel, wrap } = this.elements;
      const { camera, characterBoy, particles, sceneManager } = this.ctx;
      const tl = gsap.timeline({
        onComplete: () => {
          sceneManager.transitionTo('surprise');
          resolve();
        },
      });

      tl.to(panel, { opacity: 0, scale: 0.9, duration: 0.35, ease: 'power1.in' }, 0)
        .to(wrap, { opacity: 0, duration: 0.35 }, 0.05)
        .to(characterBoy, { x: -14, opacity: 0, duration: 0.5, ease: 'power2.inOut' }, 0)
        .add(() => particles.burst(30, 45, 10, this.ctx.sparkleLayer, 'assets/sprites/particles/star.png'), 0.1)
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
    this._idleTween?.kill();
    this._started = false;
  },

  async restart() {
    this.destroy();
    await this.init(this.ctx);
    this.play();
  },
};
