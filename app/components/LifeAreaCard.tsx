 "use client";

import { useMemo } from "react";
import { useIsDesktop } from "../hooks/useIsDesktop";
import {
  CONFIDENCE_SCALE,
  ConfidenceLevel,
  confidenceToIndex,
  confidenceToLabel,
} from "./confidence";

export interface LifeAreaData {
  id: string;
  name: string;
  currentState: string;
  confidence: ConfidenceLevel;
  topQuestion: string;
  helper: string;
}

interface LifeAreaCardProps {
  data: LifeAreaData;
  isEditing: boolean;
  draft: LifeAreaData | null;
  onStartEdit: () => void;
  onChangeDraft: (updated: LifeAreaData) => void;
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
}

export default function LifeAreaCard({
  data,
  isEditing,
  draft,
  onStartEdit,
  onChangeDraft,
  onPrimaryAction,
  onSecondaryAction,
}: LifeAreaCardProps) {
  const isDesktop = useIsDesktop();

  const currentConfidenceLabel = useMemo(
    () => confidenceToLabel(data.confidence),
    [data.confidence]
  );

  const activeConfidenceIndex = useMemo(
    () => confidenceToIndex(data.confidence),
    [data.confidence]
  );

  const handleDraftFieldChange = <K extends keyof LifeAreaData>(
    key: K,
    value: LifeAreaData[K]
  ) => {
    if (!draft) return;
    onChangeDraft({
      ...draft,
      [key]: value,
    });
  };

  const isInlineEditing = isEditing && !isDesktop && draft;

  // Split currentState into two paragraphs at natural sentence boundary to reduce density
  const splitCurrentState = useMemo(() => {
    const text = data.currentState || "You can leave this blank until words show up.";
    const sentenceBreak = text.indexOf(". ");
    if (sentenceBreak > 0 && sentenceBreak < text.length - 2) {
      return [
        text.substring(0, sentenceBreak + 1),
        text.substring(sentenceBreak + 2).trim(),
      ];
    }
    return [text];
  }, [data.currentState]);

  // Generate subtle tooltip text for accessibility
  const clarityTooltip = useMemo(() => {
    const level = currentConfidenceLabel.toLowerCase();
    if (level.includes("very unclear")) return "Clarity feels very low right now";
    if (level.includes("unclear")) return "Clarity feels low right now";
    if (level.includes("forming")) return "Clarity is beginning to form";
    if (level.includes("clear-ish")) return "Clarity feels somewhat present";
    return "Clarity feels mostly present";
  }, [currentConfidenceLabel]);

  return (
    <div
      onClick={!isEditing ? onStartEdit : undefined}
      className="group relative flex h-full cursor-pointer flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-100 transition-all duration-200 hover:shadow-md hover:ring-neutral-200 hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-neutral-300 focus-within:shadow-md focus-within:outline-none active:translate-y-0 active:shadow-sm sm:p-6"
      role={!isEditing ? "button" : undefined}
      tabIndex={!isEditing ? 0 : undefined}
      onKeyDown={
        !isEditing
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onStartEdit();
              }
            }
          : undefined
      }
      aria-label={!isEditing ? `Open ${data.name} for reflection` : undefined}
    >
      {/* Confidence dots driven by canonical confidence value */}
      <div
        className="mb-4 flex gap-1.5 sm:mb-3 sm:gap-1"
        role="img"
        aria-label={clarityTooltip}
        title={clarityTooltip}
      >
        {CONFIDENCE_SCALE.map((option, index) => {
          const isActiveOrBelow = index <= activeConfidenceIndex;
          // Create a more nuanced opacity scale that reflects clarity
          // Lower clarity = more subtle, higher clarity = slightly more visible
          const opacityMap = [0.25, 0.35, 0.5, 0.65, 0.75]; // Very unclear to Mostly clear
          const baseOpacity = opacityMap[index] || 0.25;
          const activeOpacity = isActiveOrBelow ? baseOpacity : 0.12;
          
          return (
            <div
              key={option.id}
              className={`rounded-full transition-all duration-300 ${
                isActiveOrBelow
                  ? "h-2.5 w-2.5 bg-neutral-600 sm:h-2 sm:w-2"
                  : "h-1.5 w-1.5 bg-neutral-300 sm:h-1 sm:w-1"
              }`}
              style={{
                opacity: activeOpacity,
              }}
            />
          );
        })}
      </div>

      <div className="mb-3 text-left">
        <h3 className="text-lg font-light text-neutral-800 sm:text-base">
          {data.name}
        </h3>
      </div>

      {/* Read-only summary */}
      {!isInlineEditing && (
        <div className="space-y-3 text-sm sm:space-y-2.5 sm:text-[15px]">
          <div className="space-y-2.5 leading-relaxed text-neutral-600 sm:space-y-2">
            {splitCurrentState.map((paragraph, index) => (
              <p
                key={index}
                className="leading-relaxed sm:leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>
          <div className="pt-3 space-y-1">
            <p className="text-[10px] font-medium uppercase tracking-wide text-neutral-400/70 sm:text-[9px]">
              Clarity right now
            </p>
            <p className="text-xs font-normal text-neutral-700 sm:text-[13px]">
              {currentConfidenceLabel}
            </p>
          </div>
          {data.topQuestion && (
            <p className="text-xs text-neutral-500 sm:text-[11px]">
              Question on your mind:{" "}
              <span className="italic">{data.topQuestion}</span>
            </p>
          )}
          <p className="pt-1 text-xs leading-relaxed text-neutral-400 sm:text-[11px] sm:leading-relaxed">
            {data.helper}
          </p>
        </div>
      )}

      {/* Inline editing surface (mobile & tablet only) */}
      {isInlineEditing && draft && (
        <div
          className="mt-3 space-y-6 rounded-xl bg-neutral-50/80 p-4 pb-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Current state section */}
          <section className="space-y-2">
            <p className="text-[11px] font-normal uppercase tracking-wide text-neutral-500/90">
              Current state
            </p>
            <textarea
              value={draft.currentState}
              onChange={(e) =>
                handleDraftFieldChange("currentState", e.target.value)
              }
              rows={4}
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-800 shadow-sm outline-none focus:border-neutral-300 focus:ring-0"
              placeholder="What does this area feel like right now? You can write in fragments or unfinished thoughts."
            />
            <p className="text-xs leading-relaxed text-neutral-400">
              You don&apos;t need to be precise. This can change later.
            </p>
          </section>

          {/* Confidence level section */}
          <section className="space-y-2">
            <p className="text-[11px] font-normal uppercase tracking-wide text-neutral-500/90">
              Clarity right now
            </p>
            <div className="flex flex-col gap-3">
              <div className="mx-auto flex w-full max-w-xs items-center justify-between gap-3">
                {CONFIDENCE_SCALE.map((option) => {
                  const active = draft.confidence === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() =>
                        handleDraftFieldChange("confidence", option.id)
                      }
                      className="flex flex-col items-center gap-1 text-[11px]"
                      aria-label={option.label}
                    >
                      <span
                        className={`h-2 w-2 rounded-full border transition-colors ${
                          active
                            ? "border-neutral-700 bg-neutral-700"
                            : "border-neutral-300 bg-neutral-100"
                        }`}
                      />
                      <span
                        className={`whitespace-nowrap text-[10px] ${
                          active ? "text-neutral-800" : "text-neutral-400"
                        }`}
                      >
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="pt-1 text-xs leading-relaxed text-neutral-400">
                This is just how it feels right now.
              </p>
            </div>
          </section>

          {/* Top question section */}
          <section className="space-y-2">
            <p className="text-[11px] font-normal uppercase tracking-wide text-neutral-500/90">
              Question on your mind
            </p>
            <input
              type="text"
              value={draft.topQuestion}
              onChange={(e) =>
                handleDraftFieldChange("topQuestion", e.target.value)
              }
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-800 shadow-sm outline-none focus:border-neutral-300 focus:ring-0"
              placeholder="What’s the main thing you’re unsure about here?"
            />
            <p className="text-xs leading-relaxed text-neutral-400">
              You can leave this empty or change it whenever a new question
              appears.
            </p>
          </section>

          {/* Gentle action footer */}
          <section className="space-y-3 pt-2">
            <p className="text-xs leading-relaxed text-neutral-400">
              You can stop here anytime.
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={onPrimaryAction}
                className="flex w-full items-center justify-center rounded-full bg-neutral-800 px-4 py-2.5 text-sm font-medium text-neutral-50 shadow-sm transition-colors hover:bg-neutral-700"
              >
                This is enough for now
              </button>
              <button
                type="button"
                onClick={onSecondaryAction}
                className="w-full text-center text-xs text-neutral-500 underline-offset-2 hover:underline"
              >
                I&apos;ll come back to this
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

