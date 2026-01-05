import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="mb-4 max-w-xl text-2xl font-light text-neutral-600 sm:text-[28px] sm:leading-snug">
        You don't need to have answers today.
      </h2>
      <Link
        href="/login"
        className="mt-6 rounded-full bg-neutral-800 px-6 py-2.5 text-sm font-medium text-neutral-50 shadow-sm transition-colors duration-200 hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50"
      >
        Go to your space
      </Link>
    </div>
  );
}

