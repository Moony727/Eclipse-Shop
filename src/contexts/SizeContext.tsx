"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type SizeMode = "compact" | "normal" | "large";

interface SizeContextType {
  sizeMode: SizeMode;
  setSizeMode: (mode: SizeMode) => void;
  scale: number;
}

const SizeContext = createContext<SizeContextType | undefined>(undefined);

const sizeScales: Record<SizeMode, number> = {
  compact: 0.9,
  normal: 1.0,
  large: 1.1,
};

export function SizeProvider({ children }: { children: React.ReactNode }) {
  const [sizeMode, setSizeMode] = useState<SizeMode>("normal");

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("ui-size-mode") as SizeMode;
    if (saved && ["compact", "normal", "large"].includes(saved)) {
      setSizeMode(saved);
    } else {
      // Auto-detect for very large screens
      const width = window.innerWidth;
      if (width > 2000) {
        setSizeMode("large");
      } else if (width < 380) {
        setSizeMode("compact");
      }
    }
  }, []);

  // Update CSS variable and localStorage
  useEffect(() => {
    localStorage.setItem("ui-size-mode", sizeMode);
    document.documentElement.style.setProperty("--ui-scale", sizeScales[sizeMode].toString());
    
    // Also adjust root font-size for rem-based scaling if needed
    // But since we use variables, --ui-scale is cleaner
  }, [sizeMode]);

  return (
    <SizeContext.Provider value={{ sizeMode, setSizeMode, scale: sizeScales[sizeMode] }}>
      {children}
    </SizeContext.Provider>
  );
}

export function useSize() {
  const context = useContext(SizeContext);
  if (context === undefined) {
    throw new Error("useSize must be used within a SizeProvider");
  }
  return context;
}
