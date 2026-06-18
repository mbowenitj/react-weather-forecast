import type { WeatherData } from '../types/weather';

const CACHE_PREFIX = 'weather_cache';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CachedWeather {
  data: WeatherData;
  cachedAt: number;
}

export function loadCached(locationKey: string): WeatherData | null {
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}_${locationKey}`);
    if (!raw) return null;
    const cached: CachedWeather = JSON.parse(raw);
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
    const entry: CachedWeather = { data, cachedAt: Date.now() };
    localStorage.setItem(`${CACHE_PREFIX}_${locationKey}`, JSON.stringify(entry));
  } catch {
    console.warn('Failed to save weather data to cache');
  }
}