import Enemy from './Enemy';
import initAnims from './anims/snakyAnims'// Have this.anims.getCurrentKey() bug, so here is original code of tutorial, we dont' use it here
import Projectiles from '../attacks/Projectiles';


class Snaky extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, 'snaky');
    initAnims(scene.anims); // Have this.anims.getCurrentKey() bug, so here is original code of tutorial, we dont' use it here

    this.isGetHurt = false

  }

  init() {
    super.init();
    this.speed = 100;

    this.projectiles = new Projectiles(this.scene, 'fireball-1');
    this.timeFromlastAttack = 0;
    this.attackDelay = this.getAttackDelay();
    this.lastDirection = null;

    this.setSize(12, 45); // set the size of body, which is a area can be collider
    // this.setSize(20, 45); // set the size of body, which is a area can be collider

    // setOffset() : cut the unnecessay space in the character frame.
    // In order to make the character image in the center of the collider body
    this.setOffset(7, 20);
  }

  update(time, delta) {
    super.update(time, delta);

    // For setting the directoin of the fireball
    // velocity.x > 0 means walking toward right.
    if (this.body.velocity.x > 0) {
      this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT
    } else {
      this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT
    }

    if (this.timeFromlastAttack + this.attackDelay <= time) {
      this.projectiles.fireProjectile(this, 'fireball');

      this.timeFromlastAttack = time;
      this.attackDelay = this.getAttackDelay();
    }

    if (!this.active) return; // Prevent calling a destroyed Enemy body, when the Enemy is terminated (destroyed)
    // if (this.isPlayingAnims()) return; // Have this.anims.getCurrentKey() bug, so here is original code of tutorial, we dont' use it here
    if (this.anims.isPlaying && this.isGetHurt) return;
    // console.log("e");
    this.isGetHurt = false;
    this.play('snaky-walk', true);
  }

  getAttackDelay() {
    return Phaser.Math.Between(1000, 4000);
  }

  takesHit(source) {
    super.takesHit(source);
    this.isGetHurt = true
    this.play('snaky-hurt', true);
  }
}
export default Snaky;

