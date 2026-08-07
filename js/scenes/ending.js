const CLOSING_TEXT = "Here's to 1000 more days together ❤️";

export const EndingScene = {
  timeline: null,
  elements: {},

  async init(ctx) {
    this.ctx = ctx;
    const { character, characterBoy } = ctx;

    gsap.set(characterBoy, { opacity: 0 });
    character.className = 'char-pos-solo-center';
    character.querySelector('img').src = 'assets/sprites/characters/girl.png';
    gsap.set(character, { opacity: 0, y: 12, scale: 0.92, x: 0, rotate: 0, xPercent: -50 });

    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:absolute; left:50%; top:14%; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; gap:16px; width:min(80%,460px);';

    const panel = document.createElement('div');
    panel.className = 'pixel-panel';
    panel.innerHTML = `<div class="pixel-panel__title" style="font-size:clamp(14px,2.6vw,19px);">${CLOSING_TEXT}</div>`;

    const button = document.createElement('button');
    button.className = 'pixel-button';
    button.textContent = 'REPLAY';
    button.style.marginTop = '10px';

    wrap.appendChild(panel);
    ctx.sceneUI.appendChild(wrap);
    ctx.sceneUI.appendChild(button);
    button.style.cssText += 'position:absolute; left:50%; bottom:12%; transform:translateX(-50%);';
    this.elements = { wrap, panel, button };

    gsap.to(character, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.6)' });
    gsap.set(panel, { opacity: 0, scale: 0.85 });
    gsap.to(panel, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)', delay: 0.35 });
    gsap.set(button, { opacity: 0, y: 8 });
    gsap.to(button, { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)', delay: 0.7 });
  },

  play() {
    const { button } = this.elements;
    const { audio } = this.ctx;
    this._onEnter = () => { audio.playSFX('hover'); gsap.to(button, { scale: 1.06, duration: 0.18 }); };
    this._onLeave = () => gsap.to(button, { scale: 1, duration: 0.18 });
    this._onClick = () => this.handleReplay();
    button.addEventListener('pointerenter', this._onEnter);
    button.addEventListener('pointerleave', this._onLeave);
    button.addEventListener('click', this._onClick);
  },

  async handleReplay() {
    const { audio, particles } = this.ctx;
    audio.playSFX('replayChime');
    particles.burst(50, 60, 10, this.ctx.sparkleLayer, 'assets/sprites/particles/sparkle.png');
    await new Promise((r) => setTimeout(r, 300));
    const tl = gsap.timeline({
      onComplete: () => this.ctx.sceneManager.transitionTo('greeting'),
    });
    tl.to([this.elements.wrap, this.elements.button], { opacity: 0, duration: 0.4 });
    this.timeline = tl;
  },

  pause() { this.timeline?.pause(); },

  destroy() {
    const { button } = this.elements;
    if (button) {
      button.removeEventListener('pointerenter', this._onEnter);
      button.removeEventListener('pointerleave', this._onLeave);
      button.removeEventListener('click', this._onClick);
      button.remove();
    }
    this.timeline?.kill();
  },

  async restart() {
    this.destroy();
    await this.init(this.ctx);
    this.play();
  },
};
