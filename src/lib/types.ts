export type Difficulty = "Începător" | "Mediu" | "Avansat";

export type ProjectPart = {
  name: string;
  quantity: number;
  estimatedPriceRon: number;
  supplier: string;
  link: string;
  notes: string;
};

export type ProjectCodeFile = {
  filename: string;
  language: string;
  code: string;
};

export type LabProject = {
  id: string;
  title: string;
  shortDescription: string;
  technicalDescription: string;
  category: string;
  difficulty: Difficulty;
  estimatedCostRon: number;
  tags: string[];
  creatorUsername: string;
  createdAt: string;
  stars: number;
  votes: number;
  image: string;
  isPublic: boolean;
  assumptions: string[];
  requiredTools: string[];
  safetyWarnings: string[];
  parts: ProjectPart[];
  supplierSuggestions: string[];
  wiringDiagram: string;
  modelDescription: string;
  assemblyInstructions: string[];
  testingSteps: string[];
  troubleshooting: string[];
  codeFiles: ProjectCodeFile[];
};
