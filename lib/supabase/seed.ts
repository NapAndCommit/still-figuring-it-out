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

export async function seedLifeAreas(userId: string) {
  const supabase = await createClient();

  // Check if user already has life areas
  const { data: existingAreas } = await supabase
    .from("life_areas")
    .select("id")
    .eq("user_id", userId)
    .limit(1);

  if (existingAreas && existingAreas.length > 0) {
    // User already has life areas, don't seed
    return;
  }

  // Insert default life areas
  const { error } = await supabase.from("life_areas").insert(
    DEFAULT_LIFE_AREAS.map((area) => ({
      user_id: userId,
      name: area.name,
      current_state: area.currentState,
      confidence_level: area.confidenceLevel,
      top_question: area.topQuestion,
      helper: area.helper,
    }))
  );

  if (error) {
    console.error("Error seeding life areas:", error);
    throw error;
  }
}

