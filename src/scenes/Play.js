import Phaser from 'phaser';

class Play extends Phaser.Scene {
  constructor() {
    super('PlayScene')
  }
  create() {
    const map = this.createMap()
    this.createLayers(map)

  }

  createMap() {
    const map = this.make.tilemap({ key: 'map' });
    const layers = map.addTilesetImage('main_lev_build_1', 'tiles-1');
    return map
  }

  createLayers(map) {
    const titleset1 = map.getTileset('main_lev_build_1')
    const environment = map.createStaticLayer('environment', titleset1);
    const platforms = map.createStaticLayer('platforms', titleset1);
    return { environment, platforms }
  }
}

export default Play;