import { Sprite, Texture } from "pixi.js";

/**
 * Coin — Vật phẩm xuất hiện khi đập Question Block.
 * Có hiệu ứng nảy lên và biến mất.
 */
export class Coin extends Sprite {
  private vy = -8;
  private gravity = 0.5;
  private startY: number;

  constructor(texture: Texture, x: number, y: number) {
    super(texture);
    this.x = x;
    this.y = y;
    this.startY = y;
    this.width = 24;
    this.height = 24;
  }

  update(delta: number) {
    this.vy += this.gravity * delta;
    this.y += this.vy * delta;

    // Disappear when falling back to original position
    if (this.vy > 0 && this.y >= this.startY) {
      this.destroy();
    }
  }
}