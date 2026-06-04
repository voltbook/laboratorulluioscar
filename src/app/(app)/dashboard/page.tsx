import { Activity, Cpu, FileDown, Star, Zap } from "lucide-react";
import { demoProjects, formatRon, getTrendingProjects } from "@/lib/demo-data";
import { ProjectCard } from "@/components/project-card";

export default function DashboardPage() {
  const totalCost = demoProjects.reduce((sum, project) => sum + project.estimatedCostRon, 0);
  const metrics = [
    { label: "Proiecte publice", value: demoProjects.length, icon: Cpu },
    { label: "Stele comunitate", value: demoProjects.reduce((sum, p) => sum + p.stars, 0), icon: Star },
    { label: "Cost mediu", value: formatRon(Math.round(totalCost / demoProjects.length)), icon: Zap },
    { label: "Exporturi PDF", value: "ready", icon: FileDown },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-3">
        <Activity className="h-7 w-7 text-primary" />
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.25em] text-primary">Control room</p>
          <h1 className="font-mono text-3xl text-white">Dashboard laborator</h1>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {metrics.map((metric) => (
          <div className="terminal-panel p-4" key={metric.label}>
            <metric.icon className="mb-4 h-5 w-5 text-primary" />
            <div className="font-mono text-2xl text-white">{metric.value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{metric.label}</div>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {getTrendingProjects().slice(0, 6).map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </main>
  );
}
