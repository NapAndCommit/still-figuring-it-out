"use server";

import { createClient } from "@/lib/supabase/server";
import {
  getOrCreateCurrentWeekReflection,
  fetchCurrentWeekReflection,
  updateReflectionResponse,
  fetchAllReflections,
  WeeklyReflection,
} from "@/lib/supabase/weekly-reflections";

/**
 * Gets the current week's reflection for the authenticated user.
 * Creates a new reflection if one doesn't exist for the current week.
 * This is the main function that will be used by the UI.
 */
export async function getCurrentWeekReflection(): Promise<{
  success: boolean;
  reflection?: WeeklyReflection;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "Not authenticated",
    };
  }

  try {
    const reflection = await getOrCreateCurrentWeekReflection(user.id);
    return {
      success: true,
      reflection,
    };
  } catch (error) {
    console.error("Error getting current week reflection:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Updates the response for the current week's reflection.
 * The response can be null, empty, or partially written.
 * No validation is enforced.
 */
export async function saveReflectionResponse(
  reflectionId: string,
  response: string | null
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "Not authenticated",
    };
  }

  return await updateReflectionResponse(user.id, reflectionId, response);
}

/**
 * Fetches the current week's reflection without creating one.
 * Returns null if no reflection exists for the current week.
 * Useful for checking if a reflection exists before displaying UI.
 */
export async function getCurrentWeekReflectionIfExists(): Promise<{
  success: boolean;
  reflection?: WeeklyReflection | null;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "Not authenticated",
    };
  }

  try {
    const reflection = await fetchCurrentWeekReflection(user.id);
    return {
      success: true,
      reflection,
    };
  } catch (error) {
    console.error("Error fetching current week reflection:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Fetches all reflections for the authenticated user.
 * Ordered by week (most recent first).
 * Useful for displaying reflection history.
 */
export async function getAllReflections(): Promise<{
  success: boolean;
  reflections?: WeeklyReflection[];
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "Not authenticated",
    };
  }

  try {
    const reflections = await fetchAllReflections(user.id);
    return {
      success: true,
      reflections,
    };
  } catch (error) {
    console.error("Error fetching all reflections:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

