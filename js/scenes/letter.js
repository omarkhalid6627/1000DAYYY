const PLACEHOLDER_LETTER = `\u0623\u0644\u0641 \u064a\u0648\u0645 \u0648\u0627\u0646\u0627 \u0627\u0633\u0639\u062f \u0631\u0627\u062c\u0644 \u0641\u064a \u0627\u0644\u062f\u0646\u064a\u0627\u060c \u0627\u0644\u0641 \u064a\u0648\u0645 \u0648\u0627\u0646\u0627 \u0645\u0639 \u0627\u0643\u062a\u0631 \u0628\u0646\u0648\u062a\u0647 \u0645\u062e\u0644\u0635\u0647 \u0641\u064a \u0627\u0644\u0643\u0648\u0646 \u060c \u0627\u0644\u0641 \u064a\u0648\u0645 \u0645\u0639 \u0627\u0643\u062a\u0631 \u0628\u0646\u064a \u0627\u062f\u0645\u0647 \u062c\u0645\u064a\u0644\u0647 \u0641\u064a \u0627\u0644\u062d\u064a\u0627\u0629\u060c \u0627\u0644\u0641 \u064a\u0648\u0645 \u0648\u0627\u0646\u0627 \u0628\u062d\u0628\u0643 \u0648\u0647\u0641\u0636\u0644 \u0628\u062d\u0628\u0643 \u0637\u0648\u0644 \u0627\u0644\u0639\u0645\u0631 \u0644\u0627\u0646\u0643 \u062a\u0633\u062a\u0627\u0647\u0644\u064a \u062f\u0647 \u060c \u0627\u0644\u0641 \u064a\u0648\u0645 \u0648\u0627\u0646\u0627 \u0639\u0627\u0648\u0632 \u0627\u0641\u0636\u0644 \u0644\u0627\u0632\u0642 \u0641\u064a\u0643\u064a \u060c \u0668\u0666.\u0664 \u0645\u0644\u064a\u0648\u0646 \u062b\u0627\u0646\u064a\u0647 \u0648\u0627\u0646\u0627 \u0645\u0634 \u0628\u062a\u0646\u0641\u0633 \u063a\u064a\u0631 \u062d\u0628\u0643 \u060c \u0661.\u0664 \u0645\u0644\u064a\u0648\u0646 \u062f\u0642\u064a\u0642\u0647 \u0648\u0627\u0646\u0627 \u0628\u062c\u062a\u0647\u062f \u0648 \u0628\u062d\u0627\u0648\u0644 \u0639\u0634\u0627\u0646 \u0646\u0638\u0631\u0647 \u0627\u0644\u0644\u064a \u0628\u062a\u0628\u0642\u0649 \u0639\u0644\u0649 \u0648\u0634\u0643 \u0648\u0627\u0646\u062a \u0641\u062e\u0648\u0631\u0647 \u0628\u064a\u0627 \u060c \u0661\u0664\u0662 \u0627\u0633\u0628\u0648\u0639 \u0648\u0627\u0646\u0627 \u0628\u0639\u062f\u064a \u0627\u0644\u0627\u0633\u0628\u0648\u0639 \u0639\u0634\u0627\u0646 \u0645\u0633\u062a\u0646\u064a \u0627\u0644\u064a\u0648\u0645 \u0627\u0644\u0644\u064a \u0641\u064a\u0647\u0645 \u0627\u0644\u0644\u064a \u0628\u062a\u0631\u0645\u064a \u0641\u064a\u0647 \u0641\u062d\u0636\u0646\u0643 \u0648\u0645\u062a\u0634\u0648\u0642 \u0627\u0634\u0648\u0641\u0643\u060c \u0663\u0662 \u0634\u0647\u0631 \u0648 \u0643\u0644 \u0634\u0647\u0631 \u0644\u0647 \u0630\u0643\u0631\u0649 \u0645\u062e\u062a\u0644\u0641\u0647 \u0639\u0646 \u0627\u0644\u0644\u064a \u0628\u0639\u062f\u0647\u060c \u0633\u0646\u062a\u064a\u0646 \u0648 \u0668 \u0634\u0647\u0648\u0631 \u0648\u0627\u0646\u0627 \u0628\u0639\u064a\u0634 \u0627\u062d\u0633\u0646 \u0633\u0646\u064a\u0646 \u062d\u064a\u0627\u062a\u064a
\u064a\u0627\u0631\u0628 \u064a\u0628\u0642\u0648\u0627 \u0645\u0634 \u0661\u0660\u0660\u0660 \u064a\u0648\u0645 \u064a\u0628\u0642\u0648\u0627 \u0661\u0660\u0660\u0660 \u0627\u0633\u0628\u0648\u0639 \u0648 \u0634\u0647\u0631 \u0648\u0633\u0646\u0647\ud83d\ude02
\u0627\u0646\u0627 \u0628\u062d\u0628\u0643 \u0627\u0648\u064a \u0627\u0648\u064a \u0627\u0648\u064a \u0627\u0648\u064a \u0627\u0648\u064a \u064a\u0645\u0631\u064a\u0645 \u0648\u0641\u0639\u0644\u0627 \u0631\u0628\u0646\u0627 \u064a\u062e\u0644\u064a\u0643\u064a \u0644\u064a\u0627 \u064a\u0627 \u0627\u062d\u0644\u0649 \u0628\u0646\u062a \u0641\u064a \u062d\u064a\u0627\u062a\u064a \u0643\u0644\u0647\u0627`;

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
    paperText.dir = 'rtl';
    paperText.style.cssText = `
      position: absolute; right: 31%; top: 14%;
      width: min(37%, 330px); max-height: 76%; overflow-y: auto;
      font-family: var(--font-body); font-size: clamp(14px, 1.9vw, 18px);
      line-height: 1.6; color: #4A3220; text-align: right; direction: rtl; opacity: 0;
      white-space: pre-line; text-shadow: 0 1px 0 rgba(255,255,255,0.4);
    `;

    const skipHint = document.createElement('div');
    skipHint.style.cssText = 'position:absolute; left:50%; bottom:2%; transform:translateX(-50%); font-family:var(--font-body); font-size:12px; color:rgba(74,50,32,0.55); opacity:0;';
    skipHint.textContent = '(tap to skip)';

    const backBtn = document.createElement('button');
    backBtn.className = 'pixel-button';
    backBtn.textContent = '← BACK';
    backBtn.style.cssText = 'position:absolute; left:50%; bottom:6%; transform:translateX(-50%); opacity:0; pointer-events:none; z-index:50;';

    root.appendChild(heading);
    root.appendChild(paperText);
    root.appendChild(skipHint);
    ctx.sceneUI.appendChild(root);
    ctx.sceneUI.appendChild(backBtn);
    this.elements = { root, heading, paperText, backBtn, skipHint, headingText: heading.querySelector('#letter-heading') };

    root.style.cursor = 'pointer';
    this._onRootClick = () => this.skipTyping();
    root.addEventListener('click', this._onRootClick);

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
    // iterate Unicode code points, not UTF-16 units, so the 😂 emoji
    // (a surrogate pair) is never split across two "characters"
    const chars = [...text];
    this._fullChars = chars;
    this._fullText = text;
    let i = 0;
    gsap.to(this.elements.skipHint, { opacity: 1, duration: 0.3 });
    const step = () => {
      if (i >= chars.length) { this.showBack(); return; }
      el.textContent = chars.slice(0, i + 1).join('');
      const ch = chars[i];
      i++;
      if (ch !== ' ') audio.playSFX('typeKey');
      const wait = (ch === '.' || ch === '\u060c') ? 250 : ch === ',' ? 150 : ch === '\n' ? 300 : 32;
      this._typeTimer = setTimeout(step, wait);
    };
    this._typeStep = step;
    step();
  },

  skipTyping() {
    if (!this._fullText || this._skipped) return;
    const el = this.elements.paperText;
    if ([...el.textContent].length >= this._fullChars.length) return;
    this._skipped = true;
    clearTimeout(this._typeTimer);
    el.textContent = this._fullText;
    this.showBack();
  },

  showBack() {
    const { backBtn, skipHint } = this.elements;
    gsap.to(skipHint, { opacity: 0, duration: 0.2 });
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
    root?.removeEventListener('click', this._onRootClick);
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
