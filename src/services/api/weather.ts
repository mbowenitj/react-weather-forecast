import type { WeatherData } from '../../types/weather';

const API_BASE = 'https://api.weatherstack.com';
const API_KEY = import.meta.env.VITE_WEATHERSTACK_API_KEY || '';

async function fetchCurrentWeather(location: string) {
  const url = `${API_BASE}/current?access_key=${API_KEY}&query=${encodeURIComponent(location)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`WeatherStack API error: ${response.statusText}`);
  return response.json();
}

async function fetchHistoricalWeather(location: string): Promise<WeatherData['historical']> {
  const today = new Date();
  const results: WeatherData['historical'] = [];

  for (let daysAgo = 3; daysAgo >= 1; daysAgo--) {
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    const dateStr = date.toISOString().split('T')[0];
    const url = `${API_BASE}/historical?access_key=${API_KEY}&query=${encodeURIComponent(location)}&historical_date=${dateStr}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data.historical?.[dateStr]) {
        results.push({
          date: dateStr,
          date_epoch: Math.floor(date.getTime() / 1000),
          ...data.historical[dateStr],
        });
      }
    }
  }
  return results;
}

async function fetchForecastWeather(location: string): Promise<WeatherData['forecast']> {
  const url = `${API_BASE}/forecast?access_key=${API_KEY}&query=${encodeURIComponent(location)}&forecast_days=3`;
  const response = await fetch(url);
  if (!response.ok) return [];
  const data = await response.json();
  if (!data.forecast) return [];
  return Object.entries(data.forecast).map(([date, dayData]: [string, any]) => ({
    date,
    date_epoch: Math.floor(new Date(date).getTime() / 1000),
    ...dayData,
  }));
}

export async function fetchWeatherData(location: string): Promise<WeatherData> {
  if (!API_KEY) {
    throw new Error('No API key configured. Please set VITE_WEATHERSTACK_API_KEY in your .env file.');
  }

  const currentData = await fetchCurrentWeather(location);
  console.log('Current weather data:', currentData);

  let historical: WeatherData['historical'] = [];
  try {
    const realHistorical = await fetchHistoricalWeather(location);
    if (realHistorical.length > 0) historical = realHistorical;
    console.log('Historical weather data:', historical);
  } catch {
    console.log('Historical data not available');
  }

  let forecast: WeatherData['forecast'] = [];
  try {
    const realForecast = await fetchForecastWeather(location);
    if (realForecast.length > 0) forecast = realForecast;
    console.log('Forecast weather data:', forecast);
  } catch {
    console.log('Forecast data not available');
  }

  const weatherData: WeatherData = {
    location: currentData.location,
    current: currentData.current,
    historical,
    forecast,
  };

  console.log('Final weather data:', weatherData);
  return weatherData;
}

