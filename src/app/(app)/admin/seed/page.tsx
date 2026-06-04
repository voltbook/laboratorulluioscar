import { Database, ShieldCheck } from "lucide-react";
import { demoProjects } from "@/lib/demo-data";

export default function SeedPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="font-mono text-sm uppercase tracking-[0.25em] text-primary">Admin</p>
      <h1 className="mt-2 font-mono text-3xl text-white">Seed panel</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="terminal-panel p-5">
          <Database className="mb-4 h-6 w-6 text-primary" />
          <h2 className="font-mono text-xl text-white">Demo projects</h2>
          <p className="mt-2 text-muted-foreground">{demoProjects.length} proiecte pregătite pentru seed în Supabase Postgres.</p>
        </div>
        <div className="terminal-panel p-5">
          <ShieldCheck className="mb-4 h-6 w-6 text-primary" />
          <h2 className="font-mono text-xl text-white">RLS activ</h2>
          <p className="mt-2 text-muted-foreground">Migrația include politici pentru view public, editare proprie, stele și copiere în workspace.</p>
        </div>
      </div>
      <div className="terminal-panel mt-6 overflow-auto p-5">
        <pre className="text-sm leading-7 text-muted-foreground">{`supabase init
supabase link --project-ref awceewlqdibjtwcqhtgh
supabase db push`}</pre>
      </div>
    </main>
  );
}
