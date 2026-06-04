import { demoProjects } from "@/lib/demo-data";
import { CommunityClient } from "@/components/community-client";

export default function CommunityPage() {
  return <CommunityClient projects={demoProjects} />;
}
