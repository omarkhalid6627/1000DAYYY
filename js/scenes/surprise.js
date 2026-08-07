const MESSAGE = 'أنا حضرتلك مفاجأة بخصوص اليوم المميز ده ❤️';

export const SurpriseScene = {
  timeline: null,
  elements: {},

  async init(ctx) {
    this.ctx = ctx;
    const { character, characterBoy } = ctx;

    gsap.set(character, { opacity: 0 });
    gsap.set(characterBoy, {
      opacity: 0, x: -20, y: 0, rotate: 0, scale: 0.92,
      left: '4%', height: '46%',
    });

    const wrap = document.createElement('div');
    wrap.style.cssText = `
      position: absolute; right: 5%; top: 50%; transform: translateY(-50%);
      width: min(56%, 420px);
    `;

    const panel = document.createElement('div');
    panel.className = 'pixel-panel';
    panel.style.cssText = 'direction: rtl; text-align: right; min-height: 90px;';
    panel.innerHTML = `<div id="surprise-text" style="font-family: var(--font-body); font-size: clamp(17px, 2.6vw, 22px); line-height: 1.5; color: var(--color-ink);"></div>`;

    const button = document.createElement('button');
    button.className = 'pixel-button';
    button.textContent = 'CONTINUE →';
    button.style.cssText = 'margin-top: 16px; opacity: 0; pointer-events: none;';

    wrap.appendChild(panel);
    wrap.appendChild(button);
    ctx.sceneUI.appendChild(wrap);
    this.elements = { wrap, panel, button, textEl: panel.querySelector('#surprise-text') };

    // boy enters first: slightly off-position + transparent -> fades/moves in, small bounce
    gsap.to(characterBoy, { opacity: 1, x: 0, scale: 1, duration: 0.6, ease: 'back.out(1.6)' });
    gsap.set(panel, { opacity: 0, y: 10 });
    gsap.to(panel, {
      opacity: 1, y: 0, duration: 0.4, ease: 'power1.out', delay: 0.4,
      onComplete: () => this.typewrite(),
    });
  },

  typewrite() {
    const { audio } = this.ctx;
    const el = this.elements.textEl;
    let i = 0;
    const step = () => {
      if (i >= MESSAGE.length) {
        this.showContinue();
        return;
      }
      el.textContent = MESSAGE.slice(0, i + 1);
      const ch = MESSAGE[i];
      i++;
      if (ch !== ' ') audio.playSFX('typeKey');
      const wait = ch === '.' || ch === '\u2764\ufe0f' ? 250 : 45;
      this._typeTimer = setTimeout(step, wait);
    };
    step();
  },

  showContinue() {
    const { button } = this.elements;
    button.style.pointerEvents = 'auto';
    gsap.set(button, { y: 8 });
    gsap.to(button, { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.8)' });
  },

  play() {
    const { button } = this.elements;
    const { audio } = this.ctx;
    this._onEnter = () => { audio.playSFX('hover'); gsap.to(button, { scale: 1.06, duration: 0.18 }); };
    this._onLeave = () => gsap.to(button, { scale: 1, duration: 0.18 });
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
      const tl = gsap.timeline({
        onComplete: () => {
          this.ctx.sceneManager.transitionTo('gift');
          resolve();
        },
      });
      tl.to(this.elements.wrap, { opacity: 0, duration: 0.35 }, 0)
        .to(this.ctx.characterBoy, { opacity: 0, duration: 0.35 }, 0);
      this.timeline = tl;
    });
  },

  pause() { this.timeline?.pause(); },

  destroy() {
    const { button } = this.elements;
    clearTimeout(this._typeTimer);
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
