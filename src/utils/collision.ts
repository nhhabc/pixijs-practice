import type { Sprite } from "pixi.js";

export function hitTest(a: Sprite, b: Sprite) {

  const dx = a.x - b.x;
  const dy = a.y - b.y;

  const dist = Math.sqrt(dx * dx + dy * dy);

  return dist < (a.width / 2 + b.width / 2);

}