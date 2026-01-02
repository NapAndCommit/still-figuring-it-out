"use client";

import { useState, useEffect } from "react";
import LogoutButton from "./LogoutButton";

interface HeaderProps {
  user: { id: string } | null;
}

export default function Header({ user }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white/80 backdrop-blur-sm transition-shadow duration-200 ${
        isScrolled ? "shadow-[0_1px_2px_rgba(0,0,0,0.02)]" : ""
      }`}
    >
      <div className="flex h-14 items-center justify-between px-6">
        <h1 className="text-sm font-normal text-neutral-600">
          Still Figuring It Out
        </h1>
        {user && <LogoutButton />}
      </div>
    </header>
  );
}

