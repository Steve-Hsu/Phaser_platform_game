import Enemy from './Enemy';
import initAnims from './anims/birdmanAnims'// Have this.anims.getCurrentKey() bug, so here is original code of tutorial, we dont' use it here

class Birdman extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, 'birdman');
    initAnims(scene.anims); // Have this.anims.getCurrentKey() bug, so here is original code of tutorial, we dont' use it here

    this.isBridmanHurt = false

  }
  update(time, delta) {
    super.update(time, delta);
    // if (this.isPlayingAnims()) return; // Have this.anims.getCurrentKey() bug, so here is original code of tutorial, we dont' use it here
    if (this.anims.isPlaying && this.isBridmanHurt) return;
    this.isBridmanHurt = false;
    this.play('birdman-idle', true);
  }

  takesHit(source) {
    super.takesHit(source);
    this.isBridmanHurt = true
    this.play('birdman-hurt', true);
  }
}
export default Birdman;

