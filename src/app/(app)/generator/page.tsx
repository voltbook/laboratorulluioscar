import { Bot, GitBranch, Sparkles, Wand2 } from "lucide-react";
import { GeneratorClient } from "@/components/generator-client";

export default function GeneratorPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-7">
        <p className="font-mono text-sm uppercase tracking-[0.25em] text-primary">AI Project Generator</p>
        <h1 className="mt-2 flex items-center gap-3 font-mono text-3xl text-white">
          <Sparkles className="h-8 w-8 text-primary" />
          Transformă ideea în blueprint complet
        </h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="mb-5 flex items-center gap-2 font-mono text-primary">
            <Wand2 className="h-5 w-5" />
            Builder laborator
          </div>
          <GeneratorClient />
        </div>
        <div className="terminal-panel p-5">
          <h2 className="font-mono text-xl text-white">Motor gratuit / open-source</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {["Local deterministic generator", "Ollama-ready architecture", "Mermaid wiring", "Three.js / R3F CAD", "jsPDF export", "Supabase Postgres", "Safety policy gate", "Romanian suppliers"].map((item) => (
              <div className="border border-primary/20 bg-black/30 p-3 font-mono text-sm text-muted-foreground" key={item}>{item}</div>
            ))}
          </div>
          <div className="mt-5 border border-primary/30 bg-primary/5 p-4 text-sm leading-6 text-muted-foreground">
            OpenAI rămâne opțional. Când cheia nu are quota, aplicația folosește generatorul local gratuit, iar ulterior putem lega Ollama, llama.cpp sau un model open-source self-hosted.
          </div>
          <div className="mt-5 grid gap-3">
            <div className="flex gap-3 border border-yellow-500/30 bg-yellow-950/20 p-4 text-sm leading-6 text-yellow-100/80">
              <Bot className="mt-1 h-5 w-5 shrink-0 text-yellow-200" />
              Proiectele cu explozivi, ignitere, jammere, arme sau instrucțiuni de rănire sunt blocate și convertite spre alternative sigure.
            </div>
            <div className="flex gap-3 border border-primary/20 p-4 text-sm leading-6 text-muted-foreground">
              <GitBranch className="mt-1 h-5 w-5 shrink-0 text-primary" />
              Flux inspirat funcțional de blueprint builders: prompt, refine, status, taburi, piese, wiring, 3D și instrucțiuni.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
