import { Sprite, Texture } from "pixi.js";
import { Keyboard } from "../input/Keyboard";
import { PHYSICS, resolveHorizontal, resolveVertical } from "../utils/Physics";
import type { TileMap } from "../map/TileMap";
import { creaturePosY } from "../map/MapData";

export class Player extends Sprite {
  vx: number = 0;
  vy: number = 0;
  gravity: number = PHYSICS.GRAVITY;
  onGround: boolean = false;
  isPlayer: boolean = true;

  constructor(texture: Texture, x: number, y?: number) {
    super(texture);
    this.x = x;
    this.y = y ?? creaturePosY;
    this.width = 32;
    this.height = 32;
  }

  update(delta: number, tileMap: TileMap, mapWidth: number, onTileHit?: (event: string, tile: any) => void) {
    // Input Handling
    this.vx = 0;
    if (Keyboard.isDown("KeyA") || Keyboard.isDown("ArrowLeft")) {
      this.vx = -PHYSICS.WALK_SPEED;
    }
    if (Keyboard.isDown("KeyD") || Keyboard.isDown("ArrowRight")) {
      this.vx = PHYSICS.WALK_SPEED;
    }

    if ((Keyboard.isDown("Space") || Keyboard.isDown("ArrowUp") || Keyboard.isDown("KeyW")) && this.onGround) {
      this.vy = PHYSICS.JUMP_FORCE;
      this.onGround = false;
    }

    // 1. Apply gravity
    this.vy += this.gravity * delta;
    if (this.vy > PHYSICS.MAX_FALL) this.vy = PHYSICS.MAX_FALL;

    // 2. Move horizontally
    this.x += this.vx * delta;

    // Boundary checks
    if (this.x < 0) this.x = 0;
    if (this.x > mapWidth - this.width) {
      this.x = mapWidth - this.width;
    }

    // 3. Resolve horizontal collision
    resolveHorizontal(this, tileMap);

    // 4. Move vertically
    this.y += this.vy * delta;

    // 5. Resolve vertical collision
    resolveVertical(this, tileMap, onTileHit);
  }
}
