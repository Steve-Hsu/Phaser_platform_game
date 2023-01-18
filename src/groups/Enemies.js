import Phaser from "phaser";
import { ENEMY_TYPES } from "../types";
import collidable from "../mixins/collidable";

class Enemies extends Phaser.GameObjects.Group {
  constructor(scene) {
    super(scene);

    Object.assign(this, collidable)
  }

  // Add the projectiles to the group that can hit player.
  // Check all the enemy, if the enemy has projectiles, then add it in the group.
  getProjectiles() {
    const projectiles = new Phaser.GameObjects.Group();
    this.getChildren().forEach((enemy) => {
      enemy.projectiles && projectiles.addMultiple(enemy.projectiles.getChildren())
    })
    return projectiles;
  }

  getTypes() {
    return ENEMY_TYPES;
  }
}

export default Enemies;