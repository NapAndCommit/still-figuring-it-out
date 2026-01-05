"use client";

import { useState, useEffect } from "react";
import LifeAreaCard, { LifeAreaData } from "../components/LifeAreaCard";
import LifeAreaEditDrawer from "../components/LifeAreaEditDrawer";
import WeeklyReflection from "../components/WeeklyReflection";
import PatternAwareness from "../components/PatternAwareness";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { getLifeAreas, saveLifeArea } from "../actions/life-areas";

type LoadingState = "loading" | "empty" | "error" | "ready";

export default function Dashboard() {
  const [lifeAreas, setLifeAreas] = useState<LifeAreaData[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>("loading");
  const [activeEditAreaId, setActiveEditAreaId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<LifeAreaData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    async function loadLifeAreas() {
      try {
        const areas = await getLifeAreas();
        if (areas.length === 0) {
          setLoadingState("empty");
        } else {
          setLifeAreas(areas);
          setLoadingState("ready");
        }
      } catch (error) {
        // Technical error logged in server action
        setLoadingState("error");
      }
    }
    loadLifeAreas();
  }, []);

  const handleUpdateArea = async (updatedArea: LifeAreaData): Promise<boolean> => {
    // Prevent double-submits
    if (isSaving) return false;

    setIsSaving(true);
    setSaveMessage(null);

    // Optimistically update UI
    const previousAreas = [...lifeAreas];
    setLifeAreas((prev) =>
      prev.map((area) => (area.id === updatedArea.id ? updatedArea : area))
    );

    // Persist to Supabase
    const result = await saveLifeArea(updatedArea);

    if (!result.success) {
      // Revert optimistic update on error
      setLifeAreas(previousAreas);
      // Show calm error message
      setSaveMessage("That didn't save yet. You can try again when you're ready.");
      // Clear message after a moment
      setTimeout(() => setSaveMessage(null), 5000);
      setIsSaving(false);
      return false;
    }

    // Subtle success feedback
    setSaveMessage("Saved for now.");
    setTimeout(() => setSaveMessage(null), 3000);
    setIsSaving(false);
    return true;
  };

  const startEditForArea = (areaId: string) => {
    const area = lifeAreas.find((a) => a.id === areaId);
    if (!area) return;
    setActiveEditAreaId(areaId);
    setEditDraft(area);
  };

  const commitDraft = async (): Promise<boolean> => {
    if (!activeEditAreaId || !editDraft) return false;
    const result = await handleUpdateArea(editDraft);
    // Return true if save succeeded, false otherwise
    return result;
  };

  const finishEditSession = () => {
    setActiveEditAreaId(null);
    setEditDraft(null);
  };

  const handlePrimaryAction = async () => {
    // "This is enough for now" – commit and close
    const success = await commitDraft();
    // Only close if save succeeded
    if (success) {
      finishEditSession();
    }
  };

  const handleSecondaryAction = async () => {
    // "I'll come back to this" – still keep whatever was written so far, then close
    const success = await commitDraft();
    // Only close if save succeeded
    if (success) {
      finishEditSession();
    }
  };

  // Loading state
  if (loadingState === "loading") {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-12 text-center sm:mb-16">
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
            Getting your space ready.
          </p>
        </div>
      </div>
    );
  }

  // Empty state (should rarely happen due to auto-recovery)
  if (loadingState === "empty") {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-12 text-center sm:mb-16">
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
            Something didn&apos;t load yet. You can refresh whenever you feel like it.
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (loadingState === "error") {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-12 text-center sm:mb-16">
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
            Something didn&apos;t load yet. You can refresh whenever you feel like it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      {/* Save message (subtle feedback) */}
      {saveMessage && (
        <div className="mb-4 text-center">
          <p className="text-sm text-neutral-500">{saveMessage}</p>
        </div>
      )}

      {/* Intro section */}
      <div className="mb-12 text-center sm:mb-16">
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
          This is a space to hold what you don't have answers to yet.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-neutral-500 sm:mt-4">
          Nothing here needs to be finished. You can change your words
          whenever they no longer feel true.
        </p>
      </div>

      {/* Weekly Reflection section */}
      <WeeklyReflection />

      {/* Pattern Awareness section */}
      <PatternAwareness />

      {/* Life Areas Grid */}
      {/* Mobile & Tablet: Auto-flow grid */}
      <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:hidden">
        {lifeAreas.map((area) => (
          <LifeAreaCard
            key={area.id}
            data={area}
            isEditing={activeEditAreaId === area.id}
            draft={
              activeEditAreaId === area.id && editDraft ? editDraft : null
            }
            onStartEdit={() => startEditForArea(area.id)}
            onChangeDraft={setEditDraft}
            onPrimaryAction={handlePrimaryAction}
            onSecondaryAction={handleSecondaryAction}
            isSaving={isSaving && activeEditAreaId === area.id}
          />
        ))}
      </div>

      {/* Desktop: Explicit two-row layout */}
      <div className="hidden lg:block space-y-6">
        {/* Top Row: Career, Money, Relationships */}
        <div className="grid grid-cols-3 gap-6">
          {lifeAreas.slice(0, 3).map((area) => (
            <LifeAreaCard
              key={area.id}
              data={area}
              isEditing={activeEditAreaId === area.id}
              draft={
                activeEditAreaId === area.id && editDraft ? editDraft : null
              }
              onStartEdit={() => startEditForArea(area.id)}
              onChangeDraft={setEditDraft}
              onPrimaryAction={handlePrimaryAction}
              onSecondaryAction={handleSecondaryAction}
            />
          ))}
        </div>

        {/* Bottom Row: Identity, Health (centered) */}
        <div className="grid grid-cols-6 gap-6">
          <div className="col-start-2 col-span-2">
            <LifeAreaCard
              data={lifeAreas[3]}
              isEditing={activeEditAreaId === lifeAreas[3].id}
              draft={
                activeEditAreaId === lifeAreas[3].id && editDraft ? editDraft : null
              }
              onStartEdit={() => startEditForArea(lifeAreas[3].id)}
              onChangeDraft={setEditDraft}
              onPrimaryAction={handlePrimaryAction}
              onSecondaryAction={handleSecondaryAction}
            />
          </div>
          <div className="col-span-2">
            <LifeAreaCard
              data={lifeAreas[4]}
              isEditing={activeEditAreaId === lifeAreas[4].id}
              draft={
                activeEditAreaId === lifeAreas[4].id && editDraft ? editDraft : null
              }
              onStartEdit={() => startEditForArea(lifeAreas[4].id)}
              onChangeDraft={setEditDraft}
              onPrimaryAction={handlePrimaryAction}
              onSecondaryAction={handleSecondaryAction}
            />
          </div>
        </div>
      </div>

      {/* Desktop edit drawer */}
      {isDesktop && (
          <LifeAreaEditDrawer
          open={Boolean(activeEditAreaId && editDraft)}
          data={editDraft}
          onChange={setEditDraft}
          onSaveAndClose={handlePrimaryAction}
          onDiscardAndClose={handleSecondaryAction}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}

