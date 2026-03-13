import { Sprite, Texture } from "pixi.js";
import { TileType } from "./MapData";
import { ASSETS } from "../assets/AssetConfig";

/**
 * Tile — tile from map.
 * Tile know its type (Ground, Brick, Question)
 * and can react when hit from below.
 */
export class Tile extends Sprite {

  readonly tileType: TileType;
  private used = false;  // used for Question block

  constructor(texture: Texture, type: TileType) {
    super(texture);
    this.tileType = type;
    this.width = 32;
    this.height = 32;
  }

  /** Called when player hit tile from below. */
  hitFromBelow(): string | void {
    if (this.tileType === TileType.BRICK) {
      return "brick_break";
    }

    if (this.tileType === TileType.QUESTION && !this.used) {
      this.used = true;
      this.texture = Texture.from(ASSETS.EMPTY);
      return "spawn_coin";
    }
  }

  /** Tile is solid (block movement)? */
  isSolid(): boolean {
    return (
      this.tileType === TileType.GROUND ||
      this.tileType === TileType.BRICK ||
      this.tileType === TileType.QUESTION
    );
  }
}
