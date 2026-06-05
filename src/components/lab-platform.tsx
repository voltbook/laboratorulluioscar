import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Cpu, FlaskConical, Gamepad2, Star, Trophy } from "lucide-react";
import { MatrixRain } from "@/components/matrix-rain";
import { ProjectCard } from "@/components/project-card";
import type { LabProject } from "@/lib/types";

export function MatrixBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <MatrixRain />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,102,0.18),transparent_36%),linear-gradient(180deg,rgba(0,0,0,0.2),rgba(2,4,3,0.96))]" />
    </div>
  );
}

export function NeonButton({
  children,
  href,
  variant = "primary",
}: {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "secondary";
}) {
  return (
    <Link className={`lab-button ${variant === "primary" ? "lab-button-primary" : ""}`} href={href}>
      {children}
    </Link>
  );
}

export function LabHero() {
  return (
    <section className="relative isolate flex min-h-[88vh] items-center overflow-hidden border-b border-primary/20 px-4 py-24 sm:px-6 lg:px-8">
      <MatrixBackground />
      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1fr_0.78fr] lg:items-center">
        <div className="max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 border border-primary/40 bg-primary/10 px-3 py-2 font-mono text-xs uppercase tracking-[0.28em] text-primary shadow-[0_0_28px_rgba(0,255,102,0.16)]">
            <FlaskConical className="h-4 w-4" />
            Futuristic AI laboratory online
          </div>
          <h1 className="font-mono text-5xl font-semibold leading-tight text-white sm:text-7xl lg:text-8xl">Oscar&apos;s Laboratory</h1>
          <p className="mt-5 font-mono text-2xl uppercase tracking-[0.16em] text-primary">Play. Build. Learn. Create.</p>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            Enter a futuristic AI laboratory where games, learning, coding, electronics, robotics, science, and creative projects become interactive experiences.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <NeonButton href="/dashboard">
              Enter the Laboratory
              <ArrowRight className="h-4 w-4" />
            </NeonButton>
            <NeonButton href="#games" variant="secondary">
              Explore Games
              <Gamepad2 className="h-4 w-4" />
            </NeonButton>
          </div>
        </div>
        <div className="terminal-panel relative overflow-hidden p-4">
          <Image
            src="/brand/oscar-laboratory-logo.png"
            alt="Oscar's Laboratory logo"
            width={900}
            height={900}
            className="mx-auto aspect-square w-full max-w-md object-contain drop-shadow-[0_0_38px_rgba(0,255,102,0.32)]"
            priority
          />
        </div>
      </div>
    </section>
  );
}

export function FeatureCard({ description, icon: Icon, title }: { description: string; icon: LucideIcon; title: string }) {
  return (
    <article className="terminal-panel p-5">
      <Icon className="mb-5 h-7 w-7 text-primary" />
      <h3 className="font-mono text-xl text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
    </article>
  );
}

export function GameCard({
  description,
  href = "/dashboard",
  icon: Icon,
  status = "Preview",
  title,
}: {
  description: string;
  href?: string;
  icon: LucideIcon;
  status?: string;
  title: string;
}) {
  return (
    <Link href={href} className="group block border border-primary/15 bg-[#080c09] p-5 transition hover:-translate-y-1 hover:border-primary/70 hover:bg-primary/5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <Icon className="h-7 w-7 text-primary" />
        <span className="lab-badge">{status}</span>
      </div>
      <h3 className="font-mono text-xl text-white">{title}</h3>
      <p className="mt-3 min-h-16 text-sm leading-6 text-muted-foreground">{description}</p>
      <div className="mt-5 flex items-center gap-2 font-mono text-xs uppercase text-primary opacity-70 transition group-hover:opacity-100">
        Launch module
        <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}

export function ProjectGeneratorCard() {
  return (
    <Link href="/generator" className="group terminal-panel grid gap-5 overflow-hidden p-5 transition hover:border-primary/70 md:grid-cols-[180px_1fr]">
      <Image src="/brand/project-generator-icon.png" alt="Project Generator icon" width={360} height={360} className="aspect-square w-full max-w-44 object-contain" />
      <div>
        <div className="mb-3 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-primary">
          <Cpu className="h-4 w-4" />
          Main game/tool
        </div>
        <h3 className="font-mono text-2xl text-white">Project Generator</h3>
        <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
          Generate complete DIY projects with parts, wiring, 3D preview, instructions, code, and PDF export.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {["Parts", "Wiring", "3D", "Instructions", "Code", "PDF"].map((item) => <span className="lab-badge" key={item}>{item}</span>)}
        </div>
      </div>
    </Link>
  );
}

export function CommunityPreview({ projects }: { projects: LabProject[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.25em] text-primary">Community</p>
          <h2 className="mt-2 font-mono text-3xl text-white">Public projects, stars, votes and trending creations</h2>
        </div>
        <NeonButton href="/community" variant="secondary">
          View Community
          <Star className="h-4 w-4" />
        </NeonButton>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
        {projects.slice(0, 6).map((project) => <ProjectCard key={project.id} project={project} compact />)}
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {[
          ["Stars", projects.reduce((sum, project) => sum + project.stars, 0)],
          ["Votes", projects.reduce((sum, project) => sum + project.votes, 0)],
          ["Trending projects", projects.length],
        ].map(([label, value]) => (
          <div className="terminal-panel p-4" key={label}>
            <Trophy className="mb-3 h-5 w-5 text-primary" />
            <div className="font-mono text-2xl text-white">{value}</div>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
