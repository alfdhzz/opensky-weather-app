export async function getWeatherData(params: { q?: string; lat?: string; lon?: string }) {
  const API_KEY = process.env.OPENWEATHER_API_KEY;
  if (!API_KEY) {
    throw new Error("OPENWEATHER_API_KEY is not set in environment variables");
  }

  try {
    // 1. Get Current Weather
    let currentUrl = "";
    if (params.lat && params.lon) {
      currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${params.lat}&lon=${params.lon}&appid=${API_KEY}&units=metric&lang=id`;
    } else {
      const query = params.q || "Jakarta";
      currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&appid=${API_KEY}&units=metric&lang=id`;
    }

    const currentRes = await fetch(currentUrl, { next: { revalidate: 600 } });

    if (!currentRes.ok) {
      if (currentRes.status === 404) return { error: "Kota tidak ditemukan" };
      if (currentRes.status === 401) return { error: "API Key tidak valid" };
      return { error: "Terjadi kesalahan saat mengambil data cuaca" };
    }

    const current = await currentRes.json();
    
    // 2. Get Forecast Data (5 day / 3 hour)
    const lat = current.coord.lat;
    const lon = current.coord.lon;
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=id`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    let hourlyForecast = [];
    let dailyForecast = [];

    if (forecastRes.ok) {
      const forecast = await forecastRes.json();
      
      // Parse Hourly (Next 24 hours = 8 items of 3-hour intervals)
      hourlyForecast = forecast.list.slice(0, 8).map((item: any) => {
        const date = new Date(item.dt * 1000);
        return {
          time: date.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }),
          temp: Math.round(item.main.temp),
          condition: item.weather[0].main,
          description: item.weather[0].description,
          iconCode: item.weather[0].icon,
        };
      });

      // Parse Daily (Group by day and find min/max)
      const dailyMap = new Map();
      forecast.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        // Get localized day name
        const day = date.toLocaleDateString("id-ID", { weekday: 'short' }); 
        
        if (!dailyMap.has(day)) {
          dailyMap.set(day, {
            day: day,
            min: item.main.temp_min,
            max: item.main.temp_max,
            condition: item.weather[0].main,
            iconCode: item.weather[0].icon,
          });
        } else {
          const existing = dailyMap.get(day);
          existing.min = Math.min(existing.min, item.main.temp_min);
          existing.max = Math.max(existing.max, item.main.temp_max);
        }
      });
      
      // Convert to array and round temperatures
      dailyForecast = Array.from(dailyMap.values()).map((item: any) => ({
        ...item,
        min: Math.round(item.min),
        max: Math.round(item.max),
      })).slice(0, 7);
    }

    return {
      current: {
        temp: Math.round(current.main.temp),
        condition: current.weather[0].description.replace(/\b\w/g, (l: string) => l.toUpperCase()), // capitalize
        weatherMain: current.weather[0].main,
        location: `${current.name}, ${current.sys.country}`,
        feelsLike: Math.round(current.main.feels_like),
        humidity: current.main.humidity,
        wind: Math.round(current.wind.speed * 3.6), // convert m/s to km/h
        pressure: current.main.pressure,
        visibility: current.visibility / 1000, // convert m to km
        time: new Date().toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }),
        iconCode: current.weather[0].icon,
      },
      hourlyForecast,
      dailyForecast
    };

  } catch (error) {
    console.error("Weather Fetch Error:", error);
    return { error: "Koneksi terputus atau gagal memuat data" };
  }
}
