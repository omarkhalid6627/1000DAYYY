export const GiftScene = {
  timeline: null,
  elements: {},
  opened: null,

  async init(ctx) {
    this.ctx = ctx;
    if (!this.opened) this.opened = { message: false, photos: false, song: false };

    // returning here with everything already opened -> go straight to ending
    if (this.opened.message && this.opened.photos && this.opened.song) {
      this.ctx.sceneManager.transitionTo('ending');
      return;
    }

    gsap.set(ctx.characterBoy, { opacity: 0 });
    ctx.character.className = 'char-pos-solo-left';
    ctx.character.querySelector('img').src = 'assets/sprites/characters/boy.png';
    gsap.set(ctx.character, { opacity: 0, x: 0, y: 0, rotate: 0, scale: 1 });
    gsap.to(ctx.character, { opacity: 1, duration: 0.5, ease: 'power1.out' });

    const root = document.createElement('div');
    root.className = 'gift-root';
    root.style.cssText = 'position:absolute; inset:0;';

    const title = document.createElement('div');
    title.className = 'pixel-panel';
    title.style.cssText = 'position:absolute; left:50%; top:8%; transform:translateX(-50%); opacity:0;';
    title.innerHTML = '<div class="pixel-panel__title" id="gift-title" style="font-size:clamp(18px,3.4vw,26px); min-height:1em;"></div>';

    const row = document.createElement('div');
    row.className = 'gift-row';
    const boxDefs = [
      { type: 'song', img: 'giftbox-song.png' },
      { type: 'photos', img: 'giftbox-photos.png' },
      { type: 'message', img: 'giftbox-message.png' },
    ];
    boxDefs.forEach(({ type, img }) => {
      const box = document.createElement('button');
      box.className = 'gift-box-img';
      box.dataset.type = type;
      box.setAttribute('aria-label', type);
      box.innerHTML = `<img src="assets/sprites/ui/${img}" class="pixelated" alt="">`;
      row.appendChild(box);
    });

    root.appendChild(title);
    root.appendChild(row);
    ctx.sceneUI.appendChild(root);

    this.elements = { root, title, row, boxes: [...row.querySelectorAll('.gift-box-img')] };

    const freshBoxes = this.elements.boxes.filter((b) => !this.opened[b.dataset.type]);
    const openedBoxes = this.elements.boxes.filter((b) => this.opened[b.dataset.type]);
    openedBoxes.forEach((b) => { b.classList.add('is-opened'); gsap.set(b, { opacity: 0.45 }); });

    const enterTl = gsap.timeline({
      onComplete: () => this.revealTitle('CHOOSE YOUR GIFT'),
    });
    freshBoxes.forEach((box, i) => {
      gsap.set(box, { y: -150, opacity: 0, rotate: (i - 1) * 6 });
      enterTl.to(box, { y: 0, opacity: 1, rotate: 0, duration: 0.6, ease: 'bounce.out' }, i * 0.22);
    });
    enterTl.add(() => this.startIdleFloats(), '+=0.1');
  },

  revealTitle(text) {
    const { audio } = this.ctx;
    const { title } = this.elements;
    gsap.to(title, { opacity: 1, duration: 0.3 });
    const el = title.querySelector('#gift-title');
    let i = 0;
    const step = () => {
      if (i >= text.length) return;
      el.textContent = text.slice(0, i + 1);
      if (text[i] !== ' ') audio.playSFX('typeKey');
      i++;
      this._titleTimer = setTimeout(step, 45);
    };
    step();
  },

  startIdleFloats() {
    this.elements.boxes.forEach((box, i) => {
      if (this.opened[box.dataset.type]) return;
      gsap.to(box, { y: -6, duration: 1.6 + i * 0.3, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.2 });
      gsap.to(box, { rotate: i % 2 === 0 ? 3 : -3, duration: 2.2 + i * 0.2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.3 });
    });
  },

  play() {
    const { audio } = this.ctx;
    this._onEnter = (e) => {
      if (this.opened[e.currentTarget.dataset.type]) return;
      audio.playSFX('hover');
      gsap.to(e.currentTarget, { scale: 1.08, duration: 0.2, ease: 'back.out(2)' });
    };
    this._onLeave = (e) => {
      if (this.opened[e.currentTarget.dataset.type]) return;
      gsap.to(e.currentTarget, { scale: 1, duration: 0.2 });
    };
    this._onClick = (e) => this.openBox(e.currentTarget.dataset.type);

    this.elements.boxes.forEach((box) => {
      box.addEventListener('pointerenter', this._onEnter);
      box.addEventListener('pointerleave', this._onLeave);
      box.addEventListener('click', this._onClick);
    });
  },

  openBox(type) {
    if (this.opened[type] || this._transitioning) return;
    this._transitioning = true;
    const { audio, particles } = this.ctx;
    const box = this.elements.boxes.find((b) => b.dataset.type === type);
    const rect = box.getBoundingClientRect();
    const stageRect = this.ctx.stage.getBoundingClientRect();
    const xPct = ((rect.left + rect.width / 2 - stageRect.left) / stageRect.width) * 100;
    const yPct = ((rect.top + rect.height / 2 - stageRect.top) / stageRect.height) * 100;

    audio.playSFX('giftOpen');
    this.ctx.camera.shake(3, 0.12);
    particles.burst(xPct, yPct, 10, this.ctx.sparkleLayer, 'assets/sprites/particles/heart.png');
    gsap.killTweensOf(box);
    this.opened[type] = true;

    const tl = gsap.timeline({
      onComplete: () => this.ctx.sceneManager.transitionTo(
        type === 'message' ? 'letter' : type === 'photos' ? 'photos' : 'song'
      ),
    });
    tl.to(box, { scale: 1.15, rotate: 0, duration: 0.1, ease: 'power1.out' })
      .to(box, { x: -4, duration: 0.05 })
      .to(box, { x: 4, duration: 0.05 })
      .to(box, { x: 0, scale: 0.2, opacity: 0, duration: 0.25, ease: 'power1.in' })
      .to([this.elements.title, ...this.elements.boxes.filter((b) => b !== box)], { opacity: 0, duration: 0.2 }, '<');
    this.timeline = tl;
  },

  pause() { this.timeline?.pause(); },

  destroy() {
    clearTimeout(this._titleTimer);
    this.elements.boxes?.forEach((box) => {
      box.removeEventListener('pointerenter', this._onEnter);
      box.removeEventListener('pointerleave', this._onLeave);
      box.removeEventListener('click', this._onClick);
      gsap.killTweensOf(box);
    });
    this.timeline?.kill();
    this._transitioning = false;
  },

  async restart() {
    this.opened = { message: false, photos: false, song: false };
    this.destroy();
    await this.init(this.ctx);
    this.play();
  },

  resetState() {
    this.opened = null;
  },
};
