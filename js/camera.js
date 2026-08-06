export class CameraController {
  constructor(stageInner) {
    this.el = stageInner;
    this.currentScale = 1;
    this._floatTween = null;
  }

  zoomTo(scale, duration = 1, ease = 'power2.inOut') {
    this.currentScale = scale;
    return gsap.to(this.el, { scale, duration, ease });
  }

  floatLoop(distancePx = 3, duration = 8) {
    this._floatTween = gsap.to(this.el, {
      y: `-=${distancePx}`,
      duration,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
    return this._floatTween;
  }

  shake(distancePx = 3, duration = 0.12) {
    const tl = gsap.timeline();
    tl.to(this.el, { x: distancePx, duration: duration / 4, ease: 'power1.inOut' })
      .to(this.el, { x: -distancePx, duration: duration / 2, ease: 'power1.inOut' })
      .to(this.el, { x: 0, duration: duration / 4, ease: 'power1.inOut' });
    return tl;
  }
}
