import { TileType, TILE_SIZE } from "./MapData";

export interface ChunkData {
  tiles: number[][];
  enemies: { x: number; y: number }[];
  coins: { x: number; y: number }[];
}

export class ProceduralGenerator {
  static readonly CHUNK_WIDTH = 40;
  static readonly MAP_HEIGHT = 15;

  generateChunk(chunkIndex: number): ChunkData {
    const tiles: number[][] = Array.from({ length: ProceduralGenerator.MAP_HEIGHT }, () =>
      Array(ProceduralGenerator.CHUNK_WIDTH).fill(TileType.EMPTY)
    );
    const enemies: { x: number; y: number }[] = [];
    const coins: { x: number; y: number }[] = [];

    const groundRow = ProceduralGenerator.MAP_HEIGHT - 1;

    // 1. Fill basic ground with consistent gaps
    for (let col = 0; col < ProceduralGenerator.CHUNK_WIDTH; col++) {
      const isBufferZone = col < 4 || col > 36;
      // Procedural gap: gap of 2-3 tiles
      if (!isBufferZone && Math.random() < 0.1) {
        col += 2; // Jump over 2 columns
        continue;
      }
      tiles[groundRow][col] = TileType.GROUND;
    }

    // 2. Add structured features
    for (let col = 5; col < 35; col++) {
      // Only build features if there's ground below
      if (tiles[groundRow][col] === TileType.EMPTY) continue;

      const roll = Math.random();

      // Feature: Floating Platform (Bricks/Questions)
      if (roll < 0.1) {
        const h = groundRow - 4;
        const length = 3 + Math.floor(Math.random() * 3);
        for (let i = 0; i < length && (col + i) < 35; i++) {
          tiles[h][col + i] = (i === 1) ? TileType.QUESTION : TileType.BRICK;
          if (Math.random() < 0.3) coins.push({ x: (col + i) * TILE_SIZE, y: (h - 1) * TILE_SIZE });
        }
        col += length + 2; // Space after platform
      }
      // Feature: Small Stairs
      else if (roll < 0.15) {
        tiles[groundRow - 1][col] = TileType.GROUND;
        tiles[groundRow - 1][col + 1] = TileType.GROUND;
        tiles[groundRow - 2][col + 1] = TileType.GROUND;
        col += 3;
      }
      // Feature: Enemy on ground
      else if (roll < 0.2) {
        enemies.push({ x: col * TILE_SIZE, y: (groundRow - 1) * TILE_SIZE });
        col += 2;
      }
    }

    // First chunk safety
    if (chunkIndex === 0) {
      for (let i = 0; i < 15; i++) tiles[groundRow][i] = TileType.GROUND;
      enemies.length = 0;
    }

    return { tiles, enemies, coins };
  }
}
