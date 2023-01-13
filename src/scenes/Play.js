import Phaser from 'phaser';
import Player from '../entities/Player';
import Enemies from '../groups/Enemies';

class Play extends Phaser.Scene {
  constructor(config) {
    super('PlayScene')
    this.config = config
  }
  create() {
    const map = this.createMap();
    const layers = this.createLayers(map);
    const playerZones = this.getPlayerZones(layers.playerZones);
    const player = this.createPlayer(playerZones.start); // create player and set the start coordinate by playerZone.start
    const enemies = this.createEnemies(layers.enemySpawns); // create enemys with layer the enemy_spwans

    this.createEnemyColliders(enemies, {
      colliders: {
        platformsColliers: layers.platformsColliers,
        player
      }
    })

    this.createPlayerColliders(player, {
      colliders: {
        platformsColliers: layers.platformsColliers
      }
    })
    this.createEndOfLevel(playerZones.end, player);
    this.setupFollowupCameraOn(player);

    // Drawing lines setting for cast Ray
    this.graphics = this.add.graphics();
    this.line = new Phaser.Geom.Line();
    this.graphics.lineStyle(1, 0x00ff00);

    this.input.on('pointerdown', this.startDrawing, this); // mouse click down
    this.input.on('pointerup', this.finishDrawing, this); // mouse stop click

  }

  startDrawing(pointer) {
    this.line.x1 = pointer.worldX;
    this.line.y1 = pointer.worldY;
  }

  finishDrawing(pointer) {
    this.line.x2 = pointer.worldX;
    this.line.y2 = pointer.worldY;

    this.graphics.strokeLineShape(this.line);
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
    const playerZones = map.getObjectLayer('player_zones');
    const enemySpawns = map.getObjectLayer('enemy_spawns');


    // Make collision
    // platformsColliers.setCollisionByExclusion(-1, true); // standard code
    platformsColliers.setCollisionByProperty({ collider: true }); // Only when we set the tile with custom property

    return { environment, platforms, platformsColliers, playerZones, enemySpawns }
  }

  createPlayer(start) {
    return new Player(this, start.x, start.y);
  }

  createEnemies(spawnLayer) {
    const enemies = new Enemies(this);
    const enemyTypes = enemies.getTypes();

    spawnLayer.objects.forEach(spawnPoint => {
      // console.log(spawnPoint.properties[0].value)
      const enemy = new enemyTypes[spawnPoint.properties[0].value](this, spawnPoint.x, spawnPoint.y);
      enemies.add(enemy)
    })

    return enemies;
  }


  createPlayerColliders(target, { colliders }) {
    target
      .addCollider(colliders.platformsColliers)
  }

  createEnemyColliders(targets, { colliders }) {
    targets
      .addCollider(colliders.platformsColliers)
      .addCollider(colliders.player)
  }

  setupFollowupCameraOn(player) {
    const { height, width, mapOffset, zoomFactor } = this.config;
    this.physics.world.setBounds(0, 0, width + mapOffset, height)
    this.cameras.main.setBounds(0, 0, width + mapOffset, height).setZoom(zoomFactor)
    this.cameras.main.startFollow(player);
  }

  getPlayerZones(playerZonesLayer) {
    const playerZones = playerZonesLayer.objects;
    return {
      start: playerZones.find(zone => zone.name === 'StartPoint'),
      end: playerZones.find(zone => zone.name === 'EndPoint')
    }
  }
  createEndOfLevel(end, player) {
    const endOfLevel = this.physics.add.sprite(end.x, end.y, 'end')
      .setAlpha(0)
      .setSize(5, this.config.height)
      .setOrigin(0.5, 1);

    const eolOverlap = this.physics.add.overlap(player, endOfLevel, () => {
      eolOverlap.active = false;
      console.log('Player has won')
    })
  }
}

export default Play;