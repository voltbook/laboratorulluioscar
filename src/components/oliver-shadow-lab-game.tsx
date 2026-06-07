"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUp, Crosshair, Keyboard, Maximize2, Pause, Play, RotateCcw, X, Zap } from "lucide-react";

const levels = [
  {
    name: "Level 1 — Laboratory Escape",
    theme: 0x06140b,
    platforms: [
      [0, 520, 960, 44],
      [180, 420, 170, 24],
      [430, 350, 170, 24],
      [690, 280, 160, 24],
    ],
    enemies: [[540, 310, "bot"]],
    drones: [],
    lasers: [],
    orbs: [
      [230, 385],
      [490, 315],
      [750, 245],
    ],
    goal: [850, 230],
  },
  {
    name: "Level 2 — Dark City",
    theme: 0x070b1c,
    platforms: [
      [0, 520, 960, 44],
      [120, 430, 140, 24],
      [340, 360, 150, 24],
      [570, 310, 170, 24],
      [770, 240, 140, 24],
    ],
    enemies: [[420, 320, "bot"]],
    drones: [[650, 230]],
    lasers: [],
    orbs: [
      [165, 395],
      [395, 325],
      [635, 275],
      [820, 205],
    ],
    goal: [870, 190],
  },
  {
    name: "Level 3 — Underground Tunnels",
    theme: 0x0a1110,
    platforms: [
      [0, 520, 960, 44],
      [170, 450, 120, 24],
      [360, 390, 140, 24],
      [560, 330, 110, 24],
      [730, 430, 160, 24],
    ],
    enemies: [
      [420, 350, "spider"],
      [780, 390, "spider"],
    ],
    drones: [],
    lasers: [[610, 360]],
    orbs: [
      [210, 415],
      [410, 355],
      [600, 295],
      [790, 395],
    ],
    goal: [860, 380],
  },
  {
    name: "Level 4 — Factory of Shadows",
    theme: 0x160b0f,
    platforms: [
      [0, 520, 960, 44],
      [120, 455, 180, 22],
      [370, 400, 160, 22],
      [610, 345, 170, 22],
      [760, 260, 140, 22],
    ],
    enemies: [
      [460, 360, "bot"],
      [690, 305, "brute"],
    ],
    drones: [[260, 340]],
    lasers: [[560, 430]],
    orbs: [
      [180, 420],
      [430, 365],
      [665, 310],
      [810, 225],
    ],
    goal: [875, 210],
  },
  {
    name: "Level 5 — Central Tower",
    theme: 0x10051c,
    platforms: [
      [0, 520, 960, 44],
      [110, 430, 160, 24],
      [310, 350, 160, 24],
      [520, 280, 160, 24],
      [720, 210, 170, 24],
    ],
    enemies: [[390, 310, "brute"]],
    drones: [[600, 185]],
    lasers: [
      [250, 455],
      [710, 250],
    ],
    orbs: [
      [165, 395],
      [365, 315],
      [575, 245],
      [775, 175],
    ],
    goal: [850, 160],
    boss: [790, 170],
  },
] as const;

const levelBackgrounds = [
  "/games/oliver-te/backgrounds/level-01-lab-escape-bg.png",
  "/games/oliver-te/backgrounds/level-02-neon-rooftops-bg.png",
  "/games/oliver-te/backgrounds/level-03-underground-tunnels-bg.png",
  "/games/oliver-te/backgrounds/level-04-shadow-factory-bg.png",
  "/games/oliver-te/backgrounds/level-05-tower-core-bg.png",
] as const;

const levelObjectives = [
  "Escape the lab · collect 3 energy orbs · reach EXIT",
  "Cross the rooftops · avoid drone fire · reach EXIT",
  "Survive tunnel traps · shoot spider bots · reach EXIT",
  "Break through the factory · use Shadow Pulse on brutes",
  "Destroy the AI Core Guardian · dodge shadow blasts",
] as const;

