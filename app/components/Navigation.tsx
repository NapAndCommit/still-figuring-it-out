"use client";

import { useState, useRef } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Navigation() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const wasExpandedByClickRef = useRef(false);

  const toggleSidebar = () => {
    wasExpandedByClickRef.current = !isSidebarExpanded;
    setIsSidebarExpanded((prev) => !prev);
  };

  const handleHoverExpand = () => {
    if (!isSidebarExpanded && !wasExpandedByClickRef.current) {
      setIsSidebarExpanded(true);
    }
  };

  const handleHoverCollapse = () => {
    if (isSidebarExpanded && !wasExpandedByClickRef.current) {
      setIsSidebarExpanded(false);
    }
  };

  return (
    <>
      <Header onMenuClick={toggleSidebar} />
      <Sidebar
        isExpanded={isSidebarExpanded}
        onToggle={toggleSidebar}
        onHoverExpand={handleHoverExpand}
        onHoverCollapse={handleHoverCollapse}
        wasExpandedByClick={wasExpandedByClickRef.current}
      />
    </>
  );
}

