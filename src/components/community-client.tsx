"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock3, Globe2, Rocket, Search, Star } from "lucide-react";
import { ProjectCard } from "@/components/project-card";
import type { LabProject } from "@/lib/types";

type SortMode = "Recent" | "Trending" | "Top";

export function CommunityClient({ projects }: { projects: LabProject[] }) {
  const [scope, setScope] = useState<"All" | "Starred">("All");
  const [sort, setSort] = useState<SortMode>("Trending");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = projects.filter((project) => {
      const haystack = `${project.title} ${project.category} ${project.creatorUsername} ${project.tags.join(" ")}`.toLowerCase();
      const matchesQuery = !q || haystack.includes(q);
      const matchesScope = scope === "All" || project.stars >= 50;
      return matchesQuery && matchesScope;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "Recent") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sort === "Top") return b.stars - a.stars;
      return b.stars + b.votes - (a.stars + a.votes);
    });
  }, [projects, query, scope, sort]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-10 border-b border-primary/10 pb-8">
        <div className="mb-8 flex items-center gap-4">
          <Link className="lab-icon-button" href="/" aria-label="Înapoi">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-mono text-3xl uppercase tracking-[0.28em] text-white md:text-4xl">Community</h1>
        </div>
        <p className="max-w-xl font-mono text-lg leading-8 text-muted-foreground">Explore projects published by the community.</p>
      </div>

      <div className="mb-6 grid gap-3">
        <div className="grid grid-cols-2 border border-primary/15">
          <button className={`flex items-center justify-center gap-2 p-3 font-mono text-sm uppercase ${scope === "All" ? "bg-white text-black" : "text-muted-foreground"}`} onClick={() => setScope("All")} type="button">
            <Globe2 className="h-4 w-4" />
            All
          </button>
          <button className={`flex items-center justify-center gap-2 p-3 font-mono text-sm uppercase ${scope === "Starred" ? "bg-white text-black" : "text-muted-foreground"}`} onClick={() => setScope("Starred")} type="button">
            <Star className="h-4 w-4" />
            Starred
          </button>
        </div>

        <div className="grid grid-cols-3 border border-primary/15">
          {[
            ["Recent", Clock3],
            ["Trending", Rocket],
            ["Top", Star],
          ].map(([label, Icon]) => (
            <button className={`flex items-center justify-center gap-2 p-3 font-mono text-sm uppercase ${sort === label ? "bg-white text-black" : "text-muted-foreground"}`} key={label as string} onClick={() => setSort(label as SortMode)} type="button">
              <Icon className="h-4 w-4" />
              {label as string}
            </button>
          ))}
        </div>

        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input className="input-lab h-14 pl-12 font-mono text-lg" placeholder="Search projects..." value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-5 xl:grid-cols-3">
        {visible.map((project) => (
          <ProjectCard key={project.id} project={project} compact />
        ))}
      </div>
    </main>
  );
}
