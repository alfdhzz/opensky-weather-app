"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  // Only determine theme AFTER hydration to avoid mismatch
  const isDark = mounted && resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
    const fadeTimer = setTimeout(() => setFadeOut(true), 1800);
    const hideTimer = setTimeout(() => setVisible(false), 2250);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center
        transition-opacity duration-500 ease-out
        ${fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"}
        ${isDark
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          : "bg-gradient-to-br from-sky-50 via-white to-blue-50"
        }`}
    >
      {/* Floating blobs — adaptive */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[10%] left-[15%] w-72 h-72 rounded-full blur-[100px] animate-pulse
          ${isDark ? "bg-blue-600/20" : "bg-blue-300/30"}`}
        />
        <div className={`absolute bottom-[10%] right-[10%] w-80 h-80 rounded-full blur-[120px] animate-pulse delay-700
          ${isDark ? "bg-sky-400/10" : "bg-sky-200/40"}`}
        />
      </div>

      {/* Logo */}
      <div className="relative flex flex-col items-center animate-preloader-pop">
        {/* Logo icon with glow ring */}
        <div className={`relative w-24 h-24 mb-6 ${isDark ? "drop-shadow-[0_0_32px_rgba(56,189,248,0.5)]" : "drop-shadow-[0_0_24px_rgba(14,165,233,0.3)]"}`}>
          <div className={`absolute inset-0 rounded-2xl blur-xl animate-pulse
            ${isDark ? "bg-gradient-to-br from-blue-500/30 to-sky-300/10" : "bg-gradient-to-br from-sky-300/40 to-blue-200/20"}`}
          />
          <div className={`relative w-full h-full rounded-2xl overflow-hidden shadow-2xl
            ${isDark ? "ring-2 ring-white/10" : "ring-2 ring-sky-200/60"}`}
          >
            <Image src="/logo.png" alt="OpenSky Logo" fill className="object-cover" />
          </div>
        </div>

        {/* App name */}
        <h1 className={`text-4xl font-bold tracking-widest mb-2 select-none
          ${isDark ? "text-white" : "text-slate-800"}`}
        >
          OpenSky
        </h1>
        <p className={`text-sm tracking-[0.3em] uppercase font-medium
          ${isDark ? "text-sky-400" : "text-sky-500"}`}
        >
          Real-time Weather
        </p>
      </div>

      {/* Loading dots */}
      <div className="absolute bottom-16 flex gap-2 items-center">
        <span className={`w-2 h-2 rounded-full animate-bounce [animation-delay:0ms]
          ${isDark ? "bg-sky-400" : "bg-sky-500"}`}
        />
        <span className={`w-2 h-2 rounded-full animate-bounce [animation-delay:150ms]
          ${isDark ? "bg-sky-400" : "bg-sky-500"}`}
        />
        <span className={`w-2 h-2 rounded-full animate-bounce [animation-delay:300ms]
          ${isDark ? "bg-sky-400" : "bg-sky-500"}`}
        />
      </div>
    </div>
  );
}
