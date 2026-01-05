"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Home, BookOpen, LogOut } from "lucide-react";

export default function Sidebar({
  isExpanded,
  onToggle,
  onHoverExpand,
  onHoverCollapse,
  wasExpandedByClick = false,
}: {
  isExpanded: boolean;
  onToggle: () => void;
  onHoverExpand?: () => void;
  onHoverCollapse?: () => void;
  wasExpandedByClick?: boolean;
}) {
  const router = useRouter();
  const supabase = createClient();
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showLabels, setShowLabels] = useState(false);

  const navItems = [
    {
      href: "/dashboard",
      icon: Home,
      label: "Home",
    },
    {
      href: "/reflections",
      icon: BookOpen,
      label: "Past Reflections",
    },
  ];

  // Staggered label reveal: show labels after width expansion begins
  useEffect(() => {
    if (isExpanded) {
      // Delay label appearance 60-80ms after expansion starts
      const timer = setTimeout(() => {
        setShowLabels(true);
      }, 70);
      return () => clearTimeout(timer);
    } else {
      // Hide labels immediately when collapsing
      setShowLabels(false);
    }
  }, [isExpanded]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login?left=true");
    router.refresh();
  };

  // Handle icon hover: expand sidebar only when hovering over icons
  const handleIconMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    // Only expand on hover for desktop (not mobile)
    if (typeof window !== "undefined" && window.innerWidth >= 640) {
      onHoverExpand?.();
    }
  };

  const handleIconMouseLeave = () => {
    // Only auto-collapse on hover leave if it was expanded via hover (desktop only)
    if (typeof window !== "undefined" && window.innerWidth >= 640) {
      hoverTimeoutRef.current = setTimeout(() => {
        onHoverCollapse?.();
      }, 150);
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Mobile overlay */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-neutral-900/20 backdrop-blur-sm z-20 sm:hidden"
          onClick={onToggle}
        />
      )}
      <aside
        className={`fixed left-0 top-14 h-[calc(100vh-3.5rem)] bg-neutral-50/80 backdrop-blur-sm transition-all duration-[240ms] ease-in-out z-30 flex flex-col ${
          isExpanded ? "w-48" : "w-0 sm:w-16"
        } ${isExpanded ? "flex" : "hidden sm:flex"}`}
      >
        <nav className="flex flex-col gap-1 p-3 h-full">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-neutral-500 hover:bg-neutral-100/40 group"
                  onMouseEnter={handleIconMouseEnter}
                  onMouseLeave={handleIconMouseLeave}
                >
                  <IconComponent
                    size={20}
                    strokeWidth={1.25}
                    className="flex-shrink-0 text-neutral-500 transition-colors duration-200 group-hover:text-neutral-600"
                  />
                  {isExpanded && (
                    <span
                      className={`text-sm font-normal text-neutral-600 whitespace-nowrap transition-opacity duration-200 ${
                        showLabels ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
          {isExpanded && (
            <div className="mt-auto pt-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-500 hover:text-neutral-600 hover:bg-neutral-100/40 transition-all duration-200 w-full text-left group"
                onMouseEnter={handleIconMouseEnter}
                onMouseLeave={handleIconMouseLeave}
              >
                <LogOut
                  size={20}
                  strokeWidth={1.25}
                  className="text-neutral-500 transition-colors duration-200 group-hover:text-neutral-600"
                />
                <span
                  className={`text-sm font-normal text-neutral-600 whitespace-nowrap transition-opacity duration-200 ${
                    showLabels ? "opacity-100" : "opacity-0"
                  }`}
                >
                  Step Away
                </span>
              </button>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}

