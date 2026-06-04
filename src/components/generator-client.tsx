"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import jsPDF from "jspdf";
import {
  AlertTriangle,
  BadgeCheck,
  Box,
  Check,
  CheckCircle2,
  ChevronDown,
  Code2,
  Copy,
  Download,
  FileText,
  Grid2X2,
  ImageIcon,
  Layers3,
  Lightbulb,
  List,
  Loader2,
  Lock,
  MessageSquare,
  Palette,
  RefreshCcw,
  Search,
  Send,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Trash2,
  UserRound,
  Workflow,
  X,
} from "lucide-react";
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

type InstructionGroup = { title: string; steps: string[] };
type CodeFile = { filename: string; language: string; code: string };

type Result = {
  status: "ready" | "blocked";
  engine?: string;
  title: string;
  category?: string;
  difficulty?: string;
  shortDescription?: string;
  technicalDescription?: string;
  tags?: string[];
  estimatedCostRon?: number;
  imagePrompt?: string;
  conceptImageUrl?: string;
  parts?: Part[];
  requiredTools?: string[];
  assumptions?: string[];
  supplierSuggestions?: string[];
  safetyWarnings?: string[];
  wiringDiagram?: string;
  mechModel?: { layers?: string[]; labels?: string[] };
  instructionGroups?: InstructionGroup[];
  testingSteps?: string[];
  troubleshooting?: string[];
  code?: string;
  codeFiles?: CodeFile[];
  providerStatus?: string;
  blockedReason?: string;
  saferAlternatives?: string[];
};

const starter = "Vreau o seră inteligentă cu ESP32, senzori de umiditate, pompă 12V și alertă pe telefon.";

const statusSteps = [
  "PLANIFICARE ARHITECTURĂ",
  "CLARIFICARE DESIGN CHOICES",
  "GENERARE IMAGINE CONCEPT",
  "GENERARE ELECTRICAL DESIGN",
  "GENERARE MECHANICAL DESIGN",
  "DESIGN READY",
];

const ideaPrompts = [
  "Robot mic cu ESP32 care evită obstacole",
  "Stație meteo solară pentru balcon",
  "Sistem de irigații automat pentru plante",
  "Companion desktop bot cu OLED și servouri",
  "Uscător filament 3D cu control temperatură",
  "Monitor energie smart home doar pe joasă tensiune",
];

const refineQuestions = [
  { label: "Care este bugetul?", key: "budget", options: ["Sub 150 RON", "150-500 RON", "500+ RON", "Altul"] },
  { label: "Timp disponibil?", key: "time", options: ["Câteva zile", "~1 lună", "3 luni+", "Altul"] },
  { label: "Nivelul tău?", key: "skill", options: ["Începător", "Mediu", "Avansat", "Altul"] },
  { label: "Ce format preferi?", key: "format", options: ["Kit simplu", "CAD + wiring", "Prototip premium", "Altul"] },
];

const modelOptions = [
  { name: "OSCAR LOCAL", detail: "free", locked: false },
  { name: "OLLAMA READY", detail: "open-source", locked: false },
  { name: "OSCAR MAX", detail: "pro", locked: true },
  { name: "OSCAR ULTRA", detail: "ultra", locked: true },
];

const tabs = [
  ["chat", MessageSquare, "Chat"],
  ["info", ImageIcon, "Info"],
  ["parts", List, "Piese"],
  ["wiring", Workflow, "Wiring"],
  ["mech", Box, "3D"],
  ["instructions", FileText, "Instrucțiuni"],
  ["code", Code2, "Cod"],
  ["pdf", Download, "PDF"],
] as const;

