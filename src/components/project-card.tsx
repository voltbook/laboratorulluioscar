import Image from "next/image";
import Link from "next/link";
import { Clock3, Cpu, Star, UserRound } from "lucide-react";
import { formatRon } from "@/lib/demo-data";
import type { LabProject } from "@/lib/types";

export function ProjectCard({ project, compact = false }: { project: LabProject; compact?: boolean }) {
  const electricalCount = project.parts.filter((part) => part.category !== "Mechanical").reduce((sum, part) => sum + part.quantity, 0);
  const mechanicalCount = project.parts.filter((part) => part.category === "Mechanical").reduce((sum, part) => sum + part.quantity, 0);
  const partCount = electricalCount + mechanicalCount;
  const dateLabel = new Date(project.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  if (compact) {
    return (
      <Link href={`/projects/${project.id}`} className="group block overflow-hidden border border-primary/15 bg-[#111115] transition hover:border-white/70">
        <div className="relative aspect-[4/3] overflow-hidden bg-black">
          <Image src={project.image} alt={project.title} fill className="object-cover opacity-95 transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 33vw" unoptimized />
        </div>
        <div className="p-3 md:p-4">
          <h3 className="min-h-[3.2rem] font-mono text-base uppercase tracking-[0.08em] text-white md:text-xl">{project.title}</h3>
          <div className="mt-4 grid grid-cols-[1fr_auto_auto] items-center gap-2 font-mono text-xs text-muted-foreground md:text-sm">
            <span>{partCount}<br className="md:hidden" /> parts</span>
            <span className="flex items-center gap-1 text-yellow-300"><Star className="h-3.5 w-3.5 fill-yellow-300" />{project.stars}</span>
            <span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{dateLabel}</span>
          </div>
          <div className="mt-3 flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <span className="grid h-4 w-4 place-items-center bg-primary text-[9px] text-black">↯</span>
            {project.creatorUsername}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/projects/${project.id}`} className="group terminal-panel block overflow-hidden transition hover:-translate-y-1 hover:border-primary/60">
      <div className="relative aspect-[16/10] overflow-hidden border-b border-primary/20 bg-black">
        <Image src={project.image} alt={project.title} fill className="object-cover opacity-90 transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" unoptimized />
        <div className="absolute left-3 top-3 border border-primary/40 bg-black/70 px-2 py-1 font-mono text-xs text-primary">{project.category}</div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-mono text-lg text-white">{project.title}</h3>
          <div className="flex shrink-0 items-center gap-1 font-mono text-sm text-primary">
            <Star className="h-4 w-4 fill-primary" />
            {project.stars}
          </div>
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{project.shortDescription}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="lab-badge"><Cpu className="h-3 w-3" /> {partCount} piese</span>
          <span className="lab-badge">{formatRon(project.estimatedCostRon)}</span>
          <span className="lab-badge">{project.difficulty}</span>
        </div>
        <div className="mt-4 flex items-center gap-2 border-t border-primary/10 pt-3 text-xs text-muted-foreground">
          <UserRound className="h-4 w-4 text-primary" />
          {project.creatorUsername} · {new Date(project.createdAt).toLocaleDateString("ro-RO")}
        </div>
      </div>
    </Link>
  );
}
