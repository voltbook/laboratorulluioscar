import { KeyRound, LogIn } from "lucide-react";

export default function AuthPage() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-65px)] max-w-7xl place-items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="terminal-panel w-full max-w-md p-6">
        <p className="font-mono text-sm uppercase tracking-[0.25em] text-primary">Auth gateway</p>
        <h1 className="mt-2 font-mono text-3xl text-white">Login / Register</h1>
        <div className="mt-6 space-y-4">
          <input className="input-lab" placeholder="email@laborator.ro" type="email" />
          <input className="input-lab" placeholder="parolă" type="password" />
          <button className="lab-button lab-button-primary w-full" type="button"><LogIn className="h-4 w-4" /> Intră în laborator</button>
          <button className="lab-button w-full" type="button"><KeyRound className="h-4 w-4" /> Continuă cu magic link</button>
        </div>
        <p className="mt-5 text-sm leading-6 text-muted-foreground">Formular pregătit pentru Supabase Auth. Conectarea reală se activează după aplicarea variabilelor Supabase și a politicilor RLS.</p>
      </div>
    </main>
  );
}
