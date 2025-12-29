"use client";

import { useState, useEffect } from "react";
import LifeAreaCard, { LifeAreaData } from "../components/LifeAreaCard";
import LifeAreaEditDrawer from "../components/LifeAreaEditDrawer";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { getLifeAreas, saveLifeArea } from "../actions/life-areas";

export default function Dashboard() {
  const [lifeAreas, setLifeAreas] = useState<LifeAreaData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeEditAreaId, setActiveEditAreaId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<LifeAreaData | null>(null);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    async function loadLifeAreas() {
      try {
        const areas = await getLifeAreas();
        setLifeAreas(areas);
      } catch (error) {
        console.error("Error loading life areas:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadLifeAreas();
  }, []);

  const handleUpdateArea = async (updatedArea: LifeAreaData) => {
    // Optimistically update UI
    setLifeAreas((prev) =>
      prev.map((area) => (area.id === updatedArea.id ? updatedArea : area))
    );

    // Persist to Supabase
    try {
      await saveLifeArea(updatedArea);
    } catch (error) {
      console.error("Error saving life area:", error);
      // Revert on error - could show a subtle message here if needed
      // For now, we'll keep the optimistic update
    }
  };

  const startEditForArea = (areaId: string) => {
    const area = lifeAreas.find((a) => a.id === areaId);
    if (!area) return;
    setActiveEditAreaId(areaId);
    setEditDraft(area);
  };

  const commitDraft = () => {
    if (!activeEditAreaId || !editDraft) return;
    handleUpdateArea(editDraft);
  };

  const finishEditSession = () => {
    setActiveEditAreaId(null);
    setEditDraft(null);
  };

  const handlePrimaryAction = () => {
    // "This is enough for now" – commit and close
    commitDraft();
    finishEditSession();
  };

  const handleSecondaryAction = () => {
    // "I'll come back to this" – still keep whatever was written so far, then close
    commitDraft();
    finishEditSession();
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-12 text-center sm:mb-16">
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
            Loading your space…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
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
        />
      )}
    </div>
  );
}

