import { Sprite, Texture } from "pixi.js";
import { Keyboard } from "../input/Keyboard";
import { PHYSICS } from "../systems/Physics";
import { creaturePosY } from "../map/MapData";

/**
 * Player.
 *
 * Responsible for:
 *   - Reading input and handling movement
 *   - Applying gravity
 *   - Exposing applyHorizontalMovement / applyVerticalMovement
 *     to let GameScene resolve collision independently for each axis
 */
export class Player extends Sprite {

  // ── Velocity ──────────────────────────────────────────────────────────────
  vx = 0;
  vy = 0;

  // ── State ─────────────────────────────────────────────────────────────────
  onGround = false;
  public readonly isPlayer = true;

  constructor(texture: Texture) {
    super(texture);
    this.x = 64;
    this.y = creaturePosY;
    this.width = 32;
    this.height = 32;
  }

  /**
   * Called every frame BEFORE applying movement.
   * - Reads input
   * - Applies gravity to vy
   */
  update(): void {
    this.handleInput();
    this.applyGravity();
  }

  /** Move along X axis. Call BEFORE handleHorizontalCollision. */
  applyHorizontalMovement(delta: number): void {
    this.x += this.vx * delta;

    // Limit left boundary
    if (this.x < 0) this.x = 0;
  }

  /** Move along Y axis. Call BEFORE handleVerticalCollision. */
  applyVerticalMovement(delta: number): void {
    this.y += this.vy * delta;
  }

  // ── Private ───────────────────────────────────────────────────────────────

  private handleInput(): void {
    this.vx = 0;

    if (Keyboard.isDown("KeyA") || Keyboard.isDown("ArrowLeft")) {
      this.vx = -PHYSICS.WALK_SPEED;
    }
    if (Keyboard.isDown("KeyD") || Keyboard.isDown("ArrowRight")) {
      this.vx = PHYSICS.WALK_SPEED;
    }
    if ((Keyboard.isDown("Space") || Keyboard.isDown("ArrowUp") || Keyboard.isDown("KeyW")) && this.onGround) {
      this.vy = PHYSICS.JUMP_FORCE;
      this.onGround = false;
    }
  }

  private applyGravity(): void {
    this.vy += PHYSICS.GRAVITY;
    // Limit falling speed (terminal velocity)
    if (this.vy > PHYSICS.MAX_FALL) this.vy = PHYSICS.MAX_FALL;
  }
}