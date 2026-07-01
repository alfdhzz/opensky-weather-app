"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

export function FavoriteList() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const loadFavorites = () => {
    const saved = localStorage.getItem("opensky_favorites");
    if (saved) {
      setFavorites(JSON.parse(saved));
    } else {
      setFavorites([]);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadFavorites();

    // Listen for custom event from FavoriteButton
    window.addEventListener("favorites_updated", loadFavorites);
    return () => window.removeEventListener("favorites_updated", loadFavorites);
  }, []);

  if (!mounted || favorites.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3 px-1 text-sm font-medium text-slate-500 dark:text-slate-400">
        <Star className="w-4 h-4" />
        <span>Kota Favorit</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {favorites.map((city) => (
          <button
            key={city}
            onClick={() => router.push(`/?q=${encodeURIComponent(city)}`)}
            className="px-4 py-2 text-sm rounded-xl glass hover:bg-white/60 dark:hover:bg-slate-700/60 transition-colors text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}
