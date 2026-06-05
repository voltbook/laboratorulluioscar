import Image from "next/image";
import { Bot, GitBranch, Wand2 } from "lucide-react";
import { GeneratorClient } from "@/components/generator-client";

export default function GeneratorPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-7 flex items-center gap-4">
        <Image src="/brand/project-generator-icon.png" alt="Project Generator game icon" width={88} height={88} className="h-16 w-16 object-contain" />
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.25em] text-primary">Project Generator game/tool</p>
          <h1 className="mt-2 font-mono text-3xl text-white">Generate a complete DIY build mission</h1>
        </div>
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
          <h2 className="font-mono text-xl text-white">Free / open-source engine mode</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {["Local deterministic generator", "Ollama-ready architecture", "Mermaid wiring", "Three.js / R3F CAD", "jsPDF export", "Supabase Postgres", "Safety policy gate", "Romanian suppliers"].map((item) => (
              <div className="border border-primary/20 bg-black/30 p-3 font-mono text-sm text-muted-foreground" key={item}>{item}</div>
            ))}
          </div>
          <div className="mt-5 border border-primary/30 bg-primary/5 p-4 text-sm leading-6 text-muted-foreground">
            OpenAI remains optional. When image or text quota is unavailable, the app uses local fallback generation and stays ready for Ollama, llama.cpp, or a self-hosted open-source model.
          </div>
          <div className="mt-5 grid gap-3">
            <div className="flex gap-3 border border-yellow-500/30 bg-yellow-950/20 p-4 text-sm leading-6 text-yellow-100/80">
              <Bot className="mt-1 h-5 w-5 shrink-0 text-yellow-200" />
              Projects involving explosives, igniters, jammers, weapons, or harmful instructions are blocked and redirected toward safe educational alternatives.
            </div>
            <div className="flex gap-3 border border-primary/20 p-4 text-sm leading-6 text-muted-foreground">
              <GitBranch className="mt-1 h-5 w-5 shrink-0 text-primary" />
              Blueprint-builder style flow: prompt, refine, generation status, tabs, parts, wiring, 3D, code and instructions.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
