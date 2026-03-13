/**
 * Physics constants.
 * Collect all physics constants in one place for easy tuning.
 */
export const PHYSICS = {
  GRAVITY: 0.6,    // Slightly stronger gravity for punchier jump
  MAX_FALL: 18,
  JUMP_FORCE: -15,     // Stronger jump to reach high platforms
  WALK_SPEED: 5,      // Slightly faster move
  FRICTION: 0,
} as const;
