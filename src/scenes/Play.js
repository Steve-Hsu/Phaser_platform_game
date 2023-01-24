import Phaser from 'phaser';
import Player from '../entities/Player';
import Enemies from '../groups/Enemies';
// import collectable from '../collectable.js/Collectable';
import Collectables from '../groups/Collectables';
import Hud from '../hud';
import EventEmitter from '../events/Emitter';

import initAnims from '../anims'

class Play extends Phaser.Scene {
  constructor(config) {
    super('PlayScene')
    this.config = config
  }
  create({ gameStatus }) {
    this.score = 0
    this.hud = new Hud(this, 0, 0);
    const map = this.createMap();
    initAnims(this.anims);
    const layers = this.createLayers(map);
    const playerZones = this.getPlayerZones(layers.playerZones);
    const player = this.createPlayer(playerZones.start); // create player and set the start coordinate by playerZone.start
    const enemies = this.createEnemies(layers.enemySpawns, layers.platformsColliers); // create enemys with layer the enemy_spwans
    const collectables = this.createCollectables(layers.collectables);

    this.createBG(map);

    this.createEnemyColliders(enemies, {
      colliders: {
        platformsColliers: layers.platformsColliers,
        player
      }
    })

    this.createPlayerColliders(player, {
      colliders: {
        platformsColliers: layers.platformsColliers,
        projectiles: enemies.getProjectiles(),
        collectables,
        traps: layers.traps
      }
    })

    this.createEndOfLevel(playerZones.end, player);
    this.setupFollowupCameraOn(player);
    if (gameStatus === 'PLAYER_LOOSE') return;
    this.createGameEvents();

  }

  finishDrawing(pointer, layer) {
    this.line.x2 = pointer.worldX;
    this.line.y2 = pointer.worldY;
    this.graphics.clear(); // clear all the previous lines, so don't duplicated when quick double click
    this.graphics.strokeLineShape(this.line);

    this.tileHits = layer.getTilesWithinShape(this.line);

    if (this.tileHits.length > 0) {
      this.tileHits.forEach(tile => {
        tile.index !== -1 && tile.setCollision(true)
      })
    }

    this.drawDebug(layer)
    this.plotting = false;
  }

  createMap() {
    const map = this.make.tilemap({ key: `level_${this.getCurrentLevel()}` });
    map.addTilesetImage('main_lev_build_1', 'tiles-1');
    map.addTilesetImage('bg_dark', 'bg-middle');
    return map
  }

  createLayers(map) {
    const titleset1 = map.getTileset('main_lev_build_1')
    const platformsColliers = map.createLayer('platforms_colliders', titleset1);

    const titlesetBG = map.getTileset('bg_dark')
    map.createLayer('distance', titlesetBG).setDepth(-12);

    const environment = map.createLayer('environment', titleset1).setDepth(-2);
    const platforms = map.createLayer('platforms', titleset1);
    const playerZones = map.getObjectLayer('player_zones');
    const enemySpawns = map.getObjectLayer('enemy_spawns');
    const collectables = map.getObjectLayer('collectables');
    const traps = map.createLayer('traps', titleset1)
    // Make collision
    // platformsColliers.setCollisionByExclusion(-1, true); // standard code
    platformsColliers.setCollisionByProperty({ collider: true }); // Only when we set the tile with custom property
    traps.setCollisionByExclusion(-1);

    return {
      environment,
      platforms,
      platformsColliers,
      playerZones,
      enemySpawns,
      collectables,
      traps
    }
  }

  createBG(map) {
    const bgObject = map.getObjectLayer('distance_BG').objects[0];
    this.spikisImage = this.add.tileSprite(bgObject.x, bgObject.y, this.config.width, 180 * 2, 'bg-spikes-dark')
      .setOrigin(0, 1)
      .setDepth(-10)
      .setScrollFactor(0, 1); // 0 = flase, 1 = true, x, y, 

    this.skyImage = this.add.tileSprite(0, 0, this.config.width, bgObject.height, 'sky-play')
      .setOrigin(0, 0)
      .setDepth(-11)
      .setScrollFactor(0, 1); // 0 = flase, 1 = true, x, y, 
  }

  createGameEvents() {
    EventEmitter.on('PLAYER_LOOSE', () => {
      this.scene.restart({ gameStatus: 'PLAYER_LOOSE' })
    })
  }

  createCollectables(collectableLayer) {
    // const collectables = this.physics.add.staticGroup();
    const collectables = new Collectables(this).setDepth(-1);
    collectables.addFromLayer(collectableLayer);

    collectables.playAnimation('diamond-shine')

    return collectables
  }

  createPlayer(start) {
    return new Player(this, start.x, start.y);
  }

  createEnemies(spawnLayer, platformsColliers) {
    const enemies = new Enemies(this);
    const enemyTypes = enemies.getTypes();

    spawnLayer.objects.forEach(spawnPoint => {
      // console.log(spawnPoint.properties[0].value)
      const enemy = new enemyTypes[spawnPoint.properties[0].value](
        this,
        spawnPoint.x,
        spawnPoint.y
      );
      enemy.setPlatformColliders(platformsColliers)
      enemies.add(enemy)
    })

    return enemies;
  }

  onPlayerCollision(enemy, player) {
    player.takesHit(enemy)
  }

  createPlayerColliders(target, { colliders }) {
    target
      .addCollider(colliders.platformsColliers)
      .addCollider(colliders.projectiles, this.onHit)
      .addCollider(colliders.traps, this.onHit)
      .addOverlap(colliders.collectables, this.onCollect, this)
  }

  onHit(entity, source) {
    entity.takesHit(source)
  }

  onCollect(entity, collectable) {
    this.score += collectable.score;
    this.hud.updateScoreboard(this.score);
    // disableGameObject -> this will deativate the object, default: false
    // hideGameObject -> this will hide the game object. Default : false
    collectable.disableBody(true, true)
  }

  createEnemyColliders(targets, { colliders }) {
    targets
      .addCollider(colliders.platformsColliers)
      .addCollider(colliders.player, this.onPlayerCollision)
      .addCollider(colliders.player.projectiles, this.onHit)
      .addOverlap(colliders.player.meleeWeapon, this.onHit)
  }

  setupFollowupCameraOn(player) {
    const { height, width, mapOffset, zoomFactor } = this.config;
    this.physics.world.setBounds(0, 0, width + mapOffset, height + 200)
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

  getCurrentLevel() {
    return this.registry.get('level') || 1;
  }

  createEndOfLevel(end, player) {
    const endOfLevel = this.physics.add.sprite(end.x, end.y, 'end')
      .setAlpha(0)
      .setSize(5, this.config.height)
      .setOrigin(0.5, 1);

    const eolOverlap = this.physics.add.overlap(player, endOfLevel, () => {
      eolOverlap.active = false;
      // Go to next level
      this.registry.inc('level', 1);
      this.scene.restart({ gameStatus: 'LEVEL_COMPLETED' })
    })
  }

  update() {
    this.spikisImage.tilePositionX = this.cameras.main.scrollX * 0.3;
    this.skyImage.tilePositionX = this.cameras.main.scrollX * 0.1;
  }
}

export default Play;