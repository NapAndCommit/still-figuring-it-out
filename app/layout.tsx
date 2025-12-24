import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Still Figuring It Out",
  description: "A personal dashboard for navigating uncertainty",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="border-b border-neutral-200 bg-white/50 backdrop-blur-sm">
          <div className="mx-auto max-w-4xl px-6 py-4">
            <h1 className="text-lg font-light text-neutral-700">
              Still Figuring It Out
            </h1>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-6 py-12">{children}</main>
      </body>
    </html>
  );
}

