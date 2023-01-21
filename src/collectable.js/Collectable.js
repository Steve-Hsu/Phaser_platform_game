import Phaser from 'phaser';

class collectable extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);

    scene.add.existing(this);

    this.score = 1;

    scene.tweens.add({
      targets: this,
      y: this.y - 3,
      duration: Phaser.Math.Between(1500, 2500),
      repeat: -1,
      easy: 'linear',
      yoyo: true
    })
  }
}

export default collectable;