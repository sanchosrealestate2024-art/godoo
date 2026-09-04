import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatArea(area: string | null) {
  if (!area) return "";
  return area;
}

export const CATEGORY_LABELS: Record<string, string> = {
  residential: "Residential",
  commercial: "Commercial",
  institutional: "Institutional",
  hospitality: "Hospitality",
  mixed_use: "Mixed Use",
  urban_planning: "Urban Planning",
  interior: "Interior",
};
