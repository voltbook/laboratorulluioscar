"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Box, CheckCircle2, ChevronDown, FileText, ImageIcon, Lightbulb, List, Loader2, MessageSquare, RotateCcw, Send, ShieldAlert, SlidersHorizontal, Sparkles, Workflow, X } from "lucide-react";
import { MermaidDiagram } from "@/components/mermaid-diagram";
import { ProjectModelViewer } from "@/components/project-model-viewer";

type Part = {
  name: string;
  category: string;
  quantity: number;
  estimatedPriceRon: number;
  supplier: string;
  supplierUrl: string;
  description: string;
};

type Result = {
  status: "ready" | "blocked";
  title: string;
  shortDescription?: string;
  technicalDescription?: string;
  tags?: string[];
  estimatedCostRon?: number;
  parts?: Part[];
  safetyWarnings?: string[];
  wiringDiagram?: string;
  instructionGroups?: { title: string; steps: string[] }[];
  code?: string;
  providerStatus?: string;
  blockedReason?: string;
  saferAlternatives?: string[];
};

const starter = "Vreau o seră inteligentă cu ESP32, senzori de umiditate, pompă 12V și alertă pe telefon.";

const statusSteps = [
  "PLANIFICARE ARHITECTURĂ",
  "CLARIFICARE DESIGN",
  "GENERARE ELECTRICĂ",
  "GENERARE MECANICĂ",
  "DESIGN READY",
];

const ideaPrompts = [
  "Robot mic cu ESP32 care evită obstacole",
  "Stație meteo solară pentru balcon",
  "Sistem de irigații pentru plante de interior",
  "Companion desktop bot cu OLED și servouri",
];

const refineQuestions = [
  {
    label: "Buget",
    key: "budget",
    options: ["Sub 150 RON", "150-500 RON", "500+ RON", "Altul"],
  },
  {
    label: "Timp",
    key: "time",
    options: ["Câteva zile", "~1 lună", "3 luni+", "Altul"],
  },
  {
    label: "Nivel",
    key: "skill",
    options: ["Începător", "Mediu", "Avansat", "Altul"],
  },
];

