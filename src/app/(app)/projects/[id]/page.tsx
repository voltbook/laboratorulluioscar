import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/demo-data";
import { ProjectDetailClient } from "@/components/project-detail-client";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = getProjectById(id);
  if (!project) notFound();

  return <ProjectDetailClient project={project} />;
}
