"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize2, Pause, Play, RotateCcw } from "lucide-react";

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

export function OliverShadowLabGame() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<{ destroy: (removeCanvas: boolean, noReturn?: boolean) => void; scene: { getScene: (key: string) => unknown } } | null>(null);
  const [running, setRunning] = useState(false);

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
        lasers!: Phaser.Physics.Arcade.StaticGroup;
        orbs!: Phaser.Physics.Arcade.StaticGroup;
        goal!: Phaser.GameObjects.Rectangle;
        levelIndex = 0;
        score = 0;
        hp = 3;
        jumps = 0;
        attackUntil = 0;
        invulnerableUntil = 0;
        levelText!: Phaser.GameObjects.Text;
        hudText!: Phaser.GameObjects.Text;
        messageText!: Phaser.GameObjects.Text;

        constructor() {
          super("shadow-lab");
        }

        preload() {
          this.load.image("cover", "/games/oliver-te-shadow-lab/cover-art.png");
        }

        create() {
          this.cursors = this.input.keyboard!.createCursorKeys();
          this.wasd = this.input.keyboard!.addKeys("W,A,S,D,SPACE,J,K,R") as Record<string, Phaser.Input.Keyboard.Key>;
          this.createLevel(0);
          this.input.keyboard!.on("keydown-R", () => this.createLevel(this.levelIndex));
        }

        createLevel(index: number) {
          this.levelIndex = index;
          this.children.removeAll();
          this.physics.world.colliders.destroy();
          this.physics.world.setBounds(0, 0, 960, 560);
          const level = levels[index];

          this.add.rectangle(480, 280, 960, 560, level.theme).setDepth(-10);
          this.add.grid(480, 280, 960, 560, 48, 48, 0x000000, 0, 0x00ff66, 0.12).setDepth(-9);
          this.add.rectangle(480, 36, 900, 48, 0x000000, 0.45).setStrokeStyle(1, 0x00ff66, 0.35);

          this.platforms = this.physics.add.staticGroup();
          level.platforms.forEach(([x, y, w, h]) => {
            const platform = this.add.rectangle(x + w / 2, y + h / 2, w, h, 0x132018).setStrokeStyle(1, 0x00ff66, 0.65);
            this.physics.add.existing(platform, true);
            this.platforms.add(platform);
          });

          this.player = this.physics.add.sprite(70, 450, "");
          this.player.setSize(30, 44).setOffset(-15, -22);
          this.player.setCollideWorldBounds(true);
          this.player.setDragX(650);
          this.player.setMaxVelocity(250, 620);
          this.drawPlayer(0x33ccff);

          this.enemies = this.physics.add.group();
          level.enemies.forEach(([x, y, type]) => this.spawnEnemy(Number(x), Number(y), String(type)));
          this.drones = this.physics.add.group();
          level.drones.forEach(([x, y]) => this.spawnDrone(Number(x), Number(y)));

          this.lasers = this.physics.add.staticGroup();
          level.lasers.forEach(([x, y]) => {
            const beam = this.add.rectangle(Number(x), Number(y), 18, 96, 0xff2d75, 0.7).setStrokeStyle(1, 0xff9bc3, 0.9);
            this.physics.add.existing(beam, true);
            this.lasers.add(beam);
          });

          this.orbs = this.physics.add.staticGroup();
          level.orbs.forEach(([x, y]) => {
            const orb = this.add.circle(Number(x), Number(y), 10, 0x00ff66).setStrokeStyle(2, 0xdcff00);
            this.physics.add.existing(orb, true);
            this.orbs.add(orb);
          });

          if ("boss" in level && level.boss) {
            const [bossX, bossY] = level.boss;
            const boss = this.add.rectangle(Number(bossX), Number(bossY), 82, 82, 0x241044).setStrokeStyle(3, 0xff40ff);
            this.add.text(Number(bossX) - 35, Number(bossY) - 6, "AI CORE", { fontFamily: "monospace", fontSize: "12px", color: "#ffb8ff" });
            this.physics.add.existing(boss);
            this.enemies.add(boss);
          }

          const [gx, gy] = level.goal;
          const goalRect = this.add.rectangle(Number(gx), Number(gy), 42, 64, 0x00ff66, 0.16).setStrokeStyle(2, 0x00ff66);
          this.physics.add.existing(goalRect, true);
          this.goal = goalRect;

          this.levelText = this.add.text(24, 20, level.name, { fontFamily: "monospace", fontSize: "18px", color: "#ffffff" }).setScrollFactor(0);
          this.hudText = this.add.text(24, 48, "", { fontFamily: "monospace", fontSize: "14px", color: "#00ff66" }).setScrollFactor(0);
          this.messageText = this.add.text(480, 96, "Move: A/D or arrows · Jump: W/Space · Attack: J · Restart: R", {
            fontFamily: "monospace",
            fontSize: "13px",
            color: "#9eeeb5",
          }).setOrigin(0.5).setScrollFactor(0);
          this.time.delayedCall(3500, () => this.messageText.setText(""));

          this.physics.add.collider(this.player, this.platforms);
          this.physics.add.collider(this.enemies, this.platforms);
          this.physics.add.overlap(this.player, this.orbs, (_, orb) => {
            (orb as Phaser.GameObjects.GameObject).destroy();
            this.score += 10;
          });
          this.physics.add.overlap(this.player, this.goal, () => this.nextLevel());
          this.physics.add.overlap(this.player, this.enemies, (_, enemy) => this.handleEnemy(enemy as Phaser.GameObjects.GameObject));
          this.physics.add.overlap(this.player, this.lasers, () => this.damage("Laser trap"));
          this.updateHud();
        }

        drawPlayer(color: number) {
          const g = this.add.graphics();
          g.fillStyle(0x070b12, 1).fillRoundedRect(-15, -24, 30, 44, 5);
          g.lineStyle(2, color, 1).strokeRoundedRect(-15, -24, 30, 44, 5);
          g.fillStyle(0x101827, 1).fillCircle(-6, -29, 8).fillCircle(6, -29, 8);
          g.lineStyle(2, 0x6be8ff, 1).strokeTriangle(-8, -14, 8, -14, 0, -2);
          const textureKey = `player-${color}`;
          g.generateTexture(textureKey, 48, 64);
          g.destroy();
          this.player.setTexture(textureKey);
        }

        spawnEnemy(x: number, y: number, type: string) {
          const color = type === "spider" ? 0x9b5cff : type === "brute" ? 0xff6b35 : 0x00ff66;
          const body = this.add.rectangle(x, y, type === "brute" ? 46 : 34, type === "brute" ? 52 : 30, 0x0b0f12).setStrokeStyle(2, color);
          this.physics.add.existing(body);
          const arcadeBody = body.body as Phaser.Physics.Arcade.Body;
          arcadeBody.setCollideWorldBounds(true);
          arcadeBody.setVelocityX(type === "brute" ? -45 : -70);
          (body as Phaser.GameObjects.Rectangle & { enemyType?: string }).enemyType = type;
          this.enemies.add(body);
        }

        spawnDrone(x: number, y: number) {
          const drone = this.add.rectangle(x, y, 42, 20, 0x0b0f12).setStrokeStyle(2, 0x33ccff);
          this.physics.add.existing(drone);
          const body = drone.body as Phaser.Physics.Arcade.Body;
          body.allowGravity = false;
          body.setVelocityX(-80);
          this.drones.add(drone);
          this.enemies.add(drone);
        }

        update() {
          const body = this.player.body;
          const left = this.cursors.left.isDown || this.wasd.A.isDown;
          const right = this.cursors.right.isDown || this.wasd.D.isDown;
          const jumpPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.wasd.W) || Phaser.Input.Keyboard.JustDown(this.wasd.SPACE);

          if (left) body.setAccelerationX(-900);
          else if (right) body.setAccelerationX(900);
          else body.setAccelerationX(0);

          if (body.blocked.down) this.jumps = 0;
          if (jumpPressed && this.jumps < 2) {
            body.setVelocityY(this.jumps === 0 ? -390 : -340);
            this.jumps += 1;
          }

          if (Phaser.Input.Keyboard.JustDown(this.wasd.J) || Phaser.Input.Keyboard.JustDown(this.wasd.K)) {
            this.attackUntil = this.time.now + 260;
            this.drawPlayer(0xffffff);
          }
          if (this.attackUntil && this.time.now > this.attackUntil) {
            this.attackUntil = 0;
            this.drawPlayer(0x33ccff);
          }

          this.enemies.getChildren().forEach((child) => {
            const obj = child as Phaser.GameObjects.Rectangle;
            const enemyBody = obj.body as Phaser.Physics.Arcade.Body | undefined;
            if (!enemyBody) return;
            if (obj.y > 505 || obj.x < 35 || obj.x > 925) enemyBody.setVelocityX((enemyBody.velocity.x || 60) * -1);
          });

          this.drones.getChildren().forEach((child) => {
            const obj = child as Phaser.GameObjects.Rectangle;
            const droneBody = obj.body as Phaser.Physics.Arcade.Body | undefined;
            if (!droneBody) return;
            if (obj.x < 120 || obj.x > 850) droneBody.setVelocityX((droneBody.velocity.x || 80) * -1);
            obj.y += Math.sin(this.time.now / 250) * 0.45;
          });

          if (this.player.y > 545) this.damage("Fell into the shadows");
          this.updateHud();
        }

        handleEnemy(enemy: Phaser.GameObjects.GameObject) {
          if (this.attackUntil > this.time.now) {
            enemy.destroy();
            this.score += 25;
            return;
          }
          this.damage("Enemy hit");
        }

        damage(reason: string) {
          if (this.invulnerableUntil > this.time.now) return;
          this.hp -= 1;
          this.invulnerableUntil = this.time.now + 1100;
          this.messageText.setText(reason);
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
          this.hudText?.setText(`HP ${"■".repeat(this.hp)}${"□".repeat(3 - this.hp)} · XP ${this.score} · Orbs are energy · Attack disables enemies`);
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

  const pressVirtualKey = (code: string, type: "keydown" | "keyup") => {
    window.dispatchEvent(new KeyboardEvent(type, { code, key: code.replace("Arrow", ""), bubbles: true }));
    document.dispatchEvent(new KeyboardEvent(type, { code, key: code.replace("Arrow", ""), bubbles: true }));
  };

  return (
    <div className="terminal-panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary/15 p-3">
        <div className="font-mono text-sm uppercase tracking-[0.16em] text-primary">Oliver Te runtime // Phaser 3</div>
        <div className="flex gap-2">
          <button className="lab-button h-9 px-3" onClick={togglePause} type="button">
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {running ? "Pause" : "Resume"}
          </button>
          <button className="lab-button h-9 px-3" onClick={restart} type="button">
            <RotateCcw className="h-4 w-4" />
            Restart
          </button>
          <button className="lab-button h-9 px-3" onClick={() => hostRef.current?.requestFullscreen()} type="button">
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div ref={hostRef} className="min-h-[320px] bg-black" />
      <div className="grid grid-cols-4 gap-2 border-t border-primary/15 p-3 md:hidden">
        {[
          ["Left", "ArrowLeft"],
          ["Right", "ArrowRight"],
          ["Jump", "Space"],
          ["Attack", "KeyJ"],
        ].map(([label, code]) => (
          <button
            className="lab-button h-12 px-2 text-xs"
            key={label}
            onPointerDown={() => pressVirtualKey(code, "keydown")}
            onPointerLeave={() => pressVirtualKey(code, "keyup")}
            onPointerUp={() => pressVirtualKey(code, "keyup")}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>
      <div className="grid gap-3 border-t border-primary/15 p-3 text-xs text-muted-foreground md:grid-cols-4">
        <span>Desktop: arrows/WASD</span>
        <span>Jump: W / Space</span>
        <span>Attack: J / K</span>
        <span>Restart level: R</span>
      </div>
    </div>
  );
}
