export type ConfidenceLevel =
  | "very-unclear"
  | "unclear"
  | "forming"
  | "clear-ish"
  | "mostly-clear";

export interface ConfidenceConfig {
  id: ConfidenceLevel;
  label: string;
}

export const CONFIDENCE_SCALE: ConfidenceConfig[] = [
  { id: "very-unclear", label: "Very unclear" },
  { id: "unclear", label: "Unclear" },
  { id: "forming", label: "Forming" },
  { id: "clear-ish", label: "Clear-ish" },
  { id: "mostly-clear", label: "Mostly clear" },
];

export function confidenceToLabel(level: ConfidenceLevel): string {
  const match = CONFIDENCE_SCALE.find((c) => c.id === level);
  return match?.label ?? "Very unclear";
}

export function confidenceToIndex(level: ConfidenceLevel): number {
  const index = CONFIDENCE_SCALE.findIndex((c) => c.id === level);
  return index === -1 ? 0 : index;
}


