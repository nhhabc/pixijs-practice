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
  const horizontalPadding = isPlayer ? 4 : 0;

  return {
    x: sprite.x + offsetX + horizontalPadding,
    y: sprite.y + offsetY,
    width: sprite.width - (horizontalPadding * 2),
    height: sprite.height,
  };
}

/**
 * Resolve collision X. 
 * Return penetration depth (positive = a moves right colliding b, negative = a moves left colliding b)
 */
export function resolveX(a: Rect, b: Rect): number {
  const overlapRight = (a.x + a.width) - b.x;           // a collide left side of b
  const overlapLeft = (b.x + b.width) - a.x;           // a collide right side of b
  return overlapRight < overlapLeft ? overlapRight : -overlapLeft;
}

/**
 * Resolve collision Y.
 *
 * @returns penetration depth (positive = a moves down colliding b, negative = a moves up colliding b)
 */
export function resolveY(a: Rect, b: Rect): number {
  const overlapBottom = (a.y + a.height) - b.y;           // a collide top side of b
  const overlapTop = (b.y + b.height) - a.y;           // a collide bottom side of b
  return overlapBottom < overlapTop ? overlapBottom : -overlapTop;
}