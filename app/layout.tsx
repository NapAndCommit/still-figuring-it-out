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
      <body className="min-h-screen">
        <header className="border-b border-neutral-200 bg-white/50 backdrop-blur-sm">
          <div className="mx-auto max-w-4xl px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between">
            <h1 className="text-base font-light text-neutral-700 sm:text-lg">
              Still Figuring It Out
            </h1>
            {user && <LogoutButton />}
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
          {children}
        </main>
      </body>
    </html>
  );
}

