import { Sprite } from "pixi.js";
import type { TileMap } from "../map/TileMap";
import { aabbOverlap, spriteRect } from "./Collision";

/**
 * Physics constants.
 * Collect all physics constants in one place for easy tuning.
 */
export const PHYSICS = {
  GRAVITY: 0.6,    // Slightly stronger gravity for punchier jump
  MAX_FALL: 18,
  JUMP_FORCE: -15,     // Stronger jump to reach high platforms
  WALK_SPEED: 5,      // Slightly faster move
  FRICTION: 0,
} as const;

export interface PhysicalEntity extends Sprite {
  vx: number;
  vy: number;
  isPlayer?: boolean;
  onGround?: boolean;
}

export function resolveHorizontal(entity: PhysicalEntity, tileMap: TileMap) {
  for (const tile of tileMap.solidTiles) {
    const entRect = spriteRect(entity);
    const tRect = spriteRect(tile);

    if (!aabbOverlap(entRect, tRect)) continue;

    if (entity.vx > 0) {
      entity.x = tRect.x - entRect.width; // adjusted x since spriteRect x might have padding
      // but wait, spriteRect has padding.
      // previous logic: entity.sprite.x = tRect.x - entity.sprite.width;
      entity.x = tRect.x - entity.width; 
      if (!entity.isPlayer) entity.vx *= -1; // It's an Enemy
    } else if (entity.vx < 0) {
      // previous logic: entity.sprite.x = tRect.x + tRect.width;
      entity.x = tRect.x + tRect.width;
      if (!entity.isPlayer) entity.vx *= -1; // It's an Enemy
    }
  }
}

export function resolveVertical(entity: PhysicalEntity, tileMap: TileMap, onTileHit?: (event: string, tile: any) => void) {
  const isPlayer = entity.isPlayer === true;
  if (isPlayer) entity.onGround = false;

  for (const tile of tileMap.solidTiles) {
    const entRect = spriteRect(entity);
    const tRect = spriteRect(tile);

    if (!aabbOverlap(entRect, tRect)) continue;

    if (entity.vy > 0) {
      // previous logic: entity.sprite.y = tRect.y - entity.sprite.height;
      entity.y = tRect.y - entity.height;
      entity.vy = 0;
      if (isPlayer) entity.onGround = true;
    } else if (entity.vy < 0) {
      // previous logic: entity.sprite.y = tRect.y + tRect.height;
      entity.y = tRect.y + tRect.height;
      entity.vy = 0;

      if (isPlayer && onTileHit) {
        const event = tile.hitFromBelow();
        if (event) onTileHit(event, tile);
      }
    }
  }
}
