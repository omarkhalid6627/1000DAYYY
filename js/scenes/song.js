export const SongScene = {
  timeline: null,
  elements: {},

  async init(ctx) {
    this.ctx = ctx;
    gsap.set(ctx.character, { opacity: 0 });
    gsap.set(ctx.characterBoy, { opacity: 0 });

    const blackout = document.createElement('div');
    blackout.style.cssText = 'position:absolute; inset:0; background:var(--color-ink); opacity:1; z-index:20;';

    const root = document.createElement('div');
    root.style.cssText = `
      position: absolute; inset: 0;
      background: linear-gradient(180deg, #B8A6DA, var(--color-lavender) 60%, #9A7FC4);
      display: flex; align-items: center; justify-content: center;
      opacity: 0;
    `;

    root.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; gap:18px;">
        <div class="player-panel" id="song-panel" style="opacity:0; transform:scale(0.8);">
          <div class="player-disc" id="song-disc"></div>
          <div>
            <div class="pixel-panel__title" style="font-size:18px; -webkit-text-stroke-width:2px;">SONG FOR YOU</div>
            <div style="font-family:var(--font-body); font-size:14px; margin-top:8px; color:var(--color-ink);">
              [drop your song file in assets/audio/music/ and I'll wire up playback]
            </div>
          </div>
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
    backBtn.textContent = '← BACK';
    backBtn.style.cssText = 'position:absolute; left:50%; bottom:6%; transform:translateX(-50%); opacity:0; pointer-events:none;';

    ctx.sceneUI.appendChild(blackout);
    ctx.sceneUI.appendChild(root);
    ctx.sceneUI.appendChild(backBtn);
    this.elements = {
      root, blackout, backBtn,
      panel: root.querySelector('#song-panel'),
      disc: root.querySelector('#song-disc'),
      mascot: root.querySelector('#song-mascot'),
    };

    // unique transition-in: power-on fade-through-black
    const tl = gsap.timeline();
    tl.to(blackout, { opacity: 0, duration: 0.5, delay: 0.25, ease: 'power1.inOut' }, 0)
      .to(root, { opacity: 1, duration: 0.4 }, 0.15)
      .to(this.elements.panel, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }, 0.5)
      .to(this.elements.mascot, { opacity: 1, y: -4, duration: 0.4, ease: 'back.out(2)' }, 0.75)
      .add(() => {
        gsap.to(this.elements.disc, { rotate: 360, duration: 4, repeat: -1, ease: 'none' });
        gsap.to(this.elements.mascot, { y: '+=4', duration: 1.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        this.elements.backBtn.style.pointerEvents = 'auto';
        gsap.to(this.elements.backBtn, { opacity: 1, duration: 0.4 });
      }, 0.9);
    this.timeline = tl;
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
    const tl = gsap.timeline({ onComplete: () => this.ctx.sceneManager.transitionTo('gift') });
    tl.to(this.elements.blackout, { opacity: 1, duration: 0.4, ease: 'power1.inOut' }, 0)
      .to(this.elements.backBtn, { opacity: 0, duration: 0.2 }, 0);
    this.timeline = tl;
  },

  pause() { this.timeline?.pause(); },

  destroy() {
    const { backBtn, root, blackout } = this.elements;
    if (backBtn) {
      backBtn.removeEventListener('pointerenter', this._onEnter);
      backBtn.removeEventListener('pointerleave', this._onLeave);
      backBtn.removeEventListener('click', this._onClick);
      backBtn.remove();
    }
    gsap.killTweensOf(this.elements.disc);
    gsap.killTweensOf(this.elements.mascot);
    root?.remove();
    blackout?.remove();
    this.timeline?.kill();
  },

  async restart() {
    this.destroy();
    await this.init(this.ctx);
    this.play();
  },
};
