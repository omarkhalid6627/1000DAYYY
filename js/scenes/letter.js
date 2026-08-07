const PLACEHOLDER_LETTER = `My love,

[This is where your own words go \u2014 tell me what you want the
letter to say (or dictate it to me) and I'll drop it in here
exactly, with the same typewriter reveal.]

Forever yours.`;

export const LetterScene = {
  timeline: null,
  elements: {},

  async init(ctx) {
    this.ctx = ctx;
    gsap.set(ctx.character, { opacity: 0 });
    gsap.set(ctx.characterBoy, { opacity: 0 });

    const root = document.createElement('div');
    root.style.cssText = `
      position: absolute; inset: 0;
      background-image: url('assets/sprites/ui/letter-bg.jpg');
      background-size: cover; background-position: center;
      opacity: 0;
    `;

    const heading = document.createElement('div');
    heading.className = 'pixel-panel';
    heading.style.cssText = 'position:absolute; left:50%; top:6%; transform:translateX(-50%) scale(0.8); opacity:0;';
    heading.innerHTML = '<div class="pixel-panel__title" id="letter-heading" style="font-size:clamp(16px,3vw,22px); min-height:1.3em;"></div>';

    const paperText = document.createElement('div');
    paperText.id = 'letter-text';
    paperText.style.cssText = `
      position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%) scale(0.9);
      width: min(60%, 480px); max-height: 68%; overflow-y: auto;
      font-family: var(--font-body); font-size: clamp(16px, 2.2vw, 20px);
      line-height: 1.55; color: #4A3220; text-align: center; opacity: 0;
      white-space: pre-line;
    `;

    const backBtn = document.createElement('button');
    backBtn.className = 'pixel-button';
    backBtn.textContent = '← BACK';
    backBtn.style.cssText = 'position:absolute; left:50%; bottom:6%; transform:translateX(-50%); opacity:0; pointer-events:none;';

    root.appendChild(heading);
    root.appendChild(paperText);
    ctx.sceneUI.appendChild(root);
    ctx.sceneUI.appendChild(backBtn);
    this.elements = { root, heading, paperText, backBtn, headingText: heading.querySelector('#letter-heading') };

    // unique transition-in: zoom + fade, feels like stepping into the scene
    gsap.fromTo(root, { opacity: 0, scale: 1.12 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' });

    gsap.to(heading, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.8)', delay: 0.5,
      onComplete: () => this.typeHeading() });
  },

  typeHeading() {
    const { audio } = this.ctx;
    const el = this.elements.headingText;
    const text = 'A Letter For You';
    let i = 0;
    const step = () => {
      if (i >= text.length) { this.showLetter(); return; }
      el.textContent = text.slice(0, i + 1);
      if (text[i] !== ' ') audio.playSFX('typeKey');
      i++;
      this._timer = setTimeout(step, 45);
    };
    step();
  },

  showLetter() {
    const { audio } = this.ctx;
    const { paperText } = this.elements;
    gsap.to(paperText, {
      opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.3)',
      onComplete: () => {
        audio.playSFX('envelope');
        this.typewrite(paperText, PLACEHOLDER_LETTER);
      },
    });
  },

  typewrite(el, text) {
    const { audio } = this.ctx;
    let i = 0;
    const step = () => {
      if (i >= text.length) { this.showBack(); return; }
      el.textContent = text.slice(0, i + 1);
      const ch = text[i];
      i++;
      if (ch !== ' ') audio.playSFX('typeKey');
      const wait = ch === '.' ? 250 : ch === ',' ? 150 : ch === '\n' ? 300 : 32;
      this._typeTimer = setTimeout(step, wait);
    };
    step();
  },

  showBack() {
    const { backBtn } = this.elements;
    backBtn.style.pointerEvents = 'auto';
    gsap.to(backBtn, { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.8)' });
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
    const tl = gsap.timeline({
      onComplete: () => this.ctx.sceneManager.transitionTo('gift'),
    });
    tl.to(this.elements.root, { opacity: 0, scale: 1.08, duration: 0.5, ease: 'power1.in' }, 0)
      .to(this.elements.backBtn, { opacity: 0, duration: 0.3 }, 0);
    this.timeline = tl;
  },

  pause() { this.timeline?.pause(); },

  destroy() {
    clearTimeout(this._timer);
    clearTimeout(this._typeTimer);
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
