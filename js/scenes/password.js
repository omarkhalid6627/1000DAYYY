const PASSWORD = '221123';

export const PasswordScene = {
  timeline: null,
  elements: {},
  entered: '',

  async init(ctx) {
    this.ctx = ctx;
    this.entered = '';
    const { character, characterBoy } = ctx;

    // boy alone, in roughly Scene 1's original spot; girl hidden
    gsap.set(character, { opacity: 0 });
    gsap.set(characterBoy, { opacity: 1, x: 0, y: 0, rotate: 0, left: '4%', height: '46%' });

    const wrap = document.createElement('div');
    wrap.className = 'password-wrap';
    wrap.style.cssText = `
      position: absolute; right: 6%; top: 50%; transform: translateY(-50%);
      display: flex; flex-direction: column; align-items: center; gap: 14px;
    `;

    const panel = document.createElement('div');
    panel.className = 'pixel-panel';
    panel.style.cssText = 'display: flex; flex-direction: column; align-items: center; gap: 12px;';
    panel.innerHTML = `
      <div class="pixel-panel__title" style="font-size: clamp(14px, 2.6vw, 18px);">ENTER PASSWORD</div>
      <div class="keypad">
        <div class="keypad-display" id="pw-display"></div>
      </div>
    `;

    const keypad = panel.querySelector('.keypad');
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'];
    keys.forEach((k) => {
      const btn = document.createElement('button');
      btn.className = 'keypad-key' + (k.length > 1 ? ' keypad-key--wide' : '');
      btn.textContent = k;
      btn.dataset.key = k;
      keypad.appendChild(btn);
    });

    wrap.appendChild(panel);
    ctx.sceneUI.appendChild(wrap);
    this.elements = {
      wrap, panel,
      display: panel.querySelector('#pw-display'),
      keys: [...panel.querySelectorAll('.keypad-key')],
    };
    this.updateDisplay();

    gsap.set(panel, { opacity: 0, scale: 0.8 });
    gsap.to(panel, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)', delay: 0.2 });
  },

  updateDisplay() {
    const shown = this.entered.split('').map((c) => c).join(' ') +
      (this.entered.length < PASSWORD.length ? ' ' + '·'.repeat(PASSWORD.length - this.entered.length).split('').join(' ') : '');
    this.elements.display.textContent = shown;
  },

  play() {
    const { audio } = this.ctx;
    this._onKeyClick = (e) => {
      const btn = e.currentTarget;
      const k = btn.dataset.key;
      audio.playSFX('hover');
      gsap.to(btn, { scale: 0.9, duration: 0.08, yoyo: true, repeat: 1 });

      if (k === 'C') {
        this.entered = '';
      } else if (k === '⌫') {
        this.entered = this.entered.slice(0, -1);
      } else if (this.entered.length < PASSWORD.length) {
        this.entered += k;
      }
      this.updateDisplay();

      if (this.entered.length === PASSWORD.length) {
        this.entered === PASSWORD ? this.handleSuccess() : this.handleWrong();
      }
    };
    this.elements.keys.forEach((btn) => btn.addEventListener('click', this._onKeyClick));
  },

  handleWrong() {
    const { audio } = this.ctx;
    audio.playSFX('click');
    const tl = gsap.timeline({ onComplete: () => { this.entered = ''; this.updateDisplay(); } });
    tl.to(this.elements.panel, { x: -8, duration: 0.06 })
      .to(this.elements.panel, { x: 8, duration: 0.06 })
      .to(this.elements.panel, { x: -6, duration: 0.06 })
      .to(this.elements.panel, { x: 0, duration: 0.06 });
  },

  async handleSuccess() {
    const { audio, particles } = this.ctx;
    audio.playSFX('click');
    const rect = this.elements.panel.getBoundingClientRect();
    const stageRect = this.ctx.stage.getBoundingClientRect();
    const xPct = ((rect.left + rect.width / 2 - stageRect.left) / stageRect.width) * 100;
    const yPct = ((rect.top + rect.height / 2 - stageRect.top) / stageRect.height) * 100;
    particles.burst(xPct, yPct, 10, this.ctx.sparkleLayer, 'assets/sprites/particles/sparkle.png');
    await new Promise((r) => setTimeout(r, 400));
    this.transitionOut();
  },

  transitionOut() {
    return new Promise((resolve) => {
      const tl = gsap.timeline({
        onComplete: () => {
          this.ctx.sceneManager.transitionTo('intro');
          resolve();
        },
      });
      tl.to(this.elements.wrap, { opacity: 0, duration: 0.35 }, 0);
      this.timeline = tl;
    });
  },

  pause() { this.timeline?.pause(); },

  destroy() {
    this.elements.keys?.forEach((btn) => btn.removeEventListener('click', this._onKeyClick));
    this.timeline?.kill();
    this.entered = '';
  },

  async restart() {
    this.destroy();
    await this.init(this.ctx);
    this.play();
  },
};
