import Phaser from "phaser";

import collidable from "../mixins/collidable";

class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);

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
    this.speed = 150;
    this.health = 100;

    this.body.setGravityY(500); // set so the player will fill in Y direction
    this.setSize(this.width, 45); // set the size of body, which is a area can be collider

    // setOffset() : cut the unnecessay space in the character frame.
    // In order to make the character image in the center of the collider body
    this.setOffset(7, 20);
    this.setCollideWorldBounds(true);
    this.setImmovable(true); // After collider, this object don't slide away
    this.setOrigin(0.5, 1); // for match the playerZone's object
  }

  initEvents() {
    // Listening to the update scene function from PlayScene
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
  }

  update(time, delta) {
    this.setVelocityX(20);
  }
}

export default Enemy;