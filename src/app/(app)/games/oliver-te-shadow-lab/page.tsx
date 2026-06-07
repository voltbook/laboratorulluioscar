import Image from "next/image";
import { Bot, CheckCircle2, MessageSquare, Star, Trophy } from "lucide-react";
import { OliverShadowLabGame } from "@/components/oliver-shadow-lab-game";
import { OliverShadowLabPlayButton } from "@/components/oliver-shadow-lab-play-button";

const levels = [
  ["Maps 1-5 — Laboratory Sector", "Tutorial flow, energy orbs, first guardian boss."],
  ["Maps 6-15 — Neon City Sector", "More drones, tighter jumps, faster enemy fire."],
  ["Maps 16-30 — Tunnel & Factory Sector", "Lasers, spider bots, brutes and denser routes."],
  ["Maps 31-45 — Central Tower Sector", "Heavy patrols, stacked hazards and stronger guardians."],
  ["Map 50 — World 1 Core Finale", "Final AI Core Overlord encounter before the next world."],
];

const achievements = [
  "Escape the Laboratory",
  "Collect 25 Energy Orbs",
  "Drone Dodger",
  "Factory Survivor",
  "AI Core Shutdown",
  "World 1 Clear",
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
          <Image src="/games/oliver-te/marketing/cover-wide.png" alt="Oliver Te: Shadow Lab cover art" width={1920} height={1080} className="aspect-video w-full object-cover" priority />
        </div>
        <div>
          <div className="mb-4 inline-flex items-center gap-3 border border-primary/30 bg-primary/10 px-3 py-2 font-mono text-xs uppercase tracking-[0.2em] text-primary">
            <Image src="/games/oliver-te/marketing/game-icon.png" alt="" width={32} height={32} className="h-8 w-8 rounded border border-primary/25 object-cover" />
            First playable game
          </div>
          <h1 className="font-mono text-4xl uppercase tracking-[0.12em] text-white md:text-6xl">Oliver Te: Shadow Lab</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Oliver accidentally enters a secret laboratory where AI experiments have escaped control. Cross 50 escalating maps, defeat a guardian every 5 maps, and shut down the World 1 Core.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Retro platformer", "Phaser 3", "Educational action", "50 maps", "Boss every 5 maps"].map((tag) => <span className="lab-badge" key={tag}>{tag}</span>)}
          </div>
          <OliverShadowLabPlayButton />
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
            {["Player animations: idle, run, jump, attack, hurt, death, victory", "Enemies: Shadow Imp, Cyber Drone, Spider Bot, Shadow Brute", "Boss: AI Core Guardian + World 1 Core Finale", "Procedural SFX: plasma, impact, pickup, damage, clear", "UI/VFX: health, energy, pause, level complete, hit sparks"].map((item) => (
              <p className="flex gap-2" key={item}><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {item}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 font-mono text-2xl text-white">Screenshots</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Image src="/games/oliver-te/marketing/screenshots/screenshot-level-01.png" alt="Oliver Te level 1 gameplay preview" width={1920} height={1080} className="aspect-video border border-primary/15 object-cover" />
          <Image src="/games/oliver-te/marketing/screenshots/screenshot-boss-fight.png" alt="Oliver Te boss fight gameplay preview" width={1920} height={1080} className="aspect-video border border-primary/15 object-cover" />
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
