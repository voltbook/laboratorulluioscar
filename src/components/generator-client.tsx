"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";

type Result = {
  title: string;
  shortDescription: string;
  estimatedCostRon: number;
  parts: { name: string; quantity: number; estimatedPriceRon: number; supplier: string }[];
  safetyWarnings: string[];
  wiringDiagram: string;
  assemblyInstructions: string[];
  code: string;
};

const starter = "Vreau o seră inteligentă cu ESP32, senzori de umiditate, pompă 12V și alertă pe telefon.";

export function GeneratorClient() {
  const [idea, setIdea] = useState(starter);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/generate-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });
      if (!response.ok) throw new Error("Generatorul nu a răspuns corect.");
      setResult(await response.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Eroare necunoscută.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <textarea className="textarea-lab min-h-44 resize-none" value={idea} onChange={(event) => setIdea(event.target.value)} />
      <button className="lab-button lab-button-primary w-full" onClick={generate} disabled={loading} type="button">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Generează proiect
      </button>
      {error ? <div className="border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-200">{error}</div> : null}
      {result ? (
        <div className="space-y-4 border-t border-primary/20 pt-4">
          <div>
            <p className="font-mono text-primary">output.title</p>
            <h2 className="mt-1 font-mono text-2xl text-white">{result.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{result.shortDescription}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border border-primary/20 p-3">
              <p className="font-mono text-sm text-primary">Cost</p>
              <p className="text-xl text-white">{result.estimatedCostRon} RON</p>
            </div>
            <div className="border border-primary/20 p-3">
              <p className="font-mono text-sm text-primary">Piese</p>
              <p className="text-xl text-white">{result.parts?.length ?? 0}</p>
            </div>
          </div>
          <pre className="max-h-80 overflow-auto border border-primary/20 bg-black/60 p-4 text-xs leading-6 text-muted-foreground">{JSON.stringify(result, null, 2)}</pre>
        </div>
      ) : null}
    </div>
  );
}
