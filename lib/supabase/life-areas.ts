import { createClient } from "./server";
import { LifeAreaData } from "@/app/components/LifeAreaCard";
import { ConfidenceLevel } from "@/app/components/confidence";

// Map confidence level (1-5) to ConfidenceLevel type
function confidenceLevelToConfidence(level: number | null): ConfidenceLevel {
  if (level === null) return "unclear";
  // Map: 1 = very-unclear, 2 = unclear, 3 = forming, 4 = clear-ish, 5 = mostly-clear
  const mapping: ConfidenceLevel[] = [
    "very-unclear",
    "unclear",
    "forming",
    "clear-ish",
    "mostly-clear",
  ];
  return mapping[level - 1] || "unclear";
}

// Map ConfidenceLevel type to confidence level (1-5)
function confidenceToConfidenceLevel(
  confidence: ConfidenceLevel
): number {
  const mapping: Record<ConfidenceLevel, number> = {
    "very-unclear": 1,
    unclear: 2,
    forming: 3,
    "clear-ish": 4,
    "mostly-clear": 5,
  };
  return mapping[confidence];
}

export interface LifeAreaRow {
  id: string;
  user_id: string;
  name: string;
  current_state: string | null;
  confidence_level: number | null;
  top_question: string | null;
  helper: string | null;
  updated_at: string;
}

export function rowToLifeAreaData(row: LifeAreaRow): LifeAreaData {
  return {
    id: row.id,
    name: row.name,
    currentState: row.current_state || "",
    confidence: confidenceLevelToConfidence(row.confidence_level),
    topQuestion: row.top_question || "",
    helper: row.helper || "",
  };
}

export function lifeAreaDataToRow(
  data: LifeAreaData,
  userId: string
): Partial<LifeAreaRow> {
  return {
    name: data.name,
    current_state: data.currentState || null,
    confidence_level: confidenceToConfidenceLevel(data.confidence),
    top_question: data.topQuestion || null,
    helper: data.helper || null,
  };
}

export async function fetchLifeAreas(userId: string): Promise<LifeAreaData[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("life_areas")
    .select("*")
    .eq("user_id", userId)
    .order("name");

  if (error) {
    // Log technical error for developers
    console.error("Error fetching life areas:", error);
    // Return empty array instead of throwing to prevent UI crashes
    return [];
  }

  return (data || []).map(rowToLifeAreaData);
}

export async function updateLifeArea(
  userId: string,
  lifeAreaId: string,
  data: LifeAreaData
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const row = lifeAreaDataToRow(data, userId);

  const { error } = await supabase
    .from("life_areas")
    .update(row)
    .eq("id", lifeAreaId)
    .eq("user_id", userId);

  if (error) {
    // Log technical error for developers
    console.error("Error updating life area:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

