import type { LabProject } from "@/lib/types";

const suppliers = ["eMAG", "Dedeman", "Leroy Merlin", "Hornbach", "TME", "Robofun", "OptimusDigital", "Mivarom", "Conex Electronic"];

const wiring = (sensor = "DHT22") => `flowchart LR
  ESP32["ESP32 DevKit"]
  USB["USB 5V"]
  SENSOR["${sensor}"]
  ACT["Modul releu / driver"]
  OUT["Actuator / motor"]
  USB --> ESP32
  ESP32 -- GPIO 4 --> SENSOR
  ESP32 -- GPIO 18 --> ACT
  ACT --> OUT
  ESP32 -- GND comun --> SENSOR
  ESP32 -- GND comun --> ACT`;

const code = (title: string) => `#include <Arduino.h>

const int actuatorPin = 18;
const int sensorPin = 4;

void setup() {
  Serial.begin(115200);
  pinMode(actuatorPin, OUTPUT);
  pinMode(sensorPin, INPUT);
  Serial.println("${title} online");
}

void loop() {
  int raw = digitalRead(sensorPin);
  digitalWrite(actuatorPin, raw == HIGH ? HIGH : LOW);
  Serial.printf("sensor=%d\\n", raw);
  delay(1000);
}`;

const makeProject = (
  id: string,
  title: string,
  category: string,
  cost: number,
  stars: number,
  creator: string,
  accent: string,
  difficulty: LabProject["difficulty"] = "Mediu",
  sensor = "DHT22",
): LabProject => ({
  id,
  title,
  shortDescription: `${title} construit ca proiect DIY românesc, cu piese ușor de găsit și documentație completă.`,
  technicalDescription:
    "Platformă modulară bazată pe ESP32/Arduino, senzori discreți, alimentare joasă tensiune și carcasă printată 3D. Proiectul include BOM, wiring, cod firmware și procedură de testare.",
  category,
  difficulty,
  estimatedCostRon: cost,
  tags: ["ESP32", "DIY", "3D print", category],
  creatorUsername: creator,
  createdAt: "2026-06-01",
  stars,
  votes: Math.round(stars * 1.7),
  image: `/api/placeholder?title=${encodeURIComponent(title)}&accent=${encodeURIComponent(accent)}`,
  isPublic: true,
  assumptions: ["Folosești alimentare de 5V/12V izolată", "Ai acces la imprimantă 3D sau o cutie universală", "Verifici polaritatea înainte de alimentare"],
  requiredTools: ["letcon", "multimetru", "șurubelnițe", "clește dezizolat", "cutter", "laptop cu Arduino IDE"],
  safetyWarnings: [
    "Nu lucra la 230V fără electrician autorizat.",
    "Pentru baterii Li-Ion/LiPo folosește BMS, încărcător dedicat și supraveghere.",
    "Testează inițial cu sursă limitată în curent.",
  ],
  parts: [
    { name: "ESP32 DevKit", quantity: 1, estimatedPriceRon: 45, supplier: "OptimusDigital", link: "https://www.optimusdigital.ro", notes: "Controler principal Wi-Fi/Bluetooth" },
    { name: sensor, quantity: 1, estimatedPriceRon: 22, supplier: "Robofun", link: "https://www.robofun.ro", notes: "Senzor principal proiect" },
    { name: "Modul releu 5V", quantity: 1, estimatedPriceRon: 18, supplier: "Mivarom", link: "https://www.mivarom.ro", notes: "Comutare sarcină joasă tensiune" },
    { name: "Fire Dupont + conectori", quantity: 1, estimatedPriceRon: 24, supplier: "Conex Electronic", link: "https://conexelectronic.ro", notes: "Cablare rapidă prototip" },
    { name: "Carcasă / material print 3D", quantity: 1, estimatedPriceRon: 55, supplier: "eMAG", link: "https://www.emag.ro", notes: "PLA/PETG sau cutie ABS" },
  ],
  supplierSuggestions: suppliers,
  wiringDiagram: wiring(sensor),
  modelDescription: "Model 3D simplificat: bază rectangulară, două stâlpi tehnici, placă electronică expusă și capac transparent verde neon.",
  assemblyInstructions: [
    "Montează ESP32 pe distanțiere și verifică accesul la USB.",
    "Leagă senzorul la 3V3, GND și pinul de semnal recomandat.",
    "Conectează actuatorul prin driver sau releu, cu GND comun.",
    "Încarcă firmware-ul și verifică logurile seriale.",
    "Fixează cablurile, închide carcasa și rulează testul final.",
  ],
  testingSteps: ["Verifică tensiunile fără ESP32 montat", "Rulează firmware-ul cu actuator deconectat", "Simulează semnalul senzorului", "Testează 30 minute în regim normal"],
  troubleshooting: ["Dacă ESP32 nu pornește, verifică USB și polaritatea", "Dacă releul pâlpâie, separă alimentarea actuatorului", "Dacă datele sunt instabile, scurtează firele de semnal"],
  codeFiles: [{ filename: "main.ino", language: "arduino", code: code(title) }],
});

export const demoProjects: LabProject[] = [
  makeProject("robot-wall-e-diy", "Robot Wall-E DIY", "Robotică", 680, 342, "oscar_lab", "#00ff66", "Avansat", "HC-SR04"),
  makeProject("statie-meteo-esp32", "Stație meteo ESP32", "IoT", 245, 289, "ana_bits", "#2af598", "Începător", "BME280"),
  makeProject("sera-inteligenta", "Seră inteligentă", "Automatizări", 410, 431, "gradinarul_cyber", "#00e676", "Mediu", "Senzor umiditate sol"),
  makeProject("mini-cnc-desktop", "Mini CNC desktop", "Fabricație", 1450, 198, "cnc_matei", "#39ff14", "Avansat", "Endstop optic"),
  makeProject("uscator-filament-3d", "Uscător filament 3D", "Printare 3D", 320, 176, "print_ro", "#64ffda", "Mediu", "DS18B20"),
  makeProject("ochelari-ar-diy", "Ochelari AR DIY", "Wearables", 890, 254, "livia_ar", "#00ff99", "Avansat", "IMU MPU6050"),
  makeProject("robot-brat-scara", "Robot braț SCARA", "Robotică", 1250, 367, "servo_vlad", "#00ffaa", "Avansat", "Encoder magnetic"),
  makeProject("drona-educationala", "Dronă educațională", "Educație", 980, 211, "flight_lab", "#a3ff12", "Avansat", "IMU MPU6050"),
  makeProject("sistem-solar-off-grid-mic", "Sistem solar off-grid mic", "Energie", 760, 322, "solar_mihai", "#00ff66", "Mediu", "INA219"),
  makeProject("companion-desktop-bot", "Companion desktop bot", "AI Hardware", 540, 403, "bot_alina", "#33ff88", "Mediu", "Microfon I2S"),
  makeProject("sistem-irigatii-automat", "Sistem irigații automat", "Grădină", 285, 378, "horti_io", "#00d95f", "Începător", "Senzor umiditate sol"),
  makeProject("smart-home-energy-monitor", "Smart home energy monitor", "Smart Home", 620, 297, "energy_ro", "#00ffcc", "Avansat", "Clește CT"),
];

export const formatRon = (value: number) =>
  new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", maximumFractionDigits: 0 }).format(value);

export const getTrendingProjects = () => [...demoProjects].sort((a, b) => b.stars + b.votes - (a.stars + a.votes));

export const getProjectById = (id: string) => demoProjects.find((project) => project.id === id);
