import { SceneManager } from "./SceneManager";
import { GameScene } from "../screens/GameScene";
import { Application } from "pixi.js";

export class Game {

  app!: Application;
  sceneManager!: SceneManager;

  async init() {

    this.app = new Application();

    await this.app.init({
      width: 800,
      height: 600,
      background: "#222"
    });

    document.body.appendChild(this.app.canvas);

    this.sceneManager = new SceneManager(this.app);

    this.sceneManager.changeScene(new GameScene());

  }

  constructor() {
    this.init();
  }

}