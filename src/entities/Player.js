import Phaser from "phaser";
import initAnimations from "./anims/playerAnims"

import collidable from "../mixins/collidable";

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Mixins
    // Copy the values of all of the enumerable own properties from one or more source objects 
    // to a target object. return the target object
    Object.assign(this, collidable);

    this.init();
    this.initEvents();
  }

  init() {
    this.gravity = 500;
    this.playerSpeed = 150;
    this.jumpCount = 0;
    this.consecutiveJumps = 1;
    this.cursors = this.scene.input.keyboard.createCursorKeys();

    this.body.setSize(20, 36); // Set the collider area
    this.body.setGravityY(500); // set so the player will fill in Y direction
    this.setCollideWorldBounds(true);
    this.setOrigin(0.5, 1); // for match the playerZone's object
    initAnimations(this.scene.anims);
  }

  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
  }

  update() {
    const { left, right, space, up } = this.cursors;
    // This justDown value allows you to test if thie key has just been pressed down or not.
    const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space);
    const isUpJustDown = Phaser.Input.Keyboard.JustDown(up);
    const onFloor = this.body.onFloor()

    if (left.isDown) {
      this.setVelocityX(-this.playerSpeed);
      this.setFlipX(true);
    } else if (right.isDown) {
      this.setVelocityX(this.playerSpeed);
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }
    if ((isSpaceJustDown || isUpJustDown) && (onFloor || this.jumpCount < this.consecutiveJumps)) {
      // Becase we've set the body of the player with gravity, so after space up, player will fall into ground again
      this.setVelocityY(-this.playerSpeed * 2)
      this.jumpCount++
    }
    if (onFloor) {
      // Don't play it again if it's already playing
      // Second value (true) -> igonreIfPlaying
      this.jumpCount = 0
      this.body.velocity.x !== 0 ?
        this.play('run', true) : this.play('idle', true);
    } else {
      this.play('jump', true)
    }
  }

  takesHit(initiator) {
    console.log("eee", initiator)
  }

}

export default Player;