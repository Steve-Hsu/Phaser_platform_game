import Phaser from 'phaser';

class Play extends Phaser.Scene {
  constructor() {
    super('PlayScene')
  }
  create() {
    const map = this.make.tilemap({ key: 'map' });
    const titleset1 = map.addTilesetImage('main_lev_build_1', 'tiles-1');
    // const titleset2 = map.addTilesetImage('main_lev_build_2', 'tiles-2');

    map.createStaticLayer('environment', titleset1);
    map.createStaticLayer('platforms', titleset1);

  }
}

export default Play;