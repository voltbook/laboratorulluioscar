import Image from "next/image";
import { KeyRound, LogIn } from "lucide-react";

export default function AuthPage() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-65px)] max-w-7xl place-items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="terminal-panel w-full max-w-md p-6">
        <Image src="/brand/oscar-laboratory-logo.png" alt="Oscar's Laboratory logo" width={112} height={112} className="mx-auto mb-5 h-24 w-24 object-contain" />
        <p className="font-mono text-sm uppercase tracking-[0.25em] text-primary">Oscar&apos;s Laboratory auth gateway</p>
        <h1 className="mt-2 font-mono text-3xl text-white">Login / Register</h1>
        <div className="mt-6 space-y-4">
          <input className="input-lab" placeholder="player@oscar-lab.ai" type="email" />
          <input className="input-lab" placeholder="password" type="password" />
          <button className="lab-button lab-button-primary w-full" type="button"><LogIn className="h-4 w-4" /> Enter the Laboratory</button>
          <button className="lab-button w-full" type="button"><KeyRound className="h-4 w-4" /> Continue with magic link</button>
        </div>
        <p className="mt-5 text-sm leading-6 text-muted-foreground">Form prepared for Supabase Auth. The real connection remains compatible with the existing Supabase setup and RLS policies.</p>
      </div>
    </main>
  );
}
