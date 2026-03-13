import type { Coin } from "../entities/Coin";

export function coinSystem(coins: Coin[], delta: number) {
  for (const coin of coins) {
    if (coin.destroyed) continue;

    coin.vy += coin.gravity * delta;
    coin.sprite.y += coin.vy * delta;

    if (coin.vy > 0 && coin.sprite.y >= coin.startY) {
      coin.sprite.destroy();
      coin.destroyed = true;
    }
  }
}
