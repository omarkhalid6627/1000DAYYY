export const SongScene = {
  timeline: null,
  elements: {},

  async init(ctx) {
    this.ctx = ctx;
    gsap.set(ctx.character, { opacity: 0 });
    ctx.characterBoy.className = 'char-pos-solo-left';
    ctx.characterBoy.querySelector('img').src = 'assets/sprites/characters/boy.png';
    gsap.set(ctx.characterBoy, { opacity: 0, x: 0, y: 10, rotate: 0, scale: 0.9 });

    const blackout = document.createElement('div');
    blackout.style.cssText = 'position:absolute; inset:0; background:var(--color-ink); opacity:1; z-index:20;';

    const root = document.createElement('div');
    root.style.cssText = `
      position: absolute; inset: 0; overflow: hidden;
      background: linear-gradient(180deg, #B8A6DA 0%, var(--color-lavender) 55%, #9A7FC4 100%);
      opacity: 0; z-index: 5;
    `;

    const decoLayer = document.createElement('div');
    decoLayer.style.cssText = 'position:absolute; inset:0; pointer-events:none; z-index:1;';
    root.appendChild(decoLayer);

    // a few soft static clouds low in the layer for depth
    for (let i = 0; i < 3; i++) {
      const c = document.createElement('img');
      c.src = 'assets/sprites/backgrounds/cloud-mid.png';
      c.className = 'pixelated';
      c.style.cssText = `position:absolute; left:${10 + i * 32}%; top:${8 + (i % 2) * 10}%; width:64px; opacity:0.5;`;
      decoLayer.appendChild(c);
    }
    // twinkling stars scattered through the layer
    for (let i = 0; i < 10; i++) {
      const s = document.createElement('img');
      s.src = 'assets/sprites/particles/star.png';
      s.className = 'pixelated';
      s.style.cssText = `position:absolute; left:${5 + Math.random() * 90}%; top:${5 + Math.random() * 55}%; width:7px;`;
      decoLayer.appendChild(s);
      gsap.set(s, { opacity: 0.3 });
      gsap.to(s, { opacity: 0.9, duration: 1 + Math.random() * 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: Math.random() * 3 });
    }

    const heading = document.createElement('div');
    heading.className = 'pixel-panel';
    heading.style.cssText = 'position:absolute; left:50%; top:6%; transform:translateX(-50%); opacity:0; z-index:5;';
    heading.innerHTML = '<div class="pixel-panel__title" style="font-size:clamp(16px,3vw,22px);">SONG FOR YOU</div>';

    const centerWrap = document.createElement('div');
    centerWrap.style.cssText = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:5; pointer-events:none;';
    centerWrap.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; gap:16px; pointer-events:auto;">
        <div class="player-panel" id="song-panel" style="opacity:0; transform:scale(0.8); flex-direction:column; gap:14px;">
          <div style="display:flex; align-items:center; gap:16px;">
            <div class="player-disc" id="song-disc"></div>
            <div>
              <div style="font-family:var(--font-body); font-size:15px; color:var(--color-ink);">Khalik Ma'aya</div>
              <div style="font-family:var(--font-body); font-size:12px; color:var(--color-shadow);">Amr Diab</div>
            </div>
          </div>
          <button class="pixel-button" id="song-playpause" style="align-self:center; padding:8px 22px; font-size:14px;">\u25b6 PLAY</button>
        </div>
        <svg width="46" height="46" viewBox="0 0 16 16" id="song-mascot" style="opacity:0;">
          <circle cx="8" cy="9" r="6.5" fill="#F4B6C2" stroke="#3D2D29" stroke-width="0.8"/>
          <ellipse cx="5.5" cy="8.5" rx="1.6" ry="2" fill="#3D2D29"/>
          <ellipse cx="10.5" cy="8.5" rx="1.6" ry="2" fill="#3D2D29"/>
          <circle cx="5.9" cy="7.8" r="0.5" fill="#fff"/>
          <circle cx="10.9" cy="7.8" r="0.5" fill="#fff"/>
          <ellipse cx="4" cy="10.5" rx="1" ry="0.6" fill="#F19CB3" opacity="0.7"/>
          <ellipse cx="12" cy="10.5" rx="1" ry="0.6" fill="#F19CB3" opacity="0.7"/>
          <path d="M6 11.2 Q8 12.4 10 11.2" stroke="#3D2D29" stroke-width="0.6" fill="none" stroke-linecap="round"/>
          <ellipse cx="2.5" cy="2.5" rx="2.5" ry="1.6" fill="#F4B6C2" stroke="#3D2D29" stroke-width="0.7" transform="rotate(-30 2.5 2.5)"/>
        </svg>
      </div>
    `;

    const backBtn = document.createElement('button');
    backBtn.className = 'pixel-button';
    backBtn.textContent = '\u2190 BACK';
    backBtn.style.cssText = 'position:absolute; left:50%; bottom:6%; transform:translateX(-50%); opacity:0; pointer-events:none; z-index:50;';

    const audioEl = document.createElement('audio');
    audioEl.src = 'assets/audio/music/song-for-you.mp3';
    audioEl.preload = 'none';

    ctx.sceneUI.appendChild(blackout);
    ctx.sceneUI.appendChild(root);
    ctx.sceneUI.appendChild(heading);
    ctx.sceneUI.appendChild(centerWrap);
    ctx.sceneUI.appendChild(backBtn);
    ctx.sceneUI.appendChild(audioEl);

    this.elements = {
      root, blackout, backBtn, heading, decoLayer, audioEl,
      panel: centerWrap.querySelector('#song-panel'),
      disc: centerWrap.querySelector('#song-disc'),
      mascot: centerWrap.querySelector('#song-mascot'),
      playBtn: centerWrap.querySelector('#song-playpause'),
    };

    const tl = gsap.timeline();
    tl.to(blackout, { opacity: 0, duration: 0.5, delay: 0.25, ease: 'power1.inOut',
      onComplete: () => { blackout.style.pointerEvents = 'none'; } }, 0)
      .to(root, { opacity: 1, duration: 0.4 }, 0.15)
      .to(heading, { opacity: 1, duration: 0.3 }, 0.4)
      .to(this.elements.panel, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }, 0.5)
      .to(this.elements.mascot, { opacity: 1, y: -4, duration: 0.4, ease: 'back.out(2)' }, 0.75)
      .to(this.ctx.characterBoy, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }, 0.8)
      .add(() => {
        gsap.to(this.elements.mascot, { y: '+=4', duration: 1.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        gsap.to(this.ctx.characterBoy, { y: '-=5', duration: 0.9, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        this.startAmbientNotes();
        this.elements.backBtn.style.pointerEvents = 'auto';
        gsap.to(this.elements.backBtn, { opacity: 1, duration: 0.4 });
      }, 0.9);
    this.timeline = tl;
  },

  startAmbientNotes() {
    this._ambientTimer = setInterval(() => {
      const symbols = ['\u2669', '\u266a', '\u266b'];
      const note = document.createElement('div');
      note.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      note.style.cssText = `
        position:absolute; left:${10 + Math.random() * 80}%; top:85%;
        color:rgba(255,248,239,0.8); font-size:${16 + Math.random() * 10}px; z-index:2;
      `;
      this.elements.decoLayer.appendChild(note);
      gsap.to(note, {
        y: '-=260', x: `+=${Math.random() > 0.5 ? 30 : -30}`, opacity: 0, rotate: Math.random() * 40 - 20,
        duration: 4, ease: 'power1.out', onComplete: () => note.remove(),
      });
    }, 900);
  },

  play() {
    const { backBtn, playBtn, audioEl, disc } = this.elements;
    const { audio } = this.ctx;

    this._onBackEnter = () => { audio.playSFX('hover'); gsap.to(backBtn, { scale: 1.06, duration: 0.18 }); };
    this._onBackLeave = () => gsap.to(backBtn, { scale: 1, duration: 0.18 });
    this._onBackClick = () => this.goBack();
    backBtn.addEventListener('pointerenter', this._onBackEnter);
    backBtn.addEventListener('pointerleave', this._onBackLeave);
    backBtn.addEventListener('click', this._onBackClick);

    this._discSpin = null;
    this._onPlayClick = () => {
      audio.playSFX('click');
      if (audioEl.paused) {
        audioEl.play().catch(() => {});
        playBtn.textContent = '\u23f8 PAUSE';
        this._discSpin = gsap.to(disc, { rotate: '+=360', duration: 4, repeat: -1, ease: 'none' });
      } else {
        audioEl.pause();
        playBtn.textContent = '\u25b6 PLAY';
        this._discSpin?.pause();
      }
    };
    playBtn.addEventListener('click', this._onPlayClick);
    audioEl.addEventListener('ended', () => {
      playBtn.textContent = '\u25b6 PLAY';
      this._discSpin?.pause();
    });
  },

  goBack() {
    const { audio } = this.ctx;
    audio.playSFX('click');
    this.elements.audioEl.pause();
    clearInterval(this._ambientTimer);
    const tl = gsap.timeline({ onComplete: () => this.ctx.sceneManager.transitionTo('gift') });
    tl.to(this.elements.blackout, { opacity: 1, pointerEvents: 'auto', duration: 0.4, ease: 'power1.inOut' }, 0)
      .to([this.elements.backBtn, this.elements.heading, this.elements.panel, this.elements.mascot],
          { opacity: 0, duration: 0.2 }, 0)
      .to(this.ctx.characterBoy, { opacity: 0, duration: 0.2 }, 0);
    this.timeline = tl;
  },

  pause() { this.timeline?.pause(); this.elements.audioEl?.pause(); },

  destroy() {
    clearInterval(this._ambientTimer);
    const { backBtn, playBtn, root, blackout, heading, audioEl } = this.elements;
    if (backBtn) {
      backBtn.removeEventListener('pointerenter', this._onBackEnter);
      backBtn.removeEventListener('pointerleave', this._onBackLeave);
      backBtn.removeEventListener('click', this._onBackClick);
      backBtn.remove();
    }
    playBtn?.removeEventListener('click', this._onPlayClick);
    audioEl?.pause();
    audioEl?.remove();
    gsap.killTweensOf(this.elements.disc);
    gsap.killTweensOf(this.elements.mascot);
    gsap.killTweensOf(this.ctx.characterBoy);
    this._discSpin?.kill();
    root?.remove();
    blackout?.remove();
    heading?.remove();
    this.timeline?.kill();
  },

  async restart() {
    this.destroy();
    await this.init(this.ctx);
    this.play();
  },
};
