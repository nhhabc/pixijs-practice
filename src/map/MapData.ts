// ─── Tile Constants ──────────────────────────────────────────────────────────
export const TILE_SIZE = 32;

export enum TileType {
  EMPTY = 0,
  GROUND = 1,
  BRICK = 2,
  QUESTION = 3,
}

// ─── Map Layout ───────────────────────────────────────────────────────────────
// 0 = empty | 1 = solid ground | 2 = brick | 3 = question block
//
// Column index:  0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31
// ─── Map Layout ───────────────────────────────────────────────────────────────
// 0 = empty | 1 = solid ground | 2 = brick | 3 = question block
//
const MAX_TILES = 300;
const R0 = Array(MAX_TILES).fill(0);
const R1 = Array(MAX_TILES).fill(0);
const R2 = Array(MAX_TILES).fill(0);
const R3 = Array(MAX_TILES).fill(0);
const R4 = Array(MAX_TILES).fill(0);
const R5 = Array(MAX_TILES).fill(0);
const R6 = Array(MAX_TILES).fill(0);
const R7 = Array(MAX_TILES).fill(0);
const R8 = Array(MAX_TILES).fill(0);
const R9 = Array(MAX_TILES).fill(0);
const R10 = Array(MAX_TILES).fill(0);
const R11 = Array(MAX_TILES).fill(0);
const R12 = Array(MAX_TILES).fill(0);
const R13 = Array(MAX_TILES).fill(0);
const R14 = Array(MAX_TILES).fill(0);
const R15 = Array(MAX_TILES).fill(0);
const R16 = Array(MAX_TILES).fill(0);
const G = Array(MAX_TILES).fill(1); // Ground row

// --- Decorations and Obstacles ---

// Start area (0-15) - Empty

// First platform (20-30)
for (let i = 20; i < 25; i++) R13[i] = TileType.BRICK;
R13[22] = TileType.QUESTION;

// Pits (35-37, 50-53)
G[35] = G[36] = G[37] = 0;
G[50] = G[51] = G[52] = G[53] = 0;

// Floating bricks (40-45)
R12[40] = 2; R12[41] = 3; R12[42] = 2; R12[43] = 3; R12[44] = 2;

// Staircase (60-65)
R16[60] = 1;
R16[61] = R15[61] = 1;
R16[62] = R15[62] = R14[62] = 1;
R16[63] = R15[63] = R14[63] = R13[63] = 1;

// Long gap with platforms (70-85)
for (let i = 70; i < 85; i++) G[i] = 0;
for (let i = 72; i < 76; i++) R12[i] = 2;
for (let i = 79; i < 83; i++) R12[i] = 2;

// High challenge (90-110)
R11[95] = 3;
R13[95] = 2;
for (let i = 100; i < 110; i++) {
  if (i % 2 === 0) R13[i] = 2;
  else R11[i] = 3;
}

// Another pit (120-125)
for (let i = 120; i < 125; i++) G[i] = 0;

// Castle-like structure (140-160)
for (let i = 140; i < 160; i++) {
  R16[i] = 1;
  if (i % 5 === 0) {
    R15[i] = 1;
    R14[i] = 1;
  }
}

// End stretch
for (let i = 180; i < 195; i++) {
  if (i % 3 === 0) R13[i] = 3;
}

export const mapData: number[][] = [
  R0, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12, R13, R14, R15, R16, G
];

export const creaturePosY = (mapData.length - 2) * TILE_SIZE;