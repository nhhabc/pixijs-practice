import type { Enemy } from "../entities/Enemy";
import type { TileMap } from "../map/TileMap";

export function enemySystem(enemies: Enemy[], tileMap: TileMap, delta: number, mapHeight: number) {
  for (const enemy of enemies) {
    if (enemy.destroyed) continue;

    if (enemy.isDead) {
      enemy.deadTimer += delta;
      if (enemy.deadTimer > 30) {
        enemy.sprite.destroy();
        enemy.destroyed = true;
      }
      continue;
    }

    // AI: Turn around at pits
    const checkX = enemy.vx > 0 ? enemy.sprite.x + enemy.sprite.width + 5 : enemy.sprite.x - 5;
    const checkCol = Math.floor(checkX / 32);
    const checkRow = Math.floor((enemy.sprite.y + enemy.sprite.height + 5) / 32);

    const tileBelow = tileMap.getTile(checkCol, checkRow);
    if (!tileBelow && enemy.sprite.y < mapHeight) {
      enemy.vx *= -1;
    }
  }
}
