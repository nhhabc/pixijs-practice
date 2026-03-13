import { Scene, SceneManager } from "../game/SceneManager";
import { TileMap } from "../map/TileMap";
import { Keyboard } from "../input/Keyboard";
import { Assets, Container, Text } from "pixi.js";
import { generateMapData } from "../map/MapData";
import { ASSETS } from "../assets/AssetConfig";

// Entities
import { createPlayer, type Player } from "../entities/Player";
import { createEnemy, type Enemy } from "../entities/Enemy";
import { createCoin, type Coin } from "../entities/Coin";

// Systems
import { playerSystem } from "../systems/playerSystem";
import { enemySystem } from "../systems/enemySystem";
import { physicsSystem } from "../systems/physicsSystem";
import { collisionSystem } from "../systems/collisionSystem";
import { coinSystem } from "../systems/coinSystem";
import { cameraSystem } from "../systems/cameraSystem";
import { timerSystem, type GameState } from "../systems/timerSystem";
import type { Tile } from "../map/Tile";
import { GameOverScene } from "./GameOverScene";

export class GameScene extends Scene {
  private player!: Player;
  private enemies: Enemy[] = [];
  private coins: Coin[] = [];
  private tileMap!: TileMap;
  private mapData!: number[][];
  private world!: Container;
  private textures: any;
  private ready = false;
  private isGameOver = false;

  private score = 0;
  private scoreText!: Text;
  private timerText!: Text;

  private gameState: GameState = {
    timeRemaining: 600,
    frameCount: 0
  };

  constructor(private sceneManager: SceneManager) {
    super();
    this.init();
  }

  private async init() {
    Keyboard.init();

    this.textures = {
      player: Assets.get(ASSETS.PLAYER),
      ground: Assets.get(ASSETS.GROUND),
      brick: Assets.get(ASSETS.BRICK),
      question: Assets.get(ASSETS.QUESTION),
      empty: Assets.get(ASSETS.EMPTY),
      enemy: Assets.get(ASSETS.ENEMY),
      coin: Assets.get(ASSETS.COIN),
    };

    this.world = new Container();
    this.addChild(this.world);

    this.mapData = generateMapData();
    this.tileMap = new TileMap(this.textures, this.mapData);
    this.world.addChild(this.tileMap);

    // Entity creation via factory
    this.player = createPlayer(this.textures.player, 64);
    this.world.addChild(this.player.sprite);

    // Spawn enemies across 1000 tiles (32000 px)
    const spawnPoints: number[] = [];
    for (let x = 600; x < 30000; x += 500) {
      // Add some randomness to spacing
      spawnPoints.push(x + Math.random() * 400);
    }

    for (const x of spawnPoints) {
      this.spawnEnemy(x);
    }

    this.timerText = new Text({
      text: `TIME: ${this.gameState.timeRemaining}`,
      style: { fill: "#ffffff", fontSize: 24, fontWeight: "bold" }
    });
    this.timerText.x = 20;
    this.timerText.y = 20;
    this.addChild(this.timerText);

    this.scoreText = new Text({
      text: `SCORE: ${this.score}`,
      style: { fill: "#ffffff", fontSize: 24, fontWeight: "bold" }
    });
    this.scoreText.anchor.x = 1;
    this.scoreText.x = 780;
    this.scoreText.y = 20;
    this.addChild(this.scoreText);

    this.ready = true;
  }

  update(delta: number): void {
    if (!this.ready || this.isGameOver) return;

    const mapWidth = this.mapData[0].length * 32;
    const mapHeight = this.mapData.length * 32;

    // --- 1. Logic & Input Systems ---
    playerSystem(this.player);
    enemySystem(this.enemies, this.tileMap, delta, mapHeight);
    coinSystem(this.coins, delta);
    timerSystem(this.gameState, delta, this.timerText, () => this.gameOver("TIME UP!"));

    // --- 2. Physics & Tile Collision Systems ---
    physicsSystem(this.player, this.enemies, this.tileMap, delta, (event, tile) => {
      this.handleTileEvent(event, tile);
    }, mapWidth);

    // --- 3. Entity Interaction Systems ---
    collisionSystem(this.player, this.enemies, (pts) => this.updateScore(pts), () => this.gameOver());

    // --- 4. Camera & World Systems ---
    cameraSystem(this.world, this.player, mapWidth, mapHeight);

    if (this.player.sprite.y > mapHeight + 100) {
      this.gameOver("FELL INTO PIT!");
    }

    // --- 5. Cleanup ---
    this.enemies = this.enemies.filter(e => !e.destroyed);
    this.coins = this.coins.filter(c => !c.destroyed);
  }

  private handleTileEvent(event: string, tile: Tile) {
    if (event === "brick_break") {
      this.tileMap.removeTile(tile);
    }
    if (event === "spawn_coin") {
      this.spawnCoin(tile.x, tile.y - 32);
      this.updateScore(1);
    }
  }

  private spawnEnemy(x: number, y?: number) {
    const enemy = createEnemy(this.textures.enemy, x, y);
    this.enemies.push(enemy);
    this.world.addChild(enemy.sprite);
  }

  private spawnCoin(x: number, y: number) {
    const coin = createCoin(this.textures.coin, x, y);
    this.coins.push(coin);
    this.world.addChild(coin.sprite);
  }

  private updateScore(points: number) {
    this.score += points;
    this.scoreText.text = `SCORE: ${this.score}`;
  }

  gameOver(reason: string = "GAME OVER") {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.player.vx = 0;
    this.player.vy = 0;
    setTimeout(() => {
      this.sceneManager.changeScene(new GameOverScene(this.sceneManager, reason));
    }, 100);
  }
}
