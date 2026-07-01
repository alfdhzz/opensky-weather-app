"use client";

import { Search, Navigation, LocateFixed, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  const [query, setQuery] = useState(defaultValue);
  const [isLocating, setIsLocating] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/");
    }
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung geolokasi.");
      return;
    }
    
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setQuery(""); // Clear text
        router.push(`/?lat=${latitude}&lon=${longitude}`);
        setIsLocating(false);
      },
      (error) => {
        console.error(error);
        alert("Gagal mendapatkan lokasi. Pastikan izin lokasi (GPS) diaktifkan.");
        setIsLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="flex items-center gap-2 w-full sm:w-auto">
      <form onSubmit={handleSearch} className="relative w-full sm:w-80 group flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari kota..." 
          className="block w-full pl-10 pr-10 py-3 border-none rounded-2xl glass text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
        <button type="submit" aria-label="Submit search" className="absolute inset-y-0 right-2 flex items-center text-slate-400 hover:text-blue-500 transition-colors cursor-pointer">
          <Navigation className="h-4 w-4" />
        </button>
      </form>
      
      <button 
        type="button" 
        onClick={handleLocate}
        disabled={isLocating}
        title="Gunakan lokasi saya"
        className="p-3 rounded-2xl glass text-slate-600 dark:text-slate-300 hover:text-blue-500 dark:hover:text-amber-400 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isLocating ? <Loader2 className="w-5 h-5 animate-spin" /> : <LocateFixed className="w-5 h-5" />}
      </button>
    </div>
  );
}
