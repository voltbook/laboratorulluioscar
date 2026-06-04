import { demoProjects } from "@/lib/demo-data";
import { ProjectCard } from "@/components/project-card";

export default function SavedPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="font-mono text-sm uppercase tracking-[0.25em] text-primary">Workspace</p>
      <h1 className="mt-2 font-mono text-3xl text-white">Proiecte salvate</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">Demo local pentru proiectele copiate din comunitate. După conectarea Supabase Auth, lista devine per user.</p>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {demoProjects.slice(2, 8).map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </main>
  );
}
