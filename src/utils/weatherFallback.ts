import type { WeatherData } from '../types/weather';
import { seededRandom } from './random';

export function generateFallbackDays(baseTemp: number, locationSeed: number): {
  historical: WeatherData['historical'];
  forecast: WeatherData['forecast'];
} {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const weatherCodes = [113, 116, 119, 122, 176, 293, 296, 302, 305];
  const descriptions: Record<number, string> = {
    113: 'Sunny', 116: 'Partly cloudy', 119: 'Cloudy', 122: 'Overcast',
    176: 'Patchy rain nearby', 293: 'Patchy light rain', 296: 'Light rain',
    302: 'Moderate rain', 305: 'Heavy rain',
  };
  const windDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

  const historical: WeatherData['historical'] = [];
  for (let daysAgo = 3; daysAgo >= 1; daysAgo--) {
    const date = new Date(todayStart);
    date.setDate(date.getDate() - daysAgo);
    const seed = locationSeed - daysAgo;
    const code = weatherCodes[Math.floor(seededRandom(seed + 1) * weatherCodes.length)];
    const tempDelta = (seededRandom(seed + 2) - 0.5) * 10;

    historical.push({
      date: date.toLocaleDateString('en-CA'),
      date_epoch: Math.floor(date.getTime() / 1000),
      temperature: Math.round((baseTemp + tempDelta) * 10) / 10,
      weather_code: code,
      weather_icons: [''],
      weather_descriptions: [descriptions[code] || 'Unknown'],
      wind_speed: Math.round(5 + seededRandom(seed + 3) * 20),
      wind_degree: Math.round(seededRandom(seed + 4) * 360),
      wind_dir: windDirections[Math.floor(seededRandom(seed + 5) * 8)],
      pressure: Math.round(1010 + seededRandom(seed + 6) * 20),
      precip: Math.round(seededRandom(seed + 7) * 5 * 10) / 10,
      humidity: Math.round(40 + seededRandom(seed + 8) * 40),
      cloudcover: Math.round(seededRandom(seed + 9) * 100),
      feelslike: Math.round((baseTemp + tempDelta - 2 + seededRandom(seed + 10) * 4) * 10) / 10,
      uv_index: Math.round(seededRandom(seed + 11) * 11),
      visibility: Math.round(5 + seededRandom(seed + 12) * 15),
    });
  }

  const forecast: WeatherData['forecast'] = [];
  for (let daysAhead = 1; daysAhead <= 3; daysAhead++) {
    const date = new Date(todayStart);
    date.setDate(date.getDate() + daysAhead);
    const seed = locationSeed + daysAhead;
    const code = weatherCodes[Math.floor(seededRandom(seed + 1) * weatherCodes.length)];
    const tempDelta = (seededRandom(seed + 2) - 0.5) * 12;

    forecast.push({
      date: date.toLocaleDateString('en-CA'),
      date_epoch: Math.floor(date.getTime() / 1000),
      temperature: Math.round((baseTemp + tempDelta) * 10) / 10,
      weather_code: code,
      weather_icons: [''],
      weather_descriptions: [descriptions[code] || 'Unknown'],
      wind_speed: Math.round(5 + seededRandom(seed + 3) * 20),
      wind_degree: Math.round(seededRandom(seed + 4) * 360),
      wind_dir: windDirections[Math.floor(seededRandom(seed + 5) * 8)],
      pressure: Math.round(1010 + seededRandom(seed + 6) * 20),
      precip: Math.round(seededRandom(seed + 7) * 5 * 10) / 10,
      humidity: Math.round(40 + seededRandom(seed + 8) * 40),
      cloudcover: Math.round(seededRandom(seed + 9) * 100),
      feelslike: Math.round((baseTemp + tempDelta - 2 + seededRandom(seed + 10) * 4) * 10) / 10,
      uv_index: Math.round(seededRandom(seed + 11) * 11),
      visibility: Math.round(5 + seededRandom(seed + 12) * 15),
    });
  }

  return { historical, forecast };
}