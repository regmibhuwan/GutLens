export type IBSType = "IBS-C" | "IBS-D" | "IBS-M" | "Unsure";

export interface UserProfile {
  ibsType: IBSType;
  triggers: string[];
  name: string;
}

export interface FoodAnalysis {
  foodName: string;
  confidence: number;
  safetyRating: "Green" | "Yellow" | "Red";
  ratingExplanation: string;
  fodmapBreakdown: string[];
  safePortion: string;
  preparationTips: string[];
  bestTimingAndHow: string;
  personalizedNote: string;
  saferAlternatives: string[];
  encouragingClosing: string;
}

export interface ScanHistoryItem {
  id: string;
  timestamp: number;
  imageDataUrl: string;
  analysis: FoodAnalysis;
}

export const COMMON_TRIGGERS = [
  "Garlic",
  "Onion",
  "Wheat / Gluten",
  "Dairy / Lactose",
  "Beans & Lentils",
  "Apples",
  "Pears",
  "Watermelon",
  "Mango",
  "Mushrooms",
  "Cauliflower",
  "Artichokes",
  "Honey",
  "High-fructose corn syrup",
  "Sugar alcohols (sorbitol, mannitol)",
  "Cashews / Pistachios",
  "Avocado (large portions)",
  "Dried fruit",
  "Coffee",
  "Alcohol",
  "Spicy food",
  "Carbonated drinks",
  "Fried / fatty food",
];
