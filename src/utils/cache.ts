import type { WeatherData } from '../types/weather';

const CACHE_PREFIX = 'weather_cache';
const CACHE_TTL_MS = 1 * 60 * 60 * 1000; // 1 hour
const CACHE_VERSION = 2; // Increment this when you change the data structure to clear old cached data

interface CachedWeather {
  data: WeatherData;
  cachedAt: number;
  version: number;
}

export function loadCached(locationKey: string): WeatherData | null {
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}_${locationKey}`);
    if (!raw) return null;
    const cached: CachedWeather = JSON.parse(raw);
    if (cached.version !== CACHE_VERSION) {
      localStorage.removeItem(`${CACHE_PREFIX}_${locationKey}`);
      return null;
    }
    if (Date.now() - cached.cachedAt > CACHE_TTL_MS) {
      localStorage.removeItem(`${CACHE_PREFIX}_${locationKey}`);
      return null;
    }
    return cached.data;
  } catch {
    return null;
  }
}

export function saveCache(locationKey: string, data: WeatherData): void {
  try {
    const entry: CachedWeather = { data, cachedAt: Date.now(), version: CACHE_VERSION };
    localStorage.setItem(`${CACHE_PREFIX}_${locationKey}`, JSON.stringify(entry));
  } catch {
    console.warn('Failed to save weather data to cache');
  }
}