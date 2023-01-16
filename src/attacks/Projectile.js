import Phaser from "phaser";

class Projectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.speed = 300;
    this.maxDistance = 200;
    this.traveleDistance = 0;
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    this.traveleDistance += this.body.deltaAbsX();
    if (this.traveleDistance >= this.maxDistance) {
      this.destroy();
    }
  }

  fire() {
    this.setVelocityX(this.speed);
  }
}

export default Projectile;