import { Scene, SceneManager } from "../game/SceneManager";
import { Player } from "../objects/Player";
import { TileMap } from "../map/TileMap";
import { Tile } from "../objects/Tile";
import { Enemy } from "../objects/Enemy";
import { Coin } from "../objects/Coin";
import { Keyboard } from "../input/Keyboard";
import { aabbOverlap, spriteRect } from "../systems/Collision";
import { Assets, Container, Text } from "pixi.js";
import { GameOverScene } from "./GameOverScene";
import { mapData } from "../map/MapData";

export class GameScene extends Scene {
  private player!: Player;
  private tileMap!: TileMap;
  private world!: Container;
  private enemies: Enemy[] = [];
  private coins: Coin[] = [];
  private textures: any;
  private ready = false;
  private isGameOver = false;

  // Score & Timer
  private score = 0;
  private scoreText!: Text;
  private timeRemaining = 600;
  private timerText!: Text;
  private frameCount = 0;

  constructor(private sceneManager: SceneManager) {
    super();
    this.init();
  }

  private async init() {
    Keyboard.init();

    this.textures = {
      player: await Assets.load("src/assets/images/Player.png"),
      ground: await Assets.load("src/assets/images/Ground.png"),
      brick: await Assets.load("src/assets/images/Brick.png"),
      question: await Assets.load("src/assets/images/Question.png"),
      empty: await Assets.load("src/assets/images/Empty.png"),
      enemy: await Assets.load("src/assets/images/Enemy.png"),
      coin: await Assets.load("src/assets/images/Coin.png"),
    };

    this.world = new Container();
    this.addChild(this.world);

    // Initialize Tile Map
    this.tileMap = new TileMap(this.textures);
    this.world.addChild(this.tileMap);

    this.player = new Player(this.textures.player);
    this.world.addChild(this.player);

    // Spawn manual enemies
    const spawnPoints = [400, 700, 1200, 1500, 2100, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500, 8000, 8500, 9000, 9500, 10000];
    for (const x of spawnPoints) {
      this.spawnEnemy(x);
    }

    // UI - Score & Timer
    this.timerText = new Text({
      text: `TIME: ${Math.ceil(this.timeRemaining)}`,
      style: { fill: "#ffffff", fontSize: 24, fontWeight: "bold" }
    });
    this.timerText.x = 20;
    this.timerText.y = 20;
    this.addChild(this.timerText);

    this.scoreText = new Text({
      text: `SCORE: ${this.score}`,
      style: { fill: "#ffffff", fontSize: 24, fontWeight: "bold" }
    });
    this.scoreText.anchor.x = 1; // Align to right
    this.scoreText.x = 780;
    this.scoreText.y = 20;
    this.addChild(this.scoreText);

    this.ready = true;
  }

  private updateScore(points: number) {
    this.score += points;
    this.scoreText.text = `SCORE: ${this.score}`;
  }

  private spawnEnemy(x: number, y?: number) {
    const enemy = new Enemy(this.textures.enemy, x, y);
    this.enemies.push(enemy);
    this.world.addChild(enemy);
  }

  private spawnCoin(x: number, y: number) {
    const coin = new Coin(this.textures.coin, x, y);
    this.coins.push(coin);
    this.world.addChild(coin);
  }

