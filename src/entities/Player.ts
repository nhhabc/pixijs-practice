import { Sprite } from "pixi.js";
import { creaturePosY } from "../map/MapData";

export interface Player {
  sprite: Sprite;
  vx: number;
  vy: number;
  onGround: boolean;
  isPlayer: boolean;
}

export function createPlayer(texture: any, x: number, y?: number): Player {
  const sprite = new Sprite(texture);
  sprite.x = x;
  sprite.y = y ?? creaturePosY;
  sprite.width = 32;
  sprite.height = 32;
  // Mark as player for collision system padding logic

  return {
    sprite,
    vx: 0,
    vy: 0,
    onGround: false,
    isPlayer: true
  };
}
