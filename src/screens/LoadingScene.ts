import { Text, TextStyle, Assets } from "pixi.js";
import { Scene, SceneManager } from "../game/SceneManager";
import { MenuScene } from "./MenuScene";

export class LoadingScene extends Scene {
  private loadingText!: Text;

  constructor(private sceneManager: SceneManager) {
    super();
    this.init();
  }

  private async init() {
    const style = new TextStyle({
      fontFamily: "Arial",
      fontSize: 36,
      fontWeight: "bold",
      fill: "#ffffff",
    });

    this.loadingText = new Text({ text: "LOADING...", style });
    this.loadingText.anchor.set(0.5);
    this.loadingText.x = 400;
    this.loadingText.y = 300;
    this.addChild(this.loadingText);

    // Load essential UI assets
    try {
      await Assets.load([
        "src/assets/images/GameBg.png",
        "src/assets/images/GameOver.png"
      ]);

      // Small delay to show loading screen
      setTimeout(() => {
        this.sceneManager.changeScene(new MenuScene(this.sceneManager));
      }, 500);
    } catch (e) {
      console.error("Asset loading failed", e);
      this.sceneManager.changeScene(new MenuScene(this.sceneManager));
    }
  }

  update(_delta: number) {
    this.loadingText.alpha = 0.5 + Math.sin(Date.now() * 0.01) * 0.5;
  }
}
