"use client";

import { useEffect, useId, useRef } from "react";
import mermaid from "mermaid";

export function MermaidDiagram({ chart }: { chart: string }) {
  const id = useId().replace(/:/g, "");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
      themeVariables: {
        primaryColor: "#04120a",
        primaryTextColor: "#f4fff8",
        primaryBorderColor: "#00ff66",
        lineColor: "#00ff66",
        secondaryColor: "#071b10",
        tertiaryColor: "#0b0f0c",
      },
    });
    mermaid.render(`diagram-${id}`, chart).then(({ svg }) => {
      if (ref.current) ref.current.innerHTML = svg;
    });
  }, [chart, id]);

  return <div ref={ref} className="mermaid-wrap min-h-72 overflow-auto rounded-sm border border-primary/20 bg-black/60 p-4" />;
}
