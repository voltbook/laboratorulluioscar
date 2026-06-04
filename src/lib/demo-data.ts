import type { LabProject, ProjectPart } from "@/lib/types";

const suppliers = ["eMAG", "Dedeman", "Leroy Merlin", "Hornbach", "TME", "Robofun", "OptimusDigital", "Mivarom", "Conex Electronic"];

const img = (title: string, accent = "#00ff66") => `/api/placeholder?title=${encodeURIComponent(title)}&accent=${encodeURIComponent(accent)}`;

const supplierLink = (supplier: string, query: string) => {
  const map: Record<string, string> = {
    eMAG: "https://www.emag.ro/search/",
    Amazon: "https://www.amazon.com/s?k=",
    TME: "https://www.tme.eu/ro/katalog/?search=",
    Robofun: "https://www.robofun.ro/catalogsearch/result/?q=",
    OptimusDigital: "https://www.optimusdigital.ro/ro/cautare?controller=search&s=",
    Mivarom: "https://www.mivarom.ro/cautare?controller=search&s=",
    Dedeman: "https://www.dedeman.ro/ro/search?query=",
    Hornbach: "https://www.hornbach.ro/cautare/?text=",
    "Conex Electronic": "https://conexelectronic.ro/?s=",
  };
  return `${map[supplier] ?? "https://www.google.com/search?q="}${encodeURIComponent(query)}`;
};

const part = (name: string, category: string, quantity: number, price: number, supplier: string, notes: string, subtitle = category): ProjectPart => ({
  name,
  category,
  subtitle,
  quantity,
  estimatedPriceRon: price,
  supplier,
  link: supplierLink(supplier, name),
  notes,
  image: img(name, category === "Mechanical" ? "#b9a8ff" : category === "Power" ? "#ffd166" : "#00ff66"),
});

const wallEParts: ProjectPart[] = [
  part("LicheeRV-Nano", "Electrical", 1, 96, "Amazon", "AI brain pentru procesare audio/video; poate fi înlocuit cu Raspberry Pi Zero 2 W.", "LicheeRV-Nano AI Brain"),
  part("ESP32-WROOM-32 Development Board", "Electrical", 1, 45, "OptimusDigital", "Controller real-time pentru motoare, senzori și comunicare cu modulul AI.", "ESP32 Real-time Controller"),
  part("TB6612FNG dual motor driver", "Electrical", 2, 34, "Robofun", "Driver eficient pentru motoare DC mici, la joasă tensiune.", "Track Motor Driver"),
  part("Camera OV5647 MIPI/USB module", "Electrical", 1, 85, "TME", "Cameră pentru experimente de vision local, fără upload obligatoriu.", "Vision Camera"),
  part("OLED ST7789 / mini display", "Electrical", 1, 42, "Mivarom", "Display expresiv pentru ochi/status.", "Face Display"),
  part("I2S microphone module", "Electrical", 1, 28, "Conex Electronic", "Input audio simplu pentru comenzi locale.", "Audio Sensor"),
  part("LiPo 7.4V cu BMS", "Power", 1, 120, "eMAG", "Alimentare mobilă cu protecție; se testează numai cu încărcător dedicat.", "Protected Battery"),
  part("Buck converter 5V 3A", "Power", 1, 24, "Mivarom", "Regulator pentru ESP32 și periferice.", "5V Rail"),
  part("Micro metal gear motors", "Mechanical", 2, 45, "Robofun", "Propulsie pentru șenile mici.", "Track Motors"),
  part("Rubber tracks kit", "Mechanical", 1, 80, "Amazon", "Șenile compacte pentru interior.", "Tank Tracks"),
  part("3D printed chassis set", "Mechanical", 1, 65, "Dedeman", "PLA/PETG pentru corp, cap, brațe și suporturi.", "Printed Body"),
  part("Micro servos SG90", "Mechanical", 4, 18, "OptimusDigital", "Mișcare cap și brațe expresive.", "Expressive Movement"),
];

const wallEWiring = `flowchart LR
  BAT["LiPo 7.4V + BMS"]
  BUCK["Buck 5V"]
  ESP32["ESP32 real-time MCU"]
  AI["LicheeRV-Nano AI brain"]
  CAM["Camera module"]
  MIC["I2S microphone"]
  DISPLAY["ST7789 display"]
  DRIVER["Dual motor drivers"]
  TRACKS["Track motors"]
  SERVOS["Head + arm servos"]
  US["Ultrasonic sensors"]
  IR["IR edge sensors"]
  BAT -- POWER --> BUCK
  BUCK -- 5V --> ESP32
  BUCK -- 5V --> AI
  AI -- CSI/USB --> CAM
  AI -- SPI --> DISPLAY
  AI -- I2S --> MIC
  AI -- UART --> ESP32
  ESP32 -- PWM/DIR --> DRIVER
  DRIVER -- MOTOR --> TRACKS
  ESP32 -- PWM --> SERVOS
  ESP32 -- GPIO --> US
  ESP32 -- GPIO --> IR`;

