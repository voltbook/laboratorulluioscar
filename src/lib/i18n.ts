export const supportedLocales = ["en", "ro", "it"] as const;

export type SupportedLocale = (typeof supportedLocales)[number];

export const defaultLocale: SupportedLocale = "en";

export const platformCopy = {
  en: {
    brand: "Oscar's Laboratory",
    tagline: "Play. Build. Learn. Create.",
  },
  ro: {
    brand: "Laboratorul lui Oscar",
    tagline: "Joacă. Construiește. Învață. Creează.",
  },
  it: {
    brand: "Il Laboratorio di Oscar",
    tagline: "Gioca. Costruisci. Impara. Crea.",
  },
} satisfies Record<SupportedLocale, { brand: string; tagline: string }>;
