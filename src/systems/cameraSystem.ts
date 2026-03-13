import { type Container } from "pixi.js";
import type { Player } from "../entities/Player";

export function cameraSystem(world: Container, player: Player, mapWidth: number, mapHeight: number) {
  const targetX = 400 - player.sprite.x;
  world.x += (targetX - world.x) * 0.1;
  if (world.x > 0) world.x = 0;

  // Horizontal Clamp
  const minWorldX = 800 - mapWidth;
  if (world.x < minWorldX) world.x = minWorldX;

  const targetY = 300 - player.sprite.y;
  world.y += (targetY - world.y) * 0.1;

  const maxWorldY = 0;
  const minWorldY = 600 - mapHeight;
  if (world.y > maxWorldY) world.y = maxWorldY;
  if (world.y < minWorldY) world.y = minWorldY;
}
