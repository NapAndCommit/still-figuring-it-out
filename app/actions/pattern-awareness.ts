"use server";

import { createClient } from "@/lib/supabase/server";
import { fetchAllReflections } from "@/lib/supabase/weekly-reflections";
import { fetchLifeAreas } from "@/lib/supabase/life-areas";
import {
  detectRepeatedPrompts,
  detectRepeatedPhrases,
  detectPersistentUncertainty,
  ReflectionTheme,
  PersistentUncertainty,
} from "@/lib/utils/pattern-detection";

export interface PatternAwarenessData {
  reflectionThemes: ReflectionTheme[];
  persistentUncertainties: PersistentUncertainty[];
}

/**
 * Fetches data needed for pattern awareness and detects patterns.
 * Returns empty arrays if no patterns are detected or if there's insufficient data.
 */
export async function getPatternAwareness(): Promise<{
  success: boolean;
  data?: PatternAwarenessData;
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
    // Fetch all reflections and life areas
    const reflections = await fetchAllReflections(user.id);
    const lifeAreas = await fetchLifeAreas(user.id);

    // Detect patterns
    const repeatedPrompts = detectRepeatedPrompts(reflections);
    const repeatedPhrases = detectRepeatedPhrases(reflections);
    const persistentUncertainties = detectPersistentUncertainty(lifeAreas);

    // Combine reflection themes and remove duplicates
    const allThemes = [...repeatedPrompts, ...repeatedPhrases];
    const uniqueThemes = Array.from(
      new Map(allThemes.map((theme) => [theme.text, theme])).values()
    );

    return {
      success: true,
      data: {
        reflectionThemes: uniqueThemes,
        persistentUncertainties,
      },
    };
  } catch (error) {
    console.error("Error getting pattern awareness:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

