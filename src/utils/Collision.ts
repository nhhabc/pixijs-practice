import { Sprite } from "pixi.js";

/**
 * AABB Rect — bounding box using for collision.
 */
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Check if two AABB overlap.
 * Using for broad-phase detection.
 */
export function aabbOverlap(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

/**
 * Utility: get Rect from a Sprite.
 * offsetX/offsetY to calculate world-space when sprite is in Container.
 */
export function spriteRect(sprite: Sprite, offsetX = 0, offsetY = 0): Rect {
  // If it's Player, we shrink the horizontal hitbox a bit (e.g., 4px each side)
  // to easily pass through narrow gaps of 1 tile.
  const isPlayer = (sprite as any).isPlayer === true;
  const horizontalPadding = isPlayer ? 6 : 0;

  return {
    x: sprite.x + offsetX + horizontalPadding,
    y: sprite.y + offsetY,
    width: sprite.width - (horizontalPadding * 2),
    height: sprite.height,
  };
}