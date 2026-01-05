import type { Metadata } from "next";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./components/LogoutButton";

export const metadata: Metadata = {
  title: "Still Figuring It Out",
  description: "A personal dashboard for navigating uncertainty",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
        <header className="border-b border-neutral-100 bg-white/60 backdrop-blur-sm">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
            <h1 className="text-sm font-light text-neutral-700 sm:text-base">
              Still Figuring It Out
            </h1>
            {user && <LogoutButton />}
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
          {children}
        </main>
      </body>
    </html>
  );
}

