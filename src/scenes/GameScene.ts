import { Scene, SceneManager } from "../game/SceneManager";
import { TileMap } from "../map/TileMap";
import { Keyboard } from "../input/Keyboard";
import { Assets, Container, Text, TilingSprite } from "pixi.js";
import { generateMapData, TileType } from "../map/MapData";
import { ASSETS } from "../assets/AssetConfig";

import { Player } from "../entities/Player";
import { Enemy } from "../entities/Enemy";
import { Coin } from "../entities/Coin";
import type { Tile } from "../map/Tile";
import { GameOverScene } from "./GameOverScene";
import { timerSystem, type GameState } from "../systems/timerSystem";
import { aabbOverlap, spriteRect } from "../utils/Collision";

export class GameScene extends Scene {
  private player!: Player;
  private background!: TilingSprite;
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
      background: Assets.get(ASSETS.GAME_PLAY_BG),
      player: Assets.get(ASSETS.PLAYER),
      ground: Assets.get(ASSETS.GROUND),
      brick: Assets.get(ASSETS.BRICK),
      question: Assets.get(ASSETS.QUESTION),
      empty: Assets.get(ASSETS.EMPTY),
      enemy: Assets.get(ASSETS.ENEMY),
      coin: Assets.get(ASSETS.COIN),
    };

    this.background = new TilingSprite({
      texture: this.textures.background,
      width: 800,
      height: 600
    });
    this.addChild(this.background);

    this.world = new Container();
    this.addChild(this.world);

    this.mapData = generateMapData();
    this.tileMap = new TileMap(this.textures, this.mapData);
    this.world.addChild(this.tileMap);

    // Initialise static coins from map data
    for (let row = 0; row < this.mapData.length; row++) {
      for (let col = 0; col < this.mapData[row].length; col++) {
        if (this.mapData[row][col] === TileType.COIN) {
          this.spawnCoin(col * 32 + 4, row * 32 + 4, true);
        }
      }
    }

    // Entity creation (OOP pattern)
    this.player = new Player(this.textures.player, 64);
    this.world.addChild(this.player);

    const spawnPoints: number[] = [];
    for (let x = 600; x < 30000; x += 500) {
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

    // Timer logic
    timerSystem(this.gameState, delta, this.timerText, () => this.gameOver("TIME UP!"));

    // --- 1. Update Player ---
    this.player.update(delta, this.tileMap, mapWidth, (event, tile) => this.handleTileEvent(event, tile));

    // --- 2. Update Enemies & Check Collisions ---
    const pRect = spriteRect(this.player);

    for (const enemy of this.enemies) {
      enemy.update(delta, this.tileMap, mapHeight);

      if (enemy.isDead || enemy.destroyed) continue;

      // Example collision usage
      const eRect = spriteRect(enemy);
      if (aabbOverlap(pRect, eRect)) {
        if (this.player.vy > 0 && this.player.y + this.player.height < enemy.y + 40) {
          enemy.kill();
          this.player.vy = -8; // bounce off
          this.updateScore(1);
        } else {
          this.gameOver();
        }
      }
    }

    // --- 3. Update Coins ---
    for (const coin of this.coins) {
      coin.update(this.player, delta, (pts) => this.updateScore(pts));
    }

    // --- 4. Update Camera ---
    this.updateCamera(mapWidth, mapHeight);

    // --- 5. Background Parallax ---
    this.background.tilePosition.x = this.world.x * 0.5;
    this.background.tilePosition.y = this.world.y * 0.1;

    // Pitfall check
    if (this.player.y > mapHeight + 100) {
      this.gameOver("FELL INTO PIT!");
    }

    // --- 6. Cleanup Destroyed Objects ---
    this.enemies = this.enemies.filter(e => !e.destroyed);
    this.coins = this.coins.filter(c => !c.destroyed);
  }

  private updateCamera(mapWidth: number, mapHeight: number) {
    const targetX = 400 - this.player.x;
    this.world.x += (targetX - this.world.x) * 0.1;
    if (this.world.x > 0) this.world.x = 0;

    const minWorldX = 800 - mapWidth;
    if (this.world.x < minWorldX) this.world.x = minWorldX;

    const targetY = 300 - this.player.y;
    this.world.y += (targetY - this.world.y) * 0.1;

    const maxWorldY = 0;
    const minWorldY = 600 - mapHeight;
    if (this.world.y > maxWorldY) this.world.y = maxWorldY;
    if (this.world.y < minWorldY) this.world.y = minWorldY;
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
    const enemy = new Enemy(this.textures.enemy, x, y);
    this.enemies.push(enemy);
    this.world.addChild(enemy);
  }

  private spawnCoin(x: number, y: number, isStatic: boolean = false) {
    const coin = new Coin(this.textures.coin, x, y, isStatic);
    this.coins.push(coin);
    this.world.addChild(coin);
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
