import Link from "next/link";
import { ArrowRight, Cpu, FileDown, FlaskConical, ShieldAlert, Sparkles, Star, Terminal } from "lucide-react";
import { formatRon, getTrendingProjects } from "@/lib/demo-data";
import { ProjectCard } from "@/components/project-card";
import { MatrixRain } from "@/components/matrix-rain";

export default function Home() {
  const featured = getTrendingProjects().slice(0, 3);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <MatrixRain />
      <section className="relative isolate flex min-h-[92vh] items-center border-b border-primary/20 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 border border-primary/40 bg-primary/10 px-3 py-2 font-mono text-xs uppercase tracking-[0.28em] text-primary shadow-[0_0_28px_rgba(0,255,102,0.16)]">
              <Terminal className="h-4 w-4" />
              Laborator activ
            </div>
            <h1 className="font-mono text-4xl font-semibold leading-tight text-white sm:text-6xl lg:text-7xl">
              Laboratorul Lui Oscar
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Transformă orice idee DIY într-un proiect complet: piese, schemă, cod, 3D și PDF.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="lab-button lab-button-primary" href="/generator">
                <Sparkles className="h-4 w-4" />
                Pornește generatorul AI
              </Link>
              <Link className="lab-button" href="/community">
                Explorează comunitatea
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                ["12", "proiecte seed"],
                ["RON", "cost estimat"],
                ["PDF", "ghid exportabil"],
              ].map(([value, label]) => (
                <div className="terminal-panel p-4" key={label}>
                  <div className="font-mono text-2xl text-primary">{value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="terminal-panel relative overflow-hidden p-5">
            <div className="mb-4 flex items-center justify-between border-b border-primary/20 pb-3 font-mono text-xs text-primary">
              <span>oscar://generator/session</span>
              <span>LIVE</span>
            </div>
            <div className="space-y-4">
              <div className="rounded-sm border border-primary/20 bg-black/40 p-4">
                <p className="font-mono text-sm text-primary">$ idee</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  „Vreau o seră inteligentă cu ESP32, senzori, irigații automate și dashboard local.”
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  [Cpu, "BOM + wiring"],
                  [FlaskConical, "Pași laborator"],
                  [FileDown, "PDF How To"],
                  [ShieldAlert, "Safety checks"],
                ].map(([Icon, label]) => (
                  <div className="flex items-center gap-3 rounded-sm border border-primary/20 bg-primary/5 p-3" key={label as string}>
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="font-mono text-sm text-white">{label as string}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-sm border border-primary/30 bg-black/50 p-4">
                <div className="mb-3 flex items-center gap-2 font-mono text-sm text-primary">
                  <span className="h-2 w-2 bg-primary shadow-[0_0_14px_rgba(0,255,102,0.8)]" />
                  output.json
                </div>
                <pre className="overflow-hidden text-xs leading-6 text-muted-foreground">
{`{
  "parts": ["ESP32", "DHT22", "releu", "pompă 12V"],
  "cost": "${formatRon(286)}",
  "supplierSuggestions": ["Robofun", "TME", "Dedeman"],
  "tabs": ["Info", "Piese", "Wiring", "3D", "Cod", "PDF"]
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.25em] text-primary">Community feed</p>
            <h2 className="mt-2 font-mono text-3xl text-white">Proiecte trending</h2>
          </div>
          <Link className="lab-button" href="/community">
            Vezi toate
            <Star className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </main>
  );
}
