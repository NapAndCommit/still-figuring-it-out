 "use client";

import { LifeAreaData } from "./LifeAreaCard";
import { CONFIDENCE_SCALE } from "./confidence";

interface LifeAreaEditDrawerProps {
  open: boolean;
  data: LifeAreaData | null;
  onChange: (updated: LifeAreaData) => void;
  onSaveAndClose: () => void;
  onDiscardAndClose: () => void;
}

export default function LifeAreaEditDrawer({
  open,
  data,
  onChange,
  onSaveAndClose,
  onDiscardAndClose,
}: LifeAreaEditDrawerProps) {
  if (!data) return null;

  return (
    <div
      className={`fixed inset-0 z-40 bg-neutral-900/30 backdrop-blur-sm transition-opacity duration-200 ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!open}
    >
      <div className="flex h-full justify-end">
        <aside
          className={`relative flex h-full w-full max-w-xl flex-col bg-white shadow-xl ring-1 ring-neutral-200 transition-transform duration-200 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex-1 overflow-y-auto px-6 pb-32 pt-6">
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
                  value={data.currentState}
                  onChange={(e) =>
                    onChange({ ...data, currentState: e.target.value })
                  }
                  rows={5}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 shadow-sm outline-none focus:border-neutral-300 focus:ring-0"
                  placeholder="What does this area feel like right now? You can write in fragments or unfinished thoughts."
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
                        <button
                          key={option.id}
                          type="button"
                          onClick={() =>
                            onChange({
                              ...data,
                              confidence: option.id,
                            })
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
                  <p className="pt-1 text-xs text-neutral-400">
                    This is just how it feels right now.
                  </p>
                </div>
              </section>

              {/* Top question */}
              <section className="space-y-2">
                <p className="text-xs font-medium text-neutral-600">
                  Question on your mind
                </p>
                <input
                  type="text"
                  value={data.topQuestion}
                  onChange={(e) =>
                    onChange({ ...data, topQuestion: e.target.value })
                  }
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 shadow-sm outline-none focus:border-neutral-300 focus:ring-0"
                  placeholder="What’s the main thing you’re unsure about here?"
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
                className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-light text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-50"
              >
                This is enough for now
              </button>
              <button
                type="button"
                onClick={onDiscardAndClose}
                className="text-xs font-light text-neutral-400 underline-offset-2 hover:text-neutral-500 hover:underline"
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


