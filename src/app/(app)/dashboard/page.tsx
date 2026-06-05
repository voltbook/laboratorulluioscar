import Image from "next/image";
import Link from "next/link";
import { Activity, Code2, Cpu, FlaskConical, Gamepad2, Star, Trophy, Zap } from "lucide-react";
import { GameCard, ProjectGeneratorCard } from "@/components/lab-platform";
import { demoProjects, getTrendingProjects } from "@/lib/demo-data";
import { ProjectCard } from "@/components/project-card";

const progress = [
  { label: "Lab level", value: "02", icon: Trophy },
  { label: "Missions unlocked", value: "8", icon: Gamepad2 },
  { label: "Projects generated", value: "3", icon: Cpu },
  { label: "XP collected", value: "1,240", icon: Zap },
];

export default function DashboardPage() {
  const trending = getTrendingProjects().slice(0, 4);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex items-center gap-4">
          <Image src="/brand/oscar-laboratory-logo.png" alt="Oscar's Laboratory logo" width={82} height={82} className="h-16 w-16 object-contain" />
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.25em] text-primary">Control room</p>
            <h1 className="font-mono text-3xl text-white">Welcome to Oscar&apos;s Laboratory</h1>
          </div>
        </div>
        <Link href="/generator" className="lab-button lab-button-primary">
          Enter Lab
          <Activity className="h-4 w-4" />
        </Link>
      </div>

      <section className="mb-8">
        <h2 className="mb-4 font-mono text-2xl text-white">Continue Playing</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <GameCard title="Oliver Te: Shadow Lab" icon={Gamepad2} href="/games/oliver-te-shadow-lab" status="Playable" description="Run through the first Oscar's Laboratory platformer and stop the AI Core." />
          <GameCard title="Project Generator" icon={FlaskConical} href="/generator" status="Active" description="Continue your DIY build mission and generate the next lab blueprint." />
          <GameCard title="Code Quest" icon={Code2} href="/dashboard" status="Soon" description="Practice programming through short terminal-style challenges." />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 font-mono text-2xl text-white">AI Project Generator</h2>
        <ProjectGeneratorCard />
      </section>

      <section className="mb-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="terminal-panel p-5">
          <h2 className="font-mono text-2xl text-white">My Progress</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {progress.map((item) => (
              <div className="border border-primary/15 bg-black/35 p-4" key={item.label}>
                <item.icon className="mb-4 h-5 w-5 text-primary" />
                <p className="font-mono text-2xl text-white">{item.value}</p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="terminal-panel p-5">
          <h2 className="font-mono text-2xl text-white">Latest Experiments</h2>
          <div className="mt-5 space-y-3">
            {["Generated a Wall-E robot mission", "Unlocked Circuit Master preview", "Exported a Project Generator PDF", "Starred a community robotics build"].map((item) => (
              <div className="flex items-center gap-3 border border-primary/15 p-3 text-sm text-muted-foreground" key={item}>
                <span className="h-2 w-2 bg-primary" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-mono text-2xl text-white">Community Trending</h2>
          <Link href="/community" className="lab-button">
            Community
            <Star className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {trending.map((project) => <ProjectCard key={project.id} project={project} compact />)}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-mono text-2xl text-white">My Projects</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {demoProjects.slice(0, 3).map((project) => <ProjectCard key={project.id} project={project} />)}
        </div>
      </section>
    </main>
  );
}
