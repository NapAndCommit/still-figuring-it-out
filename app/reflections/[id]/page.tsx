"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getAllReflections } from "../../actions/weekly-reflections";
import { saveReflectionResponse } from "../../actions/weekly-reflections";
import { WeeklyReflection } from "@/lib/supabase/weekly-reflections";
import { getSoftTimeReference } from "@/lib/utils/time-references";

export default function ReflectionDetailPage() {
  const params = useParams();
  const reflectionId = params.id as string;
  const [reflection, setReflection] = useState<WeeklyReflection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [response, setResponse] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    async function loadReflection() {
      try {
        const result = await getAllReflections();
        if (result.success && result.reflections) {
          const found = result.reflections.find((r) => r.id === reflectionId);
          if (found) {
            setReflection(found);
            setResponse(found.response || "");
          }
        }
      } catch (error) {
        console.error("Error loading reflection:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadReflection();
  }, [reflectionId]);

  // Auto-resize textarea when editing
  useEffect(() => {
    if (textareaRef.current && isEditing) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.max(120, textareaRef.current.scrollHeight)}px`;
    }
  }, [response, isEditing]);

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
        setReflection({
          ...reflection,
          response: response.trim() || null,
        });
        setSaveMessage("Saved for now.");
        setTimeout(() => setSaveMessage(null), 3000);
        setIsEditing(false);
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
    return (
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <p className="text-base leading-relaxed text-neutral-500 sm:text-lg">
            Looking back...
          </p>
        </div>
      </div>
    );
  }

  if (!reflection) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <Link
            href="/reflections"
            className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            ← Back to reflections
          </Link>
        </div>
        <div className="mb-12 text-center">
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
            This reflection isn't here anymore.
          </p>
        </div>
      </div>
    );
  }

  const timeRef = getSoftTimeReference(reflection.weekStartDate);
  const hasResponse = reflection.response && reflection.response.trim().length > 0;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <Link
          href="/reflections"
          className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
        >
          ← Back to reflections
        </Link>
      </div>

      <div className="mb-8">
        <p className="text-xs text-neutral-400 sm:text-sm">{timeRef}</p>
      </div>

      <div className="mb-8">
        <p className="mx-auto max-w-2xl text-xl leading-relaxed text-neutral-700 sm:text-2xl sm:leading-relaxed">
          {reflection.prompt}
        </p>
      </div>

      {!isEditing && (
        <div className="mb-8">
          {hasResponse ? (
            <div className="mx-auto max-w-2xl">
              <p className="text-base leading-relaxed text-neutral-800 whitespace-pre-wrap">
                {reflection.response}
              </p>
            </div>
          ) : (
            <div className="mx-auto max-w-2xl">
              <p className="text-sm italic text-neutral-400">
                No response written
              </p>
            </div>
          )}
        </div>
      )}

      {isEditing && (
        <div className="mb-6">
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
        </div>
      )}

      {saveMessage && (
        <div className="mb-4 text-center">
          <p className="text-xs text-neutral-500 sm:text-sm">{saveMessage}</p>
        </div>
      )}

      <div className="flex gap-4 justify-center">
        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded-full border border-neutral-300 bg-white px-6 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50 sm:px-8 sm:py-3 sm:text-base"
          >
            Edit
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => {
                setResponse(reflection.response || "");
                setIsEditing(false);
                setSaveMessage(null);
              }}
              disabled={isSaving}
              className="rounded-full border border-neutral-300 bg-white px-6 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed sm:px-8 sm:py-3 sm:text-base"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-full bg-neutral-800 px-6 py-2.5 text-sm font-medium text-neutral-50 shadow-sm transition-colors hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed sm:px-8 sm:py-3 sm:text-base"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

