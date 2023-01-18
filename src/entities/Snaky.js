import Enemy from './Enemy';
import initAnims from './anims/birdmanAnims'// Have this.anims.getCurrentKey() bug, so here is original code of tutorial, we dont' use it here

class Snaky extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, 'snaky');
    initAnims(scene.anims); // Have this.anims.getCurrentKey() bug, so here is original code of tutorial, we dont' use it here

    this.isGetHurt = false

  }

  init() {
    super.init();
    this.speed = 100;

    this.setSize(12, 45); // set the size of body, which is a area can be collider
    // this.setSize(20, 45); // set the size of body, which is a area can be collider

    // setOffset() : cut the unnecessay space in the character frame.
    // In order to make the character image in the center of the collider body
    this.setOffset(7, 20);
  }

  update(time, delta) {
    super.update(time, delta);
    if (!this.active) return; // Prevent calling a destroyed Enemy body, when the Enemy is terminated (destroyed)
    // if (this.isPlayingAnims()) return; // Have this.anims.getCurrentKey() bug, so here is original code of tutorial, we dont' use it here
    if (this.anims.isPlaying && this.isGetHurt) return;
    this.isGetHurt = false;
    this.play('snaky-walk', true);
  }

  takesHit(source) {
    super.takesHit(source);
    this.isGetHurt = true
    this.play('snaky-hurt', true);
  }
}
export default Snaky;