  update(delta: number): void {
    if (!this.ready || this.isGameOver) return;

    // Timer Logic
    this.frameCount += delta;
    if (this.frameCount >= 60) {
      this.timeRemaining--;
      this.frameCount = 0;
      this.timerText.text = `TIME: ${Math.ceil(this.timeRemaining)}`;

      if (this.timeRemaining <= 0) {
        this.timeRemaining = 0;
        this.gameOver("TIME UP!");
      }
    }

    // Check fell into pit
    const mapHeight = mapData.length * 32;
    if (this.player.y > mapHeight + 100) {
      this.gameOver("FELL INTO THE PIT!");
    }

    this.player.update();

    // Clean up entities
    this.enemies = this.enemies.filter(enemy => !enemy.destroyed);
    this.coins = this.coins.filter(coin => !coin.destroyed);

    // Horizontal Movement
    this.player.applyHorizontalMovement(delta);
    this.resolveHorizontal(this.player);

    // Enemy AI & Movement
    for (const enemy of this.enemies) {
      if (enemy.isDead || enemy.destroyed) continue;

      // Enemy AI: Turn around at pits
      const checkX = enemy.vx > 0 ? enemy.x + enemy.width + 5 : enemy.x - 5;
      const checkCol = Math.floor(checkX / 32);
      const checkRow = Math.floor((enemy.y + enemy.height + 5) / 32);

      const tileBelow = this.tileMap.getTile(checkCol, checkRow);
      if (!tileBelow && enemy.y < mapHeight) {
        enemy.vx *= -1;
      }

      enemy.x += enemy.vx * delta;
      this.resolveHorizontal(enemy);
    }

    // Vertical Movement
    this.player.applyVerticalMovement(delta);
    this.resolveVertical(this.player);

    // Enemy Y & Coins
    for (const enemy of this.enemies) {
      if (enemy.destroyed) continue;
      enemy.update(delta);

      if (!enemy.destroyed) {
        this.resolveVertical(enemy);
      }
    }

    for (const coin of this.coins) {
      coin.update(delta);
    }

    this.handleEnemyCollisions();
    this.updateCamera();
  }

  private updateCamera() {
    const targetX = 400 - this.player.x;
    this.world.x += (targetX - this.world.x) * 0.1;
    if (this.world.x > 0) this.world.x = 0;

    // Vertical Camera
    const targetY = 300 - this.player.y;
    this.world.y += (targetY - this.world.y) * 0.1;

    // Bounds check for Y
    const maxWorldY = 0;
    const minWorldY = 600 - (mapData.length * 32);
    if (this.world.y > maxWorldY) this.world.y = maxWorldY;
    if (this.world.y < minWorldY) this.world.y = minWorldY;
  }

  private handleEnemyCollisions() {
    const pRect = spriteRect(this.player);

    for (const enemy of this.enemies) {
      if (enemy.isDead || enemy.destroyed) continue;

      const eRect = spriteRect(enemy);

      if (aabbOverlap(pRect, eRect)) {
        // Player jumps on enemy
        if (this.player.vy > 0 && this.player.y + this.player.height < enemy.y + 20) {
          enemy.die();
          this.player.vy = -8;
          this.updateScore(1);
        } else {
          this.gameOver();
        }
      }
    }
  }

  private resolveHorizontal(entity: Player | Enemy): void {
    if (entity.destroyed) return;
    for (const tile of this.tileMap.solidTiles) {
      const entRect = spriteRect(entity);
      const tRect = spriteRect(tile);

      if (!aabbOverlap(entRect, tRect)) continue;

      if (entity.vx > 0) {
        entity.x = tRect.x - entity.width;
        if (entity instanceof Enemy) entity.vx *= -1;
      } else if (entity.vx < 0) {
        entity.x = tRect.x + tRect.width;
        if (entity instanceof Enemy) entity.vx *= -1;
      }
    }
  }

  private resolveVertical(entity: Player | Enemy): void {
    if (entity.destroyed) return;
    if (entity instanceof Player) entity.onGround = false;

    for (const tile of this.tileMap.solidTiles) {
      const entRect = spriteRect(entity);
      const tRect = spriteRect(tile);

      if (!aabbOverlap(entRect, tRect)) continue;

      if (entity.vy > 0) {
        entity.y = tRect.y - entity.height;
        entity.vy = 0;
        if (entity instanceof Player) entity.onGround = true;
      } else if (entity.vy < 0) {
        entity.y = tRect.y + tRect.height;
        entity.vy = 0;

        if (entity instanceof Player) {
          const event = tile.hitFromBelow();
          this.handleTileEvent(event, tile);
        }
      }
    }
  }

  private handleTileEvent(event: string | void, tile: Tile): void {
    if (event === "brick_break") {
      this.tileMap.removeTile(tile);
    }
    if (event === "spawn_coin") {
      this.spawnCoin(tile.x, tile.y - 32);
      this.updateScore(1); // Collecting coin
    }
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