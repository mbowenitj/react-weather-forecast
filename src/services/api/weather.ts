import type { WeatherData } from "../../types/weather";
import { loadCached, saveCache } from "../../utils/cache";
import { generateFallbackDays } from "../../utils/weatherFallback.ts";
import { hashString } from "../../utils/random";

const API_BASE = "https://api.weatherstack.com";
const API_KEY = import.meta.env.VITE_WEATHERSTACK_API_KEY || "";

async function fetchCurrentWeather(location: string) {
  const url = `${API_BASE}/current?access_key=${API_KEY}&query=${encodeURIComponent(location)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`WeatherStack API error: ${response.status}`);
  return response.json();
}

export async function fetchWeatherData(location: string): Promise<WeatherData> {
  const normalizedLocation = location.trim().toLowerCase();
  
  // Always check cache first
  const cached = loadCached(normalizedLocation);
  if (cached) {
    console.log('Using cached data for', location);
    return cached;
  }

  // If no API key, use fallback data
  if (!API_KEY) {
    console.warn("No API key configured. Using fallback data.");
    const locationSeed = hashString(normalizedLocation);
    const fallback = generateFallbackDays(20, locationSeed);
    const weatherData: WeatherData = {
      location: {
        name: location,
        country: "Unknown",
        region: "Unknown",
        lat: "0",
        lon: "0",
        timezone_id: "UTC",
        localtime: new Date().toISOString(),
        localtime_epoch: Math.floor(Date.now() / 1000),
        utc_offset: "0",
      },
      current: {
        observation_time: new Date().toISOString(),
        temperature: 20,
        weather_code: 116,
        weather_icons: [],
        weather_descriptions: ["Partly cloudy"],
        wind_speed: 15,
        wind_degree: 180,
        wind_dir: "S",
        pressure: 1013,
        precip: 0,
        humidity: 60,
        cloudcover: 25,
        feelslike: 22,
        uv_index: 5,
        visibility: 10,
        is_day: "yes",
      },
      historical: fallback.historical,
      forecast: fallback.forecast,
    };
    saveCache(normalizedLocation, weatherData);
    return weatherData;
  }

  try {
    console.log('Fetching from API for', location);
    const currentData = await fetchCurrentWeather(location);
    const locationSeed = hashString(normalizedLocation);
    const fallback = generateFallbackDays(
      currentData.current.temperature,
      locationSeed,
    );

    // Use fallback for historical/forecast 
    const weatherData: WeatherData = {
      location: currentData.location,
      current: currentData.current,
      historical: fallback.historical,
      forecast: fallback.forecast,
    };

    saveCache(normalizedLocation, weatherData);
    return weatherData;
  } catch (error) {
    console.warn("API failed, using fallback data:", error);
    const locationSeed = hashString(normalizedLocation);
    const fallback = generateFallbackDays(20, locationSeed);
    const weatherData: WeatherData = {
      location: {
        name: location,
        country: "Unknown",
        region: "Unknown",
        lat: "0",
        lon: "0",
        timezone_id: "UTC",
        localtime: new Date().toISOString(),
        localtime_epoch: Math.floor(Date.now() / 1000),
        utc_offset: "0",
      },
      current: {
        observation_time: new Date().toISOString(),
        temperature: 20,
        weather_code: 116,
        weather_icons: [],
        weather_descriptions: ["Partly cloudy"],
        wind_speed: 15,
        wind_degree: 180,
        wind_dir: "S",
        pressure: 1013,
        precip: 0,
        humidity: 60,
        cloudcover: 25,
        feelslike: 22,
        uv_index: 5,
        visibility: 10,
        is_day: "yes",
      },
      historical: fallback.historical,
      forecast: fallback.forecast,
    };
    saveCache(normalizedLocation, weatherData);
    return weatherData;
  }

  // TODO: Uncomment when using a paid WeatherStack plan that supports historical & forecast endpoints
// async function fetchHistoricalWeather(
//   location: string,
// ): Promise<WeatherData["historical"]> {
//   const today = new Date();
//   const results: WeatherData["historical"] = [];
//
//   for (let daysAgo = 3; daysAgo >= 1; daysAgo--) {
//     const date = new Date(today);
//     date.setDate(date.getDate() - daysAgo);
//     const dateStr = date.toISOString().split("T")[0];
//     const url = `${API_BASE}/historical?access_key=${API_KEY}&query=${encodeURIComponent(location)}&historical_date=${dateStr}`;
//
//     try {
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       const response = await fetch(url);
//       if (response.ok) {
//         const data = await response.json();
//         if (data.historical?.[dateStr]) {
//           results.push({
//             date: dateStr,
//             date_epoch: Math.floor(date.getTime() / 1000),
//             ...data.historical[dateStr],
//           });
//         }
//       }
//     } catch (error) {
//       console.warn(`Failed to fetch historical data for ${dateStr}`);
//     }
//   }
//   return results;
// }
//
// TODO: Uncomment when using a paid WeatherStack plan that supports forecast
// async function fetchForecastWeather(
//   location: string,
// ): Promise<WeatherData["forecast"]> {
//   const url = `${API_BASE}/forecast?access_key=${API_KEY}&query=${encodeURIComponent(location)}&forecast_days=3`;
//
//   try {
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     const response = await fetch(url);
//     if (!response.ok) return [];
//     const data = await response.json();
//     if (!data.forecast) return [];
//
//     const today = new Date().toISOString().split("T")[0];
//     return Object.entries(data.forecast)
//       .filter(([date]) => date !== today)
//       .map(([date, dayData]: [string, any]) => ({
//         date,
//         date_epoch: Math.floor(new Date(date).getTime() / 1000),
//         ...dayData,
//       }));
//   } catch (error) {
//     console.warn("Failed to fetch forecast data.");
//     return [];
//   }
// }

}