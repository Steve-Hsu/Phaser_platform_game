import Phaser from "phaser";

class Projectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.speed = 300;
    this.maxDistance = 300;
    this.traveleDistance = 0;
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    this.traveleDistance += this.body.deltaAbsX();
    if (this.traveleDistance >= this.maxDistance) {
      this.setActive(false);
      this.setVisible(false);
      this.traveleDistance = 0;
    }
  }

  fire(x, y) {
    this.setActive(true);
    this.setVisible(true);
    this.body.reset(x, y);
    this.setVelocityX(this.speed);
  }
}

export default Projectile;