import { Beaker, Bot, BrainCircuit, Code2, Cpu, FlaskConical, Gamepad2, Lightbulb, Rocket, Sparkles, Zap } from "lucide-react";
import { CommunityPreview, FeatureCard, GameCard, LabHero, NeonButton, ProjectGeneratorCard } from "@/components/lab-platform";
import { getTrendingProjects } from "@/lib/demo-data";

const features = [
  { title: "AI Project Generator", icon: Sparkles, description: "Turn an idea into a complete playable build mission with parts, wiring, 3D, code and PDF." },
  { title: "Educational Games", icon: Gamepad2, description: "Learn science and technology through interactive lab games, missions and levels." },
  { title: "Coding Challenges", icon: Code2, description: "Practice logic, Arduino, ESP32, robotics control and creative programming tasks." },
  { title: "Science Experiments", icon: FlaskConical, description: "Explore physics, chemistry-inspired simulations, measurements and safe experiments." },
  { title: "Robotics & Electronics", icon: Bot, description: "Build circuits, robots, sensors, controllers and engineering prototypes." },
  { title: "Creative Entertainment", icon: Lightbulb, description: "Mix learning with playful inventions, AI experiments and maker challenges." },
];

const games = [
  {
    title: "Oliver Te: Shadow Lab",
    icon: Gamepad2,
    status: "Playable",
    href: "/games/oliver-te-shadow-lab",
    description: "A retro 2D platformer where Oliver escapes a rogue AI laboratory through five shadow levels.",
  },
  {
    title: "Code Quest",
    icon: Code2,
    status: "Soon",
    href: "/dashboard",
    description: "Solve coding puzzles, unlock lab rooms and learn programming by completing missions.",
  },
  {
    title: "Robot Builder",
    icon: Bot,
    status: "Prototype",
    href: "/dashboard",
    description: "Assemble virtual robots, choose sensors and test behavior in a simulated arena.",
  },
  {
    title: "Circuit Master",
    icon: Zap,
    status: "Soon",
    href: "/dashboard",
    description: "Connect components, debug wiring and learn electronics through interactive challenges.",
  },
  {
    title: "Science Lab",
    icon: Beaker,
    status: "Soon",
    href: "/dashboard",
    description: "Run safe science simulations, collect observations and unlock experiment cards.",
  },
  {
    title: "AI Challenge Arena",
    icon: BrainCircuit,
    status: "Soon",
    href: "/dashboard",
    description: "Compete with AI prompts, logic tasks, creative builds and engineering constraints.",
  },
];

export default function Home() {
  const featured = getTrendingProjects();

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <LabHero />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="font-mono text-sm uppercase tracking-[0.25em] text-primary">Platform modules</p>
          <h2 className="mt-2 font-mono text-3xl text-white">A laboratory for games, making and AI-powered learning</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => <FeatureCard key={feature.title} {...feature} />)}
        </div>
      </section>

      <section className="border-y border-primary/15 bg-black/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.25em] text-primary">What is Oscar&apos;s Laboratory?</p>
            <h2 className="mt-3 font-mono text-3xl text-white">Educational entertainment for curious builders</h2>
          </div>
          <p className="text-lg leading-8 text-muted-foreground">
            Oscar&apos;s Laboratory is an educational entertainment platform where users can learn by playing, generate complete DIY projects, follow interactive missions, collect progress, unlock levels, and explore AI-powered experiments.
          </p>
        </div>
      </section>

      <section id="games" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.25em] text-primary">Laboratory Games</p>
            <h2 className="mt-2 font-mono text-3xl text-white">Choose your experiment mode</h2>
          </div>
          <NeonButton href="/generator" variant="secondary">
            Start your first experiment
            <Rocket className="h-4 w-4" />
          </NeonButton>
        </div>
        <div className="mb-5">
          <ProjectGeneratorCard />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {games.map((game) => <GameCard key={game.title} {...game} />)}
        </div>
      </section>

      <CommunityPreview projects={featured} />

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="terminal-panel grid gap-6 p-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.25em] text-primary">Final CTA</p>
            <h2 className="mt-2 font-mono text-3xl text-white">Start your first experiment.</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">Enter the lab, pick a game, generate a build mission, or explore what the community is creating.</p>
          </div>
          <NeonButton href="/dashboard">
            Enter Lab
            <Cpu className="h-4 w-4" />
          </NeonButton>
        </div>
      </section>
    </main>
  );
}
