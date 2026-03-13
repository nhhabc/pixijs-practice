// ─── Tile Constants ──────────────────────────────────────────────────────────
export const TILE_SIZE = 32;

export enum TileType {
  EMPTY = 0,
  GROUND = 1,
  BRICK = 2,
  QUESTION = 3,
}

const MAX_TILES = 1000;

export function generateMapData(): number[][] {
  const rows = 18;
  const grid: number[][] = Array.from({ length: rows }, () => Array(MAX_TILES).fill(0));
  const R = (idx: number) => grid[idx];
  const G = grid[rows - 1]; // Ground row

  // Fill initial ground
  G.fill(1);

  // 1. Start area (0-20) - Always safe
  for (let i = 0; i < 20; i++) G[i] = 1;

  // 2. Procedural Generation for the rest
  let currentX = 20;
  while (currentX < MAX_TILES - 20) {
    const chunkType = Math.random();
    const chunkLength = 10 + Math.floor(Math.random() * 15);

    if (chunkType < 0.2) {
      // Pits
      for (let i = 0; i < 3 + Math.floor(Math.random() * 3); i++) {
        if (currentX + i < MAX_TILES - 20) G[currentX + i] = 0;
      }
      // Add a platform above the pit half the time
      if (Math.random() > 0.5) {
        for (let i = 0; i < 4; i++) R(13)[currentX + i] = TileType.BRICK;
      }
      currentX += 6;
    } else if (chunkType < 0.4) {
      // Staircase or Walls
      const height = 1 + Math.floor(Math.random() * 4);
      for (let i = 0; i < height; i++) {
        for (let j = i; j < height; j++) {
          if (currentX + i < MAX_TILES - 20) R(rows - 2 - j)[currentX + i] = 1;
        }
      }
      currentX += height + 2;
    } else if (chunkType < 0.7) {
      // Floating bricks & Questions
      for (let i = 0; i < chunkLength; i++) {
        if (Math.random() < 0.3) {
          R(12)[currentX + i] = (Math.random() > 0.7) ? TileType.QUESTION : TileType.BRICK;
        }
      }
      currentX += chunkLength;
    } else {
      // Ground with some obstacles
      if (Math.random() > 0.6) {
        const obsX = currentX + Math.floor(Math.random() * 5);
        R(rows - 2)[obsX] = TileType.BRICK;
        R(rows - 3)[obsX] = TileType.BRICK;
      }
      currentX += chunkLength;
    }
  }

  // 3. Victory Run (Last 20 tiles)
  for (let i = MAX_TILES - 20; i < MAX_TILES; i++) {
    G[i] = 1;
  }
  R(rows - 2)[MAX_TILES - 5] = 1;
  R(rows - 3)[MAX_TILES - 5] = 1;
  R(rows - 4)[MAX_TILES - 5] = 1;

  return grid;
}

export const creaturePosY = 16 * TILE_SIZE;