const PLACEHOLDER_LETTER = `My love,

[This is where your own words go — tell me what you want the
letter to say (or dictate it to me) and I'll drop it in here
exactly, with the same typewriter reveal.]

Forever yours.`;

export const GiftScene = {
  timeline: null,
  elements: {},
  opened: { message: false, photos: false, song: false },

  async init(ctx) {
    this.ctx = ctx;
    this.opened = { message: false, photos: false, song: false };

    gsap.set(ctx.character, { opacity: 1, x: 0, y: 0, rotate: 0, left: '4%', height: '42%' });
    gsap.set(ctx.characterBoy, { opacity: 0 });

    const root = document.createElement('div');
    root.className = 'gift-root';
    root.style.cssText = 'position:absolute; inset:0;';

    const title = document.createElement('div');
    title.className = 'pixel-panel';
    title.style.cssText = 'position:absolute; left:50%; top:8%; transform:translateX(-50%); opacity:0;';
    title.innerHTML = `<div class="pixel-panel__title" id="gift-title" style="font-size:clamp(18px,3.4vw,26px); min-height:1em;"></div>`;

    const row = document.createElement('div');
    row.className = 'gift-row';
    const boxDefs = [
      { type: 'song', cls: 'gift-box--song', label: '♪' },
      { type: 'photos', cls: 'gift-box--photos', label: '📷' },
      { type: 'message', cls: 'gift-box--message', label: '✉' },
    ];
    boxDefs.forEach(({ type, cls }) => {
      const box = document.createElement('button');
      box.className = `gift-box ${cls}`;
      box.dataset.type = type;
      box.setAttribute('aria-label', type);
      row.appendChild(box);
    });

    root.appendChild(title);
    root.appendChild(row);
    ctx.sceneUI.appendChild(root);

    this.elements = { root, title, row, boxes: [...row.querySelectorAll('.gift-box')] };

    // boxes enter first, staggered, each with a slightly different landing feel
    const enterTl = gsap.timeline({
      onComplete: () => this.revealTitle('CHOOSE YOUR GIFT'),
    });
    this.elements.boxes.forEach((box, i) => {
      gsap.set(box, { y: -150, opacity: 0, rotate: (i - 1) * 6 });
      enterTl.to(box, {
        y: 0, opacity: 1, rotate: 0, duration: 0.6, ease: 'bounce.out',
      }, i * 0.22);
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
      gsap.to(box, {
        y: -6, duration: 1.6 + i * 0.3, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.2,
      });
      gsap.to(box, {
        rotate: i % 2 === 0 ? 3 : -3, duration: 2.2 + i * 0.2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.3,
      });
    });
  },

  play() {
    const { audio } = this.ctx;
    this._onEnter = (e) => {
      audio.playSFX('hover');
      gsap.to(e.currentTarget, { scale: 1.08, rotate: 2, duration: 0.2, ease: 'back.out(2)' });
    };
    this._onLeave = (e) => gsap.to(e.currentTarget, { scale: 1, rotate: 0, duration: 0.2 });
    this._onClick = (e) => this.openBox(e.currentTarget.dataset.type);

    this.elements.boxes.forEach((box) => {
      box.addEventListener('pointerenter', this._onEnter);
      box.addEventListener('pointerleave', this._onLeave);
      box.addEventListener('click', this._onClick);
    });
  },

  openBox(type) {
    if (this.opened[type]) return;
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
    gsap.timeline()
      .to(box, { scale: 1.15, rotate: 0, duration: 0.1, ease: 'power1.out' })
      .to(box, { x: -4, duration: 0.05 })
      .to(box, { x: 4, duration: 0.05 })
      .to(box, { x: 0, scale: 0, duration: 0.2, ease: 'power1.in' });

    this.opened[type] = true;
    box.classList.add('is-opened');

    const openers = { message: () => this.showMessage(), photos: () => this.showPhotos(), song: () => this.showSong() };
    setTimeout(openers[type], 300);
  },

  checkAllOpened() {
    if (this.opened.message && this.opened.photos && this.opened.song) {
      setTimeout(() => this.ctx.sceneManager.transitionTo('ending'), 600);
    }
  },

  closeOverlay() {
    const overlay = this.elements.overlay;
    if (!overlay) return;
    gsap.to(overlay, {
      opacity: 0, duration: 0.3,
      onComplete: () => {
        overlay.remove();
        this.elements.overlay = null;
        const box = this.elements.boxes.find((b) => b.dataset.type === this.elements.overlayType);
        if (box) gsap.to(box, { scale: 1, duration: 0.3, ease: 'back.out(1.5)' });
        this.checkAllOpened();
      },
    });
  },

  buildOverlay(type, innerHTML) {
    const overlay = document.createElement('div');
    overlay.className = 'content-overlay';
    overlay.innerHTML = innerHTML;
    this.ctx.sceneUI.appendChild(overlay);
    this.elements.overlay = overlay;
    this.elements.overlayType = type;
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-x';
    closeBtn.textContent = '✕';
    closeBtn.style.pointerEvents = 'auto';
    closeBtn.addEventListener('click', () => this.closeOverlay());
    overlay.firstElementChild?.appendChild(closeBtn);
    gsap.set(overlay, { opacity: 0 });
    gsap.to(overlay, { opacity: 1, duration: 0.3 });
    return overlay;
  },

  showMessage() {
    const { audio } = this.ctx;
    const overlay = this.buildOverlay('message', `
      <div style="display:flex; flex-direction:column; align-items:center; gap:18px;">
        <div class="pixel-panel__title" id="letter-title" style="font-size:clamp(16px,3vw,22px); min-height:1.3em;"></div>
        <div class="envelope" id="gift-envelope" style="opacity:0;">
          <div class="envelope-seal">
            <svg viewBox="0 0 12 10" width="26" height="22"><path d="M6 9 L1 3 Q1 1 3 1 Q6 1 6 4 Q6 1 9 1 Q11 1 11 3 Z" fill="#E98AA5" stroke="#3D2D29" stroke-width="0.6"/></svg>
          </div>
        </div>
      </div>
    `);

    const titleEl = overlay.querySelector('#letter-title');
    const envelope = overlay.querySelector('#gift-envelope');
    const heading = 'A Letter For You';
    let i = 0;
    const typeTitle = () => {
      if (i >= heading.length) {
        gsap.to(envelope, { opacity: 1, duration: 0.3 });
        this.openEnvelope(overlay, envelope);
        return;
      }
      titleEl.textContent = heading.slice(0, i + 1);
      if (heading[i] !== ' ') audio.playSFX('typeKey');
      i++;
      this._typeTimer = setTimeout(typeTitle, 45);
    };
    setTimeout(typeTitle, 300);
  },

  openEnvelope(overlay, envelope) {
    const { audio } = this.ctx;
    gsap.set(envelope, { y: 60, scale: 0.9 });
    const openTl = gsap.timeline({ delay: 0.2 });
    openTl
      .to(envelope, { y: 0, scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.6)' })
      .to({}, { duration: 0.4 })
      .add(() => {
        audio.playSFX('envelope');
        const letter = document.createElement('div');
        letter.className = 'letter-paper';
        letter.id = 'gift-letter';
        letter.style.opacity = 0;
        overlay.querySelector('div').appendChild(letter);
        gsap.to(envelope, { opacity: 0, y: -10, duration: 0.3 });
        gsap.fromTo(letter, { scale: 0.9 }, {
          opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.4)',
          onComplete: () => this.typewrite(letter, PLACEHOLDER_LETTER),
        });
      });
  },

  typewrite(el, text) {
    const { audio } = this.ctx;
    let i = 0;
    const step = () => {
      if (i >= text.length) return;
      el.textContent = text.slice(0, i + 1);
      const ch = text[i];
      i++;
      if (ch !== ' ') audio.playSFX('typeKey');
      const wait = ch === '.' ? 250 : ch === ',' ? 150 : ch === '\n' ? 300 : 32;
      this._typeTimer = setTimeout(step, wait);
    };
    step();
  },

  showPhotos() {
    this.buildOverlay('photos', `
      <div style="display:flex; gap:14px; flex-wrap:wrap; align-items:center; justify-content:center; max-width:520px;">
        ${[1, 2, 3].map((n) => `
          <div class="photo-frame" style="--tilt:${n === 2 ? '2deg' : n === 1 ? '-4deg' : '4deg'};">
            <div class="photo-frame__inner">your photo ${n}<br>goes here</div>
          </div>
        `).join('')}
      </div>
    `);
  },

  showSong() {
    this.buildOverlay('song', `
      <div class="player-panel">
        <div class="player-disc"></div>
        <div>
          <div class="pixel-panel__title" style="font-size:16px; -webkit-text-stroke-width:2px;">SONG FOR YOU</div>
          <div style="font-family:var(--font-body); font-size:14px; margin-top:6px; color:var(--color-ink);">
            [drop your song file in assets/audio/music/ and I'll wire up the player]
          </div>
        </div>
      </div>
    `);
  },

  pause() { this.timeline?.pause(); },

  destroy() {
    clearTimeout(this._typeTimer);
    clearTimeout(this._titleTimer);
    this.elements.boxes?.forEach((box) => {
      box.removeEventListener('pointerenter', this._onEnter);
      box.removeEventListener('pointerleave', this._onLeave);
      box.removeEventListener('click', this._onClick);
      gsap.killTweensOf(box);
    });
    this.timeline?.kill();
  },

  async restart() {
    this.destroy();
    await this.init(this.ctx);
    this.play();
  },
};
