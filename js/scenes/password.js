const PASSWORD = '221123';

export const PasswordScene = {
  timeline: null,
  elements: {},
  entered: '',

  async init(ctx) {
    this.ctx = ctx;
    this.entered = '';
    const { character, characterBoy } = ctx;

    // --- couple display: uploaded hugging illustration, shown via the
    // boy slot as a single image (girl slot hidden) -------------------
    gsap.set(character, { opacity: 0 });
    characterBoy.className = 'char-pos-solo-center';
    characterBoy.querySelector('img').src = 'assets/sprites/characters/couple-hug.png';
    gsap.set(characterBoy, { opacity: 0, x: 0, y: 16, rotate: 0, scale: 0.92, xPercent: -50 });
    gsap.to(characterBoy, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.6)', delay: 0.1 });

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
      <div class="pixel-panel__title" style="font-size: clamp(14px, 2.6vw, 18px);">Guess the password</div>
      <div class="pw-slots" id="pw-slots"></div>
      <div class="keypad"></div>
    `;

    const slotsRow = panel.querySelector('#pw-slots');
    for (let i = 0; i < PASSWORD.length; i++) {
      const slot = document.createElement('div');
      slot.className = 'pw-slot';
      slotsRow.appendChild(slot);
    }

    const keypad = panel.querySelector('.keypad');
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '\u232b'];
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
      slots: [...panel.querySelectorAll('.pw-slot')],
      keys: [...panel.querySelectorAll('.keypad-key')],
    };

    gsap.set(panel, { opacity: 0, scale: 0.8 });
    gsap.to(panel, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)', delay: 0.2 });
  },

  play() {
    const { audio } = this.ctx;
    this._onKeyClick = (e) => {
      if (this._locked) return;
      const btn = e.currentTarget;
      const k = btn.dataset.key;
      audio.playSFX('hover');

      // physical press: down, squash, tiny flash, bounce back
      gsap.timeline()
        .to(btn, { y: 3, scaleY: 0.85, duration: 0.06, ease: 'power1.in' })
        .to(btn, { y: 0, scaleY: 1, duration: 0.14, ease: 'back.out(3)' });
      this.ctx.particles.spawnSparkle(
        50 + (btn.getBoundingClientRect().left - this.elements.panel.getBoundingClientRect().left) * 0.01,
        50, this.ctx.sparkleLayer
      );

      if (k === 'C') {
        this.entered = '';
      } else if (k === '\u232b') {
        this.entered = this.entered.slice(0, -1);
      } else if (this.entered.length < PASSWORD.length) {
        this.entered += k;
        this.animateDigitIntoSlot(this.entered.length - 1, k);
      }
      this.updateSlots();

      if (this.entered.length === PASSWORD.length) {
        this._locked = true;
        this.entered === PASSWORD ? this.handleSuccess() : this.handleWrong();
      }
    };
    this.elements.keys.forEach((btn) => btn.addEventListener('click', this._onKeyClick));
    this.updateSlots();
  },

  updateSlots() {
    this.elements.slots.forEach((slot, i) => {
      slot.textContent = i < this.entered.length ? this.entered[i] : '';
      slot.classList.toggle('is-filled', i < this.entered.length);
    });
  },

  animateDigitIntoSlot(index, digit) {
    const slot = this.elements.slots[index];
    if (!slot) return;
    gsap.fromTo(slot, { scale: 1.6 }, { scale: 1, duration: 0.25, ease: 'back.out(3)' });
  },

  handleWrong() {
    const { audio } = this.ctx;
    audio.playSFX('click');
    const tl = gsap.timeline({ onComplete: () => { this.entered = ''; this.updateSlots(); this._locked = false; } });
    tl.to(this.elements.slots, { x: -8, duration: 0.06 })
      .to(this.elements.slots, { x: 8, duration: 0.06 })
      .to(this.elements.slots, { x: -6, duration: 0.06 })
      .to(this.elements.slots, { x: 0, duration: 0.06 });
  },

  async handleSuccess() {
    const { audio, particles, character, characterBoy } = this.ctx;
    audio.playSFX('click');

    const tl = gsap.timeline();
    // all six slots bounce
    tl.to(this.elements.slots, { y: -10, duration: 0.15, ease: 'power1.out', stagger: 0.04 }, 0)
      .to(this.elements.slots, { y: 0, duration: 0.2, ease: 'bounce.out', stagger: 0.04 }, 0.15)
      // subtle celebratory bounce for the couple image
      .to(characterBoy, { y: -8, duration: 0.18, ease: 'power1.out' }, 0.1)
      .to(characterBoy, { y: 0, duration: 0.25, ease: 'bounce.out' }, 0.28);

    const rect = this.elements.panel.getBoundingClientRect();
    const stageRect = this.ctx.stage.getBoundingClientRect();
    const xPct = ((rect.left + rect.width / 2 - stageRect.left) / stageRect.width) * 100;
    const yPct = ((rect.top + rect.height / 2 - stageRect.top) / stageRect.height) * 100;
    particles.burst(xPct, yPct, 12, this.ctx.sparkleLayer, 'assets/sprites/particles/heart.png');

    const success = document.createElement('div');
    success.className = 'pixel-panel';
    success.style.cssText = 'position:absolute; left:50%; top:20%; transform:translateX(-50%) scale(0.7); opacity:0;';
    success.innerHTML = '<div class="pixel-panel__title" style="font-size:clamp(16px,3vw,22px);">\u0634\u0637\u0648\u0648\u0648\u0648\u0648\u0631\u0647</div>';
    this.ctx.sceneUI.appendChild(success);
    this.elements.success = success;
    gsap.to(success, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)', delay: 0.4 });

    this.timeline = tl;
    await new Promise((r) => setTimeout(r, 1500));
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
      if (this.elements.success) tl.to(this.elements.success, { opacity: 0, duration: 0.35 }, 0);
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
