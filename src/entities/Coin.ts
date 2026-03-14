import { Sprite, Texture } from "pixi.js";
import type { Player } from "./Player";
import { aabbOverlap, spriteRect } from "../utils/Collision";

export class Coin extends Sprite {
  collected: boolean = false;
  destroyed: boolean = false;

  // For the bounce animation when spawning from block
  vy: number = -8;
  gravity: number = 0.5;
  startY: number;
  isStatic: boolean = false;

  constructor(texture: Texture, x: number, y: number, isStatic: boolean = false) {
    super(texture);
    this.x = x;
    this.y = y;
    // slightly smaller hitbox
    this.width = 24;
    this.height = 24;
    this.startY = y;
    this.isStatic = isStatic;

    if (isStatic) {
      this.vy = 0;
      this.gravity = 0;
    }
  }

  update(player: Player, delta: number, onScore: (pts: number) => void) {
    if (this.collected || this.destroyed) return;

    if (!this.isStatic) {
      // Bounce animation for block coins
      this.vy += this.gravity * delta;
      this.y += this.vy * delta;

      // If it falls back down, destroy immediately
      if (this.vy > 0 && this.y >= this.startY) {
        this.destroy();
        this.destroyed = true;
        return;
      }
    } else {
      // Static map coin -> Detect overlap with player
      const pRect = spriteRect(player);
      const cRect = spriteRect(this);

      if (aabbOverlap(pRect, cRect)) {
        this.collected = true;
        this.destroy();
        this.destroyed = true;
        onScore(1); // Add score
      }
    }
  }
}
