import SpriteEffect from "./SpriteEffect"

class EffecManager {
  constructor(scene) {
    this.scene = scene
  }
  playEffectOn(effectName, target, impactPosition) {
    const effect = new SpriteEffect(this.scene, 0, 0, effectName, impactPosition);
    effect.playOn(target);
  }

}

export default EffecManager