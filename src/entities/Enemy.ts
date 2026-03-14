import { Sprite, Texture } from "pixi.js";
import { PHYSICS, resolveHorizontal, resolveVertical } from "../utils/Physics";
import type { TileMap } from "../map/TileMap";
import { creaturePosY } from "../map/MapData";

export class Enemy extends Sprite {
  vx: number = -2;
  vy: number = 0;
  gravity: number = PHYSICS.GRAVITY;
  isDead: boolean = false;
  deadTimer: number = 0;
  destroyed: boolean = false;
  isPlayer: boolean = false;

  constructor(texture: Texture, x: number, y?: number) {
    super(texture);
    this.x = x;
    this.y = y ?? creaturePosY;
    this.width = 32;
    this.height = 32;
  }

  update(delta: number, tileMap: TileMap, mapHeight: number) {
    if (this.destroyed) return;

    if (this.isDead) {
      this.deadTimer += delta;
      if (this.deadTimer > 30) {
        this.destroy(); // PixiJS builtin destroy
        this.destroyed = true;
      }
      return;
    }

    // AI: Turn around at pits
    const checkX = this.vx > 0 ? this.x + this.width + 5 : this.x - 5;
    const checkCol = Math.floor(checkX / 32);
    const checkRow = Math.floor((this.y + this.height + 5) / 32);

    const tileBelow = tileMap.getTile(checkCol, checkRow);
    if (!tileBelow && this.y < mapHeight) {
      this.vx *= -1;
    }

    // 1. Apply gravity
    this.vy += this.gravity * delta;
    if (this.vy > PHYSICS.MAX_FALL) this.vy = PHYSICS.MAX_FALL;

    // 2. Move horizontally
    this.x += this.vx * delta;

    // 3. Resolve horizontal collision (also turns around hitting walls)
    resolveHorizontal(this, tileMap);

    // 4. Move vertically
    this.y += this.vy * delta;

    // 5. Resolve vertical collision
    resolveVertical(this, tileMap);
  }

  kill() {
    this.isDead = true;
    this.vx = 0;
    this.scale.y = 0.1;
    this.y += 16;
  }
}
