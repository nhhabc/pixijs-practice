import { Application } from "pixi.js";
import { SceneManager } from "./game/SceneManager";
import { LoadingScene } from "./scenes/LoadingScene";

async function init() {
  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 600;

  const app = new Application();

  await app.init({
    background: "#1e1e1e",
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  });

  document.body.appendChild(app.canvas);

  function resize() {
    const scale = Math.min(
      window.innerWidth / GAME_WIDTH,
      window.innerHeight / GAME_HEIGHT
    );

    app.canvas.style.width = GAME_WIDTH * scale + "px";
    app.canvas.style.height = GAME_HEIGHT * scale + "px";
  }

  window.addEventListener("resize", resize);
  resize();

  const sceneManager = new SceneManager(app);

  const loadingScene = new LoadingScene(sceneManager);

  sceneManager.changeScene(loadingScene);
}

init();