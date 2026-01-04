"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllReflections } from "../actions/weekly-reflections";
import { WeeklyReflection } from "@/lib/supabase/weekly-reflections";
import { getSoftTimeReference } from "@/lib/utils/time-references";

export default function ReflectionsPage() {
  const [reflections, setReflections] = useState<WeeklyReflection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadReflections() {
      try {
        const result = await getAllReflections();
        if (result.success && result.reflections) {
          setReflections(result.reflections);
        }
      } catch (error) {
        console.error("Error loading reflections:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadReflections();
  }, []);

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

  // Empty state
  if (reflections.length === 0) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            ← Back to dashboard
          </Link>
        </div>
        <div className="mb-12 text-center">
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
            You don't write every week — and that's okay.
          </p>
        </div>
      </div>
    );
  }

  // Single reflection state
  if (reflections.length === 1) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            ← Back to dashboard
          </Link>
        </div>
        <div className="mb-12 text-center">
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
            These are moments you paused to think.
          </p>
        </div>
        <div className="space-y-8">
          <ReflectionItem reflection={reflections[0]} />
        </div>
      </div>
    );
  }

  // Multiple reflections
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
        >
          ← Back to dashboard
        </Link>
      </div>
      <div className="mb-12 text-center">
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
          These are moments you paused to think.
        </p>
      </div>
      <div className="space-y-0">
        {reflections.map((reflection, index) => (
          <div key={reflection.id}>
            <ReflectionItem reflection={reflection} />
            {index < reflections.length - 1 && (
              <div className="my-8 border-t border-neutral-100" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ReflectionItem({ reflection }: { reflection: WeeklyReflection }) {
  const timeRef = getSoftTimeReference(reflection.weekStartDate);
  const hasResponse = reflection.response && reflection.response.trim().length > 0;

  return (
    <Link
      href={`/reflections/${reflection.id}`}
      className="block group"
    >
      <div className="py-4 transition-opacity group-hover:opacity-70">
        <div className="mb-3">
          <p className="text-xs text-neutral-400 sm:text-sm">{timeRef}</p>
        </div>
        <div className="mb-2">
          <p className="text-base leading-relaxed text-neutral-700 sm:text-lg">
            {reflection.prompt}
          </p>
        </div>
        {hasResponse && (
          <div className="mt-3">
            <p className="text-sm leading-relaxed text-neutral-500 line-clamp-2">
              {reflection.response}
            </p>
          </div>
        )}
        {!hasResponse && (
          <div className="mt-3">
            <p className="text-sm italic text-neutral-400">
              No response written
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}

