import Phaser from "phaser";

export default {
  addCollider(otherGameObject, callback) {
    this.scene.physics.add.collider(this, otherGameObject, callback, null, this);
    return this;
  },
  addOverlap(otherGameObject, callback) {
    this.scene.physics.add.overlap(this, otherGameObject, callback, null, this);
    return this;
  },

  bodyPositionDifferenceX: 0,
  prevRay: null,
  prevHasHit: null,

  raycast(body, layer, { raylength = 30, precision = 0, steepns = 1 }) {
    // raylength = the length of the detect ray attached on the enemy body
    // Precision = the time to trigger a gain the detect ray, smaller the num, more precision you get
    // steepens = the angle of the detect ray, 1 = 45 degree toward bottom front, 0 = 90 degree, straigt down
    const { x, y, width, halfHeight } = body;

    this.bodyPositionDifferenceX += body.x - body.prev.x;

    if ((Math.abs(this.bodyPositionDifferenceX) <= precision) && this.prevHasHit !== null) {
      return {
        ray: this.prevRay,
        hasHit: this.prevHasHit
      }
    }



    const line = new Phaser.Geom.Line();
    let hasHit = false;

    switch (body.facing) {
      case Phaser.Physics.Arcade.FACING_RIGHT: {
        line.x1 = x + width;
        line.y1 = y + halfHeight;
        line.x2 = line.x1 + raylength * steepns;
        line.y2 = line.y1 + raylength;
        break;
      }
      case Phaser.Physics.Arcade.FACING_LEFT: {
        line.x1 = x;
        line.y1 = y + halfHeight;
        line.x2 = line.x1 - raylength * steepns;
        line.y2 = line.y1 + raylength;
        break;
      }
    }

    const hits = layer.getTilesWithinShape(line);

    if (hits.length > 0) {
      hasHit = this.prevHasHit = hits.some(hit => hit.index !== -1); // pure JS map function some()
    }

    this.prevRay = line;
    this.bodyPositionDifferenceX = 0;
    return { ray: line, hasHit }
  }
} 