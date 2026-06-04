import { Search } from "lucide-react";
import { demoProjects } from "@/lib/demo-data";
import { ProjectCard } from "@/components/project-card";

const filters = ["All", "Starred", "Recent", "Trending", "Top", "Robotică", "IoT", "Energie", "Smart Home"];

export default function CommunityPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-7">
        <p className="font-mono text-sm uppercase tracking-[0.25em] text-primary">Community</p>
        <h1 className="mt-2 font-mono text-3xl text-white">Proiecte publice</h1>
      </div>
      <div className="terminal-panel mb-6 grid gap-4 p-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
          <input className="input-lab pl-10" placeholder="Caută proiect, categorie, creator..." />
        </label>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button className="lab-button h-9 px-3" key={filter} type="button">{filter}</button>
          ))}
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {demoProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </main>
  );
}
