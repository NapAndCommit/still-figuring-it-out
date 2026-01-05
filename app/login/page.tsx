"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHoldingState, setShowHoldingState] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const justLeft = searchParams.get("left") === "true";

  // Check if user is already authenticated and redirect
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        router.push("/dashboard");
      }
    };
    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    // Silently handle errors - don't show error messages
    if (!error) {
      setShowHoldingState(true);
    } else {
      // On error, still show holding state to avoid exposing technical issues
      setShowHoldingState(true);
    }
    setIsSubmitting(false);
  };

  // Holding state after email submission
  if (showHoldingState) {
    return (
      <div className="mx-auto max-w-md">
        <div className="space-y-4 text-center">
          <p className="mx-auto max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg">
            I've sent you a private link.
          </p>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-neutral-500 sm:text-base">
            It's just to make sure this space stays yours.
          </p>
          <p className="mx-auto max-w-xl pt-4 text-xs leading-relaxed text-neutral-400 sm:text-sm">
            You can close this tab — the dashboard will open when you return.
          </p>
        </div>
      </div>
    );
  }

  // Initial form state
  return (
    <div className="mx-auto max-w-md">
      <div className="mb-6 text-center">
        <p className="mx-auto max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg">
          This is just to keep your space private.
        </p>
        {justLeft && (
          <p className="mx-auto mt-3 max-w-xl text-xs leading-relaxed text-neutral-400 sm:text-sm">
            Your space is still here.
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email address"
            required
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm outline-none transition-colors focus:border-neutral-300 focus:ring-0 placeholder:text-neutral-400"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <button
            type="submit"
            disabled={isSubmitting || !email}
            className="w-full rounded-full bg-neutral-800 px-6 py-3 text-sm font-medium text-neutral-50 shadow-sm transition-colors duration-200 hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50"
          >
            {isSubmitting ? "Sending link…" : "Send me a link"}
          </button>
          <p className="text-center text-xs leading-relaxed text-neutral-400">
            We&apos;ll email you a link to open your space.
          </p>
        </div>
      </form>
    </div>
  );
}

