import { createClient } from "./server";

/**
 * Static array of weekly reflection prompts.
 * These prompts are open-ended, avoid self-improvement language,
 * and avoid urgency or action framing.
 */
export const WEEKLY_REFLECTION_PROMPTS: readonly string[] = [
  "What feels most unclear right now?",
  "What decision am I avoiding, and why?",
  "What did I do out of fear this week?",
  "What gave me a small sense of direction?",
  "What am I pretending not to think about?",
  "What uncertainty am I carrying?",
  "What feels like it's waiting?",
  "What did I notice about myself this week?",
  "What question keeps coming back?",
  "What feels unresolved?",
] as const;

export interface WeeklyReflectionRow {
  id: string;
  user_id: string;
  prompt: string;
  response: string | null;
  week_start_date: string; // ISO date string (YYYY-MM-DD)
  created_at: string;
}

export interface WeeklyReflection {
  id: string;
  prompt: string;
  response: string | null;
  weekStartDate: string;
  createdAt: string;
}

/**
 * Converts a database row to a WeeklyReflection object.
 */
export function rowToWeeklyReflection(row: WeeklyReflectionRow): WeeklyReflection {
  return {
    id: row.id,
    prompt: row.prompt,
    response: row.response,
    weekStartDate: row.week_start_date,
    createdAt: row.created_at,
  };
}

/**
 * Gets the start date of the current week (Monday).
 * Returns date as ISO string (YYYY-MM-DD).
 */
export function getCurrentWeekStartDate(): string {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  // Calculate days to subtract to get to Monday
  // If day is 0 (Sunday), subtract 6 days; otherwise subtract (day - 1) days
  const daysToSubtract = day === 0 ? 6 : day - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - daysToSubtract);
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().split("T")[0]; // Return YYYY-MM-DD
}

/**
 * Gets the start date of a specific week (Monday) for a given date.
 * Returns date as ISO string (YYYY-MM-DD).
 */
export function getWeekStartDateForDate(date: Date): string {
  const day = date.getDay();
  const daysToSubtract = day === 0 ? 6 : day - 1;
  const monday = new Date(date);
  monday.setDate(date.getDate() - daysToSubtract);
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().split("T")[0];
}

/**
 * Selects the next prompt in sequence based on the week number.
 * Uses a cyclical approach: prompt index = (week number) % (number of prompts).
 * This ensures consistency - the same week always gets the same prompt.
 */
export function selectPromptForWeek(weekStartDate: string): string {
  // Use the week start date as a seed for consistency
  // Convert date to a number by counting weeks since a fixed reference point
  const referenceDate = new Date("2024-01-01"); // Fixed reference point
  const currentDate = new Date(weekStartDate);
  const diffTime = currentDate.getTime() - referenceDate.getTime();
  const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
  
  // Use modulo to cycle through prompts
  const promptIndex = Math.abs(diffWeeks) % WEEKLY_REFLECTION_PROMPTS.length;
  return WEEKLY_REFLECTION_PROMPTS[promptIndex];
}

/**
 * Fetches the current week's reflection for a user.
 * Returns null if no reflection exists for the current week.
 */
export async function fetchCurrentWeekReflection(
  userId: string
): Promise<WeeklyReflection | null> {
  const supabase = await createClient();
  const weekStartDate = getCurrentWeekStartDate();

  const { data, error } = await supabase
    .from("weekly_reflections")
    .select("*")
    .eq("user_id", userId)
    .eq("week_start_date", weekStartDate)
    .maybeSingle();

  if (error) {
    console.error("Error fetching current week reflection:", error);
    return null;
  }

  if (!data) {
    return null;
  }

  return rowToWeeklyReflection(data);
}

/**
 * Gets or creates the current week's reflection for a user.
 * If a reflection already exists, returns it.
 * If not, creates a new one with the appropriate prompt for the week.
 * Ensures only one reflection per user per week.
 */
export async function getOrCreateCurrentWeekReflection(
  userId: string
): Promise<WeeklyReflection> {
  const supabase = await createClient();
  const weekStartDate = getCurrentWeekStartDate();

  // First, try to fetch existing reflection
  const existing = await fetchCurrentWeekReflection(userId);
  if (existing) {
    return existing;
  }

  // If no reflection exists, create a new one
  const prompt = selectPromptForWeek(weekStartDate);

  const { data, error } = await supabase
    .from("weekly_reflections")
    .insert({
      user_id: userId,
      prompt: prompt,
      response: null,
      week_start_date: weekStartDate,
    })
    .select()
    .single();

  if (error) {
    // If there's a race condition (another request created it), fetch it
    if (error.code === "23505") {
      // Unique constraint violation - reflection was created by another request
      const existing = await fetchCurrentWeekReflection(userId);
      if (existing) {
        return existing;
      }
    }
    console.error("Error creating weekly reflection:", error);
    throw new Error("Failed to create weekly reflection");
  }

  if (!data) {
    throw new Error("Failed to create weekly reflection");
  }

  return rowToWeeklyReflection(data);
}

/**
 * Updates a reflection's response.
 * The response can be null, empty, or partially written.
 * No validation is enforced - all responses are valid.
 */
export async function updateReflectionResponse(
  userId: string,
  reflectionId: string,
  response: string | null
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("weekly_reflections")
    .update({ response: response || null })
    .eq("id", reflectionId)
    .eq("user_id", userId);

  if (error) {
    console.error("Error updating reflection response:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Fetches all reflections for a user, ordered by week (most recent first).
 */
export async function fetchAllReflections(
  userId: string
): Promise<WeeklyReflection[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("weekly_reflections")
    .select("*")
    .eq("user_id", userId)
    .order("week_start_date", { ascending: false });

  if (error) {
    console.error("Error fetching all reflections:", error);
    return [];
  }

  return (data || []).map(rowToWeeklyReflection);
}

