import { Container, Text, TextStyle, Graphics, Assets, Sprite } from "pixi.js";
import { Scene, SceneManager } from "../game/SceneManager";
import { GameScene } from "./GameScene";

export class MenuScene extends Scene {
  private title!: Text;
  private elapsed = 0;

  constructor(private sceneManager: SceneManager) {
    super();
    this.init();
  }

  private init() {
    // 1. Get preloaded background
    const bgTexture = Assets.get("src/assets/images/GameBg.png");
    if (bgTexture) {
      const background = new Sprite(bgTexture);
      background.width = 800;
      background.height = 600;
      this.addChild(background);
    }

    // 2. Title
    const titleStyle = new TextStyle({
      fontFamily: "Tahoma, Geneva, sans-serif",
      fontSize: 84,
      fontWeight: "900",
      fill: "#FBD000",
      dropShadow: {
        alpha: 0.5,
        angle: Math.PI / 6,
        blur: 4,
        distance: 6,
      },
      letterSpacing: 5,
    });

    this.title = new Text({ text: "Mario", style: titleStyle });
    this.title.anchor.set(0.5);
    this.title.x = 400;
    this.title.y = 200;
    this.addChild(this.title);

    // 3. Play Button Container
    const btnContainer = new Container();
    btnContainer.x = 400;
    btnContainer.y = 420;
    btnContainer.eventMode = 'static';
    btnContainer.cursor = "pointer";

    // Button Background using Pixi v8 API
    const btnBg = new Graphics();
    this.drawButton(btnBg, 0x00ff00);
    btnContainer.addChild(btnBg);

    const btnText = new Text({
      text: "START GAME",
      style: {
        fill: "#ffffff",
        fontWeight: "bold",
        fontSize: 28,
        fontFamily: "Arial",
        dropShadow: { alpha: 0.3, distance: 2 },
      }
    });
    btnText.anchor.set(0.5);
    btnContainer.addChild(btnText);

    // Hover effects
    btnContainer.on("pointerover", () => {
      btnBg.clear();
      this.drawButton(btnBg, 0x33ff33);
      btnContainer.scale.set(1.1);
    });

    btnContainer.on("pointerout", () => {
      btnBg.clear();
      this.drawButton(btnBg, 0x00ff00);
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
      .stroke({ color: 0xffffff, width: 4, alpha: 0.8 });
  }

  update(delta: number) {
    this.elapsed += delta;
    if (this.title) {
      this.title.y = 200 + Math.sin(this.elapsed * 0.05) * 10;
    }
  }
}
