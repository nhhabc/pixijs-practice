import { Text, TextStyle, Graphics, Container, Assets, Sprite } from "pixi.js";
import { Scene, SceneManager } from "../game/SceneManager";
import { GameScene } from "./GameScene";
import { ASSETS } from "../assets/AssetConfig";

export class GameOverScene extends Scene {
  constructor(private sceneManager: SceneManager, reason: string = "GAME OVER") {
    super();
    this.init(reason);
  }

  private async init(reason: string) {
    // Load background
    const bgTexture = Assets.get(ASSETS.GAME_OVER);
    const background = new Sprite(bgTexture);
    background.width = 800;
    background.height = 600;
    this.addChild(background);

    // Dark overlay
    const overlay = new Graphics();
    overlay.fillStyle = 0x000000;
    overlay.alpha = 0.6;
    overlay.rect(0, 0, 800, 600);
    this.addChild(overlay);

    const style = new TextStyle({
      fontFamily: "Arial Black, Gadget, sans-serif",
      fontSize: 80,
      fill: 0xff0000,
      fontWeight: "900",
      align: "center",
      stroke: { color: "#ffffff", width: 4 },
      dropShadow: {
        alpha: 0.8,
        angle: Math.PI / 2,
        blur: 10,
        color: "#000000",
        distance: 10,
      },
    });

    const text = new Text({ text: reason, style });
    text.anchor.set(0.5);
    text.x = 400;
    text.y = 250;
    this.addChild(text);

    // Restart Button
    const btnContainer = new Container();
    btnContainer.x = 400;
    btnContainer.y = 450;
    btnContainer.interactive = true;
    btnContainer.cursor = "pointer";

    const btnBg = new Graphics();
    this.drawButton(btnBg, 0xffffff);
    btnContainer.addChild(btnBg);

    const btnText = new Text({
      text: "TRY AGAIN",
      style: {
        fontSize: 28,
        fill: "#000000",
        fontWeight: "bold",
        fontFamily: "Arial"
      }
    });
    btnText.anchor.set(0.5);
    btnContainer.addChild(btnText);

    btnContainer.on("pointerover", () => {
      btnBg.clear();
      this.drawButton(btnBg, 0xcccccc);
      btnContainer.scale.set(1.1);
    });

    btnContainer.on("pointerout", () => {
      btnBg.clear();
      this.drawButton(btnBg, 0xffffff);
      btnContainer.scale.set(1.0);
    });

    btnContainer.on("pointerdown", () => {
      this.sceneManager.changeScene(new GameScene(this.sceneManager));
    });

    this.addChild(btnContainer);
  }

  private drawButton(graphics: Graphics, color: number) {
    graphics
      .roundRect(-140, -40, 280, 80, 20)
      .fill(color)
  }

  update(_delta: number) { }
}
