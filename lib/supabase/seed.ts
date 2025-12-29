import { createClient } from "./server";
import { ConfidenceLevel } from "@/app/components/confidence";

interface SeedLifeArea {
  name: string;
  currentState: string;
  confidenceLevel: number;
  topQuestion: string;
  helper: string;
}

const DEFAULT_LIFE_AREAS: SeedLifeArea[] = [
  {
    name: "Career",
    currentState:
      "Work might feel a bit undefined right now. This is a place to notice that without needing a plan.",
    confidenceLevel: 2, // "unclear"
    topQuestion: "What kind of work might actually feel like you?",
    helper: "You don't need to define this yet.",
  },
  {
    name: "Money",
    currentState:
      "This could feel shaky, stable, or somewhere in between. All of that belongs here.",
    confidenceLevel: 3, // "forming"
    topQuestion: "What feels most confusing about money right now?",
    helper: "It's okay if this changes.",
  },
  {
    name: "Relationships",
    currentState:
      "Connections might feel close, distant, or in transition. There's room for all of that.",
    confidenceLevel: 1, // "very-unclear"
    topQuestion: "Where do you feel most unsure in your connections?",
    helper: "Unclear is still a valid state.",
  },
  {
    name: "Identity",
    currentState:
      "Who you are might feel in motion. This is a quiet place to notice what's shifting.",
    confidenceLevel: 2, // "unclear"
    topQuestion: "What parts of you feel like they're still forming?",
    helper: "It's okay if this feels unclear.",
  },
  {
    name: "Health",
    currentState:
      "Energy, rest, and movement can be inconsistent. You don't have to fix anything here.",
    confidenceLevel: 2, // "unclear"
    topQuestion: "What are you most curious about in your health right now?",
    helper: "Uncertainty is part of the process.",
  },
];

export async function seedLifeAreas(userId: string): Promise<void> {
  const supabase = await createClient();

  // Fetch existing life areas
  const { data: existingAreas, error: fetchError } = await supabase
    .from("life_areas")
    .select("name")
    .eq("user_id", userId);

  if (fetchError) {
    console.error("Error fetching existing life areas:", fetchError);
    throw fetchError;
  }

  const existingNames = new Set(existingAreas?.map((area) => area.name) || []);

  // If user has all 5 default life areas, no action needed
  if (existingNames.size >= 5) {
    return;
  }

  // Determine which life areas need to be created
  const areasToCreate = DEFAULT_LIFE_AREAS.filter(
    (area) => !existingNames.has(area.name)
  );

  if (areasToCreate.length === 0) {
    return;
  }

  // Quietly recreate missing life areas
  const { error: insertError } = await supabase.from("life_areas").insert(
    areasToCreate.map((area) => ({
      user_id: userId,
      name: area.name,
      current_state: area.currentState,
      confidence_level: area.confidenceLevel,
      top_question: area.topQuestion,
      helper: area.helper,
    }))
  );

  if (insertError) {
    console.error("Error seeding life areas:", insertError);
    throw insertError;
  }
}

