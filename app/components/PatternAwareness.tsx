"use client";

import { useState, useEffect } from "react";
import { getPatternAwareness } from "../actions/pattern-awareness";
import {
  ReflectionTheme,
  PersistentUncertainty,
} from "@/lib/utils/pattern-detection";

interface PatternAwarenessData {
  reflectionThemes: ReflectionTheme[];
  persistentUncertainties: PersistentUncertainty[];
}

export default function PatternAwareness() {
  const [patterns, setPatterns] = useState<PatternAwarenessData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPatterns() {
      try {
        const result = await getPatternAwareness();
        if (result.success && result.data) {
          setPatterns(result.data);
        }
      } catch (error) {
        console.error("Error loading patterns:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadPatterns();
  }, []);

  // Don't render if loading or no patterns detected
  if (isLoading || !patterns) {
    return null;
  }

  const hasReflectionThemes = patterns.reflectionThemes.length > 0;
  const hasPersistentUncertainties = patterns.persistentUncertainties.length > 0;

  // Don't render if there are no patterns
  if (!hasReflectionThemes && !hasPersistentUncertainties) {
    return null;
  }

  return (
    <div className="mb-12 sm:mb-16">
      <h2 className="mb-4 text-xs font-normal text-neutral-400">
        Things that keep coming up for now
      </h2>

      <div className="space-y-2.5 text-xs leading-relaxed text-neutral-500">
        {/* Reflection themes */}
        {hasReflectionThemes && (
          <>
            {patterns.reflectionThemes.map((theme, index) => (
              <div key={index}>
                {theme.text}
              </div>
            ))}
          </>
        )}

        {/* Persistent uncertainties */}
        {hasPersistentUncertainties && (
          <>
            {patterns.persistentUncertainties.map((uncertainty) => (
              <div key={uncertainty.lifeAreaId}>
                <span className="text-neutral-400">
                  {uncertainty.lifeAreaName}
                </span>
                {" — "}
                This area has felt unclear for a while.
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

