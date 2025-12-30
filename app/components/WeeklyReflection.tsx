"use client";

import { useState, useEffect, useRef } from "react";
import { getCurrentWeekReflection, saveReflectionResponse } from "../actions/weekly-reflections";
import { WeeklyReflection as WeeklyReflectionType } from "@/lib/supabase/weekly-reflections";

export default function WeeklyReflection() {
  const [reflection, setReflection] = useState<WeeklyReflectionType | null>(null);
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load reflection on mount
  useEffect(() => {
    async function loadReflection() {
      try {
        const result = await getCurrentWeekReflection();
        if (result.success && result.reflection) {
          setReflection(result.reflection);
          setResponse(result.reflection.response || "");
        }
      } catch (error) {
        console.error("Error loading reflection:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadReflection();
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.max(120, textareaRef.current.scrollHeight)}px`;
    }
  }, [response]);

  const handleSave = async () => {
    if (!reflection || isSaving) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const result = await saveReflectionResponse(
        reflection.id,
        response.trim() || null
      );

      if (result.success) {
        // Update local state
        setReflection({
          ...reflection,
          response: response.trim() || null,
        });
        // Subtle feedback
        setSaveMessage("Saved for now.");
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        setSaveMessage("That didn't save yet. You can try again when you're ready.");
        setTimeout(() => setSaveMessage(null), 5000);
      }
    } catch (error) {
      console.error("Error saving reflection:", error);
      setSaveMessage("That didn't save yet. You can try again when you're ready.");
      setTimeout(() => setSaveMessage(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return null; // Don't show anything while loading
  }

  if (!reflection) {
    return null; // Don't show anything if reflection couldn't be loaded
  }

  return (
    <div className="mb-12 sm:mb-16">
      {/* Intro text */}
      <div className="mb-6 text-center">
        <p className="text-sm leading-relaxed text-neutral-500 sm:text-base">
          A question you can sit with this week.
        </p>
      </div>

      {/* Prompt display */}
      <div className="mb-6 text-center">
        <p className="mx-auto max-w-2xl text-xl leading-relaxed text-neutral-700 sm:text-2xl sm:leading-relaxed">
          {reflection.prompt}
        </p>
      </div>

      {/* Response textarea */}
      <div className="mx-auto max-w-2xl">
        <textarea
          ref={textareaRef}
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Write as much or as little as you want."
          className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-base leading-relaxed text-neutral-800 shadow-sm outline-none transition-colors focus:border-neutral-300 focus:ring-0 placeholder:text-neutral-400"
          style={{
            minHeight: "120px",
            resize: "none",
          }}
        />
        <p className="mt-2 text-xs leading-relaxed text-neutral-400 sm:text-sm">
          You can leave this unfinished.
        </p>
      </div>

      {/* Save button and feedback */}
      <div className="mx-auto mt-6 max-w-2xl">
        {saveMessage && (
          <div className="mb-3 text-center">
            <p className="text-xs text-neutral-500 sm:text-sm">{saveMessage}</p>
          </div>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="w-full rounded-full bg-neutral-800 px-6 py-2.5 text-sm font-medium text-neutral-50 shadow-sm transition-colors hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed sm:px-8 sm:py-3 sm:text-base"
        >
          {isSaving ? "Saving..." : "This is enough for today"}
        </button>
      </div>
    </div>
  );
}

