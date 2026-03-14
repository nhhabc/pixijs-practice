export const TILE_SIZE = 32;

export enum TileType {
  EMPTY = 0,
  GROUND = 1,
  BRICK = 2,
  QUESTION = 3,
  COIN = 4,
}

const MAX_TILES = 1000;

export function generateMapData(): number[][] {
  const rows = 18;
  const grid: number[][] = Array.from({ length: rows }, () =>
    Array(MAX_TILES).fill(TileType.EMPTY)
  );

  const groundRow = rows - 1;

  const G = grid[groundRow];
  const R = (y: number) => grid[y];

  // ─────────────────────────────────────────────
  // Base ground
  G.fill(TileType.GROUND);

  // ─────────────────────────────────────────────
  // Start safe zone
  for (let i = 0; i < 25; i++) {
    G[i] = TileType.GROUND;
  }

  let currentX = 25;

  while (currentX < MAX_TILES - 40) {
    const chunk = Math.random();

    // ───────────────── PIT JUMP
    if (chunk < 0.2) {
      const width = 3 + Math.floor(Math.random() * 4);

      for (let i = 0; i < width; i++) {
        G[currentX + i] = TileType.EMPTY;
      }

      if (Math.random() > 0.5) {
        for (let i = 0; i < width; i++) {
          R(13)[currentX + i] = TileType.BRICK;
        }
      }

      currentX += width + 3;
    }

    // ───────────────── DOUBLE PIT (hard)
    else if (chunk < 0.35) {
      const width = 3;

      for (let i = 0; i < width; i++) {
        G[currentX + i] = TileType.EMPTY;
      }

      for (let i = 0; i < width; i++) {
        G[currentX + width + 2 + i] = TileType.EMPTY;
      }

      R(13)[currentX + width + 1] = TileType.BRICK;
      R(11)[currentX + width + 1] = TileType.COIN; // reward above the brick

      currentX += width * 2 + 5;
    }

    // ───────────────── FLOATING PARKOUR
    else if (chunk < 0.55) {
      const platforms = 5 + Math.floor(Math.random() * 4);

      for (let i = 0; i < platforms; i++) {
        const x = currentX + i * 3;
        const y = 11 + Math.floor(Math.random() * 3);

        R(y)[x] = TileType.BRICK;

        if (Math.random() > 0.6) {
          R(y)[x + 1] = TileType.QUESTION;
        } else if (Math.random() > 0.5) {
          R(y - 2)[x] = TileType.COIN; // coin above platform
        }
      }

      currentX += platforms * 3;
    }

    // ───────────────── STAIRS
    else if (chunk < 0.75) {
      const height = 3 + Math.floor(Math.random() * 4);

      for (let i = 0; i < height; i++) {
        for (let j = 0; j <= i; j++) {
          R(groundRow - j)[currentX + i] = TileType.GROUND;
        }
        if (i > 1 && Math.random() > 0.5) {
          R(groundRow - i - 1)[currentX + i] = TileType.COIN;
        }
      }

      currentX += height + 3;
    }

    // ───────────────── CEILING TRAP
    else if (chunk < 0.9) {
      const length = 10;

      for (let i = 0; i < length; i++) {
        if (Math.random() > 0.6) {
          R(12)[currentX + i] = TileType.BRICK;
        }

        if (Math.random() > 0.8) {
          R(10)[currentX + i] = TileType.BRICK;
        }

        if (Math.random() > 0.5) {
          R(groundRow - 1)[currentX + i] = TileType.COIN;
        }
      }

      currentX += length;
    }

    // ───────────────── BROKEN GROUND
    else {
      const length = 12;

      for (let i = 0; i < length; i++) {
        if (Math.random() > 0.7) {
          G[currentX + i] = TileType.EMPTY;
        } else if (Math.random() > 0.5) {
          R(groundRow - 1)[currentX + i] = TileType.COIN;
        }
      }

      currentX += length;
    }
  }

  // ───────────────── END AREA
  for (let i = MAX_TILES - 30; i < MAX_TILES; i++) {
    G[i] = TileType.GROUND;
  }

  // flag pole style stairs
  R(rows - 2)[MAX_TILES - 10] = TileType.GROUND;
  R(rows - 3)[MAX_TILES - 10] = TileType.GROUND;
  R(rows - 4)[MAX_TILES - 10] = TileType.GROUND;
  R(rows - 5)[MAX_TILES - 10] = TileType.GROUND;

  return grid;
}

export const creaturePosY = 16 * TILE_SIZE;