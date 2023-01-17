import Phaser from "phaser";
import EffecManager from "../effects/EffectManager";

class Projectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.speed = 300;
    this.maxDistance = 300;
    this.traveleDistance = 0;

    this.damage = 10;
    this.cooldown = 500;

    this.effectManager = new EffecManager(this.scene)
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    this.traveleDistance += this.body.deltaAbsX();
    if (this.isOutOfRange()) {
      this.body.reset(0, 0);
      this.activateProjectile(false)
      this.traveleDistance = 0;
    }
  }

  fire(x, y) {
    this.activateProjectile(true);
    this.body.reset(x, y);
    this.setVelocityX(this.speed);
  }

  deliversHit(target) {
    this.activateProjectile(false);
    this.traveleDistance = 0;
    this.body.reset(0, 0);
    // Effect Manage will be responsible for creating effect and displaying it
    this.effectManager.playEffectOn('hit-effect', target)
  }

  activateProjectile(isActive) {
    this.setActive(isActive);
    this.setVisible(isActive);
  }

  isOutOfRange() {
    return this.traveleDistance &&
      this.traveleDistance >= this.maxDistance;
  }
}

export default Projectile;