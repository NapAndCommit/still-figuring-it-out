"use client";

import { useEffect, useState } from "react";

export function useIsDesktop(breakpoint: number = 1024) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`);
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsDesktop(event.matches);
    };

    // Set initial value
    handleChange(mediaQuery);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange as any);
      return () => mediaQuery.removeEventListener("change", handleChange as any);
    } else {
      // Fallback for older browsers
      // @ts-ignore
      mediaQuery.addListener(handleChange);
      // @ts-ignore
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [breakpoint]);

  return isDesktop;
}


