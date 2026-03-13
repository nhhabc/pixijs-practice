import { Container } from "pixi.js";
import { TILE_SIZE, TileType } from "./MapData";
import { Tile } from "./Tile";

/**
 * TileMap — manage the entire tile map.
 *
 * Responsible for:
 *   - Building grid from 2D array mapData
 *   - Providing getTile(col, row) to query tile by grid coords
 *   - Providing solidTiles: readonly list for collision loop
 */
export class TileMap extends Container {

  /** 2D grid for tile lookup by [row][col]. null = empty. */
  readonly grid: (Tile | null)[][] = [];

  /** All solid tiles (for collision loop). */
  readonly solidTiles: Tile[] = [];

  constructor(textures: Record<string, any>, private mapData: number[][]) {
    super();

    for (let row = 0; row < this.mapData.length; row++) {
      this.grid[row] = [];

      for (let col = 0; col < this.mapData[row].length; col++) {
        const type = this.mapData[row][col] as TileType;

        if (type === TileType.EMPTY) {
          this.grid[row][col] = null;
          continue;
        }

        const texture = this.pickTexture(type, textures);
        const tile = new Tile(texture, type);

        tile.x = col * TILE_SIZE;
        tile.y = row * TILE_SIZE;

        this.grid[row][col] = tile;
        this.solidTiles.push(tile);
        this.addChild(tile);
      }
    }
  }

  /**
   * Get tile by grid coordinates (column, row).
   * Returns null if out-of-bounds or empty.
   */
  getTile(col: number, row: number): Tile | null {
    if (row < 0 || row >= this.grid.length) return null;
    if (col < 0 || col >= (this.grid[row]?.length ?? 0)) return null;
    return this.grid[row][col] ?? null;
  }

  /**
   * Remove tile from grid and scene (used when brick is destroyed).
   */
  removeTile(tile: Tile): void {
    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[row].length; col++) {
        if (this.grid[row][col] === tile) {
          this.grid[row][col] = null;
        }
      }
    }
    const idx = this.solidTiles.indexOf(tile);
    if (idx !== -1) this.solidTiles.splice(idx, 1);
    tile.destroy();
  }

  // ── Private ───────────────────────────────────────────────────────────────

  private pickTexture(type: TileType, textures: Record<string, any>) {
    switch (type) {
      case TileType.BRICK: return textures.brick;
      case TileType.QUESTION: return textures.question;
      case TileType.GROUND:
      default: return textures.ground;
    }
  }
}
