import type { Player } from "../entities/Player";
import { type Enemy, killEnemy } from "../entities/Enemy";
import { aabbOverlap, spriteRect } from "../utils/Collision";

export function collisionSystem(
  player: Player,
  enemies: Enemy[],
  onScore: (pts: number) => void,
  onGameOver: () => void
) {
  const pRect = spriteRect(player.sprite);

  for (const enemy of enemies) {
    if (enemy.isDead || enemy.destroyed) continue;

    const eRect = spriteRect(enemy.sprite);

    if (aabbOverlap(pRect, eRect)) {
      // Player jumps on enemy
      if (player.vy > 0 && player.sprite.y + player.sprite.height < enemy.sprite.y + 40) {
        killEnemy(enemy);
        player.vy = -8; // bounce
        onScore(1);
      } else {
        onGameOver();
      }
    }
  }
}