export function OliverShadowLabGame() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<{ destroy: (removeCanvas: boolean, noReturn?: boolean) => void; scene: { getScene: (key: string) => unknown } } | null>(null);
  const [running, setRunning] = useState(false);
  const [gameMode, setGameMode] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function boot() {
      if (!hostRef.current || gameRef.current) return;
      const Phaser = await import("phaser");
      if (!mounted || !hostRef.current) return;

      class ShadowLabScene extends Phaser.Scene {
        player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
        cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
        wasd!: Record<string, Phaser.Input.Keyboard.Key>;
        platforms!: Phaser.Physics.Arcade.StaticGroup;
        enemies!: Phaser.Physics.Arcade.Group;
        drones!: Phaser.Physics.Arcade.Group;
        projectiles!: Phaser.Physics.Arcade.Group;
        enemyProjectiles!: Phaser.Physics.Arcade.Group;
        lasers!: Phaser.Physics.Arcade.StaticGroup;
        orbs!: Phaser.Physics.Arcade.StaticGroup;
        goal!: Phaser.GameObjects.GameObject;
        levelIndex = 0;
        score = 0;
        hp = 3;
        energy = 70;
        facing = 1;
        jumps = 0;
        attackUntil = 0;
        weaponCooldownUntil = 0;
        specialCooldownUntil = 0;
        invulnerableUntil = 0;
        levelText!: Phaser.GameObjects.Text;
        hudText!: Phaser.GameObjects.Text;
        messageText!: Phaser.GameObjects.Text;
        titleCard!: Phaser.GameObjects.Container;
        bossBarBg?: Phaser.GameObjects.Rectangle;
        bossBarFill?: Phaser.GameObjects.Rectangle;
        bossLabel?: Phaser.GameObjects.Text;

        constructor() {
          super("shadow-lab");
        }

        preload() {
          this.load.image("cover", "/games/oliver-te-shadow-lab/cover-art.png");
          this.load.image("sheet", "/games/oliver-te-shadow-lab/oliver-character-sheet.png");
          this.load.spritesheet("oliver-player", "/games/oliver-te/sprites/player/oliver-player-spritesheet.png", {
            frameWidth: 128,
            frameHeight: 128,
          });
          this.load.spritesheet("enemy-shadow-imp", "/games/oliver-te/sprites/enemies/enemy-shadow-imp-spritesheet.png", {
            frameWidth: 128,
            frameHeight: 128,
          });
          this.load.spritesheet("enemy-cyber-drone", "/games/oliver-te/sprites/enemies/enemy-cyber-drone-spritesheet.png", {
            frameWidth: 128,
            frameHeight: 128,
          });
          this.load.spritesheet("enemy-spider-bot", "/games/oliver-te/sprites/enemies/enemy-spider-bot-spritesheet.png", {
            frameWidth: 128,
            frameHeight: 128,
          });
          this.load.spritesheet("enemy-shadow-brute", "/games/oliver-te/sprites/enemies/enemy-shadow-brute-spritesheet.png", {
            frameWidth: 128,
            frameHeight: 128,
          });
          this.load.spritesheet("boss-ai-core-guardian", "/games/oliver-te/sprites/bosses/boss-ai-core-guardian-spritesheet.png", {
            frameWidth: 256,
            frameHeight: 256,
          });
          levelBackgrounds.forEach((path, index) => this.load.image(`level-bg-${index}`, path));
        }

        create() {
          this.cursors = this.input.keyboard!.createCursorKeys();
          this.wasd = this.input.keyboard!.addKeys("W,A,S,D,SPACE,J,K,R,N") as Record<string, Phaser.Input.Keyboard.Key>;
          this.createGeneratedTextures();
          this.createPlayerAnimations();
          this.createEnemyAnimations();
          const levelFromHash = Number(window.location.hash.match(/level-(\d+)/)?.[1] ?? 1) - 1;
          this.createLevel(Math.min(Math.max(levelFromHash, 0), levels.length - 1));
          this.input.keyboard!.on("keydown-R", () => this.createLevel(this.levelIndex));
          this.input.keyboard!.on("keydown-N", () => this.createLevel((this.levelIndex + 1) % levels.length));
        }

        createPlayerAnimations() {
          if (this.anims.exists("oliver-idle")) return;
          this.anims.create({ key: "oliver-idle", frames: this.anims.generateFrameNumbers("oliver-player", { start: 0, end: 7 }), frameRate: 8, repeat: -1 });
          this.anims.create({ key: "oliver-run", frames: this.anims.generateFrameNumbers("oliver-player", { start: 12, end: 23 }), frameRate: 14, repeat: -1 });
          this.anims.create({ key: "oliver-jump", frames: this.anims.generateFrameNumbers("oliver-player", { start: 24, end: 31 }), frameRate: 10, repeat: 0 });
          this.anims.create({ key: "oliver-climb", frames: this.anims.generateFrameNumbers("oliver-player", { start: 36, end: 43 }), frameRate: 10, repeat: -1 });
          this.anims.create({ key: "oliver-attack", frames: this.anims.generateFrameNumbers("oliver-player", { start: 48, end: 59 }), frameRate: 18, repeat: 0 });
          this.anims.create({ key: "oliver-special", frames: this.anims.generateFrameNumbers("oliver-player", { start: 60, end: 71 }), frameRate: 18, repeat: 0 });
          this.anims.create({ key: "oliver-hurt", frames: this.anims.generateFrameNumbers("oliver-player", { start: 72, end: 77 }), frameRate: 10, repeat: 0 });
          this.anims.create({ key: "oliver-death", frames: this.anims.generateFrameNumbers("oliver-player", { start: 78, end: 83 }), frameRate: 8, repeat: 0 });
          this.anims.create({ key: "oliver-victory", frames: this.anims.generateFrameNumbers("oliver-player", { start: 84, end: 95 }), frameRate: 10, repeat: -1 });
        }

        createEnemyAnimations() {
          if (this.anims.exists("shadow-imp-walk")) return;
          this.anims.create({ key: "shadow-imp-idle", frames: this.anims.generateFrameNumbers("enemy-shadow-imp", { start: 0, end: 7 }), frameRate: 8, repeat: -1 });
          this.anims.create({ key: "shadow-imp-walk", frames: this.anims.generateFrameNumbers("enemy-shadow-imp", { start: 8, end: 15 }), frameRate: 10, repeat: -1 });
          this.anims.create({ key: "shadow-imp-attack", frames: this.anims.generateFrameNumbers("enemy-shadow-imp", { start: 16, end: 23 }), frameRate: 12, repeat: 0 });
          this.anims.create({ key: "shadow-imp-death", frames: this.anims.generateFrameNumbers("enemy-shadow-imp", { start: 24, end: 31 }), frameRate: 10, repeat: 0 });
          this.anims.create({ key: "cyber-drone-fly", frames: this.anims.generateFrameNumbers("enemy-cyber-drone", { start: 0, end: 15 }), frameRate: 14, repeat: -1 });
          this.anims.create({ key: "cyber-drone-shoot", frames: this.anims.generateFrameNumbers("enemy-cyber-drone", { start: 16, end: 23 }), frameRate: 12, repeat: -1 });
          this.anims.create({ key: "cyber-drone-destroyed", frames: this.anims.generateFrameNumbers("enemy-cyber-drone", { start: 24, end: 31 }), frameRate: 10, repeat: 0 });
          this.anims.create({ key: "spider-bot-crawl", frames: this.anims.generateFrameNumbers("enemy-spider-bot", { start: 8, end: 15 }), frameRate: 14, repeat: -1 });
          this.anims.create({ key: "shadow-brute-walk", frames: this.anims.generateFrameNumbers("enemy-shadow-brute", { start: 8, end: 15 }), frameRate: 9, repeat: -1 });
          this.anims.create({ key: "ai-core-idle", frames: this.anims.generateFrameNumbers("boss-ai-core-guardian", { start: 0, end: 7 }), frameRate: 8, repeat: -1 });
          this.anims.create({ key: "ai-core-laser", frames: this.anims.generateFrameNumbers("boss-ai-core-guardian", { start: 16, end: 23 }), frameRate: 10, repeat: -1 });
        }

        createGeneratedTextures() {
          if (this.textures.exists("oliver-hero")) return;

          const hero = this.add.graphics();
          hero.fillStyle(0x151222, 1).fillTriangle(18, 36, 12, 76, 4, 86);
          hero.fillStyle(0x080a12, 1).fillRoundedRect(26, 34, 36, 46, 8);
          hero.lineStyle(3, 0x33ccff, 1).strokeRoundedRect(26, 34, 36, 46, 8);
          hero.fillStyle(0x1b0f2f, 1).fillTriangle(58, 40, 88, 54, 58, 70);
          hero.fillStyle(0xf2b17d, 1).fillCircle(44, 22, 17);
          hero.fillStyle(0x09090d, 1).fillTriangle(24, 14, 34, 0, 39, 12).fillTriangle(36, 8, 48, 0, 50, 13).fillTriangle(48, 10, 64, 4, 55, 20);
          hero.fillStyle(0x06070b, 1).fillRoundedRect(27, 17, 34, 11, 5);
          hero.fillStyle(0x7cecff, 1).fillCircle(36, 22, 4).fillCircle(52, 22, 4);
          hero.lineStyle(2, 0x00eaff, 1).strokeTriangle(35, 47, 54, 47, 44, 61);
          hero.fillStyle(0x111827, 1).fillRoundedRect(23, 76, 14, 12, 3).fillRoundedRect(53, 76, 14, 12, 3);
          hero.lineStyle(2, 0x33ccff, 0.8).strokeRoundedRect(20, 38, 12, 30, 4).strokeRoundedRect(58, 38, 12, 30, 4);
          hero.generateTexture("oliver-hero", 92, 92);
          hero.destroy();

          const heroAttack = this.add.graphics();
          heroAttack.fillStyle(0x151222, 1).fillTriangle(18, 36, 12, 76, 4, 86);
          heroAttack.fillStyle(0x080a12, 1).fillRoundedRect(26, 34, 36, 46, 8);
          heroAttack.lineStyle(3, 0xffffff, 1).strokeRoundedRect(26, 34, 36, 46, 8);
          heroAttack.fillStyle(0xf2b17d, 1).fillCircle(44, 22, 17);
          heroAttack.fillStyle(0x09090d, 1).fillTriangle(24, 14, 34, 0, 39, 12).fillTriangle(36, 8, 48, 0, 50, 13).fillTriangle(48, 10, 64, 4, 55, 20);
          heroAttack.fillStyle(0x06070b, 1).fillRoundedRect(27, 17, 34, 11, 5);
          heroAttack.fillStyle(0xffffff, 1).fillCircle(36, 22, 4).fillCircle(52, 22, 4);
          heroAttack.lineStyle(5, 0x79f7ff, 1).lineBetween(62, 52, 78, 48).lineBetween(78, 48, 94, 40).lineBetween(94, 40, 106, 30);
          heroAttack.lineStyle(2, 0x00eaff, 1).strokeTriangle(35, 47, 54, 47, 44, 61);
          heroAttack.fillStyle(0x111827, 1).fillRoundedRect(23, 76, 14, 12, 3).fillRoundedRect(53, 76, 14, 12, 3);
          heroAttack.generateTexture("oliver-attack", 112, 92);
          heroAttack.destroy();

          const bot = this.add.graphics();
          bot.fillStyle(0x07100b, 1).fillRoundedRect(8, 18, 42, 36, 8);
          bot.lineStyle(3, 0x00ff66, 1).strokeRoundedRect(8, 18, 42, 36, 8);
          bot.fillStyle(0xff2d75, 1).fillCircle(22, 33, 4).fillCircle(36, 33, 4);
          bot.lineStyle(2, 0x00ff66, 0.8).lineBetween(12, 54, 4, 66).lineBetween(46, 54, 54, 66);
          bot.generateTexture("enemy-bot", 60, 72);
          bot.destroy();

          const spider = this.add.graphics();
          spider.fillStyle(0x120a1c, 1).fillEllipse(38, 35, 44, 26);
          spider.lineStyle(3, 0x9b5cff, 1).strokeEllipse(38, 35, 44, 26);
          spider.fillStyle(0xd6c4ff, 1).fillCircle(30, 31, 4).fillCircle(46, 31, 4);
          spider.lineStyle(2, 0x9b5cff, 1);
          [10, 18, 58, 66].forEach((x) => spider.lineBetween(38, 43, x, 62));
          spider.generateTexture("enemy-spider", 76, 70);
          spider.destroy();

          const brute = this.add.graphics();
          brute.fillStyle(0x1a0a06, 1).fillRoundedRect(8, 8, 56, 66, 10);
          brute.lineStyle(4, 0xff6b35, 1).strokeRoundedRect(8, 8, 56, 66, 10);
          brute.fillStyle(0xffcf99, 1).fillCircle(28, 28, 5).fillCircle(46, 28, 5);
          brute.fillStyle(0xff6b35, 0.7).fillRoundedRect(0, 36, 18, 18, 5).fillRoundedRect(54, 36, 18, 18, 5);
          brute.generateTexture("enemy-brute", 74, 82);
          brute.destroy();

          const core = this.add.graphics();
          core.fillStyle(0x170722, 1).fillCircle(48, 48, 40);
          core.lineStyle(5, 0xff40ff, 1).strokeCircle(48, 48, 40);
          core.lineStyle(3, 0x72f7ff, 0.85).strokeCircle(48, 48, 22);
          core.fillStyle(0xff40ff, 1).fillCircle(48, 48, 10);
          core.generateTexture("ai-core", 96, 96);
          core.destroy();

          const orb = this.add.graphics();
          orb.fillStyle(0x00ff66, 0.18).fillCircle(24, 24, 22);
          orb.fillStyle(0xdcff00, 0.9).fillCircle(24, 24, 10);
          orb.lineStyle(3, 0x00ff66, 1).strokeCircle(24, 24, 15);
          orb.lineStyle(2, 0xffffff, 0.8).lineBetween(17, 17, 31, 31).lineBetween(31, 17, 17, 31);
          orb.generateTexture("energy-orb", 48, 48);
          orb.destroy();

          const exit = this.add.graphics();
          exit.fillStyle(0x031109, 0.95).fillRoundedRect(8, 6, 48, 72, 4);
          exit.lineStyle(4, 0x00ff66, 1).strokeRoundedRect(8, 6, 48, 72, 4);
          exit.fillStyle(0x00ff66, 0.22).fillRoundedRect(18, 16, 28, 52, 3);
          exit.lineStyle(2, 0xdcff00, 0.8).lineBetween(22, 26, 42, 26).lineBetween(22, 42, 42, 42).lineBetween(22, 58, 42, 58);
          exit.generateTexture("goal-door", 64, 84);
          exit.destroy();

          const bolt = this.add.graphics();
          bolt.fillStyle(0x74f7ff, 0.35).fillEllipse(36, 14, 66, 20);
          bolt.fillStyle(0xffffff, 1).fillEllipse(42, 14, 32, 8);
          bolt.lineStyle(3, 0x00eaff, 1).strokeEllipse(38, 14, 58, 16);
          bolt.lineStyle(2, 0x7c3aed, 0.9).lineBetween(0, 14, 20, 14);
          bolt.generateTexture("plasma-bolt", 72, 28);
          bolt.destroy();

          const enemyBolt = this.add.graphics();
          enemyBolt.fillStyle(0xff40ff, 0.22).fillCircle(18, 18, 17);
          enemyBolt.fillStyle(0xffffff, 1).fillCircle(18, 18, 6);
          enemyBolt.lineStyle(3, 0xff40ff, 1).strokeCircle(18, 18, 12);
          enemyBolt.lineStyle(2, 0xffb000, 0.9).lineBetween(2, 18, 34, 18).lineBetween(18, 2, 18, 34);
          enemyBolt.generateTexture("enemy-bolt", 36, 36);
          enemyBolt.destroy();

          const spark = this.add.graphics();
          spark.fillStyle(0xffffff, 1).fillCircle(24, 24, 7);
          spark.lineStyle(3, 0x7cf7ff, 1).strokeCircle(24, 24, 15);
          spark.lineStyle(2, 0xffb000, 0.9).lineBetween(24, 0, 24, 48).lineBetween(0, 24, 48, 24).lineBetween(8, 8, 40, 40).lineBetween(40, 8, 8, 40);
          spark.generateTexture("impact-spark", 48, 48);
          spark.destroy();
        }

        createLevel(index: number) {
          this.levelIndex = index;
          this.children.removeAll();
          this.physics.world.colliders.destroy();
          this.physics.world.setBounds(0, 0, 960, 560);
          const level = levels[index];
          this.bossBarBg = undefined;
          this.bossBarFill = undefined;
          this.bossLabel = undefined;

          this.add.rectangle(480, 280, 960, 560, level.theme).setDepth(-10);
          this.add.image(480, 280, `level-bg-${index}`).setDisplaySize(960, 560).setAlpha(0.92).setDepth(-9);
          this.add.rectangle(480, 280, 960, 560, 0x000000, 0.32).setDepth(-8);
          this.add.grid(480, 280, 960, 560, 48, 48, 0x000000, 0, 0x00e5ff, 0.09).setDepth(-7);
          this.drawEnvironment(index);
          this.add.rectangle(480, 36, 900, 48, 0x000000, 0.58).setStrokeStyle(1, 0x00ff66, 0.35);
          this.add.rectangle(480, 528, 960, 64, 0x000000, 0.42).setStrokeStyle(1, 0x00ff66, 0.18);

          this.platforms = this.physics.add.staticGroup();
          level.platforms.forEach(([x, y, w, h]) => {
            const platform = this.add.rectangle(x + w / 2, y + h / 2, w, h, 0x11161a).setStrokeStyle(2, 0x00ff66, 0.78);
            this.add.rectangle(x + w / 2, y + 2, w, 4, 0x7cff9d, 0.55);
            this.physics.add.existing(platform, true);
            this.platforms.add(platform);
          });

          this.player = this.physics.add.sprite(70, 450, "oliver-player", 0);
          this.player.setCollideWorldBounds(true);
          this.player.setDragX(850);
          this.player.setMaxVelocity(340, 660);
          this.player.setDisplaySize(90, 90);
          this.player.body.setSize(44, 70).setOffset(42, 42);
          this.player.play("oliver-idle");

          this.enemies = this.physics.add.group();
          level.enemies.forEach(([x, y, type]) => this.spawnEnemy(Number(x), Number(y), String(type)));
          this.drones = this.physics.add.group();
          level.drones.forEach(([x, y]) => this.spawnDrone(Number(x), Number(y)));
          this.projectiles = this.physics.add.group();
          this.enemyProjectiles = this.physics.add.group();

          this.lasers = this.physics.add.staticGroup();
          level.lasers.forEach(([x, y]) => {
            const beam = this.add.rectangle(Number(x), Number(y), 16, 110, 0xff2d75, 0.62).setStrokeStyle(2, 0xff9bc3, 1);
            this.add.rectangle(Number(x), Number(y), 42, 128, 0xff2d75, 0.08);
            this.physics.add.existing(beam, true);
            this.lasers.add(beam);
          });

          this.orbs = this.physics.add.staticGroup();
          level.orbs.forEach(([x, y]) => {
            const orb = this.physics.add.staticSprite(Number(x), Number(y), "energy-orb").setDisplaySize(28, 28);
            this.tweens.add({ targets: orb, y: Number(y) - 8, duration: 900, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
            this.orbs.add(orb);
          });

          if ("boss" in level && level.boss) {
            const [bossX, bossY] = level.boss;
            const boss = this.add.sprite(Number(bossX), Number(bossY), "boss-ai-core-guardian", 0).setDisplaySize(150, 150);
            boss.play("ai-core-idle");
            boss.setData("hp", 10);
            boss.setData("maxHp", 10);
            boss.setData("type", "boss");
            boss.setData("nextShot", this.time.now + 900);
            this.add.text(Number(bossX) - 39, Number(bossY) - 72, "AI CORE", { fontFamily: "monospace", fontSize: "12px", color: "#ffb8ff" });
            this.physics.add.existing(boss);
            const bossBody = boss.body as Phaser.Physics.Arcade.Body;
            bossBody.setSize(150, 150).setOffset(53, 64);
            bossBody.setImmovable(true);
            this.enemies.add(boss);
            this.createBossHud();
          }

          const [gx, gy] = level.goal;
          const goal = this.physics.add.staticSprite(Number(gx), Number(gy), "goal-door").setDisplaySize(58, 78);
          this.add.text(Number(gx) - 19, Number(gy) - 6, "EXIT", { fontFamily: "monospace", fontSize: "12px", color: "#baffc8" });
          this.tweens.add({ targets: goal, alpha: 0.68, duration: 650, yoyo: true, repeat: -1 });
          this.goal = goal;

          this.levelText = this.add.text(24, 20, level.name, { fontFamily: "monospace", fontSize: "18px", color: "#ffffff" }).setScrollFactor(0);
          this.hudText = this.add.text(24, 48, "", { fontFamily: "monospace", fontSize: "14px", color: "#00ff66" }).setScrollFactor(0);
          this.messageText = this.add.text(480, 96, levelObjectives[index], {
            fontFamily: "monospace",
            fontSize: "13px",
            color: "#9eeeb5",
          }).setOrigin(0.5).setScrollFactor(0);
          this.time.delayedCall(3800, () => this.messageText.setText("J = Plasma · K = Shadow Pulse · Double jump enabled"));

          this.physics.add.collider(this.player, this.platforms);
          this.physics.add.collider(this.enemies, this.platforms);
          this.physics.add.overlap(this.projectiles, this.enemies, (projectile, enemy) => this.hitEnemyWithProjectile(projectile as Phaser.GameObjects.GameObject, enemy as Phaser.GameObjects.GameObject));
          this.physics.add.overlap(this.projectiles, this.enemyProjectiles, (plasma, shadowBolt) => {
            const bolt = shadowBolt as Phaser.GameObjects.Sprite;
            this.spawnSpark(bolt.x, bolt.y, 0x74f7ff);
            plasma.destroy();
            shadowBolt.destroy();
            this.score += 3;
          });
          this.physics.add.overlap(this.player, this.enemyProjectiles, (_, projectile) => {
            (projectile as Phaser.GameObjects.GameObject).destroy();
            this.spawnSpark(this.player.x, this.player.y, 0xff40ff);
            this.damage("Shadow blast");
          });
          this.physics.add.overlap(this.player, this.orbs, (_, orb) => {
            (orb as Phaser.GameObjects.GameObject).destroy();
            this.score += 10;
            this.energy = Math.min(100, this.energy + 18);
            this.flashMessage("+18 energy");
          });
          this.physics.add.overlap(this.player, this.goal, () => this.nextLevel());
          this.physics.add.overlap(this.player, this.enemies, (_, enemy) => this.handleEnemy(enemy as Phaser.GameObjects.GameObject));
          this.physics.add.overlap(this.player, this.lasers, () => this.damage("Laser trap"));
          this.updateHud();
        }

        drawEnvironment(index: number) {
          if (index === 0) {
            for (let x = 40; x < 920; x += 110) {
              this.add.rectangle(x, 190, 24, 180, 0x0d2115, 0.65).setStrokeStyle(1, 0x00ff66, 0.25);
              this.add.circle(x, 280, 8, 0x00ff66, 0.25);
            }
          } else if (index === 1) {
            for (let x = 20; x < 950; x += 95) {
              const h = 110 + ((x * 7) % 120);
              this.add.rectangle(x, 520 - h / 2, 70, h, 0x080b19, 0.95).setStrokeStyle(1, 0x33ccff, 0.25);
              this.add.rectangle(x + 12, 510 - h, 10, 24, 0xff40ff, 0.5);
            }
          } else if (index === 2) {
            for (let x = 40; x < 930; x += 120) {
              this.add.circle(x, 210, 44, 0x062018, 0.45).setStrokeStyle(2, 0x00ff66, 0.22);
              this.add.rectangle(x, 502, 80, 16, 0x00ff66, 0.09);
            }
          } else if (index === 3) {
            for (let x = 70; x < 920; x += 150) {
              this.add.rectangle(x, 250, 90, 210, 0x1a1010, 0.65).setStrokeStyle(1, 0xff6b35, 0.3);
              this.add.circle(x + 25, 180, 22, 0xff6b35, 0.12);
            }
          } else {
            for (let x = 110; x < 900; x += 160) {
              this.add.rectangle(x, 270, 62, 360, 0x13061f, 0.7).setStrokeStyle(1, 0xff40ff, 0.35);
              this.add.line(x, 95, 0, 0, 0, 300, 0x72f7ff, 0.26);
            }
          }
        }

        spawnEnemy(x: number, y: number, type: string) {
          if (type === "bot") {
            const enemy = this.add.sprite(x, y, "enemy-shadow-imp", 8).setDisplaySize(58, 58);
            this.physics.add.existing(enemy);
            const arcadeBody = enemy.body as Phaser.Physics.Arcade.Body;
            arcadeBody.setSize(52, 70).setOffset(38, 34);
            arcadeBody.setCollideWorldBounds(true);
            arcadeBody.setVelocityX(-70);
            enemy.setData("hp", 1);
            enemy.setData("type", "imp");
            enemy.play("shadow-imp-walk");
            this.enemies.add(enemy);
            return;
          }
          const texture = type === "spider" ? "enemy-spider-bot" : "enemy-shadow-brute";
          const enemy = this.add.sprite(x, y, texture, 8).setDisplaySize(type === "brute" ? 88 : 66, type === "brute" ? 88 : 54);
          this.physics.add.existing(enemy);
          const arcadeBody = enemy.body as Phaser.Physics.Arcade.Body;
          arcadeBody.setSize(type === "brute" ? 74 : 58, type === "brute" ? 82 : 42).setOffset(type === "brute" ? 28 : 35, type === "brute" ? 30 : 52);
          arcadeBody.setCollideWorldBounds(true);
          arcadeBody.setVelocityX(type === "brute" ? -50 : -105);
          enemy.setData("hp", type === "brute" ? 4 : 2);
          enemy.setData("type", type);
          enemy.play(type === "brute" ? "shadow-brute-walk" : "spider-bot-crawl");
          this.enemies.add(enemy);
        }

        spawnDrone(x: number, y: number) {
          const drone = this.add.sprite(x, y, "enemy-cyber-drone", 0).setDisplaySize(72, 72);
          this.physics.add.existing(drone);
          const body = drone.body as Phaser.Physics.Arcade.Body;
          body.allowGravity = false;
          body.setSize(58, 42).setOffset(35, 42);
          body.setVelocityX(-80);
          drone.setData("hp", 2);
          drone.setData("type", "drone");
          drone.setData("nextShot", this.time.now + Phaser.Math.Between(700, 1600));
          drone.play("cyber-drone-fly");
          this.drones.add(drone);
          this.enemies.add(drone);
        }

        createBossHud() {
          this.bossLabel = this.add
            .text(300, 66, "AI CORE GUARDIAN", {
              fontFamily: "monospace",
              fontSize: "12px",
              color: "#ffb8ff",
            })
            .setScrollFactor(0)
            .setDepth(10);
          this.bossBarBg = this.add
            .rectangle(480, 90, 360, 14, 0x18051f, 0.9)
            .setStrokeStyle(1, 0xff40ff, 0.75)
            .setScrollFactor(0)
            .setDepth(10);
          this.bossBarFill = this.add
            .rectangle(302, 90, 356, 8, 0xff40ff, 0.95)
            .setOrigin(0, 0.5)
            .setScrollFactor(0)
            .setDepth(11);
        }

        updateBossHud() {
          if (!this.bossBarFill) return;
          const boss = this.enemies
            .getChildren()
            .find((child) => (child as Phaser.GameObjects.Sprite).getData("type") === "boss") as Phaser.GameObjects.Sprite | undefined;
          if (!boss?.active) {
            this.bossBarBg?.setVisible(false);
            this.bossBarFill?.setVisible(false);
            this.bossLabel?.setVisible(false);
            return;
          }
          const hp = Math.max(0, Number(boss.getData("hp") ?? 0));
          const maxHp = Math.max(1, Number(boss.getData("maxHp") ?? 10));
          this.bossBarFill.scaleX = hp / maxHp;
        }

        fireEnemyBolt(source: Phaser.GameObjects.Sprite, speed = 225) {
          if (!this.player?.active) return;
          const angle = Phaser.Math.Angle.Between(source.x, source.y, this.player.x, this.player.y);
          const bolt = this.physics.add.sprite(source.x, source.y, "enemy-bolt").setDisplaySize(26, 26).setDepth(4);
          bolt.body.allowGravity = false;
          this.physics.velocityFromRotation(angle, speed, bolt.body.velocity);
          this.enemyProjectiles.add(bolt);
          this.tweens.add({ targets: bolt, alpha: 0.55, scale: 1.18, duration: 110, yoyo: true, repeat: 8 });
          this.time.delayedCall(2200, () => bolt.destroy());
        }

        update() {
          const body = this.player.body;
          const left = this.cursors.left.isDown || this.wasd.A.isDown;
          const right = this.cursors.right.isDown || this.wasd.D.isDown;
          const jumpPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.wasd.W) || Phaser.Input.Keyboard.JustDown(this.wasd.SPACE);

          if (left) body.setAccelerationX(-1250);
          else if (right) body.setAccelerationX(1250);
          else body.setAccelerationX(0);
          if (left) {
            this.facing = -1;
            this.player.setFlipX(true);
          }
          if (right) {
            this.facing = 1;
            this.player.setFlipX(false);
          }

          if (body.blocked.down) this.jumps = 0;
          if (jumpPressed && this.jumps < 2) {
            body.setVelocityY(this.jumps === 0 ? -430 : -370);
            this.jumps += 1;
            this.spawnSpark(this.player.x, this.player.y + 32, 0x74f7ff);
          }

          if (Phaser.Input.Keyboard.JustDown(this.wasd.J)) this.firePlasmaBolt();
          if (Phaser.Input.Keyboard.JustDown(this.wasd.K)) this.castShockwave();
          if (this.attackUntil && this.time.now > this.attackUntil) {
            this.attackUntil = 0;
          }
          this.updatePlayerAnimation(left, right);

          this.enemies.getChildren().forEach((child) => {
            const obj = child as Phaser.GameObjects.Sprite;
            const enemyBody = obj.body as Phaser.Physics.Arcade.Body | undefined;
            if (!enemyBody) return;
            if (obj.getData("type") === "boss") {
              obj.y = 170 + Math.sin(this.time.now / 450) * 8;
              obj.setFlipX(this.player.x < obj.x);
              if (this.time.now > Number(obj.getData("nextShot") ?? 0)) {
                obj.setData("nextShot", this.time.now + 1250);
                obj.play("ai-core-laser", true);
                this.fireEnemyBolt(obj, 270);
                this.time.delayedCall(420, () => {
                  if (obj.active) obj.play("ai-core-idle", true);
                });
              }
              return;
            }
            if (obj.y > 505 || obj.x < 35 || obj.x > 925) enemyBody.setVelocityX((enemyBody.velocity.x || 60) * -1);
            obj.setFlipX(enemyBody.velocity.x < 0);
          });

          this.drones.getChildren().forEach((child) => {
            const obj = child as Phaser.GameObjects.Sprite;
            const droneBody = obj.body as Phaser.Physics.Arcade.Body | undefined;
            if (!droneBody) return;
            if (obj.x < 120 || obj.x > 850) droneBody.setVelocityX((droneBody.velocity.x || 80) * -1);
            obj.setFlipX(this.player.x < obj.x);
            obj.y += Math.sin(this.time.now / 250) * 0.45;
            if (this.time.now > Number(obj.getData("nextShot") ?? 0)) {
              obj.setData("nextShot", this.time.now + Phaser.Math.Between(1500, 2500));
              obj.play("cyber-drone-shoot", true);
              this.fireEnemyBolt(obj, 205);
              this.time.delayedCall(360, () => {
                if (obj.active) obj.play("cyber-drone-fly", true);
              });
            }
          });

          this.projectiles.getChildren().forEach((child) => {
            const obj = child as Phaser.GameObjects.Sprite;
            if (obj.x < -40 || obj.x > 1000) obj.destroy();
          });
          this.enemyProjectiles.getChildren().forEach((child) => {
            const obj = child as Phaser.GameObjects.Sprite;
            if (obj.x < -60 || obj.x > 1020 || obj.y < -60 || obj.y > 620) obj.destroy();
          });

          this.energy = Math.min(100, this.energy + 0.035);
          if (this.player.y > 545) this.damage("Fell into the shadows");
          this.updateHud();
        }

        firePlasmaBolt() {
          if (this.time.now < this.weaponCooldownUntil) return;
          this.weaponCooldownUntil = this.time.now + 260;
          this.attackUntil = this.time.now + 220;
          const shotDirection = this.getPlasmaDirection();
          this.facing = shotDirection;
          this.player.setFlipX(shotDirection < 0);
          this.player.play("oliver-attack", true);
          const projectile = this.physics.add.sprite(this.player.x + shotDirection * 42, this.player.y + 4, "plasma-bolt").setDisplaySize(58, 22);
          projectile.setFlipX(shotDirection < 0);
          projectile.setDepth(4);
          projectile.body.allowGravity = false;
          projectile.body.setVelocityX(shotDirection * 650);
          projectile.body.setVelocityY(0);
          projectile.body.setSize(52, 16);
          this.projectiles.add(projectile);
          this.tweens.add({ targets: projectile, alpha: 0.72, duration: 70, yoyo: true, repeat: 6 });
          this.time.delayedCall(900, () => projectile.destroy());
        }

        getPlasmaDirection() {
          const candidates = this.enemies
            .getChildren()
            .map((child) => child as Phaser.GameObjects.Sprite)
            .filter((enemy) => enemy.active && Math.abs(enemy.y - this.player.y) < 190)
            .sort((a, b) => Math.abs(a.x - this.player.x) - Math.abs(b.x - this.player.x));
          const nearest = candidates[0];
          if (nearest && Math.abs(nearest.x - this.player.x) > 18) return nearest.x > this.player.x ? 1 : -1;
          return this.facing || 1;
        }

        castShockwave() {
          if (this.time.now < this.specialCooldownUntil || this.energy < 38) {
            this.flashMessage(this.energy < 38 ? "Need more energy" : "Power recharging");
            return;
          }
          this.energy -= 38;
          this.specialCooldownUntil = this.time.now + 1800;
          this.attackUntil = this.time.now + 420;
          this.player.play("oliver-special", true);
          const wave = this.add.circle(this.player.x, this.player.y, 26, 0x74f7ff, 0.18).setStrokeStyle(3, 0x7c3aed, 0.95).setDepth(3);
          this.tweens.add({ targets: wave, scale: 7, alpha: 0, duration: 420, ease: "Cubic.easeOut", onComplete: () => wave.destroy() });
          this.cameras.main.shake(120, 0.006);
          this.enemies.getChildren().forEach((child) => {
            const enemy = child as Phaser.GameObjects.Sprite;
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
            if (distance > 205) return;
            this.spawnSpark(enemy.x, enemy.y, 0xffb000);
            if (enemy.getData("type") === "boss") {
              const hp = Number(enemy.getData("hp") ?? 10) - 3;
              enemy.setData("hp", hp);
              enemy.setTint(0xff8cff);
              this.time.delayedCall(140, () => enemy.clearTint());
              if (hp <= 0) {
                enemy.destroy();
                this.updateBossHud();
                this.score += 250;
              } else {
                this.score += 40;
                this.updateBossHud();
              }
              return;
            }
            enemy.destroy();
            this.score += 35;
          });
          this.flashMessage("Shadow pulse unleashed");
        }

        hitEnemyWithProjectile(projectile: Phaser.GameObjects.GameObject, enemy: Phaser.GameObjects.GameObject) {
          const target = enemy as Phaser.GameObjects.Sprite;
          this.spawnSpark(target.x, target.y, 0xffb000);
          projectile.destroy();
          const hp = Number(target.getData("hp") ?? 1) - 1;
          target.setData("hp", hp);
          target.setTint(0xffffff);
          this.time.delayedCall(90, () => target.clearTint());
          if (target.getData("type") === "boss") {
            target.play(hp > 4 ? "ai-core-idle" : "ai-core-laser", true);
            this.flashMessage(`AI Core integrity ${Math.max(0, hp)}/10`);
            this.updateBossHud();
          }
          if (hp <= 0) {
            enemy.destroy();
            if (target.getData("type") === "boss") {
              this.flashMessage("AI Core shield broken");
              this.updateBossHud();
            }
            this.score += target.getData("type") === "boss" ? 250 : 25;
          } else {
            this.score += 8;
          }
          this.energy = Math.min(100, this.energy + 7);
        }

        spawnSpark(x: number, y: number, tint: number) {
          const spark = this.add.sprite(x, y, "impact-spark").setTint(tint).setDisplaySize(34, 34).setDepth(5);
          this.tweens.add({ targets: spark, scale: 1.8, alpha: 0, duration: 260, ease: "Quad.easeOut", onComplete: () => spark.destroy() });
        }

        flashMessage(text: string) {
          this.messageText?.setText(text);
          this.time.delayedCall(900, () => {
            if (this.messageText?.text === text) this.messageText.setText("");
          });
        }

        handleEnemy(enemy: Phaser.GameObjects.GameObject) {
          if (this.attackUntil > this.time.now) {
            const target = enemy as Phaser.GameObjects.Sprite;
            const hp = Number(target.getData("hp") ?? 1) - 1;
            target.setData("hp", hp);
            this.spawnSpark(target.x, target.y, 0x74f7ff);
            if (hp <= 0) {
              enemy.destroy();
              if (target.getData("type") === "boss") this.updateBossHud();
              this.score += 25;
            }
            return;
          }
          this.damage("Enemy hit");
        }

        damage(reason: string) {
          if (this.invulnerableUntil > this.time.now) return;
          this.hp -= 1;
          this.invulnerableUntil = this.time.now + 1100;
          this.messageText.setText(reason);
          this.player.play("oliver-hurt", true);
          this.player.setTint(0xff3b6b);
          this.time.delayedCall(260, () => this.player.clearTint());
          if (this.hp <= 0) {
            this.hp = 3;
            this.score = Math.max(0, this.score - 30);
            this.createLevel(this.levelIndex);
          } else {
            this.player.setPosition(70, 450);
            this.player.body.setVelocity(0, 0);
          }
        }

        nextLevel() {
          if (this.levelIndex >= levels.length - 1) {
            this.messageText.setText("AI CORE OFFLINE · Shadow Lab complete!");
            this.score += 100;
            this.createLevel(0);
            return;
          }
          this.score += 50;
          this.createLevel(this.levelIndex + 1);
        }

        updateHud() {
          const energyBlocks = Math.round(this.energy / 20);
          const powerReady = this.energy >= 38 && this.time.now >= this.specialCooldownUntil ? "READY" : "CHARGE";
          this.hudText?.setText(`HP ${"■".repeat(this.hp)}${"□".repeat(3 - this.hp)} · EN ${"◆".repeat(energyBlocks)}${"◇".repeat(5 - energyBlocks)} · XP ${this.score} · J plasma · K power ${powerReady}`);
          this.updateBossHud();
        }

        updatePlayerAnimation(left: boolean, right: boolean) {
          if (this.attackUntil > this.time.now) return;
          if (this.invulnerableUntil > this.time.now && this.player.anims.currentAnim?.key === "oliver-hurt") return;
          if (!this.player.body.blocked.down) {
            if (this.player.anims.currentAnim?.key !== "oliver-jump") this.player.play("oliver-jump", true);
            return;
          }
          if (left || right) {
            this.player.play("oliver-run", true);
            return;
          }
          this.player.play("oliver-idle", true);
        }
      }

      const game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: hostRef.current,
        width: 960,
        height: 560,
        backgroundColor: "#020403",
        physics: {
          default: "arcade",
          arcade: {
            gravity: { x: 0, y: 900 },
            debug: false,
          },
        },
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        scene: ShadowLabScene,
      });

      gameRef.current = game;
      setRunning(true);
    }

    void boot();

    return () => {
      mounted = false;
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  useEffect(() => {
    const activate = () => setGameMode(true);
    window.addEventListener("oliver-shadow-lab:launch", activate);
    return () => window.removeEventListener("oliver-shadow-lab:launch", activate);
  }, []);

  const togglePause = () => {
    const scene = gameRef.current?.scene.getScene("shadow-lab") as { scene?: { isPaused: () => boolean; pause: () => void; resume: () => void } } | undefined;
    if (!scene?.scene) return;
    if (scene.scene.isPaused()) {
      scene.scene.resume();
      setRunning(true);
    } else {
      scene.scene.pause();
      setRunning(false);
    }
  };

  const restart = () => {
    gameRef.current?.destroy(true);
    gameRef.current = null;
    setRunning(false);
    window.setTimeout(() => window.location.reload(), 50);
  };

  const enterGameMode = async () => {
    const shell = document.getElementById("oliver-shadow-lab-shell");
    setGameMode(true);
    try {
      if (shell && !document.fullscreenElement) await shell.requestFullscreen();
      const orientation = screen.orientation as ScreenOrientation & { lock?: (orientation: "landscape") => Promise<void> };
      await orientation.lock?.("landscape").catch(() => undefined);
    } catch {
      // Fullscreen and orientation lock depend on browser support and user gesture timing.
    }
    window.dispatchEvent(new Event("resize"));
  };

  const exitGameMode = async () => {
    setGameMode(false);
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      await screen.orientation.unlock?.();
    } catch {
      // Browser support varies; leaving game mode still restores the page layout.
    }
    window.dispatchEvent(new Event("resize"));
  };

  const pressVirtualKey = (code: string, type: "keydown" | "keyup") => {
    const keyMap: Record<string, string> = {
      ArrowLeft: "ArrowLeft",
      ArrowRight: "ArrowRight",
      KeyJ: "j",
      KeyK: "k",
      Space: " ",
    };
    const event = new KeyboardEvent(type, { code, key: keyMap[code] ?? code, bubbles: true });
    window.dispatchEvent(event);
    document.dispatchEvent(event);
  };

  const mobileControls = [
    { label: "Left", key: "◀", code: "ArrowLeft", icon: ArrowLeft, help: "Move" },
    { label: "Right", key: "▶", code: "ArrowRight", icon: ArrowRight, help: "Move" },
    { label: "Jump", key: "␣", code: "Space", icon: ArrowUp, help: "Double" },
    { label: "Plasma", key: "J", code: "KeyJ", icon: Crosshair, help: "Shoot" },
    { label: "Power", key: "K", code: "KeyK", icon: Zap, help: "Pulse" },
  ];

  const desktopControls = [
    { action: "Move", keys: "A/D or ←/→" },
    { action: "Jump", keys: "W or Space" },
    { action: "Plasma", keys: "J" },
    { action: "Power", keys: "K" },
    { action: "Next test level", keys: "N" },
    { action: "Restart", keys: "R" },
  ];

  return (
    <div className={`terminal-panel shadow-lab-shell relative overflow-hidden ${gameMode ? "shadow-lab-playing" : ""}`} id="oliver-shadow-lab-shell">
      <div className="game-chrome flex flex-wrap items-center justify-between gap-3 border-b border-primary/15 bg-black/30 p-3">
        <div>
          <div className="font-mono text-sm uppercase tracking-[0.16em] text-primary">Oliver Te runtime // Phaser 3</div>
          <div className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground">Mission controls armed · Plasma online · Shadow pulse requires energy</div>
        </div>
        <div className="flex gap-2">
          <button className="lab-button h-9 px-3" onClick={togglePause} type="button">
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {running ? "Pause" : "Resume"}
          </button>
          <button className="lab-button h-9 px-3" onClick={restart} type="button">
            <RotateCcw className="h-4 w-4" />
            Restart
          </button>
          <button className="lab-button h-9 px-3" onClick={enterGameMode} type="button">
            <Maximize2 className="h-4 w-4" />
            <span className="sr-only">Fullscreen</span>
          </button>
        </div>
      </div>
      <div className="shadow-lab-stage relative bg-black">
        <div ref={hostRef} className="shadow-lab-canvas-host min-h-[320px] bg-black" />
        {gameMode ? (
          <button
            aria-label="Exit game mode"
            className="mobile-game-exit absolute right-3 top-3 z-30 grid h-10 w-10 place-items-center border border-white/25 bg-black/55 text-white shadow-[0_0_22px_rgba(0,0,0,0.35)] backdrop-blur transition hover:border-primary hover:text-primary"
            onClick={exitGameMode}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        ) : null}
        <div className="mobile-gamepad pointer-events-none absolute inset-x-0 bottom-0 z-20 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <div className="pointer-events-auto grid grid-cols-[1fr_auto_1fr] items-end gap-3">
            <div className="grid max-w-36 grid-cols-2 gap-2">
              {mobileControls.slice(0, 2).map(({ label, key, code, icon: Icon, help }) => (
              <button
                aria-label={`${label} control`}
                className="group grid h-16 place-items-center border border-primary/35 bg-black/60 font-mono text-[0.58rem] uppercase tracking-[0.08em] text-white shadow-[0_0_24px_rgba(0,255,102,0.12),inset_0_0_18px_rgba(0,255,102,0.08)] backdrop-blur transition active:scale-[0.94] active:bg-primary/25"
                key={label}
                onPointerDown={() => pressVirtualKey(code, "keydown")}
                onPointerCancel={() => pressVirtualKey(code, "keyup")}
                onPointerLeave={() => pressVirtualKey(code, "keyup")}
                onPointerUp={() => pressVirtualKey(code, "keyup")}
                type="button"
              >
                <Icon className="h-5 w-5 text-primary group-active:text-white" />
                <span>{label}</span>
                <span className="text-[0.52rem] text-muted-foreground">{help} · {key}</span>
              </button>
              ))}
            </div>
            <div className="mb-1 hidden border border-primary/20 bg-black/55 px-3 py-1 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-primary shadow-[0_0_20px_rgba(0,255,102,0.14)] backdrop-blur min-[520px]:block">
              Touch controls
            </div>
            <div className="ml-auto grid max-w-52 grid-cols-3 gap-2">
              {mobileControls.slice(2).map(({ label, key, code, icon: Icon, help }) => (
              <button
                aria-label={`${label} control`}
                className="group grid h-16 place-items-center border border-cyan-300/35 bg-black/60 font-mono text-[0.56rem] uppercase tracking-[0.08em] text-white shadow-[0_0_24px_rgba(51,204,255,0.12),inset_0_0_18px_rgba(51,204,255,0.08)] backdrop-blur transition active:scale-[0.94] active:bg-cyan-300/20"
                key={label}
                onPointerDown={() => pressVirtualKey(code, "keydown")}
                onPointerCancel={() => pressVirtualKey(code, "keyup")}
                onPointerLeave={() => pressVirtualKey(code, "keyup")}
                onPointerUp={() => pressVirtualKey(code, "keyup")}
                type="button"
              >
                <Icon className="h-5 w-5 text-cyan-200 group-active:text-white" />
                <span>{label}</span>
                <span className="text-[0.52rem] text-muted-foreground">{help} · {key}</span>
              </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="hidden border-t border-primary/15 bg-black/35 p-3 md:block">
        <div className="mb-3 flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground">
          <Keyboard className="h-3.5 w-3.5 text-primary" />
          Desktop controls
        </div>
        <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-6">
          {desktopControls.map((control) => (
            <div className="flex items-center justify-between gap-3 border border-primary/10 bg-black/35 px-3 py-2 font-mono" key={control.action}>
              <span className="uppercase tracking-[0.12em] text-white">{control.action}</span>
              <kbd className="border border-primary/25 bg-primary/10 px-2 py-1 text-[0.68rem] text-primary">{control.keys}</kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
