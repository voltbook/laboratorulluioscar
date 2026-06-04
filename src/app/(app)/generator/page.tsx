import { Sparkles, Wand2 } from "lucide-react";
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
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="terminal-panel p-5">
          <div className="mb-5 flex items-center gap-2 font-mono text-primary">
            <Wand2 className="h-5 w-5" />
            Prompt laborator
          </div>
          <GeneratorClient />
        </div>
        <div className="terminal-panel p-5">
          <h2 className="font-mono text-xl text-white">Ce generează AI-ul</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {["poză concept", "descriere tehnică", "listă piese", "preț estimativ RON", "linkuri România", "wiring Mermaid", "model 3D simplificat", "pași montaj", "cod Arduino / ESP32", "PDF How To"].map((item) => (
              <div className="border border-primary/20 bg-black/30 p-3 font-mono text-sm text-muted-foreground" key={item}>{item}</div>
            ))}
          </div>
          <div className="mt-5 border border-primary/30 bg-primary/5 p-4 text-sm leading-6 text-muted-foreground">
            Pentru 230V, baterii litiu, curenți mari, drone, vehicule sau scule periculoase, generatorul adaugă avertismente puternice și recomandă supraveghere calificată.
          </div>
        </div>
      </div>
    </main>
  );
}
