import type { Player } from "../entities/Player";
import { Keyboard } from "../input/Keyboard";
import { PHYSICS } from "../utils/Physics";

export function playerSystem(player: Player) {
  player.vx = 0;

  if (Keyboard.isDown("KeyA") || Keyboard.isDown("ArrowLeft")) {
    player.vx = -PHYSICS.WALK_SPEED;
  }
  if (Keyboard.isDown("KeyD") || Keyboard.isDown("ArrowRight")) {
    player.vx = PHYSICS.WALK_SPEED;
  }

  if ((Keyboard.isDown("Space") || Keyboard.isDown("ArrowUp") || Keyboard.isDown("KeyW")) && player.onGround) {
    player.vy = PHYSICS.JUMP_FORCE;
    player.onGround = false;
  }
}
