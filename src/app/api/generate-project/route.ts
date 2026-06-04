import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

const requestSchema = z.object({
  idea: z.string().min(8).max(3000),
  refinements: z.record(z.string(), z.string()).optional(),
  mode: z.string().optional(),
});

const blockedPatterns = [
  /explos/i,
  /firework/i,
  /igniter/i,
  /aprind/i,
  /deton/i,
  /jammer/i,
  /jamming/i,
  /weapon/i,
  /arm[ăa]/i,
  /high[\s-]?voltage/i,
  /230v/i,
  /litiu.*fără/i,
];

const isBlocked = (idea: string) => blockedPatterns.some((pattern) => pattern.test(idea));

const titleFromIdea = (idea: string) => {
  const clean = idea
    .replace(/vreau|construiește|fa|fă|diy|cu|pentru/gi, "")
    .trim()
    .split(/\s+/)
    .slice(0, 5)
    .join(" ");
  return clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : "Proiect DIY generat";
};

const localProject = (idea: string) => {
  const lower = idea.toLowerCase();
  const garden = lower.includes("ser") || lower.includes("iriga") || lower.includes("plant");
  const robot = lower.includes("robot") || lower.includes("motor") || lower.includes("obstacol");
  const title = garden ? "Seră inteligentă ESP32" : robot ? "Robot autonom ESP32" : titleFromIdea(idea);

  const parts = garden
    ? [
        { name: "ESP32 DevKit", category: "MCU", quantity: 1, estimatedPriceRon: 45, supplier: "OptimusDigital", supplierUrl: "https://www.optimusdigital.ro", description: "Controler Wi-Fi pentru senzori și automatizări." },
        { name: "Senzor umiditate sol capacitiv", category: "Sensor", quantity: 2, estimatedPriceRon: 28, supplier: "Robofun", supplierUrl: "https://www.robofun.ro", description: "Măsoară umiditatea solului fără coroziune rapidă." },
        { name: "Pompă peristaltică 12V", category: "Actuator", quantity: 1, estimatedPriceRon: 68, supplier: "eMAG", supplierUrl: "https://www.emag.ro", description: "Mută apă din rezervor spre plante." },
        { name: "Modul MOSFET logic-level", category: "Module", quantity: 1, estimatedPriceRon: 22, supplier: "Mivarom", supplierUrl: "https://www.mivarom.ro", description: "Comandă pompa de la GPIO fără a încărca ESP32." },
        { name: "Sursă 12V 2A izolată", category: "Power", quantity: 1, estimatedPriceRon: 55, supplier: "Dedeman", supplierUrl: "https://www.dedeman.ro", description: "Alimentare separată pentru pompă." },
      ]
    : [
        { name: "ESP32 DevKit", category: "MCU", quantity: 1, estimatedPriceRon: 45, supplier: "OptimusDigital", supplierUrl: "https://www.optimusdigital.ro", description: "Controler principal cu Wi-Fi/Bluetooth." },
        { name: "Driver motor TB6612FNG", category: "Module", quantity: 1, estimatedPriceRon: 34, supplier: "Robofun", supplierUrl: "https://www.robofun.ro", description: "Controlează două motoare DC mici." },
        { name: "Motoare DC cu reductor", category: "Actuator", quantity: 2, estimatedPriceRon: 38, supplier: "TME", supplierUrl: "https://www.tme.eu/ro", description: "Propulsie joasă tensiune pentru șasiu." },
        { name: "Senzor distanță ToF VL53L0X", category: "Sensor", quantity: 1, estimatedPriceRon: 42, supplier: "Conex Electronic", supplierUrl: "https://conexelectronic.ro", description: "Detectează obstacole frontal." },
        { name: "Acumulator 18650 cu holder și protecție", category: "Power", quantity: 1, estimatedPriceRon: 65, supplier: "eMAG", supplierUrl: "https://www.emag.ro", description: "Alimentare mobilă cu protecție." },
      ];

  const cost = parts.reduce((sum, part) => sum + part.estimatedPriceRon * part.quantity, 0);

  return {
    status: "ready",
    engine: "local-open-source-mode",
    title,
    shortDescription: `Blueprint complet generat local pentru: ${idea}`,
    technicalDescription: garden
      ? "Sistem de automatizare pentru seră mică, bazat pe ESP32, senzori de umiditate, comandă MOSFET pentru pompă 12V și logică de protecție la rulare uscată."
      : "Platformă mobilă educațională cu ESP32, driver dual de motoare, senzor de distanță și șasiu printabil 3D pentru evitare simplă de obstacole.",
    tags: garden ? ["ESP32", "irigații", "senzori", "automatizare"] : ["ESP32", "robotică", "motoare", "senzori"],
    estimatedCostRon: cost,
    parts,
    safetyWarnings: [
      "Testează inițial cu sursă limitată în curent.",
      "Nu lucra la 230V fără electrician autorizat.",
      "Pentru Li-Ion/LiPo folosește BMS, încărcător dedicat și carcasă ventilată.",
    ],
    wiringDiagram: garden
      ? "flowchart LR\n  ESP32[ESP32 DevKit]\n  SOIL[Senzori umiditate sol]\n  MOSFET[Modul MOSFET]\n  PUMP[Pompă 12V]\n  PSU[Sursă 12V]\n  ESP32 -- GPIO34/GPIO35 --> SOIL\n  ESP32 -- GPIO18 --> MOSFET\n  PSU -- +12V --> PUMP\n  PUMP --> MOSFET\n  MOSFET -- GND comun --> ESP32"
      : "flowchart LR\n  ESP32[ESP32 DevKit]\n  TOF[Senzor VL53L0X]\n  DRIVER[Driver TB6612FNG]\n  M1[Motor stânga]\n  M2[Motor dreapta]\n  BAT[Baterie protejată]\n  ESP32 -- I2C --> TOF\n  ESP32 -- PWM/DIR --> DRIVER\n  DRIVER --> M1\n  DRIVER --> M2\n  BAT --> DRIVER\n  BAT --> ESP32",
    mechModel: {
      layers: ["structural", "electronics", "enclosure", "mounts"],
      labels: garden ? ["rezervor", "pompă", "ESP32", "senzori sol"] : ["șasiu", "roți", "ESP32", "senzor frontal"],
    },
    instructionGroups: [
      {
        title: "Fabricare",
        steps: ["Printează sau pregătește carcasa.", "Testează montajul pieselor fără alimentare.", "Marchează punctele de prindere."],
      },
      {
        title: "Cablare",
        steps: ["Leagă GND comun între module.", "Conectează senzorii la pinii recomandați.", "Testează fiecare actuator separat."],
      },
      {
        title: "Bring-up",
        steps: ["Încarcă firmware-ul minim.", "Verifică logurile seriale.", "Rulează testul de 30 minute."],
      },
      {
        title: "Asamblare finală",
        steps: ["Fixează cablurile.", "Închide carcasa.", "Etichetează alimentarea și polaritatea."],
      },
    ],
    code: "#include <Arduino.h>\n\nconst int actuatorPin = 18;\n\nvoid setup() {\n  Serial.begin(115200);\n  pinMode(actuatorPin, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(actuatorPin, HIGH);\n  delay(500);\n  digitalWrite(actuatorPin, LOW);\n  delay(1500);\n}\n",
    providerStatus: "Generat cu motor local gratuit. Poate fi înlocuit cu Ollama/local LLM sau OpenAI când quota este activă.",
  };
};

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Idee invalidă." }, { status: 400 });

  if (isBlocked(parsed.data.idea)) {
    return NextResponse.json({
      status: "blocked",
      title: "Proiect blocat de politica de siguranță",
      blockedReason:
        "Nu putem genera proiecte care implică explozivi, propulsie pirotehnică, dispozitive de aprindere, jammere, arme sau instrucțiuni care pot provoca rănire. Pot genera o alternativă sigură: rachetă cu aer/apă, launcher pneumatic educațional limitat sau simulator CAD fără sistem de aprindere.",
      saferAlternatives: ["Rachetă cu apă și parașută mecanică", "Simulator CAD pentru aerodinamică", "Robot educațional cu lansator de confetti cu arc slab"],
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(localProject(parsed.data.idea));
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
            "Generează un proiect DIY hardware sigur în română ca JSON valid. Returnează status='ready', title, shortDescription, technicalDescription, tags, estimatedCostRon, parts cu name/category/quantity/estimatedPriceRon/supplier/supplierUrl/description, safetyWarnings, wiringDiagram Mermaid, mechModel, instructionGroups, code. Refuză explicit proiectele cu explozivi, ignitere, jammere, arme sau instrucțiuni periculoase.",
        },
        { role: "user", content: parsed.data.idea },
      ],
    });

    const content = completion.choices[0]?.message.content;
    if (!content) return NextResponse.json(localProject(parsed.data.idea));
    return NextResponse.json(JSON.parse(content));
  } catch {
    return NextResponse.json(localProject(parsed.data.idea));
  }
}
