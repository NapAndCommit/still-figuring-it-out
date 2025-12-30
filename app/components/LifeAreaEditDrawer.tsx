 "use client";

import { useEffect, useRef, useState } from "react";
import { LifeAreaData } from "./LifeAreaCard";
import { CONFIDENCE_SCALE, ConfidenceConfig } from "./confidence";

interface ConfidenceDotProps {
  option: ConfidenceConfig;
  active: boolean;
  onClick: () => void;
}

function ConfidenceDot({ option, active, onClick }: ConfidenceDotProps) {
  const [isActive, setIsActive] = useState(active);

  useEffect(() => {
    // Add delay before state update
    const timer = setTimeout(() => {
      setIsActive(active);
    }, 80);
    return () => clearTimeout(timer);
  }, [active]);

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1 text-[11px]"
      aria-label={option.label}
    >
      <span
        className={`rounded-full border transition-all duration-300 ease-out ${
          isActive
            ? "h-2.5 w-2.5 border-neutral-600 bg-neutral-600"
            : "h-2 w-2 border-neutral-300 bg-neutral-100"
        }`}
      />
      <span
        className={`whitespace-nowrap text-[10px] transition-colors duration-300 ease-out ${
          isActive ? "text-neutral-800" : "text-neutral-400"
        }`}
      >
        {option.label}
      </span>
    </button>
  );
}

interface LifeAreaEditDrawerProps {
  open: boolean;
  data: LifeAreaData | null;
  onChange: (updated: LifeAreaData) => void;
  onSaveAndClose: () => void;
  onDiscardAndClose: () => void;
  isSaving?: boolean;
}

export default function LifeAreaEditDrawer({
  open,
  data,
  onChange,
  onSaveAndClose,
  onDiscardAndClose,
  isSaving = false,
}: LifeAreaEditDrawerProps) {
  const [contentOpacity, setContentOpacity] = useState(0);
  const [hasTyped, setHasTyped] = useState(false);
  const [hasFocusedInput, setHasFocusedInput] = useState(false);
  const initialDataRef = useRef<LifeAreaData | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && data) {
      initialDataRef.current = { ...data };
      setHasTyped(false);
      setHasFocusedInput(false);
      // Delay content fade-in slightly after drawer opens
      setTimeout(() => setContentOpacity(1), 50);
    } else {
      setContentOpacity(0);
      setHasFocusedInput(false);
    }
  }, [open, data]);

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current && data) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(120, textareaRef.current.scrollHeight)}px`;
    }
  }, [data?.currentState]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Prevent exit while any input/textarea is focused
    if (hasFocusedInput) {
      return;
    }

    // Check if click is on the backdrop (not on the drawer panel)
    const target = e.target as HTMLElement;
    const drawer = target.closest('aside');
    
    // If click is not inside the drawer, close it
    if (!drawer) {
      // Passive exit - only save if user has typed
      if (hasTyped) {
        onSaveAndClose();
      } else {
        onDiscardAndClose();
      }
    }
  };

  // Handle input focus - disable click-outside-to-close
  const handleInputFocus = () => {
    setHasFocusedInput(true);
  };

  // Handle input blur - re-enable click-outside-to-close after checking if focus moved to another input
  const handleInputBlur = () => {
    // Use setTimeout to check if focus moved to another input in the drawer
    setTimeout(() => {
      const activeElement = document.activeElement;
      const drawer = activeElement?.closest('aside');
      
      // If focus is not within the drawer (or no element is focused), re-enable click-outside
      if (!drawer || activeElement === document.body) {
        setHasFocusedInput(false);
      }
    }, 0);
  };

  const handleChange = (updated: LifeAreaData) => {
    if (!hasTyped) {
      const hasChanged = JSON.stringify(updated) !== JSON.stringify(initialDataRef.current);
      if (hasChanged) {
        setHasTyped(true);
      }
    }
    onChange(updated);
  };

  if (!data) return null;

  return (
    <div
      className={`fixed inset-0 z-40 transition-opacity duration-300 ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!open}
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-neutral-900/30 backdrop-blur-sm" />
      
      {/* Drawer container */}
      <div className="flex h-full justify-end">
        <aside
          className={`relative flex h-full w-full max-w-xl flex-col bg-white shadow-xl ring-1 ring-neutral-200 transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div 
            className="flex-1 overflow-y-auto px-6 pb-32 pt-6 transition-opacity duration-300"
            style={{ opacity: contentOpacity }}
          >
            {/* Header */}
            <header className="mb-6 space-y-1.5">
              <h2 className="text-lg font-light text-neutral-900">
                {data.name}
              </h2>
              <p className="text-xs text-neutral-500">
                You can stop here anytime.
              </p>
            </header>

            {/* Body */}
            <div className="space-y-6">
              {/* Current state */}
              <section className="space-y-2">
                <p className="text-xs font-medium text-neutral-600">
                  Current state
                </p>
                <textarea
                  ref={textareaRef}
                  value={data.currentState}
                  onChange={(e) =>
                    handleChange({ ...data, currentState: e.target.value })
                  }
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 shadow-sm outline-none focus:border-neutral-300 focus:ring-0 placeholder:transition-opacity placeholder:duration-200 overflow-hidden"
                  placeholder="What does this area feel like right now? You can write in fragments or unfinished thoughts."
                  style={{
                    minHeight: '120px',
                    resize: 'none',
                  }}
                />
                <p className="text-xs leading-relaxed text-neutral-400">
                  You don&apos;t need to be precise. This can change later.
                </p>
              </section>

              {/* Confidence scale */}
              <section className="space-y-2">
                <p className="text-xs font-medium text-neutral-600">
                  Clarity right now
                </p>
                <div className="flex flex-col gap-3">
                  <div className="mx-auto flex w-full max-w-xs items-center justify-between gap-3">
                    {CONFIDENCE_SCALE.map((option) => {
                      const active = data.confidence === option.id;
                      return (
                        <ConfidenceDot
                          key={option.id}
                          option={option}
                          active={active}
                          onClick={() =>
                            handleChange({
                              ...data,
                              confidence: option.id,
                            })
                          }
                        />
                      );
                    })}
                  </div>
                  <p className="pt-1 text-xs text-neutral-400">
                    This reflects how things feel right now.
                  </p>
                </div>
              </section>

              {/* Top question */}
              <section className="space-y-2">
                <p className="text-xs font-medium text-neutral-600">
                  Question on your mind
                </p>
                <input
                  ref={inputRef}
                  type="text"
                  value={data.topQuestion}
                  onChange={(e) =>
                    handleChange({ ...data, topQuestion: e.target.value })
                  }
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 shadow-sm outline-none focus:border-neutral-300 focus:ring-0 placeholder:transition-opacity placeholder:duration-200"
                  placeholder="What's the main thing you're unsure about here?"
                />
                <p className="text-xs leading-relaxed text-neutral-400">
                  This can change later.
                </p>
              </section>
            </div>
          </div>

          {/* Footer (sticky) */}
          <footer className="sticky bottom-0 border-t border-neutral-200 bg-white/95 px-6 py-4 backdrop-blur">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={onSaveAndClose}
                disabled={isSaving}
                className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-50 shadow-sm transition-colors hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                This is enough for now
              </button>
              <button
                type="button"
                onClick={onDiscardAndClose}
                disabled={isSaving}
                className="text-xs text-neutral-500 underline-offset-2 hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
              >
                I&apos;ll come back to this
              </button>
            </div>
          </footer>
        </aside>
      </div>
    </div>
  );
}


