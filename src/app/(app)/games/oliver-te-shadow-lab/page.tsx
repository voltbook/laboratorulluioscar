import Image from "next/image";
import { Bot, CheckCircle2, Gamepad2, MessageSquare, Star, Trophy, Zap } from "lucide-react";
import { OliverShadowLabGame } from "@/components/oliver-shadow-lab-game";

const levels = [
  ["Level 1 — Laboratory Escape", "Tutorial jumps, small robots and energy doors."],
  ["Level 2 — Dark City", "Rooftops, drones and moving platform routes."],
  ["Level 3 — Underground Tunnels", "Traps, laser beams and spider bots."],
  ["Level 4 — Factory of Shadows", "Conveyors, robotic arms and a mini boss."],
  ["Level 5 — Central Tower", "Final AI Core boss encounter."],
];

const achievements = [
  "Escape the Laboratory",
  "Collect 25 Energy Orbs",
  "Drone Dodger",
  "Factory Survivor",
  "AI Core Shutdown",
  "No Damage Run",
];

const leaderboard = [
  ["oscar_lab", "12,450"],
  ["neon_maker", "9,880"],
  ["byte_runner", "8,610"],
  ["shadow_dev", "7,430"],
];

export default function OliverShadowLabPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="terminal-panel overflow-hidden">
          <Image src="/games/oliver-te-shadow-lab/cover-art.png" alt="Oliver Te: Shadow Lab cover art" width={1024} height={1024} className="aspect-square w-full object-cover" priority />
        </div>
        <div>
          <div className="mb-4 inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-3 py-2 font-mono text-xs uppercase tracking-[0.2em] text-primary">
            <Gamepad2 className="h-4 w-4" />
            First playable game
          </div>
          <h1 className="font-mono text-4xl uppercase tracking-[0.12em] text-white md:text-6xl">Oliver Te: Shadow Lab</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Oliver accidentally enters a secret laboratory where AI experiments have escaped control. Cross the dark city, underground tunnels, shadow factory and central tower to stop the AI Core.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Retro platformer", "Phaser 3", "Educational action", "AI laboratory", "5 levels"].map((tag) => <span className="lab-badge" key={tag}>{tag}</span>)}
          </div>
          <a className="lab-button lab-button-primary mt-8" href="#play">
            <Zap className="h-4 w-4" />
            Play Button
          </a>
        </div>
      </section>

      <section id="play" className="mt-8">
        <OliverShadowLabGame />
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="terminal-panel p-5">
          <h2 className="mb-4 font-mono text-2xl text-white">Level Plan</h2>
          <div className="space-y-3">
            {levels.map(([title, description]) => (
              <div className="border border-primary/15 p-4" key={title}>
                <p className="font-mono text-white">{title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="terminal-panel p-5">
          <h2 className="mb-4 font-mono text-2xl text-white">Asset Roadmap</h2>
          <div className="grid gap-2 text-sm text-muted-foreground">
            {["Player animations: idle, run, jump, attack, hurt, death, victory", "Enemies: Shadow Imp, Cyber Drone, Spider Bot, Shadow Brute", "Boss: AI Core Guardian", "Collectibles: Energy Orb, Blue Crystal, Lab Badge, XP Chip", "UI: health, energy, pause, level complete, game over"].map((item) => (
              <p className="flex gap-2" key={item}><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {item}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 font-mono text-2xl text-white">Screenshots</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Image src="/games/oliver-te-shadow-lab/oliver-character-sheet.png" alt="Oliver Te sprite and animation reference" width={1536} height={864} className="border border-primary/15 object-cover" />
          <Image src="/games/oliver-te-shadow-lab/cover-art.png" alt="Oliver Te cover screenshot" width={1024} height={1024} className="border border-primary/15 object-cover" />
        </div>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-3">
        <div className="terminal-panel p-5">
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl text-white"><Trophy className="h-5 w-5 text-primary" /> Achievements</h2>
          <div className="space-y-2">{achievements.map((item) => <p className="lab-badge w-full justify-start" key={item}>{item}</p>)}</div>
        </div>
        <div className="terminal-panel p-5">
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl text-white"><Bot className="h-5 w-5 text-primary" /> Leaderboard</h2>
          <div className="space-y-3">
            {leaderboard.map(([name, score], index) => (
              <div className="grid grid-cols-[auto_1fr_auto] gap-3 border border-primary/15 p-3 font-mono text-sm" key={name}>
                <span className="text-primary">#{index + 1}</span><span className="text-white">{name}</span><span className="text-muted-foreground">{score}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="terminal-panel p-5">
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl text-white"><MessageSquare className="h-5 w-5 text-primary" /> Comments & Ratings</h2>
          <div className="mb-4 flex gap-1 text-yellow-300">{Array.from({ length: 5 }).map((_, index) => <Star className="h-5 w-5 fill-yellow-300" key={index} />)}</div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="border border-primary/15 p-3">“Great first game for Oscar&apos;s Laboratory. The lab vibe fits perfectly.”</p>
            <p className="border border-primary/15 p-3">“Needs mobile touch controls next, but the browser prototype is already fun.”</p>
          </div>
        </div>
      </section>
    </main>
  );
}
