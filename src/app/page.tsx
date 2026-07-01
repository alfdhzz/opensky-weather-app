import { MapPin, Wind, Droplets, Sun, Cloud, CloudRain, CloudSun, CloudFog, CloudLightning, Eye, Thermometer, Moon } from "lucide-react";
import Image from "next/image";
import SearchBar from "@/components/SearchBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getWeatherData } from "@/lib/weather";
import { FavoriteButton } from "@/components/FavoriteButton";
import { FavoriteList } from "@/components/FavoriteList";

// Helper to map OpenWeatherMap icon codes to Lucide React icons
const getWeatherIcon = (iconCode: string, className: string = "w-6 h-6") => {
  const code = iconCode.substring(0, 2);
  const isDay = iconCode.endsWith('d');
  
  switch (code) {
    case '01':
      return isDay ? <Sun className={`${className} text-amber-500`} /> : <Moon className={`${className} text-slate-400`} />;
    case '02':
      return isDay ? <CloudSun className={`${className} text-amber-500`} /> : <Cloud className={`${className} text-slate-400`} />;
    case '03':
    case '04':
      return <Cloud className={`${className} text-slate-400`} />;
    case '09':
    case '10':
      return <CloudRain className={`${className} text-blue-400`} />;
    case '11':
      return <CloudLightning className={`${className} text-yellow-500`} />;
    case '13':
      return <Cloud className={`${className} text-blue-200`} />;
    case '50':
      return <CloudFog className={`${className} text-slate-400`} />;
    default:
      return <Cloud className={`${className} text-slate-400`} />;
  }
};

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  
  const lat = typeof params.lat === 'string' ? params.lat : undefined;
  const lon = typeof params.lon === 'string' ? params.lon : undefined;
  
  // If lat and lon exist, we don't need a default 'Jakarta'.
  // If they don't, and 'q' is empty, default to 'Jakarta'.
  const q = typeof params.q === 'string' && params.q.trim() !== '' 
    ? params.q 
    : (lat && lon ? undefined : "Jakarta");
  
  const weatherData = await getWeatherData({ q, lat, lon });

  return (
    <div className="min-h-screen pb-12 pt-6 px-4 sm:px-6 md:px-10 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 transition-colors duration-500">
      
      {/* Background Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[50%] rounded-full bg-blue-400/20 dark:bg-blue-600/20 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-amber-400/10 dark:bg-amber-600/10 blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto space-y-5">
        
        {/* ── Header ── */}
        <header className="flex flex-wrap items-center gap-3 mb-2">
          {/* Logo + Name */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-lg shadow-blue-500/20 ring-2 ring-white/10">
              <Image src="/logo.png" alt="OpenSky Logo" fill className="object-cover" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300">
              OpenSky
            </h1>
          </div>
          
          {/* Search + Toggle — grows to fill remaining space */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="flex-1 min-w-0">
              <SearchBar defaultValue={typeof q === "string" ? q : ""} />
            </div>
            <ThemeToggle />
          </div>
        </header>

        <FavoriteList />

        {weatherData.error ? (
          <div className="glass rounded-3xl p-12 text-center text-slate-700 dark:text-slate-200">
            <h2 className="text-2xl font-bold mb-2">Oops!</h2>
            <p>{weatherData.error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            {/* ── Left: Current Weather ── */}
            <div className="lg:col-span-2 space-y-5">
              
              {/* Hero Card */}
              <div className="glass rounded-3xl p-6 sm:p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 opacity-20 dark:opacity-10 transition-transform duration-700 group-hover:scale-110 hidden sm:block">
                  {getWeatherIcon(weatherData.current.iconCode, "w-48 h-48 sm:w-64 sm:h-64")}
                </div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 mb-1">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="font-medium text-base sm:text-lg truncate">{weatherData.current.location}</span>
                        <FavoriteButton city={weatherData.current.location} />
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Update terakhir: {weatherData.current.time}</p>
                    </div>
                  </div>

                  <div className="mt-8 sm:mt-12 flex flex-wrap items-end gap-4">
                    <div className="text-7xl sm:text-[6rem] font-bold leading-none tracking-tighter text-slate-800 dark:text-white">
                      {weatherData.current.temp}°
                    </div>
                    <div className="mb-2 sm:mb-4">
                      <p className="text-xl sm:text-2xl font-semibold text-slate-700 dark:text-slate-200">{weatherData.current.condition}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">Terasa seperti {weatherData.current.feelsLike}°</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hourly Forecast */}
              <div className="glass rounded-3xl p-5 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Prakiraan 24 Jam</h2>
                <div className="flex gap-2 sm:gap-4 overflow-x-auto no-scrollbar pb-2">
                  {weatherData.hourlyForecast?.map((hour: any, idx: number) => (
                    <div key={idx} className="flex flex-col items-center justify-center min-w-[60px] sm:min-w-[70px] p-2 sm:p-3 rounded-2xl hover:bg-white/40 dark:hover:bg-slate-700/40 transition-colors cursor-pointer">
                      <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-2">{hour.time}</span>
                      {getWeatherIcon(hour.iconCode)}
                      <span className="text-base sm:text-lg font-bold mt-2 sm:mt-3 text-slate-700 dark:text-slate-200">{hour.temp}°</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <DetailCard icon={<Wind />} label="Angin" value={`${weatherData.current.wind} km/h`} />
                <DetailCard icon={<Droplets />} label="Kelembapan" value={`${weatherData.current.humidity}%`} />
                <DetailCard icon={<Eye />} label="Visibilitas" value={`${weatherData.current.visibility} km`} />
                <DetailCard icon={<Thermometer />} label="Tekanan" value={`${weatherData.current.pressure} hPa`} />
              </div>
            </div>

            {/* ── Right: Daily & UV ── */}
            <div className="space-y-5">
              
              {/* Daily Forecast */}
              <div className="glass rounded-3xl p-5 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
                  Prakiraan {weatherData.dailyForecast?.length || 5} Hari
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  {weatherData.dailyForecast?.map((day: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between group">
                      <span className="w-16 text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 group-hover:text-blue-500 transition-colors">
                        {idx === 0 ? "Hari Ini" : day.day}
                      </span>
                      <div className="flex items-center gap-2">
                        {getWeatherIcon(day.iconCode)}
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 text-sm font-semibold justify-end">
                        <span className="text-slate-400">{day.min}°</span>
                        <div className="w-8 sm:w-10 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-amber-400" />
                        <span className="text-slate-700 dark:text-slate-200">{day.max}°</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* UV Index */}
              <div className="glass rounded-3xl p-5 sm:p-6">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 mb-4">
                  <Sun className="w-5 h-5" />
                  <span className="font-semibold">Indeks UV</span>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">Sedang</div>
                  <p className="text-amber-500 font-medium text-sm">Berdasarkan waktu &amp; cuaca</p>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 via-amber-400 to-red-500 w-[50%]" />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">One Call API diperlukan untuk data real-time.</p>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="glass p-4 rounded-2xl flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
      <div className="text-blue-500 mb-2">
        {icon}
      </div>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      <p className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-200">{value}</p>
    </div>
  );
}

