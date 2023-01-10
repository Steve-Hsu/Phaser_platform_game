import Phaser from 'phaser';

class Play extends Phaser.Scene {
  constructor() {
    super('PlayScene')
  }
  create() {
    const map = this.createMap()
    const layers = this.createLayers(map)
    const player = this.createPlayer();

    this.physics.add.collider(player, layers.platformsColliers)
  }

  createMap() {
    const map = this.make.tilemap({ key: 'map' });
    map.addTilesetImage('main_lev_build_1', 'tiles-1');
    return map
  }

  createLayers(map) {
    const titleset1 = map.getTileset('main_lev_build_1')
    const platformsColliers = map.createStaticLayer('platforms_colliders', titleset1);
    const environment = map.createStaticLayer('environment', titleset1);
    const platforms = map.createStaticLayer('platforms', titleset1);


    // Make collision
    // platformsColliers.setCollisionByExclusion(-1, true); // standard code
    platformsColliers.setCollisionByProperty({ collider: true }); // Only when we set the tile with custom property

    return { environment, platforms, platformsColliers }
  }

  createPlayer() {
    const player = this.physics.add.sprite(100, 250, 'player');
    player.body.setGravityY(500); // set so the player will fill in Y direction
    player.setCollideWorldBounds(true);
    return player
  }
}

export default Play;