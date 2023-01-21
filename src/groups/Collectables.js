import Phaser from 'phaser';
import Collectable from '../collectable.js/Collectable';

class Collectables extends Phaser.Physics.Arcade.StaticGroup {
  constructor(scene) {
    super(scene.physics.world, scene)

    this.createFromConfig({
      classType: Collectable
    })
  }
}

export default Collectables;