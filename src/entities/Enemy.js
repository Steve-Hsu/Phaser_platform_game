import Phaser from "phaser";
import collidable from "../mixins/collidable";

class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);

    this.config = scene.config;

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
    this.timeFromLastTurn = 0;
    this.maxPatrolDistance = 500;
    this.currentPatrolDistance = 0;

    this.damage = 20 // Enemy's attack to player

    this.health = 100;
    this.platformCollidersLayer = null;
    this.rayGraphics = this.scene.add.graphics({ lineStyle: { width: 2, color: 0xaa00aa } });
    this.body.setGravityY(this.gravity); // set so the player will fill in Y direction
    this.setSize(this.width, 45); // set the size of body, which is a area can be collider

    // setOffset() : cut the unnecessay space in the character frame.
    // In order to make the character image in the center of the collider body
    this.setOffset(7, 20);
    this.setCollideWorldBounds(true);
    this.setImmovable(true); // After collider, this object don't slide away
    this.setOrigin(0.5, 1); // for match the playerZone's object
    this.setVelocityX(this.speed); // Walking speed of Enemy
  }
  initEvents() {
    // Listening to the update scene function from PlayScene
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
  }
  update(time, delta) {
    this.patrol(time)
  }



  patrol(time, delta) {

    if (!this.body || !this.body.onFloor()) { return; } // A seft check if don't have this enemy body, just return null;

    this.currentPatrolDistance += Math.abs(this.body.deltaX())
    const { ray, hasHit } = this.raycast(this.body, this.platformCollidersLayer, {
      raylength: 40, precision: 10, steepens: 1
    });
    // raylength = the length of the detect ray attached on the enemy body
    // Precision = the time to trigger a gain the detect ray, smaller the num, more precision you get
    // steepens = the angle of the detect ray, 1 = 45 degree toward bottom front, 0 = 90 degree, straigt down

    if ((!hasHit || this.currentPatrolDistance >= this.maxPatrolDistance)
      && this.timeFromLastTurn + 100 < time) {
      this.setFlipX(!this.flipX); // flip the image
      this.setVelocityX(this.speed = -this.speed) // It basically walk backward
      this.timeFromLastTurn = time;
      this.currentPatrolDistance = 0
    }

    if (this.config.debug && ray) {
      this.rayGraphics.clear();
      this.rayGraphics.strokeLineShape(ray);
    }
  }

  setPlatformColliders(platformCollidersLayer) {
    this.platformCollidersLayer = platformCollidersLayer;

  }
}

export default Enemy;