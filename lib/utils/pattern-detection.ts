import { WeeklyReflection } from "@/lib/supabase/weekly-reflections";
import { LifeAreaData } from "@/app/components/LifeAreaCard";

export interface ReflectionTheme {
  text: string;
  type: "repeated-prompt" | "repeated-phrase";
}

export interface PersistentUncertainty {
  lifeAreaName: string;
  lifeAreaId: string;
}

/**
 * Detects repeated prompts in reflection history.
 * Returns themes for prompts that appear more than once.
 */
export function detectRepeatedPrompts(
  reflections: WeeklyReflection[]
): ReflectionTheme[] {
  const promptCounts = new Map<string, number>();
  
  // Count occurrences of each prompt
  reflections.forEach((reflection) => {
    if (reflection.response && reflection.response.trim().length > 0) {
      const count = promptCounts.get(reflection.prompt) || 0;
      promptCounts.set(reflection.prompt, count + 1);
    }
  });

  // Filter to prompts that appear more than once
  const repeatedPrompts: ReflectionTheme[] = [];
  promptCounts.forEach((count, prompt) => {
    if (count > 1) {
      // Extract a short, neutral summary from the prompt
      const summary = extractThemeFromPrompt(prompt);
      repeatedPrompts.push({
        text: summary,
        type: "repeated-prompt",
      });
    }
  });

  return repeatedPrompts;
}

/**
 * Extracts a short, neutral theme summary from a prompt.
 */
function extractThemeFromPrompt(prompt: string): string {
  // Map prompts to neutral, observational summaries
  const promptMap: Record<string, string> = {
    "What feels most unclear right now?": "Uncertainty around what's unclear",
    "What decision am I avoiding, and why?": "Avoiding a difficult conversation",
    "What did I do out of fear this week?": "Acting from fear",
    "What gave me a small sense of direction?": "Small moments of direction",
    "What am I pretending not to think about?": "Something being avoided",
    "What uncertainty am I carrying?": "Carrying uncertainty",
    "What feels like it's waiting?": "Something waiting",
    "What did I notice about myself this week?": "Self-observation",
    "What question keeps coming back?": "A recurring question",
    "What feels unresolved?": "Something unresolved",
  };

  return promptMap[prompt] || "A recurring theme";
}

/**
 * Detects repeated keywords or phrases in reflection responses.
 * Uses basic string matching to find common words/phrases.
 */
export function detectRepeatedPhrases(
  reflections: WeeklyReflection[]
): ReflectionTheme[] {
  const phrases: ReflectionTheme[] = [];
  
  // Only analyze reflections with responses
  const reflectionsWithResponses = reflections.filter(
    (r) => r.response && r.response.trim().length > 0
  );

  if (reflectionsWithResponses.length < 2) {
    return phrases;
  }

  // Common uncertainty-related phrases to look for, with their theme mappings
  const phrasePatterns: Array<{ pattern: string; theme: string }> = [
    { pattern: "career", theme: "Uncertainty around career direction" },
    { pattern: "job", theme: "Uncertainty around career direction" },
    { pattern: "work", theme: "Uncertainty around career direction" },
    { pattern: "money", theme: "Financial uncertainty" },
    { pattern: "financ", theme: "Financial uncertainty" },
    { pattern: "relationship", theme: "Relationship uncertainty" },
    { pattern: "partner", theme: "Relationship uncertainty" },
    { pattern: "friend", theme: "Relationship uncertainty" },
    { pattern: "conversation", theme: "Avoiding a difficult conversation" },
    { pattern: "talk", theme: "Avoiding a difficult conversation" },
    { pattern: "decision", theme: "A decision being avoided" },
    { pattern: "choose", theme: "A decision being avoided" },
    { pattern: "uncertain", theme: "Uncertainty" },
    { pattern: "uncertainty", theme: "Uncertainty" },
    { pattern: "unclear", theme: "Things feeling unclear" },
    { pattern: "not sure", theme: "Not being sure" },
    { pattern: "don't know", theme: "Not knowing" },
    { pattern: "confused", theme: "Confusion" },
    { pattern: "avoiding", theme: "Avoiding something" },
    { pattern: "afraid", theme: "Fear" },
    { pattern: "fear", theme: "Fear" },
    { pattern: "worried", theme: "Worry" },
    { pattern: "anxious", theme: "Anxiety" },
    { pattern: "stuck", theme: "Feeling stuck" },
    { pattern: "waiting", theme: "Something waiting" },
    { pattern: "unresolved", theme: "Unresolved matters" },
  ];

  // Track theme occurrences across reflections
  const themeOccurrences = new Map<string, number>();
  
  reflectionsWithResponses.forEach((reflection) => {
    const responseLower = reflection.response!.toLowerCase();
    const foundThemes = new Set<string>();
    
    phrasePatterns.forEach(({ pattern, theme }) => {
      if (responseLower.includes(pattern)) {
        foundThemes.add(theme);
      }
    });
    
    // Count each unique theme found in this reflection
    foundThemes.forEach((theme) => {
      const count = themeOccurrences.get(theme) || 0;
      themeOccurrences.set(theme, count + 1);
    });
  });

  // Convert to themes that appear in multiple reflections
  themeOccurrences.forEach((count, theme) => {
    if (count >= 2) {
      phrases.push({
        text: theme,
        type: "repeated-phrase",
      });
    }
  });

  return phrases;
}


/**
 * Detects life areas with persistent low confidence.
 * Currently checks for areas with low confidence (very-unclear or unclear).
 */
export function detectPersistentUncertainty(
  lifeAreas: LifeAreaData[]
): PersistentUncertainty[] {
  return lifeAreas
    .filter(
      (area) =>
        area.confidence === "very-unclear" || area.confidence === "unclear"
    )
    .map((area) => ({
      lifeAreaName: area.name,
      lifeAreaId: area.id,
    }));
}

