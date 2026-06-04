"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Box,
  Code2,
  Copy,
  Download,
  FileText,
  Grid2X2,
  Info,
  List,
  Search,
  Star,
  UserRound,
  Workflow,
} from "lucide-react";
import { MermaidDiagram } from "@/components/mermaid-diagram";
import { PdfExportButton } from "@/components/pdf-export-button";
import { ProjectModelViewer } from "@/components/project-model-viewer";
import { formatRon } from "@/lib/demo-data";
import type { LabProject } from "@/lib/types";

const tabs = [
  ["info", Info, "Info"],
  ["parts", List, "Parts"],
  ["wiring", Workflow, "Wiring"],
  ["mech", Box, "Mech"],
  ["instructions", FileText, "Instructions"],
  ["code", Code2, "Code"],
  ["pdf", Download, "PDF"],
] as const;

export function ProjectDetailClient({ project }: { project: LabProject }) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number][0]>("info");
  const [partQuery, setPartQuery] = useState("");
  const [partFilter, setPartFilter] = useState("All");
  const [partsView, setPartsView] = useState<"list" | "grid">("grid");
  const [starred, setStarred] = useState(false);
  const [copied, setCopied] = useState(false);
  const [done, setDone] = useState<Record<number, boolean>>({});

  const electrical = project.parts.filter((part) => part.category !== "Mechanical");
  const mechanical = project.parts.filter((part) => part.category === "Mechanical");
  const totalParts = project.parts.reduce((sum, part) => sum + part.quantity, 0);
  const electricalCount = electrical.reduce((sum, part) => sum + part.quantity, 0);
  const mechanicalCount = mechanical.reduce((sum, part) => sum + part.quantity, 0);
  const electricalCost = electrical.reduce((sum, part) => sum + part.quantity * part.estimatedPriceRon, 0);
  const mechanicalCost = mechanical.reduce((sum, part) => sum + part.quantity * part.estimatedPriceRon, 0);

  const filteredParts = useMemo(() => {
    const q = partQuery.toLowerCase();
    return project.parts.filter((part) => {
      const matchesFilter = partFilter === "All" || part.category === partFilter;
      const matchesQuery = !q || `${part.name} ${part.subtitle} ${part.notes} ${part.supplier}`.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [partFilter, partQuery, project.parts]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
      <div className="sticky top-0 z-30 -mx-4 border-b border-primary/10 bg-background/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <a className="lab-icon-button shrink-0" href="/community" aria-label="Înapoi">
              <ArrowLeft className="h-5 w-5" />
            </a>
            <h1 className="truncate font-mono text-lg uppercase tracking-[0.2em] text-white md:text-2xl">{project.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden border border-primary/20 px-2 py-1 font-mono text-xs text-white sm:inline">{starred ? project.stars + 1 : project.stars} ⚡</span>
            <button className="lab-icon-button" type="button" aria-label="Profil">
              <UserRound className="h-4 w-4 text-primary" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {tabs.map(([tab, Icon, label]) => (
            <button className={`flex items-center justify-center gap-2 border-b-2 py-2 font-mono text-xs uppercase ${activeTab === tab ? "border-white text-white" : "border-transparent text-muted-foreground"}`} key={tab} onClick={() => setActiveTab(tab)} type="button">
              <Icon className="h-4 w-4" />
              <span className="hidden md:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === "info" ? (
        <section className="py-6">
          <div className="relative aspect-[16/9] overflow-hidden border border-primary/15 bg-black">
            <Image src={project.image} alt={project.title} fill className="object-cover" sizes="100vw" priority unoptimized />
          </div>
          <div className="mt-8">
            <h2 className="font-mono text-3xl uppercase tracking-[0.16em] text-white">{project.title}</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.tags.map((tag) => <span className="lab-badge uppercase" key={tag}>{tag}</span>)}
            </div>
            <p className="mt-7 font-mono text-sm uppercase tracking-[0.18em] text-muted-foreground">Technical description</p>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-muted-foreground">{project.technicalDescription}</p>
            <div className="mt-7 max-w-3xl border border-primary/15 font-mono text-sm">
              <div className="grid grid-cols-3 border-b border-primary/15 p-3 uppercase text-muted-foreground">
                <span>Category</span><span className="text-right">Parts</span><span className="text-right">Cost</span>
              </div>
              <CostRow label="Electrical" count={electricalCount} cost={electricalCost} />
              <CostRow label="Mechanical" count={mechanicalCount} cost={mechanicalCost} />
              <CostRow label="Total" count={totalParts} cost={electricalCost + mechanicalCost} strong />
            </div>
            <div className="mt-8 flex items-center gap-2 font-mono text-muted-foreground">
              <span className="grid h-6 w-6 place-items-center bg-primary text-xs text-black">↯</span>
              {project.creatorUsername}
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <button className="lab-button h-14" onClick={() => setStarred((value) => !value)} type="button">
                <Star className={`h-5 w-5 ${starred ? "fill-yellow-300 text-yellow-300" : ""}`} />
                Star ({starred ? project.stars + 1 : project.stars})
              </button>
              <button className="lab-button h-14 bg-white text-black" onClick={() => setCopied(true)} type="button">
                <Copy className="h-5 w-5" />
                {copied ? "Copied to my projects" : "Copy to my projects"}
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === "parts" ? (
        <section className="py-5">
          <label className="relative mb-3 block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input className="input-lab h-14 pl-12 font-mono text-lg" placeholder="Search for parts" value={partQuery} onChange={(event) => setPartQuery(event.target.value)} />
          </label>
          <div className="mb-5 flex flex-wrap gap-2">
            <FilterButton active={partFilter === "All"} onClick={() => setPartFilter("All")}>All {totalParts}</FilterButton>
            <FilterButton active={partFilter === "Electrical"} onClick={() => setPartFilter("Electrical")}>Electrical {electricalCount}</FilterButton>
            <FilterButton active={partFilter === "Mechanical"} onClick={() => setPartFilter("Mechanical")}>Mechanical {mechanicalCount}</FilterButton>
            <button className={`lab-icon-button ml-auto ${partsView === "list" ? "bg-white text-black" : ""}`} onClick={() => setPartsView("list")} type="button" aria-label="List view"><List className="h-4 w-4" /></button>
            <button className={`lab-icon-button ${partsView === "grid" ? "bg-white text-black" : ""}`} onClick={() => setPartsView("grid")} type="button" aria-label="Grid view"><Grid2X2 className="h-4 w-4" /></button>
          </div>
          <div className={partsView === "grid" ? "grid gap-5 md:grid-cols-2" : "grid gap-4"}>
            {filteredParts.map((part) => (
              <article className={`overflow-hidden border border-primary/15 bg-[#111115] ${partsView === "list" ? "grid md:grid-cols-[220px_1fr]" : ""}`} key={part.name}>
                <div className={`relative bg-white ${partsView === "list" ? "min-h-56" : "aspect-[4/3]"}`}>
                  <Image src={part.image ?? project.image} alt={part.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" unoptimized />
                  <span className="absolute right-3 top-3 border border-primary/40 bg-black/70 px-2 py-1 font-mono text-xs text-primary">{part.category}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-mono text-xl text-white md:text-2xl">{part.name}</h3>
                  <p className="mt-1 font-mono text-sm text-muted-foreground">{part.subtitle}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{part.notes}</p>
                  <div className="mt-4 border-t border-white/70 pt-4">
                    <div className="grid grid-cols-[1fr_auto] gap-4">
                      <p className="font-mono text-sm text-muted-foreground">QTY&nbsp;&nbsp; UNIT<br /><span className="text-white">{part.quantity}</span>&nbsp;&nbsp;&nbsp; ~{formatRon(part.estimatedPriceRon)}</p>
                      <a className="lab-button bg-orange-500 text-black hover:bg-orange-400" href={part.link} target="_blank">{part.supplier}</a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === "wiring" ? (
        <section className="py-5">
          <div className="min-h-[640px] border border-primary/15 bg-[#070908] p-4">
            <MermaidDiagram chart={project.wiringDiagram} />
            <Legend />
          </div>
        </section>
      ) : null}

      {activeTab === "mech" ? (
        <section className="py-5">
          <div className="relative">
            <ProjectModelViewer />
            <div className="mt-4 border border-primary/15 p-4 md:absolute md:bottom-6 md:left-6 md:mt-0 md:w-64 md:bg-black/75">
              <p className="mb-3 border-b border-white pb-2 font-mono text-lg uppercase text-white">3D CAD</p>
              {["Electrical", "Structural", "Enclosure", "Mechanism", "Misc", "3D Print"].map((layer) => (
                <p className="mb-2 font-mono text-sm uppercase text-muted-foreground" key={layer}>◇ {layer}</p>
              ))}
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{project.modelDescription}</p>
        </section>
      ) : null}

      {activeTab === "instructions" ? (
        <section className="py-5">
          <div className="mb-6 flex items-center gap-3 border-b border-primary/15 pb-4">
            <FileText className="h-5 w-5 text-white" />
            <h2 className="font-mono text-2xl uppercase tracking-[0.16em] text-white">Instructions</h2>
            <span className="font-mono text-sm uppercase text-muted-foreground">Legacy</span>
          </div>
          <h3 className="mb-8 font-mono text-2xl text-white">Project: {project.title}</h3>
          <div className="mb-8 border-l-4 border-white pl-4">
            <h4 className="mb-4 font-mono text-xl font-bold text-white">Assumptions</h4>
            <div className="space-y-3 font-mono text-muted-foreground">
              {project.assumptions.map((item) => <p key={item}>{item}</p>)}
            </div>
          </div>
          <div className="mb-8 border-l-4 border-white pl-4">
            <h4 className="mb-4 font-mono text-xl font-bold text-white">Action Items</h4>
            <div className="space-y-4">
              {project.assemblyInstructions.map((step, index) => (
                <label className="grid cursor-pointer grid-cols-[auto_1fr] gap-4 font-mono text-lg leading-7 text-muted-foreground" key={step}>
                  <input className="mt-1 h-6 w-6 accent-primary" checked={Boolean(done[index])} onChange={() => setDone((current) => ({ ...current, [index]: !current[index] }))} type="checkbox" />
                  <span>{step}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="border-l-4 border-white pl-4">
            <h4 className="mb-4 font-mono text-xl font-bold text-white">Assembly Key Points</h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 font-mono text-lg text-muted-foreground">
              {project.parts.slice(0, 8).map((part) => <span key={part.name}>{part.name.toLowerCase().replaceAll(" ", "_")}</span>)}
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === "code" ? (
        <section className="py-5">
          <button className="lab-button mb-4" onClick={() => navigator.clipboard.writeText(project.codeFiles[0]?.code ?? "")} type="button">
            <Copy className="h-4 w-4" />
            Copy code
          </button>
          {project.codeFiles.map((file) => <pre className="overflow-auto border border-primary/20 bg-black/70 p-4 text-xs leading-6 text-primary/90" key={file.filename}>{file.code}</pre>)}
        </section>
      ) : null}

      {activeTab === "pdf" ? (
        <section className="py-5">
          <div className="border border-primary/15 p-5">
            <h2 className="font-mono text-2xl uppercase text-white">Export PDF</h2>
            <p className="mt-3 mb-5 text-muted-foreground">Exportă ghidul How To cu descriere, piese, montaj, testing și troubleshooting.</p>
            <PdfExportButton project={project} />
          </div>
        </section>
      ) : null}
    </main>
  );
}

function CostRow({ count, cost, label, strong = false }: { count: number; cost: number; label: string; strong?: boolean }) {
  return (
    <div className={`grid grid-cols-3 border-b border-primary/10 p-3 last:border-b-0 ${strong ? "font-bold text-white" : "text-muted-foreground"}`}>
      <span>{label}</span>
      <span className="text-right">{count}</span>
      <span className="text-right">{formatRon(cost)}</span>
    </div>
  );
}

function FilterButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return <button className={`lab-button ${active ? "bg-white text-black" : ""}`} onClick={onClick} type="button">{children}</button>;
}

function Legend() {
  return (
    <div className="mt-6 w-full max-w-64 border border-primary/15 bg-black/70 p-4">
      <p className="mb-4 border-b border-white pb-2 font-mono text-lg uppercase tracking-[0.16em] text-white">Schematic</p>
      {["MCU", "Sensor", "Actuator", "Power", "Module", "Display"].map((item) => <p className="mb-2 font-mono text-sm uppercase text-muted-foreground" key={item}>◇ {item}</p>)}
      <div className="mt-4 border-t border-white pt-4">
        <p className="font-mono text-sm text-primary">━━ DATA</p>
        <p className="font-mono text-sm text-yellow-300">┈┈ POWER</p>
        <p className="font-mono text-sm text-slate-300">── GROUND</p>
      </div>
    </div>
  );
}
