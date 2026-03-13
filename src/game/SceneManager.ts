import { Application, Container } from "pixi.js";

export abstract class Scene extends Container {

  abstract update(delta: number): void;

}

export class SceneManager {

  currentScene?: Scene;
  app: Application;

  constructor(app: Application) {

    this.app = app;

    this.app.ticker.add((ticker) => this.update(ticker.deltaTime));

  }

  changeScene(scene: Scene) {

    if (this.currentScene) {
      this.app.stage.removeChild(this.currentScene);
    }

    this.currentScene = scene;

    this.app.stage.addChild(scene);

  }

  update(delta: number) {

    if (this.currentScene) {
      this.currentScene.update(delta);
    }

  }
}