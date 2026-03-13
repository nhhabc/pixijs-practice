import { PHYSICS } from "../utils/Physics";
import type { Player } from "../entities/Player";
import type { Enemy } from "../entities/Enemy";
import type { TileMap } from "../map/TileMap";
import { aabbOverlap, spriteRect } from "../utils/Collision";

type Entity = Player | Enemy;

export function physicsSystem(player: Player, enemies: Enemy[], tileMap: TileMap, delta: number,
  onTileHit?: (event: string, tile: any) => void, mapWidth?: number) {
  // 1. Gravity
  applyGravity(player);
  for (const enemy of enemies) {
    if (!enemy.isDead && !enemy.destroyed) {
      enemy.vy += PHYSICS.GRAVITY * delta;
    }
  }

  // 2. Horizontal Movement & Collision
  player.sprite.x += player.vx * delta;

  // Boundary checks
  if (player.sprite.x < 0) player.sprite.x = 0;
  if (mapWidth && player.sprite.x > mapWidth - player.sprite.width) {
    player.sprite.x = mapWidth - player.sprite.width;
  }
  resolveHorizontal(player, tileMap);

  for (const enemy of enemies) {
    if (!enemy.isDead && !enemy.destroyed) {
      enemy.sprite.x += enemy.vx * delta;
      resolveHorizontal(enemy, tileMap);
    }
  }

  // 3. Vertical Movement & Collision
  player.sprite.y += player.vy * delta;
  resolveVertical(player, tileMap, onTileHit);

  for (const enemy of enemies) {
    if (!enemy.isDead && !enemy.destroyed) {
      enemy.sprite.y += enemy.vy * delta;
      resolveVertical(enemy, tileMap);
    }
  }
}

function applyGravity(player: Player) {
  player.vy += PHYSICS.GRAVITY;
  // limit the fall speed 
  if (player.vy > PHYSICS.MAX_FALL) player.vy = PHYSICS.MAX_FALL;
}

function resolveHorizontal(entity: Entity, tileMap: TileMap) {
  for (const tile of tileMap.solidTiles) {
    const entRect = spriteRect(entity.sprite);
    const tRect = spriteRect(tile);

    if (!aabbOverlap(entRect, tRect)) continue;

    if (entity.vx > 0) {
      entity.sprite.x = tRect.x - entity.sprite.width;
      if (!entity.isPlayer) entity.vx *= -1; // It's an Enemy
    } else if (entity.vx < 0) {
      entity.sprite.x = tRect.x + tRect.width;
      if (!entity.isPlayer) entity.vx *= -1; // It's an Enemy
    }
  }
}

function resolveVertical(entity: Entity, tileMap: TileMap, onTileHit?: (event: string, tile: any) => void) {
  const isPlayer = entity.isPlayer;
  if (isPlayer) (entity as Player).onGround = false;

  for (const tile of tileMap.solidTiles) {
    const entRect = spriteRect(entity.sprite);
    const tRect = spriteRect(tile);

    if (!aabbOverlap(entRect, tRect)) continue;

    if (entity.vy > 0) {
      entity.sprite.y = tRect.y - entity.sprite.height;
      entity.vy = 0;
      if (isPlayer) (entity as Player).onGround = true;
    } else if (entity.vy < 0) {
      entity.sprite.y = tRect.y + tRect.height;
      entity.vy = 0;

      if (isPlayer && onTileHit) {
        const event = tile.hitFromBelow();
        if (event) onTileHit(event, tile);
      }
    }
  }
}
