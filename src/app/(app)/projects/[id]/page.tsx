import { notFound } from "next/navigation";
import { AlertTriangle, Box, Code2, Cpu, FileText, Info, ListChecks, Route, Star } from "lucide-react";
import { getProjectById, formatRon } from "@/lib/demo-data";
import { MermaidDiagram } from "@/components/mermaid-diagram";
import { PdfExportButton } from "@/components/pdf-export-button";
import { ProjectModelViewer } from "@/components/project-model-viewer";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = getProjectById(id);
  if (!project) notFound();

  const tabs = [
    { id: "info", label: "Info", icon: Info },
    { id: "parts", label: "Piese", icon: Cpu },
    { id: "wiring", label: "Wiring", icon: Route },
    { id: "model", label: "3D", icon: Box },
    { id: "instructions", label: "Instrucțiuni", icon: ListChecks },
    { id: "code", label: "Code", icon: Code2 },
    { id: "pdf", label: "PDF", icon: FileText },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="lab-badge">{project.category}</span>
            <span className="lab-badge">{project.difficulty}</span>
            <span className="lab-badge">{formatRon(project.estimatedCostRon)}</span>
          </div>
          <h1 className="font-mono text-4xl text-white">{project.title}</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">{project.shortDescription}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="lab-badge h-10 px-3"><Star className="h-4 w-4 fill-primary" /> {project.stars}</div>
          <PdfExportButton project={project} />
        </div>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <a className="lab-button shrink-0" href={`#${tab.id}`} key={tab.id}>
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </a>
        ))}
      </div>

      <div className="grid gap-6">
        <section id="info" className="terminal-panel p-5">
          <h2 className="mb-3 font-mono text-2xl text-white">Info</h2>
          <p className="leading-7 text-muted-foreground">{project.technicalDescription}</p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {project.assumptions.map((item) => <div className="border border-primary/20 p-3 text-sm text-muted-foreground" key={item}>{item}</div>)}
          </div>
          <div className="mt-5 border border-yellow-400/30 bg-yellow-950/20 p-4">
            <div className="mb-2 flex items-center gap-2 font-mono text-yellow-200"><AlertTriangle className="h-5 w-5" /> Safety</div>
            <ul className="space-y-2 text-sm text-yellow-100/80">
              {project.safetyWarnings.map((warning) => <li key={warning}>{warning}</li>)}
            </ul>
          </div>
        </section>

        <section id="parts" className="terminal-panel overflow-hidden p-5">
          <h2 className="mb-4 font-mono text-2xl text-white">Piese</h2>
          <div className="overflow-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-primary/20 font-mono text-primary">
                <tr><th className="py-3">Piesă</th><th>Cant.</th><th>Preț</th><th>Furnizor</th><th>Note</th></tr>
              </thead>
              <tbody className="divide-y divide-primary/10 text-muted-foreground">
                {project.parts.map((part) => (
                  <tr key={part.name}><td className="py-3 text-white">{part.name}</td><td>{part.quantity}</td><td>{formatRon(part.estimatedPriceRon)}</td><td><a className="text-primary" href={part.link}>{part.supplier}</a></td><td>{part.notes}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="wiring" className="terminal-panel p-5">
          <h2 className="mb-4 font-mono text-2xl text-white">Wiring</h2>
          <MermaidDiagram chart={project.wiringDiagram} />
        </section>

        <section id="model" className="terminal-panel p-5">
          <h2 className="mb-4 font-mono text-2xl text-white">3D Model</h2>
          <ProjectModelViewer />
          <p className="mt-3 text-sm text-muted-foreground">{project.modelDescription}</p>
        </section>

        <section id="instructions" className="terminal-panel p-5">
          <h2 className="mb-4 font-mono text-2xl text-white">Instrucțiuni</h2>
          <ol className="space-y-3">
            {project.assemblyInstructions.map((step, index) => <li className="border border-primary/20 p-3 text-muted-foreground" key={step}><span className="font-mono text-primary">{index + 1}. </span>{step}</li>)}
          </ol>
        </section>

        <section id="code" className="terminal-panel p-5">
          <h2 className="mb-4 font-mono text-2xl text-white">Code</h2>
          {project.codeFiles.map((file) => <pre className="overflow-auto border border-primary/20 bg-black/70 p-4 text-xs leading-6 text-primary/90" key={file.filename}>{file.code}</pre>)}
        </section>

        <section id="pdf" className="terminal-panel p-5">
          <h2 className="mb-4 font-mono text-2xl text-white">Export PDF</h2>
          <p className="mb-4 text-muted-foreground">Exportă ghidul How To cu descriere, piese și pași de montaj.</p>
          <PdfExportButton project={project} />
        </section>
      </div>
    </main>
  );
}