const code = (title: string) => `#include <Arduino.h>

const int leftMotorPwm = 18;
const int rightMotorPwm = 19;
const int statusLed = 2;

void setup() {
  Serial.begin(115200);
  pinMode(leftMotorPwm, OUTPUT);
  pinMode(rightMotorPwm, OUTPUT);
  pinMode(statusLed, OUTPUT);
  Serial.println("${title} ready");
}

void loop() {
  digitalWrite(statusLed, !digitalRead(statusLed));
  analogWrite(leftMotorPwm, 80);
  analogWrite(rightMotorPwm, 80);
  delay(500);
  analogWrite(leftMotorPwm, 0);
  analogWrite(rightMotorPwm, 0);
  delay(1500);
}`;

const makeProject = ({
  id,
  title,
  category,
  cost,
  stars,
  creator,
  date,
  accent,
  difficulty = "Mediu",
  parts,
  description,
  tags,
  wiring,
}: {
  id: string;
  title: string;
  category: string;
  cost: number;
  stars: number;
  creator: string;
  date: string;
  accent: string;
  difficulty?: LabProject["difficulty"];
  parts?: ProjectPart[];
  description?: string;
  tags?: string[];
  wiring?: string;
}): LabProject => {
  const projectParts =
    parts ??
    [
      part("ESP32 DevKit", "Electrical", 1, 45, "OptimusDigital", "Controler principal Wi-Fi/Bluetooth"),
      part("Senzor principal", "Electrical", 1, 32, "Robofun", "Senzor adaptat proiectului"),
      part("Driver / modul control", "Electrical", 1, 38, "Mivarom", "Interfață pentru actuator sau periferic"),
      part("Carcasă / print 3D", "Mechanical", 1, 80, "Dedeman", "Corp printat 3D sau cutie modificată"),
      part("Conectori + fire", "Electrical", 1, 24, "Conex Electronic", "Cablaj prototip și conectori"),
    ];

  return {
    id,
    title,
    shortDescription: `${title} publicat de comunitate, cu piese, wiring, 3D mockup, cod și instrucțiuni.`,
    technicalDescription:
      description ??
      "Platformă modulară bazată pe ESP32/Arduino, senzori discreți, alimentare joasă tensiune și carcasă printată 3D. Proiectul include BOM, wiring, cod firmware și procedură de testare.",
    category,
    difficulty,
    estimatedCostRon: cost,
    tags: tags ?? ["compact size", "low cost", "real-time control", "indoor environment"],
    creatorUsername: creator,
    createdAt: date,
    stars,
    votes: Math.round(stars * 1.9),
    image: img(title, accent),
    isPublic: true,
    assumptions: ["Power Source: 5-12V DC protejat.", "Environment: interior, uscat, suprafețe stabile.", `Skill Level: ${difficulty}.`, "Tools: imprimantă 3D, letcon, multimetru, șurubelnițe."],
    requiredTools: ["3D printer", "soldering iron", "wire strippers", "multimeter", "precision screwdriver set", "laptop cu Arduino IDE"],
    safetyWarnings: [
      "Nu lucra la 230V fără electrician autorizat.",
      "Pentru baterii Li-Ion/LiPo folosește BMS, încărcător dedicat și supraveghere.",
      "Testează inițial cu sursă limitată în curent.",
    ],
    parts: projectParts,
    supplierSuggestions: suppliers,
    wiringDiagram: wiring ?? wallEWiring.replaceAll("LicheeRV-Nano AI brain", "Optional processing module"),
    modelDescription: "3D CAD mockup: cadru wireframe, module poziționate pe straturi, labels pentru zonele mecanice/electrice și carcasă printabilă.",
    assemblyInstructions: [
      "Print all 3D mechanical components and test fit without electronics.",
      "Mount motors, brackets and structural inserts.",
      "Install power management: protected battery, switch and buck converter.",
      "Mount controller boards on standoffs and route wires by section.",
      "Integrate sensors with their respective MCU pins.",
      "Connect display/speaker/optional AI module where applicable.",
      "Establish inter-MCU communication if the project has multiple controllers.",
      "Implement watchdog and safe startup firmware.",
      "Finalize wiring and verify every power/data connection.",
      "Load initial firmware and run bring-up tests.",
    ],
    testingSteps: ["Verify voltages before connecting MCUs.", "Run actuator tests at low duty cycle.", "Check sensor readings in Serial Monitor.", "Run a 30 minute thermal and stability test."],
    troubleshooting: ["If the board resets, check peak current.", "If sensors fail, verify GND/SDA/SCL continuity.", "If motors are noisy, separate power and add decoupling."],
    codeFiles: [{ filename: "main.ino", language: "arduino", code: code(title) }],
  };
};

