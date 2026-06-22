"use client";

import * as React from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
    
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10"></div>; // Placeholder to prevent layout shift
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-on-surface-variant hover:bg-surface-variant/50 rounded-full transition-colors active:scale-95 flex items-center justify-center"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <span className="material-symbols-outlined text-[20px]">dark_mode</span>
        ) : theme === 'light' ? (
          <span className="material-symbols-outlined text-[20px]">light_mode</span>
        ) : (
          <span className="material-symbols-outlined text-[20px]">routine</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-40 bg-surface border border-outline-variant rounded-xl shadow-lg overflow-hidden z-50">
          <div className="flex flex-col p-1">
            <button
              onClick={() => { setTheme("light"); setIsOpen(false); }}
              className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${theme === 'light' ? 'bg-primary/10 text-primary font-medium' : 'text-on-surface hover:bg-surface-variant/50'}`}
            >
              <span className="material-symbols-outlined text-[18px]">light_mode</span>
              Light
            </button>
            <button
              onClick={() => { setTheme("dark"); setIsOpen(false); }}
              className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${theme === 'dark' ? 'bg-primary/10 text-primary font-medium' : 'text-on-surface hover:bg-surface-variant/50'}`}
            >
              <span className="material-symbols-outlined text-[18px]">dark_mode</span>
              Dark
            </button>
            <button
              onClick={() => { setTheme("system"); setIsOpen(false); }}
              className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${theme === 'system' ? 'bg-primary/10 text-primary font-medium' : 'text-on-surface hover:bg-surface-variant/50'}`}
            >
              <span className="material-symbols-outlined text-[18px]">routine</span>
              System
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
