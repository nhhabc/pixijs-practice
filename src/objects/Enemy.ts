import { Sprite, Texture } from "pixi.js";
import { creaturePosY } from "../map/MapData";

/**
 * Goomba — Basic enemy.
 * Moves back and forth, turns around when hitting walls.
 */
export class Enemy extends Sprite {
  vx = -2;
  vy = 0;
  gravity = 0.5;
  isDead = false;
  private deadTimer = 0;

  constructor(texture: Texture, x: number, y?: number) {
    super(texture);
    this.x = x;
    this.y = y ?? creaturePosY;
    this.width = 32;
    this.height = 32;
  }

  update(delta: number) {
    if (this.isDead) {
      this.deadTimer += delta;
      if (this.deadTimer > 30) { // After 0.5s, disappear completely
        this.destroy();
      }
      return;
    }

    this.vy += this.gravity * delta;
    this.y += this.vy * delta;
    // x is updated by GameScene to handle collision
  }

  die() {
    this.isDead = true;
    this.vx = 0;
    this.scale.y = 0.1; // Squashed effect
    this.y += 16;
  }
}