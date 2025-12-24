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

  // Calculate if last row needs centering
  const totalCards = lifeAreas.length;
  const lgCols = 3;
  const fullRows = Math.floor(totalCards / lgCols);
  const cardsInLastRow = totalCards % lgCols;
  const needsCentering = cardsInLastRow > 0 && cardsInLastRow < lgCols;
  const lastRowStartIndex = fullRows * lgCols;

  return (
    <div className="mx-auto max-w-5xl">
      {/* Permission layer - soft header */}
      <div className="mb-16 pt-10">
        <p className="text-xs font-extralight leading-relaxed text-neutral-400 max-w-2xl">
          This isn't a place to measure progress. It's a place to notice.
        </p>
      </div>

      {/* Life Areas Grid */}
      <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {lifeAreas.map((area, index) => {
          const isInLastRow = index >= lastRowStartIndex;
          let gridColumnClass = "";
          
          if (isInLastRow && needsCentering) {
            // Center the last row items
            if (cardsInLastRow === 1) {
              gridColumnClass = "lg:col-start-2";
            } else if (cardsInLastRow === 2) {
              // For 2 cards, start first at col 2 to center the pair
              const positionInLastRow = index - lastRowStartIndex;
              gridColumnClass = positionInLastRow === 0 ? "lg:col-start-2" : "";
            }
          }
          
          return (
            <div key={area.id} className={gridColumnClass}>
              <LifeAreaCard
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
            </div>
          );
        })}
      </div>

      {/* Reassurance element */}
      <div className="mt-20 mb-8">
        <p className="text-xs font-extralight text-neutral-300 text-center">
          You come back when you need to.
        </p>
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

