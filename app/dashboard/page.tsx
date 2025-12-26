"use client";

import { useState } from "react";
import LifeAreaCard, { LifeAreaData } from "../components/LifeAreaCard";
import LifeAreaEditDrawer from "../components/LifeAreaEditDrawer";
import { useIsDesktop } from "../hooks/useIsDesktop";

const initialLifeAreas: LifeAreaData[] = [
  {
    id: "career",
    name: "Career",
    currentState:
      "Work might feel a bit undefined right now. This is a place to notice that without needing a plan.",
    confidence: "unclear",
    topQuestion: "What kind of work might actually feel like you?",
    helper: "You don't need to define this yet.",
  },
  {
    id: "money",
    name: "Money",
    currentState:
      "This could feel shaky, stable, or somewhere in between. All of that belongs here.",
    confidence: "forming",
    topQuestion: "What feels most confusing about money right now?",
    helper: "It's okay if this changes.",
  },
  {
    id: "relationships",
    name: "Relationships",
    currentState:
      "Connections might feel close, distant, or in transition. There’s room for all of that.",
    confidence: "very-unclear",
    topQuestion: "Where do you feel most unsure in your connections?",
    helper: "Unclear is still a valid state.",
  },
  {
    id: "identity",
    name: "Identity",
    currentState:
      "Who you are might feel in motion. This is a quiet place to notice what’s shifting.",
    confidence: "unclear",
    topQuestion: "What parts of you feel like they’re still forming?",
    helper: "It's okay if this feels unclear.",
  },
  {
    id: "health",
    name: "Health",
    currentState:
      "Energy, rest, and movement can be inconsistent. You don’t have to fix anything here.",
    confidence: "unclear",
    topQuestion: "What are you most curious about in your health right now?",
    helper: "Uncertainty is part of the process.",
  },
];

export default function Dashboard() {
  const [lifeAreas, setLifeAreas] = useState<LifeAreaData[]>(initialLifeAreas);
  const [activeEditAreaId, setActiveEditAreaId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<LifeAreaData | null>(null);
  const isDesktop = useIsDesktop();

  const handleUpdateArea = (updatedArea: LifeAreaData) => {
    setLifeAreas((prev) =>
      prev.map((area) => (area.id === updatedArea.id ? updatedArea : area))
    );
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

