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

  return (
    <div className="group relative flex flex-col rounded-3xl bg-white/80 p-6 shadow-sm ring-1 ring-neutral-100/50 transition-opacity duration-500 hover:opacity-90">
      {/* Confidence dots driven by canonical confidence value */}
      <div className="mb-5 flex gap-1.5">
        {CONFIDENCE_SCALE.map((option, index) => {
          const isActiveOrBelow = index <= activeConfidenceIndex;
          return (
            <div
              key={option.id}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                isActiveOrBelow
                  ? "bg-neutral-600 opacity-60"
                  : "bg-neutral-200 opacity-30"
              }`}
            />
          );
        })}
      </div>

      <button
        type="button"
        onClick={onStartEdit}
        className="mb-4 flex items-baseline justify-between text-left"
      >
        <h3 className="text-base font-extralight text-neutral-600">{data.name}</h3>
        {!isEditing && (
          <span className="invisible text-xs font-extralight text-neutral-300 opacity-0 transition-opacity duration-500 group-hover:visible group-hover:opacity-60">
            Reflect on this
          </span>
        )}
      </button>

      {/* Read-only summary - softened hierarchy */}
      {!isInlineEditing && (
        <div className="space-y-3 text-sm">
          {/* One emotional signal - emphasized */}
          <p className="text-xs font-light text-neutral-500">
            {currentConfidenceLabel === "Very unclear" || currentConfidenceLabel === "Unclear"
              ? "Clarity feels low right now"
              : currentConfidenceLabel === "Forming"
              ? "Clarity is beginning to form"
              : currentConfidenceLabel === "Clear-ish" || currentConfidenceLabel === "Mostly clear"
              ? "Clarity feels present"
              : "Clarity feels low right now"}
          </p>
          
          {/* One short preview line - reduced contrast */}
          {data.currentState ? (
            <p className="line-clamp-2 leading-relaxed text-neutral-500/70">
              {data.currentState}
            </p>
          ) : (
            <p className="text-xs font-extralight leading-relaxed text-neutral-400/80">
              Unclear is still a valid state.
            </p>
          )}
        </div>
      )}

      {/* Inline editing surface (mobile & tablet only) */}
      {isInlineEditing && draft && (
        <div className="mt-3 space-y-6 rounded-xl bg-neutral-50/80 p-4 pb-6">
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
            <p className="text-xs font-light leading-relaxed text-neutral-400">
              You can stop here anytime.
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={onPrimaryAction}
                className="flex w-full items-center justify-center rounded-full border border-neutral-300 bg-white px-4 py-2.5 text-sm font-light text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-50"
              >
                This is enough for now
              </button>
              <button
                type="button"
                onClick={onSecondaryAction}
                className="w-full text-center text-xs font-light text-neutral-400 underline-offset-2 hover:text-neutral-500 hover:underline"
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

