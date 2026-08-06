export class SceneManager {
  constructor(context) {
    this.context = context; // shared { audio, particles, camera, sceneUI, character }
    this.scenes = new Map();
    this.currentId = null;
  }

  register(id, scene) {
    this.scenes.set(id, scene);
  }

  async transitionTo(id) {
    const next = this.scenes.get(id);
    if (!next) {
      this.context.onMissingScene?.(id);
      return;
    }
    const current = this.currentId ? this.scenes.get(this.currentId) : null;
    if (current) {
      current.pause?.();
      await current.transitionOut?.();
      current.destroy?.();
    }
    this.context.sceneUI.innerHTML = '';
    this.currentId = id;
    await next.init(this.context);
    next.play();
  }

  restartAll() {
    const current = this.currentId ? this.scenes.get(this.currentId) : null;
    current?.destroy?.();
    this.context.sceneUI.innerHTML = '';
    this.currentId = null;
  }
}
