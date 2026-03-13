import { Application } from "pixi.js";
import { SceneManager } from "./game/SceneManager";
import { LoadingScene } from "./scenes/LoadingScene";

async function init() {

  const app = new Application();

  await app.init({
    width: 800,
    height: 600,
    background: "#1e1e1e"
  });

  document.body.appendChild(app.canvas);

  const sceneManager = new SceneManager(app);

  const loadingScene = new LoadingScene(sceneManager);

  sceneManager.changeScene(loadingScene);
}

init();