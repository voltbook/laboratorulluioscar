import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

const requestSchema = z.object({ idea: z.string().min(8).max(3000) });

const fallback = (idea: string) => ({
  title: "Proiect DIY generat local",
  shortDescription: `Blueprint tehnic pentru: ${idea}`,
  estimatedCostRon: 360,
  parts: [
    { name: "ESP32 DevKit", quantity: 1, estimatedPriceRon: 45, supplier: "OptimusDigital" },
    { name: "Senzor principal", quantity: 1, estimatedPriceRon: 28, supplier: "Robofun" },
    { name: "Modul releu / driver", quantity: 1, estimatedPriceRon: 22, supplier: "Mivarom" },
  ],
  safetyWarnings: ["Testează cu alimentare joasă tensiune.", "Pentru 230V cere ajutorul unui electrician autorizat."],
  wiringDiagram: "flowchart LR\nESP32-->SENSOR\nESP32-->DRIVER\nDRIVER-->ACTUATOR",
  assemblyInstructions: ["Planifică schema", "Montează piesele", "Încarcă firmware-ul", "Testează controlat"],
  code: "void setup(){ Serial.begin(115200); }\nvoid loop(){ delay(1000); }",
});

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Idee invalidă." }, { status: 400 });

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(fallback(parsed.data.idea));
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Generează un proiect DIY hardware în română ca JSON valid. Include title, shortDescription, estimatedCostRon, parts array cu name quantity estimatedPriceRon supplier, safetyWarnings, wiringDiagram Mermaid, assemblyInstructions, code. Include avertismente puternice pentru 230V, baterii litiu, curenți mari, drone, vehicule sau scule periculoase.",
        },
        { role: "user", content: parsed.data.idea },
      ],
    });

    const content = completion.choices[0]?.message.content;
    if (!content) return NextResponse.json(fallback(parsed.data.idea));
    return NextResponse.json(JSON.parse(content));
  } catch {
    return NextResponse.json({
      ...fallback(parsed.data.idea),
      providerStatus: "OpenAI indisponibil sau fără quota; rezultat demo local.",
    });
  }
}