export function GeneratorClient() {
  const [idea, setIdea] = useState(starter);
  const [mode, setMode] = useState("OSCAR LOCAL");
  const [result, setResult] = useState<Result | null>(null);
  const [phase, setPhase] = useState<"idle" | "refine" | "generating" | "ready" | "blocked">("idle");
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number][0]>("chat");
  const [showIdeas, setShowIdeas] = useState(false);
  const [showRefine, setShowRefine] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showModels, setShowModels] = useState(false);
  const [selectedRefinements, setSelectedRefinements] = useState<Record<string, string>>({});
  const [priority, setPriority] = useState(48);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageStatus, setImageStatus] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [partQuery, setPartQuery] = useState("");
  const [partCategory, setPartCategory] = useState("All");
  const [partsView, setPartsView] = useState<"grid" | "list">("grid");
  const [doneSteps, setDoneSteps] = useState<Record<string, boolean>>({});
  const [enrichedWiring, setEnrichedWiring] = useState(false);
  const [layerFilter, setLayerFilter] = useState("all");

  const partCount = result?.parts?.reduce((sum, part) => sum + part.quantity, 0) ?? 0;
  const instructionCount = result?.instructionGroups?.reduce((sum, group) => sum + group.steps.length, 0) ?? 0;
  const doneCount = Object.values(doneSteps).filter(Boolean).length;

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    result?.parts?.forEach((part) => counts.set(part.category, (counts.get(part.category) ?? 0) + part.quantity));
    return Array.from(counts.entries());
  }, [result?.parts]);

  const filteredParts = useMemo(() => {
    const query = partQuery.toLowerCase();
    return (result?.parts ?? []).filter((part) => {
      const matchesCategory = partCategory === "All" || part.category === partCategory;
      const matchesQuery = !query || `${part.name} ${part.category} ${part.description} ${part.supplier}`.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [partCategory, partQuery, result?.parts]);

  const generateConceptImage = async (project = result) => {
    if (!project || project.status !== "ready") return;
    setImageLoading(true);
    setImageStatus("generating concept image...");
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: project.title, prompt: project.imagePrompt ?? project.shortDescription }),
      });
      const data = (await response.json()) as { imageUrl?: string; providerStatus?: string };
      if (data.imageUrl) setImageUrl(data.imageUrl);
      setImageStatus(data.providerStatus ?? "Imagine actualizată.");
    } catch {
      setImageStatus("Imaginea nu a putut fi regenerată acum.");
    } finally {
      setImageLoading(false);
    }
  };

  const generate = async (skipRefine = false) => {
    if (!skipRefine && phase === "idle") {
      setShowRefine(true);
      setPhase("refine");
      return;
    }
    setShowRefine(false);
    setShowModels(false);
    setPhase("generating");
    setActiveTab("chat");
    setResult(null);
    setError("");
    setImageUrl("");
    setImageStatus("");
    setDoneSteps({});
    setActiveStep(0);

    const timers = statusSteps.map((_, index) => window.setTimeout(() => setActiveStep(index), 380 + index * 520));

    try {
      const response = await fetch("/api/generate-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, mode, refinements: { ...selectedRefinements, priority: String(priority) } }),
      });
      if (!response.ok) throw new Error("Generatorul nu a răspuns corect.");
      const data = (await response.json()) as Result;
      setResult(data);
      setPhase(data.status === "blocked" ? "blocked" : "ready");
      setActiveStep(data.status === "blocked" ? 0 : statusSteps.length - 1);
      if (data.status === "ready") {
        setImageUrl(data.conceptImageUrl ?? "");
        setActiveTab("info");
        void generateConceptImage(data);
      }
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
    setImageUrl("");
    setImageStatus("");
    setDoneSteps({});
  };

  const exportPdf = () => {
    if (!result || result.status !== "ready") return;
    const doc = new jsPDF();
    let y = 18;
    const margin = 14;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(result.title, margin, y);
    y += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(doc.splitTextToSize(result.technicalDescription ?? "", 180), margin, y);
    y += 28;
    doc.setFont("helvetica", "bold");
    doc.text("Piese", margin, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    result.parts?.forEach((part) => {
      doc.text(`- ${part.quantity}x ${part.name} ~ ${part.estimatedPriceRon} RON (${part.supplier})`, margin, y);
      y += 6;
    });
    y += 4;
    doc.setFont("helvetica", "bold");
    doc.text("Instrucțiuni", margin, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    result.instructionGroups?.forEach((group) => {
      doc.text(group.title, margin, y);
      y += 6;
      group.steps.forEach((step) => {
        doc.text(doc.splitTextToSize(`- ${step}`, 180), margin + 4, y);
        y += 6;
        if (y > 280) {
          doc.addPage();
          y = 18;
        }
      });
    });
    doc.save(`${result.title.toLowerCase().replace(/[^a-z0-9]+/gi, "-")}-how-to.pdf`);
  };

  return (
    <div className="relative">
      {showIdeas ? (
        <IdeaModal
          onClose={() => setShowIdeas(false)}
          onPick={(prompt) => {
            setIdea(prompt);
            setShowIdeas(false);
          }}
        />
      ) : null}

      {showRefine ? (
        <RefineModal
          priority={priority}
          selectedRefinements={selectedRefinements}
          setPriority={setPriority}
          setSelectedRefinements={setSelectedRefinements}
          onClose={() => {
            setShowRefine(false);
            setPhase(result ? "ready" : "idle");
          }}
          onGenerate={() => generate(true)}
        />
      ) : null}

      <div className="terminal-panel overflow-hidden">
        <div className="border-b border-primary/15">
          <div className="flex items-center justify-between gap-3 border-b border-primary/10 p-4">
            <button className="font-mono text-lg font-bold uppercase tracking-[0.22em] text-white" onClick={() => setActiveTab("chat")} type="button">
              Laboratorul Lui Oscar <span className="text-xs text-muted-foreground">by Oscar Robotics</span>
            </button>
            <div className="relative flex items-center gap-2">
              <span className="border border-primary/20 px-2 py-1 font-mono text-xs text-white">5 ⚡</span>
              <button className="lab-icon-button" onClick={() => setShowProfile((value) => !value)} type="button" aria-label="Profil">
                <UserRound className="h-4 w-4 text-primary" />
              </button>
              {showProfile ? <ProfileMenu onClose={() => setShowProfile(false)} /> : null}
            </div>
          </div>
          <div className="grid grid-cols-8 gap-1 overflow-x-auto px-3">
            {tabs.map(([tab, Icon, label]) => (
              <button
                className={`flex min-w-12 items-center justify-center gap-2 border-b-2 py-3 font-mono text-xs uppercase ${activeTab === tab ? "border-white text-white" : "border-transparent text-muted-foreground hover:text-white"}`}
                key={tab}
                onClick={() => setActiveTab(tab)}
                type="button"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {activeTab === "chat" ? (
          <ChatTab
            activeStep={activeStep}
            error={error}
            idea={idea}
            mode={mode}
            phase={phase}
            result={result}
            setIdea={setIdea}
            setMode={setMode}
            setShowIdeas={setShowIdeas}
            setShowRefine={setShowRefine}
            showModels={showModels}
            setShowModels={setShowModels}
            generate={() => generate(false)}
            reset={reset}
          />
        ) : null}

        {activeTab === "info" && result?.status === "ready" ? (
          <InfoTab imageLoading={imageLoading} imageStatus={imageStatus} imageUrl={imageUrl} mode={mode} partCount={partCount} result={result} onRegenerateImage={() => generateConceptImage()} />
        ) : null}

        {activeTab === "parts" && result?.status === "ready" ? (
          <PartsTab
            categoryCounts={categoryCounts}
            filteredParts={filteredParts}
            partCategory={partCategory}
            partCount={partCount}
            partQuery={partQuery}
            partsView={partsView}
            setPartCategory={setPartCategory}
            setPartQuery={setPartQuery}
            setPartsView={setPartsView}
          />
        ) : null}

        {activeTab === "wiring" && result?.status === "ready" ? (
          <Panel title="Wiring">
            <div className="mb-4 flex justify-end">
              <button className="lab-button" onClick={() => setEnrichedWiring((value) => !value)} type="button">
                <Workflow className="h-4 w-4" />
                {enrichedWiring ? "Simplifică wiring" : "Enrich wiring"}
              </button>
            </div>
            <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
              <MermaidDiagram chart={enrichedWiring ? enrichMermaid(result.wiringDiagram ?? "") : result.wiringDiagram ?? "flowchart LR\nA-->B"} />
              <LegendPanel />
            </div>
          </Panel>
        ) : null}

        {activeTab === "mech" && result?.status === "ready" ? (
          <Panel title="3D CAD">
            <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
              <ProjectModelViewer />
              <div className="border border-primary/15 p-4">
                <p className="mb-4 font-mono text-sm uppercase tracking-[0.16em] text-white">Layers</p>
                {["all", ...(result.mechModel?.layers ?? [])].map((layer) => (
                  <button className={`mb-2 flex w-full items-center gap-2 border p-2 text-left font-mono text-sm ${layerFilter === layer ? "border-white bg-white text-black" : "border-primary/15 text-muted-foreground"}`} key={layer} onClick={() => setLayerFilter(layer)} type="button">
                    <Layers3 className="h-4 w-4" />
                    {layer}
                  </button>
                ))}
                <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                  {(result.mechModel?.labels ?? []).map((label) => <div key={label}>[{layerFilter}] {label}</div>)}
                </div>
              </div>
            </div>
          </Panel>
        ) : null}

        {activeTab === "instructions" && result?.status === "ready" ? (
          <InstructionsTab doneCount={doneCount} doneSteps={doneSteps} instructionCount={instructionCount} result={result} setDoneSteps={setDoneSteps} />
        ) : null}

        {activeTab === "code" && result?.status === "ready" ? (
          <Panel title="Code">
            <div className="mb-4 flex flex-wrap gap-2">
              {(result.codeFiles?.length ? result.codeFiles : [{ filename: "main.ino", language: "arduino", code: result.code ?? "" }]).map((file) => (
                <span className="lab-badge" key={file.filename}>{file.filename}</span>
              ))}
              <button className="lab-button ml-auto" onClick={() => navigator.clipboard.writeText(result.codeFiles?.[0]?.code ?? result.code ?? "")} type="button">
                <Copy className="h-4 w-4" />
                Copy
              </button>
            </div>
            <pre className="max-h-[520px] overflow-auto border border-primary/15 bg-black/70 p-4 text-sm text-primary"><code>{result.codeFiles?.[0]?.code ?? result.code}</code></pre>
          </Panel>
        ) : null}

        {activeTab === "pdf" && result?.status === "ready" ? (
          <Panel title="Export PDF">
            <div className="border border-primary/15 p-5">
              <p className="font-mono text-xl text-white">{result.title}</p>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Exportă ghidul “How To” cu descriere, piese, wiring în format text, pași de montaj, testare și troubleshooting. PDF-ul este generat local în browser.</p>
              <button className="lab-button lab-button-primary mt-5" onClick={exportPdf} type="button">
                <Download className="h-4 w-4" />
                Export PDF
              </button>
            </div>
          </Panel>
        ) : null}
      </div>

      <p className="mt-3 text-center font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">Oscar Blueprint</p>
      {result?.providerStatus ? <p className="mt-2 text-center text-xs text-muted-foreground">{result.providerStatus}</p> : null}
    </div>
  );
}

function ChatTab(props: {
  activeStep: number;
  error: string;
  generate: () => void;
  idea: string;
  mode: string;
  phase: "idle" | "refine" | "generating" | "ready" | "blocked";
  reset: () => void;
  result: Result | null;
  setIdea: (value: string) => void;
  setMode: (value: string) => void;
  setShowIdeas: (value: boolean) => void;
  setShowRefine: (value: boolean) => void;
  setShowModels: (value: boolean) => void;
  showModels: boolean;
}) {
  return (
    <div className="p-4">
      <div className="mb-2 text-right font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">user_input</div>
      <textarea className="textarea-lab min-h-28 resize-none font-mono text-base" value={props.idea} onChange={(event) => props.setIdea(event.target.value)} />
      <div className="grid border border-primary/20 md:grid-cols-[1fr_auto_auto_auto]">
        <button className="border-b border-primary/20 px-4 py-3 text-left font-mono text-sm uppercase text-white md:border-b-0 md:border-r" onClick={() => props.setShowIdeas(true)} type="button">
          <Lightbulb className="mr-2 inline h-4 w-4 text-yellow-300" />
          Need an idea?
        </button>
        <button className="border-b border-primary/20 px-4 py-3 font-mono text-sm uppercase text-muted-foreground md:border-b-0 md:border-r" onClick={() => props.setShowRefine(true)} type="button">
          <SlidersHorizontal className="mr-2 inline h-4 w-4" />
          Refine
        </button>
        <div className="relative border-b border-primary/20 md:border-b-0 md:border-r">
          <button className="flex h-full w-full items-center justify-center gap-2 px-4 py-3 font-mono text-sm uppercase text-muted-foreground" onClick={() => props.setShowModels(!props.showModels)} type="button">
            {props.mode}
            <ChevronDown className="h-4 w-4" />
          </button>
          {props.showModels ? (
            <div className="absolute right-0 top-full z-30 w-56 border border-primary/20 bg-[#080b09] p-2 shadow-2xl">
              {modelOptions.map((option) => (
                <button
                  className={`flex w-full items-center justify-between p-3 text-left font-mono text-sm ${option.locked ? "text-muted-foreground/45" : "text-white hover:bg-primary/10"}`}
                  disabled={option.locked}
                  key={option.name}
                  onClick={() => {
                    props.setMode(option.name);
                    props.setShowModels(false);
                  }}
                  type="button"
                >
                  <span>{option.name}<span className="ml-2 text-xs text-muted-foreground">{option.detail}</span></span>
                  {option.locked ? <Lock className="h-3 w-3" /> : props.mode === option.name ? <Check className="h-4 w-4" /> : null}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <button className="grid min-h-12 place-items-center bg-white px-6 text-black disabled:opacity-50" onClick={props.generate} disabled={props.phase === "generating"} type="button">
          {props.phase === "generating" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </button>
      </div>

      {props.phase === "generating" ? (
        <div className="mt-6">
          <div className="mb-4 flex justify-between border border-yellow-500/40 bg-yellow-950/30 p-2 font-mono text-sm text-yellow-200">
            <span>Waiting in queue</span>
            <span className="underline">Local mode skips paid credits</span>
          </div>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">generation_status</p>
          <div className="border border-primary/15 p-4">
            {statusSteps.map((step, index) => (
              <div className={`flex gap-3 py-2 font-mono text-sm ${index === props.activeStep ? "text-white" : "text-muted-foreground/45"}`} key={step}>
                {index < props.activeStep ? <CheckCircle2 className="h-5 w-5 text-primary" /> : index === props.activeStep ? <Loader2 className="h-5 w-5 animate-spin text-yellow-300" /> : <span className="h-5 w-5 rounded-full border border-muted-foreground/30" />}
                {step}{index === props.activeStep ? "..." : ""}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {props.phase === "blocked" && props.result ? (
        <div className="mt-6 space-y-4">
          <div className="border border-red-500/40 bg-red-950/20 p-4">
            <div className="mb-3 flex items-center gap-2 font-mono text-red-200">
              <ShieldAlert className="h-5 w-5" />
              Blocat de politica de siguranță
            </div>
            <p className="leading-7 text-red-100/80">{props.result.blockedReason}</p>
          </div>
          <div className="border border-primary/20 p-4">
            <p className="mb-2 font-mono text-sm text-primary">Alternative sigure</p>
            <div className="flex flex-wrap gap-2">
              {props.result.saferAlternatives?.map((item) => (
                <button className="lab-button" key={item} onClick={() => { props.setIdea(item); props.reset(); }} type="button">{item}</button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {props.error ? <div className="mt-4 border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-200">{props.error}</div> : null}
    </div>
  );
}

function InfoTab({ imageLoading, imageStatus, imageUrl, mode, onRegenerateImage, partCount, result }: { imageLoading: boolean; imageStatus: string; imageUrl: string; mode: string; onRegenerateImage: () => void; partCount: number; result: Result }) {
  return (
    <Panel title={result.title}>
      <div className="relative overflow-hidden border border-primary/15 bg-black">
        {imageUrl ? <Image alt={`Concept ${result.title}`} className="aspect-[16/9] w-full object-cover" height={720} src={imageUrl} unoptimized width={1280} /> : <div className="grid aspect-[16/9] place-items-center font-mono text-primary">concept image queue</div>}
      </div>
      <button className="lab-button mt-4 w-full bg-white text-black" onClick={onRegenerateImage} disabled={imageLoading} type="button">
        {imageLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
        Update image
      </button>
      {imageStatus ? <p className="mt-2 text-center text-xs text-muted-foreground">{imageStatus}</p> : null}
      <div className="mt-6 flex flex-wrap gap-2">{result.tags?.map((tag) => <span className="lab-badge" key={tag}>{tag}</span>)}</div>
      <p className="mt-5 text-sm uppercase tracking-[0.18em] text-muted-foreground">User description</p>
      <div className="mt-2 border border-primary/15 p-4 text-sm leading-6 text-muted-foreground">{result.shortDescription}</div>
      <p className="mt-5 text-sm uppercase tracking-[0.18em] text-muted-foreground">Technical description</p>
      <p className="mt-2 leading-7 text-muted-foreground">{result.technicalDescription}</p>
      <div className="mt-5 grid grid-cols-2 border border-primary/15 text-sm md:grid-cols-4">
        <Stat label="Category" value={result.category ?? "DIY"} />
        <Stat label="Parts" value={partCount} />
        <Stat label="Cost" value={`${result.estimatedCostRon ?? 0} RON`} />
        <Stat label="Mode" value={mode} />
      </div>
      <div className="mt-5 border border-yellow-500/30 bg-yellow-950/20 p-4">
        <p className="mb-2 flex items-center gap-2 font-mono text-yellow-200"><AlertTriangle className="h-4 w-4" /> Safety</p>
        <ul className="space-y-2 text-sm text-yellow-100/80">{result.safetyWarnings?.map((warning) => <li key={warning}>- {warning}</li>)}</ul>
      </div>
      <div className="mt-5 border border-red-500/30 bg-red-950/10 p-4">
        <p className="mb-2 flex items-center gap-2 font-mono text-red-200"><Trash2 className="h-4 w-4" /> Danger zone</p>
        <p className="text-sm text-red-100/70">Ștergerea proiectului va fi activată după salvarea în workspace.</p>
      </div>
    </Panel>
  );
}

function PartsTab(props: {
  categoryCounts: [string, number][];
  filteredParts: Part[];
  partCategory: string;
  partCount: number;
  partQuery: string;
  partsView: "grid" | "list";
  setPartCategory: (value: string) => void;
  setPartQuery: (value: string) => void;
  setPartsView: (value: "grid" | "list") => void;
}) {
  return (
    <Panel title="Parts">
      <div className="relative mb-3">
        <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <input className="input-lab pl-10" placeholder="Search for parts" value={props.partQuery} onChange={(event) => props.setPartQuery(event.target.value)} />
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <button className={`lab-button ${props.partCategory === "All" ? "bg-white text-black" : ""}`} onClick={() => props.setPartCategory("All")} type="button">All {props.partCount}</button>
        {props.categoryCounts.map(([category, count]) => (
          <button className={`lab-button ${props.partCategory === category ? "bg-white text-black" : ""}`} key={category} onClick={() => props.setPartCategory(category)} type="button">{category} {count}</button>
        ))}
        <button className={`lab-icon-button ml-auto ${props.partsView === "list" ? "bg-white text-black" : ""}`} onClick={() => props.setPartsView("list")} type="button" aria-label="List view"><List className="h-4 w-4" /></button>
        <button className={`lab-icon-button ${props.partsView === "grid" ? "bg-white text-black" : ""}`} onClick={() => props.setPartsView("grid")} type="button" aria-label="Grid view"><Grid2X2 className="h-4 w-4" /></button>
      </div>
      <div className={props.partsView === "grid" ? "grid gap-4 md:grid-cols-2" : "grid gap-3"}>
        {props.filteredParts.map((part) => <PartCard key={part.name} part={part} compact={props.partsView === "list"} />)}
      </div>
    </Panel>
  );
}

function PartCard({ compact, part }: { compact: boolean; part: Part }) {
  const searchLink = `${part.supplierUrl}?q=${encodeURIComponent(part.name)}`;
  return (
    <div className={`overflow-hidden border border-primary/15 ${compact ? "grid md:grid-cols-[170px_1fr]" : ""}`}>
      <div className={`${compact ? "min-h-36" : "aspect-[16/10]"} bg-[linear-gradient(135deg,#efefef,#9aa59e)] p-4`}>
        <div className="grid h-full place-items-center border border-black/10 bg-white/25 font-mono text-sm text-black/60">{part.category}</div>
      </div>
      <div className="p-4">
        <h3 className="font-mono text-xl text-white">{part.name}</h3>
        <p className="mt-1 font-mono text-sm text-muted-foreground">{part.category}</p>
        <p className="mt-2 text-sm text-muted-foreground">{part.description}</p>
        <div className="mt-4 grid grid-cols-[1fr_auto] gap-4">
          <div className="font-mono text-sm text-muted-foreground">QTY<br /><span className="text-white">{part.quantity}</span> · ~{part.estimatedPriceRon} RON</div>
          <div className="grid gap-2">
            <a className="lab-button lab-button-primary" href={searchLink} target="_blank">{part.supplier}</a>
            <span className="flex items-center gap-1 font-mono text-xs text-primary"><BadgeCheck className="h-3 w-3" /> verifică preț</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function InstructionsTab({ doneCount, doneSteps, instructionCount, result, setDoneSteps }: { doneCount: number; doneSteps: Record<string, boolean>; instructionCount: number; result: Result; setDoneSteps: React.Dispatch<React.SetStateAction<Record<string, boolean>>> }) {
  return (
    <Panel title={`Instructions ${doneCount}/${instructionCount} done`}>
      <div className="mb-4 flex flex-wrap gap-2">
        <button className="lab-button"><RefreshCcw className="h-4 w-4" /> Regenerate</button>
        <button className="lab-button lab-button-primary"><Sparkles className="h-4 w-4" /> Generate all ({instructionCount})</button>
      </div>
      <div className="mb-4 border border-primary/15 p-4">
        <p className="mb-3 font-mono text-sm uppercase tracking-[0.16em] text-primary">Tools & assumptions</p>
        <div className="grid gap-4 md:grid-cols-2">
          <ul className="space-y-2 text-sm text-muted-foreground">{result.requiredTools?.map((tool) => <li key={tool}>- {tool}</li>)}</ul>
          <ul className="space-y-2 text-sm text-muted-foreground">{result.assumptions?.map((item) => <li key={item}>- {item}</li>)}</ul>
        </div>
      </div>
      <div className="space-y-4">
        {result.instructionGroups?.map((group, groupIndex) => (
          <div className="border border-primary/15" key={group.title}>
            <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-b border-primary/10 p-4">
              <h3 className="font-mono text-xl text-white">{groupIndex + 1}. {group.title}</h3>
              <span className="lab-badge">{group.steps.filter((_, index) => doneSteps[`${groupIndex}-${index}`]).length}/{group.steps.length}</span>
              <button className="lab-button"><Sparkles className="h-4 w-4" /> Generate ({group.steps.length})</button>
            </div>
            {group.steps.map((step, index) => {
              const id = `${groupIndex}-${index}`;
              return (
                <details className="border-b border-primary/10 p-4" key={id}>
                  <summary className="grid cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-3 font-mono text-muted-foreground">
                    <button className={`h-4 w-4 rounded-full border ${doneSteps[id] ? "border-primary bg-primary" : "border-muted-foreground/40"}`} onClick={(event) => { event.preventDefault(); setDoneSteps((current) => ({ ...current, [id]: !current[id] })); }} type="button" aria-label="Done" />
                    <span>{groupIndex + 1}.{index + 1} {step}</span>
                    <span className="lab-badge">3 parts</span>
                  </summary>
                  <div className="mt-4 border border-primary/15 p-4">
                    <div className="mb-4 grid min-h-36 place-items-center border border-primary/15 bg-black/50 text-center text-sm text-muted-foreground">
                      <Lock className="mb-2 h-6 w-6" />
                      Instruction image placeholder
                    </div>
                    <p className="font-mono text-white">{step}</p>
                    <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                      <li>Pregătește piesele asociate pasului.</li>
                      <li>Verifică polaritatea, orientarea și prinderea mecanică.</li>
                      <li>Testează incremental înainte de asamblarea finală.</li>
                    </ol>
                  </div>
                </details>
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <InfoList title="Testing" items={result.testingSteps ?? []} />
        <InfoList title="Troubleshooting" items={result.troubleshooting ?? []} />
      </div>
    </Panel>
  );
}

function IdeaModal({ onClose, onPick }: { onClose: () => void; onPick: (prompt: string) => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="terminal-panel max-h-[86vh] w-full max-w-2xl overflow-auto border-white/80 p-5">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-mono text-2xl uppercase tracking-[0.18em] text-white">
            <Sparkles className="h-5 w-5 text-primary" />
            Need an idea?
          </h2>
          <button className="lab-icon-button" onClick={onClose} type="button"><X className="h-5 w-5" /></button>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {ideaPrompts.map((prompt) => (
            <button className="border border-primary/20 bg-black/40 p-4 text-left font-mono text-sm text-muted-foreground transition hover:border-primary hover:text-white" key={prompt} onClick={() => onPick(prompt)} type="button">
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function RefineModal(props: {
  onClose: () => void;
  onGenerate: () => void;
  priority: number;
  selectedRefinements: Record<string, string>;
  setPriority: (value: number) => void;
  setSelectedRefinements: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="terminal-panel max-h-[86vh] w-full max-w-2xl overflow-auto border-white/80 p-5">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-mono text-2xl uppercase tracking-[0.18em] text-white">Refine your design</h2>
            <p className="mt-2 text-sm text-muted-foreground">Răspunde pentru arhitectură mai bună sau sari peste cu defaults.</p>
          </div>
          <button className="lab-icon-button" onClick={props.onClose} type="button"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-6">
          {refineQuestions.map((question, index) => (
            <div key={question.key}>
              <p className="mb-3 font-mono text-sm uppercase tracking-[0.16em] text-white">{index + 1}. {question.label}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {question.options.map((option) => {
                  const selected = props.selectedRefinements[question.key] === option;
                  return (
                    <button className={`border p-3 text-left font-mono text-sm transition ${selected ? "border-white bg-white text-black" : "border-primary/15 bg-black/40 text-muted-foreground hover:border-primary hover:text-white"}`} key={option} onClick={() => props.setSelectedRefinements((current) => ({ ...current, [question.key]: option }))} type="button">
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <div>
            <p className="mb-3 font-mono text-sm uppercase tracking-[0.16em] text-white">5. Ce contează mai mult?</p>
            <input className="w-full accent-primary" type="range" min="0" max="100" value={props.priority} onChange={(event) => props.setPriority(Number(event.target.value))} />
            <div className="mt-2 grid grid-cols-2 gap-4 text-xs text-muted-foreground">
              <span>Procesul: învățare & construcție</span>
              <span className="text-right">Rezultatul: produs final</span>
            </div>
          </div>
          <button className="lab-button lab-button-primary w-full" onClick={props.onGenerate} type="button">
            <Sparkles className="h-4 w-4" />
            Generate project ideas
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute right-0 top-12 z-40 w-80 border border-white/80 bg-[#0b0b0f] p-4 shadow-2xl">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center bg-primary text-black"><UserRound className="h-6 w-6" /></div>
        <div>
          <p className="font-mono text-white">oscar_builder</p>
          <p className="font-mono text-xs text-muted-foreground">local@laborator</p>
        </div>
        <button className="lab-icon-button ml-auto" onClick={onClose} type="button"><X className="h-4 w-4" /></button>
      </div>
      <div className="mb-4 flex items-center gap-3 font-mono text-sm text-muted-foreground"><span className="bg-white/10 px-3 py-2 text-white">FREE</span> 5/10 weekly</div>
      <MenuLine icon={<Sparkles className="h-4 w-4" />} text="Upgrade to Pro" strong />
      <MenuLine icon={<UserRound className="h-4 w-4" />} text="Change username" />
      <MenuLine icon={<Palette className="h-4 w-4" />} text="Profile color" suffix={<span className="h-4 w-4 bg-primary" />} />
      <MenuLine icon={<Sun className="h-4 w-4" />} text="Light mode" />
      <MenuLine icon={<ShieldAlert className="h-4 w-4" />} text="Feedback / safety report" />
    </div>
  );
}

function MenuLine({ icon, strong, suffix, text }: { icon: React.ReactNode; strong?: boolean; suffix?: React.ReactNode; text: string }) {
  return <button className={`flex w-full items-center gap-3 border-t border-primary/10 py-3 text-left font-mono ${strong ? "text-white" : "text-muted-foreground"}`} type="button">{icon}{text}<span className="ml-auto">{suffix}</span></button>;
}

function LegendPanel() {
  return (
    <div className="border border-primary/15 p-4">
      <p className="mb-4 border-b border-white pb-2 font-mono text-lg uppercase tracking-[0.16em] text-white">Schematic</p>
      {["MCU", "Sensor", "Actuator", "Power", "Module", "Display"].map((item) => <div className="mb-2 font-mono text-sm text-muted-foreground" key={item}>◇ {item}</div>)}
      <div className="mt-4 border-t border-white pt-4">
        <p className="font-mono text-sm text-primary">━━ DATA</p>
        <p className="font-mono text-sm text-yellow-300">┈┈ POWER</p>
        <p className="font-mono text-sm text-slate-300">── GROUND</p>
      </div>
    </div>
  );
}

function InfoList({ items, title }: { items: string[]; title: string }) {
  return (
    <div className="border border-primary/15 p-4">
      <p className="mb-3 font-mono text-sm uppercase tracking-[0.16em] text-primary">{title}</p>
      <ul className="space-y-2 text-sm text-muted-foreground">{items.map((item) => <li key={item}>- {item}</li>)}</ul>
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
    <div className="border-r border-b border-primary/15 p-3 last:border-r-0 md:border-b-0">
      <div className="font-mono text-xs uppercase text-muted-foreground">{label}</div>
      <div className="mt-1 break-words font-mono text-white">{value}</div>
    </div>
  );
}

function enrichMermaid(chart: string) {
  return `${chart}\n  classDef power fill:#201400,stroke:#fbbf24,color:#fde68a\n  classDef logic fill:#001b0b,stroke:#00ff66,color:#dcffe8`;
}
