import Phaser from "phaser";
import initAnimations from "./anims/playerAnims";
import collidable from "../mixins/collidable";
import HealthBar from "../hud/Healthbar";
import anims from "../mixins/anims";
import Projectiles from "../attacks/Projectiles";

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Mixins
    // Copy the values of all of the enumerable own properties from one or more source objects 
    // to a target object. return the target object
    Object.assign(this, collidable);
    Object.assign(this, anims);

    this.init();
    this.initEvents();
  }

  init() {
    this.gravity = 500;
    this.playerSpeed = 150;
    this.jumpCount = 0;
    this.consecutiveJumps = 1;
    this.hasBeenHit = false;
    this.bounceVelocity = 250;
    this.cursors = this.scene.input.keyboard.createCursorKeys();

    this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
    this.projectiles = new Projectiles(this.scene);

    // for me to treat bug of this.anims.getCurrentKey(), cannot find the function 
    this.isThrow = false

    this.health = 100;
    this.hp = new HealthBar(
      this.scene,
      this.scene.config.leftTopCorner.x + 5,
      this.scene.config.leftTopCorner.y + 5,
      2,
      this.health);

    this.body.setSize(20, 36); // Set the collider area
    this.body.setGravityY(500); // set so the player will fill in Y direction
    this.setCollideWorldBounds(true);
    this.setOrigin(0.5, 1); // for match the playerZone's object
    initAnimations(this.scene.anims);

    this.scene.input.keyboard.on('keydown-Q', () => {

      this.play('throw', true);
      // console.log("check", this.anims)
      this.projectiles.fireProjectile(this);
      this.isThrow = true
    })
  }

  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
  }

  update() {
    if (this.hasBeenHit) { return; };
    const { left, right, space, up } = this.cursors;
    // This justDown value allows you to test if thie key has just been pressed down or not.
    const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space);
    const isUpJustDown = Phaser.Input.Keyboard.JustDown(up);
    const onFloor = this.body.onFloor()

    if (left.isDown) {
      this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT;
      this.setVelocityX(-this.playerSpeed);
      this.setFlipX(true);
    } else if (right.isDown) {
      this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
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

    // Origin code, but can find the "this.anims.getCurrentKey()"
    // if (this.anims.isPlayingAnims && this.anims.getCurrentKey() === 'throw') {
    //   return;
    // }
    if (this.anims.isPlaying && this.isThrow) return;
    this.isThrow = false // turn back to default

    // Don't play it again if it's already playing
    // Second value (true) -> igonreIfPlaying
    if (onFloor) {
      this.jumpCount = 0
      this.body.velocity.x !== 0 ?
        this.play('run', true) : this.play('idle', true);
    } else {
      this.play('jump', true)
    }


  }

  playDamageTween() {
    return this.scene.tweens.add({
      targets: this,
      duration: 100,
      yoyo: true,
      repeat: 4,
      tint: 0xffffff
    })
  }

  bounceOff() {
    this.body.touching.right ?
      this.setVelocityX(-this.bounceVelocity) :
      this.setVelocityX(this.bounceVelocity);

    // this.setVelocityY(-this.bounceVelocity)

    setTimeout(() => {
      this.setVelocityY(-this.bounceVelocity) // Player got hit and jump back a little, here is the jump of jump back
    }, 0)
  }

  takesHit(initiator) {
    if (this.hasBeenHit) { return; }
    this.hasBeenHit = true;
    this.bounceOff();
    const hitAnim = this.playDamageTween();

    this.health -= initiator.damage;
    this.hp.decrease(this.health);

    // this.scene.time.addEvent({
    //   delay: 1000,
    //   callback: () => {
    //     this.hasBeenHit = false;
    //   },
    //   loop: false
    // })
    // More neat way above code
    this.scene.time.delayedCall(1000, () => {
      this.hasBeenHit = false;
      hitAnim.stop();
      this.clearTint();
    })
  }

}

export default Player;