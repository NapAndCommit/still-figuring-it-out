import type { Metadata } from "next";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import Navigation from "./components/Navigation";

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
        {user && <Navigation />}
        <main
          className={`mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 transition-all duration-200 ${
            user ? "sm:pl-20" : ""
          }`}
          style={{ paddingTop: user ? "3.5rem" : "2.5rem" }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}

