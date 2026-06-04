"use client";

import { FileDown } from "lucide-react";
import jsPDF from "jspdf";
import type { LabProject } from "@/lib/types";

export function PdfExportButton({ project }: { project: LabProject }) {
  const exportPdf = () => {
    const doc = new jsPDF();
    const margin = 14;
    let y = 18;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(project.title, margin, y);
    y += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(project.technicalDescription, 180);
    doc.text(lines, margin, y);
    y += lines.length * 5 + 8;
    doc.setFont("helvetica", "bold");
    doc.text("Piese", margin, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    project.parts.forEach((part) => {
      doc.text(`- ${part.quantity}x ${part.name} ~ ${part.estimatedPriceRon} RON (${part.supplier})`, margin, y);
      y += 6;
    });
    y += 4;
    doc.setFont("helvetica", "bold");
    doc.text("Pași montaj", margin, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    project.assemblyInstructions.forEach((step, index) => {
      const stepLines = doc.splitTextToSize(`${index + 1}. ${step}`, 180);
      doc.text(stepLines, margin, y);
      y += stepLines.length * 5 + 2;
    });
    doc.save(`${project.id}-how-to.pdf`);
  };

  return (
    <button className="lab-button lab-button-primary" onClick={exportPdf} type="button">
      <FileDown className="h-4 w-4" />
      Export PDF
    </button>
  );
}
