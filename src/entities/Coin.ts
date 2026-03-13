import { Sprite } from "pixi.js";

export interface Coin {
  sprite: Sprite;
  vy: number;
  gravity: number;
  startY: number;
  destroyed: boolean;
}

export function createCoin(texture: any, x: number, y: number): Coin {
  const sprite = new Sprite(texture);
  sprite.x = x;
  sprite.y = y;
  sprite.width = 24;
  sprite.height = 24;
  
  return {
    sprite,
    vy: -8,
    gravity: 0.5,
    startY: y,
    destroyed: false
  };
}