export const demoProjects: LabProject[] = [
  makeProject({
    id: "wifi-signal-monitor",
    title: "WiFi Signal Monitor",
    category: "RF Tools",
    cost: 210,
    stars: 8,
    creator: "david",
    date: "2026-06-04",
    accent: "#9cffd1",
    difficulty: "Începător",
    tags: ["safe RF", "spectrum scan", "ESP32", "no jamming"],
    description: "Alternativă sigură la proiectele de tip jammer: monitor pasiv pentru canale WiFi, RSSI și ocupare spectru. Nu transmite bruiaj și nu interferează cu rețele.",
  }),
  makeProject({ id: "desktop-companion-bot", title: "Desktop Companion Bot", category: "AI Hardware", cost: 520, stars: 26, creator: "thero_f470", date: "2026-06-02", accent: "#00ff66", tags: ["OLED face", "servos", "desktop bot", "expressive"] }),
  makeProject({ id: "ar-smart-glasses", title: "AR Smart Glasses", category: "Wearables", cost: 890, stars: 54, creator: "galli_9c75", date: "2026-05-30", accent: "#67e8f9", difficulty: "Avansat", tags: ["wearable", "micro display", "IMU", "low power"] }),
  makeProject({ id: "low-cost-filament-dryer", title: "Low-cost Filament Dryer", category: "3D Print", cost: 320, stars: 63, creator: "ptero_b65f", date: "2026-05-29", accent: "#fde68a", tags: ["filament", "temperature", "dryer", "PLA/PETG"] }),
  makeProject({ id: "desktop-cnc-mill", title: "Desktop CNC Mill", category: "Fabrication", cost: 1450, stars: 44, creator: "solex_energo", date: "2026-05-31", accent: "#a7f3d0", difficulty: "Avansat", tags: ["CNC", "GRBL", "linear rails", "desktop"] }),
  makeProject({ id: "educational-drone-frame", title: "Educational Drone Frame", category: "Education", cost: 980, stars: 114, creator: "stego_2cc2", date: "2026-05-25", accent: "#bfdbfe", difficulty: "Avansat", tags: ["simulator first", "flight safety", "frame", "IMU"] }),
  makeProject({ id: "scara-arm-robot", title: "SCARA Arm Robot", category: "Robotics", cost: 1250, stars: 146, creator: "galli_1f37", date: "2026-05-23", accent: "#ddd6fe", difficulty: "Avansat", tags: ["SCARA", "stepper", "inverse kinematics", "robot arm"] }),
  makeProject({
    id: "wall-e-robot",
    title: "Wall-E Robot",
    category: "Robotics",
    cost: 184,
    stars: 150,
    creator: "trike_5f10",
    date: "2026-05-20",
    accent: "#fef3c7",
    difficulty: "Avansat",
    parts: wallEParts,
    wiring: wallEWiring,
    tags: ["compact size", "low cost", "real-time responsiveness", "expandable AI", "indoor environment", "expressive movement"],
    description:
      'This project details the construction of a compact, low-cost "Wall-E" inspired robot. It features real-time motor and sensor control via an ESP32, enhanced with an expandable AI brain for experiments like vision and audio processing, all housed within a 3D-printed chassis for indoor environments and expressive movement.',
  }),
  makeProject({ id: "pocket-weather-station", title: "Pocket Weather Station", category: "IoT", cost: 245, stars: 79, creator: "meteo_ro", date: "2026-05-18", accent: "#93c5fd", difficulty: "Începător", tags: ["BME280", "solar", "ESP32", "portable"] }),
  makeProject({ id: "smart-air-monitor", title: "Smart Air Monitor", category: "Smart Home", cost: 420, stars: 88, creator: "air_lab", date: "2026-05-16", accent: "#c4b5fd", tags: ["CO2", "PM2.5", "OLED", "alerts"] }),
  makeProject({ id: "robot-wall-e-diy", title: "Robot Wall-E DIY", category: "Robotică", cost: 680, stars: 342, creator: "oscar_lab", date: "2026-06-01", accent: "#00ff66", difficulty: "Avansat" }),
  makeProject({ id: "sera-inteligenta", title: "Seră inteligentă", category: "Automatizări", cost: 410, stars: 431, creator: "gradinarul_cyber", date: "2026-06-01", accent: "#00e676" }),
];

export const formatRon = (value: number) =>
  new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", maximumFractionDigits: 0 }).format(value);

export const getTrendingProjects = () => [...demoProjects].sort((a, b) => b.stars + b.votes - (a.stars + a.votes));

export const getProjectById = (id: string) => demoProjects.find((project) => project.id === id);
