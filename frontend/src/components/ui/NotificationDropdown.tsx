"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-on-surface-variant hover:bg-surface-variant/50 rounded-full transition-colors active:scale-95"
      >
        <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 0" }}>notifications</span>
        <span className="absolute top-1.5 right-1.5 w-[9px] h-[9px] bg-error rounded-full border-2 border-surface"></span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant overflow-hidden z-50" style={{ animation: 'slideIn 0.2s ease-out' }}>
          <div className="px-4 py-3 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/50">
            <h3 className="font-semibold text-[14px] text-on-surface">Notifications</h3>
            <span className="text-[11px] text-primary cursor-pointer hover:underline font-medium">Mark all read</span>
          </div>
          
          <div className="p-6 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-on-surface-variant text-[24px]">notifications_off</span>
            </div>
            <p className="text-[13px] font-medium text-on-surface">No new notifications</p>
            <p className="text-[12px] text-on-surface-variant mt-1">You're all caught up! Check back later.</p>
          </div>
        </div>
      )}
    </div>
  );
}
