import { Sprite, Texture } from "pixi.js";

export enum BrickType {
  NORMAL,
  QUESTION
}

export class Brick extends Sprite {

  type: BrickType;
  used = false;

  constructor(texture: Texture, type: BrickType) {

    super(texture);
    this.type = type;

  }

  hitFromBelow() {

    if (this.type === BrickType.NORMAL) {

      this.destroy();

    }

    if (this.type === BrickType.QUESTION && !this.used) {

      this.used = true;

      return "spawn_coin";

    }

  }

}