"use client";

import { Star } from "lucide-react";
import { useEffect, useState } from "react";

export function FavoriteButton({ city }: { city: string }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("opensky_favorites");
    if (saved) {
      const favorites = JSON.parse(saved);
      setIsFavorite(favorites.includes(city));
    }
  }, [city]);

  const toggleFavorite = () => {
    const saved = localStorage.getItem("opensky_favorites");
    let favorites: string[] = saved ? JSON.parse(saved) : [];

    if (isFavorite) {
      favorites = favorites.filter((c) => c !== city);
    } else {
      favorites.push(city);
    }

    localStorage.setItem("opensky_favorites", JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
    
    // Dispatch event so FavoriteList can update instantly
    window.dispatchEvent(new Event("favorites_updated"));
  };

  if (!mounted) {
    return <div className="w-5 h-5" />; // Placeholder
  }

  return (
    <button
      onClick={toggleFavorite}
      title={isFavorite ? "Hapus dari Favorit" : "Tambah ke Favorit"}
      className={`p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-500
        ${isFavorite ? "text-amber-500 bg-amber-500/10 hover:bg-amber-500/20" : "text-slate-400 hover:text-amber-500 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"}`}
    >
      <Star className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
    </button>
  );
}
