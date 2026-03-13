import { Sprite } from "pixi.js";
import { creaturePosY } from "../map/MapData";

export interface Enemy {
  sprite: Sprite;
  vx: number;
  vy: number;
  isDead: boolean;
  deadTimer: number;
  destroyed: boolean;
  isPlayer: boolean;
}

export function createEnemy(texture: any, x: number, y?: number): Enemy {
  const sprite = new Sprite(texture);
  sprite.x = x;
  sprite.y = y ?? creaturePosY;
  sprite.width = 32;
  sprite.height = 32;

  return {
    sprite,
    vx: -2,
    vy: 0,
    isDead: false,
    deadTimer: 0,
    destroyed: false,
    isPlayer: false
  };
}

export function killEnemy(enemy: Enemy) {
  enemy.isDead = true;
  enemy.vx = 0;
  enemy.sprite.scale.y = 0.1;
  enemy.sprite.y += 16;
}
