import Phaser from "phaser";
import Projectile from "./Projectile";
import { getTimestamp } from "../utils/functions";

class Projectiles extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);
    this.createMultiple({
      frameQuantity: 5,
      active: false,
      visible: false,
      key: 'iceball',
      classType: Projectile
    })
    this.timeFromLastProjectile = null;
  }

  fireProjectile(initiator) {
    const projectile = this.getFirstDead(false);
    if (!projectile) { return; }

    // Cool down the shooting
    if (this.timeFromLastProjectile
      && this.timeFromLastProjectile + projectile.cooldown > getTimestamp()) {
      return;
    }

    const center = initiator.getCenter(); // get value of Centered coordinates of Projectile
    let centerX; // little touch of the coordinates of the projectile

    if (initiator.lastDirection === Phaser.Physics.Arcade.FACING_RIGHT) {
      projectile.speed = Math.abs(projectile.speed);
      projectile.setFlipX(false);
      centerX = center.x + 10
    } else {
      projectile.speed = -Math.abs(projectile.speed);
      projectile.setFlipX(true);
      centerX = center.x - 10
    }

    projectile.fire(centerX, center.y);
    this.timeFromLastProjectile = getTimestamp();
  }

}

export default Projectiles;