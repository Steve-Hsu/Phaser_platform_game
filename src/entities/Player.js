import Phaser from "phaser";
import initAnimations from "./anims/playerAnims";
import collidable from "../mixins/collidable";
import HealthBar from "../hud/Healthbar";
import anims from "../mixins/anims";
import Projectiles from "../attacks/Projectiles";
import MeleeWeapon from "../attacks/MeleeWeapon";
import { getTimestamp } from "../utils/functions";
import EventEmitter from '../events/Emitter';

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

    //Sound Effect
    this.jumpSound = this.scene.sound.add('jump', { volume: 0.2 });
    this.projectileSound = this.scene.sound.add('projectile-launch', { volume: 0.2 });
    this.stepSound = this.scene.sound.add('step', { volume: 0.2 });
    this.swipeSound = this.scene.sound.add('swipe', { volume: 0.2 });

    this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
    this.projectiles = new Projectiles(this.scene, 'iceball-1');
    this.meleeWeapon = new MeleeWeapon(this.scene, 0, 0, 'sword-default');
    this.timeFromLastSwing = null;

    // for me to treat bug of this.anims.getCurrentKey(), cannot find the function 
    this.isThrow = false
    this.isDown = false

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
    this.handleAttacks();
    this.handleMovement();

    // For running sound
    this.running = false
    this.scene.time.addEvent({
      delay: 300,
      repeat: -1,
      callbackScope: this,
      callback: () => {
        if (this.running) {
          this.stepSound.play();
        }
      }
    })
  }

  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
  }

  update() {
    this.running = false
    // Prevent player can move right or left, while being hit or sliding(crouch down)
    const { left, right, space, up } = this.cursors;
    if (this.hasBeenHit || this.isDown || !this.body) { return; };

    if (this.getBounds().top > this.scene.config.height) {
      EventEmitter.emit("PLAYER_LOOSE");
      return;
    }
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
      this.jumpSound.play();
      this.setVelocityY(-this.playerSpeed * 2)
      this.jumpCount++
    }

    // Origin code, but can find the "this.anims.getCurrentKey()"
    // if (this.anims.isPlaying && this.anims.getCurrentKey() === 'throw') {
    //   return;
    // }


    if (this.anims.isPlaying && this.isThrow || this.isDown) return;
    this.isThrow = false // turn back to default

    // Don't play it again if it's already playing
    // Second value (true) -> igonreIfPlaying
    if (onFloor) {
      // For running sound
      if (left.isDown || right.isDown) {
        this.running = true
      }

      this.jumpCount = 0
      this.body.velocity.x !== 0 ?
        this.play('run', true) : this.play('idle', true);
    } else {
      this.play('jump', true)
    }
  }

  handleAttacks() {
    this.scene.input.keyboard.on('keydown-Q', () => {

      this.projectileSound.play();

      this.play('throw', true);
      this.projectiles.fireProjectile(this, 'iceball');
      this.isThrow = true
    })

    this.scene.input.keyboard.on('keydown-E', () => {

      if (this.timeFromLastSwing
        && this.timeFromLastSwing + this.meleeWeapon.attackSpeed > getTimestamp()) return;
      console.log("melee");

      this.swipeSound.play();
      this.play('throw', true);
      this.isThrow = true
      this.meleeWeapon.swing(this);
      this.timeFromLastSwing = getTimestamp()
    })
  }

  handleMovement() {
    this.scene.input.keyboard.on('keydown-DOWN', () => {
      this.body.setSize(this.width, this.height / 2);
      this.setOffset(0, this.height / 2);
      this.setVelocityX(0)
      this.play('slide', true)
      this.isDown = true;
    })
    this.scene.input.keyboard.on('keyup-DOWN', () => {
      this.body.setSize(20, 38);
      this.setOrigin(0.5, 1);
      this.isDown = false
    })

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

  bounceOff(source) {

    if (source.body) {
      this.body.touching.right ?
        this.setVelocityX(-this.bounceVelocity) :
        this.setVelocityX(this.bounceVelocity);
    } else {
      // If the course of damage comes from tile layer
      this.body.blocked.right ?
        this.setVelocityX(-this.bounceVelocity) :
        this.setVelocityX(this.bounceVelocity);
    }

    // this.setVelocityY(-this.bounceVelocity)

    setTimeout(() => {
      this.setVelocityY(-this.bounceVelocity) // Player got hit and jump back a little, here is the jump of jump back
    }, 0)
  }

  takesHit(source) {
    if (this.hasBeenHit) { return; }
    this.health -= source.damage || source.properties.damage || 0;
    if (this.health <= 0) {
      EventEmitter.emit('PLAYER_LOOSE');
      return;
    }

    this.hasBeenHit = true;
    this.bounceOff(source);
    const hitAnim = this.playDamageTween();


    this.hp.decrease(this.health);
    // Add effect when player got hit by projectile, but when the source is enemy,
    // And the enemy don't have custom FUNC: deliversHit, so here we check first prevent error
    source.deliversHit && source.deliversHit(this);

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