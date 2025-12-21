import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h2 className="mb-4 text-2xl font-light text-neutral-600">
        You don't need to have answers today.
      </h2>
      <Link
        href="/dashboard"
        className="mt-6 rounded-lg bg-neutral-200 px-6 py-2 text-sm font-light text-neutral-700 transition-colors hover:bg-neutral-300"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}