export function GeneratorClient() {
  const [idea, setIdea] = useState(starter);
  const [mode, setMode] = useState("OSCAR LOCAL");
  const [result, setResult] = useState<Result | null>(null);
  const [phase, setPhase] = useState<"idle" | "refine" | "generating" | "ready" | "blocked">("idle");
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState("chat");
  const [showIdeas, setShowIdeas] = useState(false);
  const [showRefine, setShowRefine] = useState(false);
  const [selectedRefinements, setSelectedRefinements] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  const partCount = result?.parts?.reduce((sum, part) => sum + part.quantity, 0) ?? 0;
  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    result?.parts?.forEach((part) => counts.set(part.category, (counts.get(part.category) ?? 0) + part.quantity));
    return Array.from(counts.entries());
  }, [result?.parts]);

  const generate = async (skipRefine = false) => {
    if (!skipRefine && phase === "idle") {
      setShowRefine(true);
      setPhase("refine");
      return;
    }
    setShowRefine(false);
    setPhase("generating");
    setActiveTab("chat");
    setResult(null);
    setError("");
    setActiveStep(0);

    const timers = statusSteps.map((_, index) =>
      window.setTimeout(() => setActiveStep(index), 450 + index * 620),
    );

    try {
      const response = await fetch("/api/generate-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, mode, refinements: selectedRefinements }),
      });
      if (!response.ok) throw new Error("Generatorul nu a răspuns corect.");
      const data = (await response.json()) as Result;
      setResult(data);
      setPhase(data.status === "blocked" ? "blocked" : "ready");
      setActiveStep(data.status === "blocked" ? 0 : statusSteps.length - 1);
      if (data.status === "ready") setActiveTab("info");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Eroare necunoscută.");
      setPhase("idle");
    } finally {
      timers.forEach(window.clearTimeout);
    }
  };

  const reset = () => {
    setPhase("idle");
    setResult(null);
    setActiveStep(0);
    setActiveTab("chat");
    setError("");
  };

  return (
    <div className="relative">
      {showIdeas ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="terminal-panel w-full max-w-xl border-white/80 p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-mono text-2xl uppercase tracking-[0.18em] text-white">
                <Lightbulb className="h-5 w-5 text-primary" />
                Need an idea?
              </h2>
              <button className="lab-icon-button" onClick={() => setShowIdeas(false)} type="button"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-3">
              {ideaPrompts.map((prompt) => (
                <button
                  className="w-full border border-primary/20 bg-black/40 p-4 text-left font-mono text-sm text-muted-foreground transition hover:border-primary hover:text-white"
                  key={prompt}
                  onClick={() => {
                    setIdea(prompt);
                    setShowIdeas(false);
                  }}
                  type="button"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {showRefine ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="terminal-panel max-h-[86vh] w-full max-w-2xl overflow-auto border-white/80 p-5">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="font-mono text-2xl uppercase tracking-[0.18em] text-white">Refinează designul</h2>
                <p className="mt-2 text-sm text-muted-foreground">Răspunde pentru arhitectură mai bună sau sari peste cu defaults.</p>
              </div>
              <button className="lab-icon-button" onClick={() => setShowRefine(false)} type="button"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-6">
              {refineQuestions.map((question, index) => (
                <div key={question.key}>
                  <p className="mb-3 font-mono text-sm uppercase tracking-[0.16em] text-white">{index + 1}. {question.label}</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {question.options.map((option) => {
                      const selected = selectedRefinements[question.key] === option;
                      return (
                        <button
                          className={`border p-3 text-left font-mono text-sm transition ${selected ? "border-white bg-white text-black" : "border-primary/15 bg-black/40 text-muted-foreground hover:border-primary hover:text-white"}`}
                          key={option}
                          onClick={() => setSelectedRefinements((current) => ({ ...current, [question.key]: option }))}
                          type="button"
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              <div>
                <p className="mb-3 font-mono text-sm uppercase tracking-[0.16em] text-white">4. Ce contează mai mult?</p>
                <input className="w-full accent-primary" type="range" min="0" max="100" defaultValue="48" />
                <div className="mt-2 grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                  <span>Procesul: învățare & construcție</span>
                  <span className="text-right">Rezultatul: produs final</span>
                </div>
              </div>
              <button className="lab-button lab-button-primary w-full" onClick={() => generate(true)} type="button">
                <Sparkles className="h-4 w-4" />
                Generează blueprint
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="terminal-panel overflow-hidden">
        <div className="border-b border-primary/15 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="font-mono text-xs uppercase tracking-[0.22em] text-primary">oscar://blueprint/session</div>
            <div className="flex items-center gap-2">
              <span className="border border-primary/20 px-2 py-1 font-mono text-xs text-white">5 ⚡</span>
              <button className="lab-button h-8 px-2" type="button" onClick={() => setMode(mode === "OSCAR LOCAL" ? "OLLAMA READY" : "OSCAR LOCAL")}>
                {mode}
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-1 border-b border-primary/15 pb-3">
            {[
              ["chat", MessageSquare],
              ["info", ImageIcon],
              ["parts", List],
              ["wiring", Workflow],
              ["mech", Box],
              ["instructions", FileText],
            ].map(([tab, Icon]) => (
              <button
                className={`flex items-center justify-center border-b-2 py-2 font-mono text-xs uppercase ${activeTab === tab ? "border-white text-white" : "border-transparent text-muted-foreground"}`}
                key={tab as string}
                onClick={() => setActiveTab(tab as string)}
                type="button"
              >
                <Icon className="h-4 w-4" />
                <span className="sr-only">{tab as string}</span>
              </button>
            ))}
          </div>
        </div>

        {activeTab === "chat" ? (
          <div className="p-4">
            <div className="mb-2 text-right font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">user_input</div>
            <textarea className="textarea-lab min-h-28 resize-none font-mono text-base" value={idea} onChange={(event) => setIdea(event.target.value)} />
            <div className="grid border border-primary/20 sm:grid-cols-[1fr_auto_auto]">
              <button className="border-b border-primary/20 px-4 py-3 text-left font-mono text-sm uppercase text-white sm:border-b-0 sm:border-r" onClick={() => setShowIdeas(true)} type="button">
                <Lightbulb className="mr-2 inline h-4 w-4 text-yellow-300" />
                Need an idea?
              </button>
              <button className="border-b border-primary/20 px-4 py-3 font-mono text-sm uppercase text-muted-foreground sm:border-b-0 sm:border-r" onClick={() => setShowRefine(true)} type="button">
                <SlidersHorizontal className="mr-2 inline h-4 w-4" />
                Refine
              </button>
              <button className="grid min-h-12 place-items-center bg-white px-6 text-black disabled:opacity-50" onClick={() => generate(false)} disabled={phase === "generating"} type="button">
                {phase === "generating" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </button>
            </div>

            {phase === "generating" ? (
              <div className="mt-6">
                <div className="mb-4 border border-yellow-500/40 bg-yellow-950/30 p-2 font-mono text-sm text-yellow-200">Waiting in queue</div>
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">generation_status</p>
                <div className="border border-primary/15 p-4">
                  {statusSteps.map((step, index) => (
                    <div className={`flex gap-3 py-2 font-mono text-sm ${index === activeStep ? "text-white" : "text-muted-foreground/45"}`} key={step}>
                      {index < activeStep ? <CheckCircle2 className="h-5 w-5 text-primary" /> : index === activeStep ? <Loader2 className="h-5 w-5 animate-spin text-yellow-300" /> : <span className="h-5 w-5 rounded-full border border-muted-foreground/30" />}
                      {step}{index === activeStep ? "..." : ""}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {phase === "blocked" && result ? (
              <div className="mt-6 space-y-4">
                <div className="border border-red-500/40 bg-red-950/20 p-4">
                  <div className="mb-3 flex items-center gap-2 font-mono text-red-200">
                    <ShieldAlert className="h-5 w-5" />
                    Blocat de politica de siguranță
                  </div>
                  <p className="leading-7 text-red-100/80">{result.blockedReason}</p>
                </div>
                <div className="border border-primary/20 p-4">
                  <p className="mb-2 font-mono text-sm text-primary">Alternative sigure</p>
                  <div className="flex flex-wrap gap-2">
                    {result.saferAlternatives?.map((item) => (
                      <button className="lab-button" key={item} onClick={() => { setIdea(item); reset(); }} type="button">{item}</button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {error ? <div className="mt-4 border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-200">{error}</div> : null}
          </div>
        ) : null}

        {activeTab === "info" && result?.status === "ready" ? (
          <Panel title={result.title}>
            <div className="aspect-[16/9] border border-primary/15 bg-[radial-gradient(circle_at_50%_35%,rgba(0,255,102,.22),transparent_32%),linear-gradient(135deg,#111,#050805)] p-5">
              <div className="grid h-full place-items-center border border-primary/20 font-mono text-primary">{result.title}</div>
            </div>
            <button className="lab-button mt-4 w-full bg-white text-black" type="button"><RotateCcw className="h-4 w-4" /> Update image</button>
            <div className="mt-6 flex flex-wrap gap-2">{result.tags?.map((tag) => <span className="lab-badge" key={tag}>{tag}</span>)}</div>
            <p className="mt-5 text-sm uppercase tracking-[0.18em] text-muted-foreground">Technical description</p>
            <p className="mt-2 leading-7 text-muted-foreground">{result.technicalDescription}</p>
            <div className="mt-5 grid grid-cols-3 border border-primary/15 text-sm">
              <Stat label="Parts" value={partCount} />
              <Stat label="Cost" value={`${result.estimatedCostRon ?? 0} RON`} />
              <Stat label="Mode" value={mode} />
            </div>
            <div className="mt-5 border border-yellow-500/30 bg-yellow-950/20 p-4">
              <p className="mb-2 flex items-center gap-2 font-mono text-yellow-200"><AlertTriangle className="h-4 w-4" /> Safety</p>
              <ul className="space-y-2 text-sm text-yellow-100/80">{result.safetyWarnings?.map((warning) => <li key={warning}>{warning}</li>)}</ul>
            </div>
          </Panel>
        ) : null}

        {activeTab === "parts" && result?.status === "ready" ? (
          <Panel title="Parts">
            <input className="input-lab mb-3" placeholder="Search for parts" />
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="lab-button bg-white text-black">All {partCount}</span>
              {categoryCounts.map(([category, count]) => <span className="lab-button" key={category}>{category} {count}</span>)}
            </div>
            <div className="grid gap-4">
              {result.parts?.map((part) => (
                <div className="overflow-hidden border border-primary/15" key={part.name}>
                  <div className="aspect-[16/10] bg-[linear-gradient(135deg,#e8e8e8,#8d958f)] p-4">
                    <div className="h-full border border-black/10 bg-white/20" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-mono text-xl text-white">{part.name}</h3>
                    <p className="mt-1 font-mono text-sm text-muted-foreground">{part.category}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{part.description}</p>
                    <div className="mt-4 grid grid-cols-[1fr_auto] gap-4">
                      <div className="font-mono text-sm text-muted-foreground">QTY<br /><span className="text-white">{part.quantity}</span> · ~{part.estimatedPriceRon} RON</div>
                      <a className="lab-button lab-button-primary" href={part.supplierUrl} target="_blank">{part.supplier}</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        ) : null}

        {activeTab === "wiring" && result?.status === "ready" ? (
          <Panel title="Wiring">
            <MermaidDiagram chart={result.wiringDiagram ?? "flowchart LR\nA-->B"} />
          </Panel>
        ) : null}

        {activeTab === "mech" && result?.status === "ready" ? (
          <Panel title="Mech">
            <ProjectModelViewer />
          </Panel>
        ) : null}

        {activeTab === "instructions" && result?.status === "ready" ? (
          <Panel title={`Instructions 0/${result.instructionGroups?.reduce((sum, group) => sum + group.steps.length, 0) ?? 0} done`}>
            <div className="mb-4 border border-primary/15 p-4">
              <p className="mb-2 font-mono text-sm uppercase tracking-[0.16em] text-primary">Tools & assumptions</p>
              <p className="text-sm text-muted-foreground">Multimetru, letcon, cabluri, laptop, imprimantă 3D opțională, sursă limitată în curent.</p>
            </div>
            <div className="space-y-4">
              {result.instructionGroups?.map((group, groupIndex) => (
                <div className="border border-primary/15" key={group.title}>
                  <div className="flex items-center justify-between border-b border-primary/10 p-4">
                    <h3 className="font-mono text-xl text-white">{groupIndex + 1}. {group.title}</h3>
                    <span className="lab-badge">Generate ({group.steps.length})</span>
                  </div>
                  {group.steps.map((step, index) => (
                    <details className="border-b border-primary/10 p-4" key={step}>
                      <summary className="cursor-pointer font-mono text-muted-foreground">{groupIndex + 1}.{index + 1} {step}</summary>
                      <div className="mt-4 border border-primary/15 p-4">
                        <p className="mb-3 text-center text-sm text-muted-foreground">Instruction image placeholder</p>
                        <p className="font-mono text-white">{step}</p>
                        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                          <li>Pregătește piesele asociate pasului.</li>
                          <li>Verifică polaritatea și fixarea mecanică.</li>
                          <li>Testează incremental înainte de asamblarea finală.</li>
                        </ol>
                      </div>
                    </details>
                  ))}
                </div>
              ))}
            </div>
          </Panel>
        ) : null}
      </div>

      <p className="mt-3 text-center font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">Oscar Blueprint</p>
      {result?.providerStatus ? <p className="mt-2 text-center text-xs text-muted-foreground">{result.providerStatus}</p> : null}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-4">
      <h2 className="mb-5 font-mono text-2xl uppercase tracking-[0.16em] text-white">{title}</h2>
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border-r border-primary/15 p-3 last:border-r-0">
      <div className="font-mono text-xs uppercase text-muted-foreground">{label}</div>
      <div className="mt-1 font-mono text-white">{value}</div>
    </div>
  );
}
