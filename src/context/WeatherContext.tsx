import { createContext, useContext, useReducer, useCallback, useMemo, type ReactNode } from 'react';
import type { WeatherState, WeatherAction, WeatherData, WeatherTileData } from '../types/weather';
import { fetchWeatherData } from '../services/api/weather';
import { formatDayLabel, getWeatherEmoji } from '../utils/formatters';

const initialState: WeatherState = {
  location: '',
  weatherData: null,
  selectedDay: null,
  isLoading: false,
  error: null,
  timeline: [],
};

function buildTimeline(data: WeatherData): WeatherTileData[] {
  const tiles: WeatherTileData[] = [];

  for (const day of data.historical) {
    tiles.push({
      id: `hist-${day.date}`,
      label: formatDayLabel(day.date, true),
      date: day.date,
      temperature: day.temperature,
      weatherCode: day.weather_code,
      weatherIcon: getWeatherEmoji(day.weather_code),
      weatherDescription: day.weather_descriptions[0] || '',
      isHistorical: true,
    });
  }

  tiles.push({
    id: 'current',
    label: formatDayLabel(new Date().toISOString().split('T')[0], false),
    date: new Date().toISOString().split('T')[0],
    temperature: data.current.temperature,
    weatherCode: data.current.weather_code,
    weatherIcon: getWeatherEmoji(data.current.weather_code),
    weatherDescription: data.current.weather_descriptions[0] || '',
    isHistorical: false,
  });

  const today = new Date().toISOString().split('T')[0];
  for (const day of data.forecast) {
    if (day.date === today) continue; 
    tiles.push({
      id: `forecast-${day.date}`,
      label: formatDayLabel(day.date, false),
      date: day.date,
      temperature: day.temperature,
      weatherCode: day.weather_code,
      weatherIcon: getWeatherEmoji(day.weather_code),
      weatherDescription: day.weather_descriptions[0] || '',
      isHistorical: false,
    });
  }

  return tiles;
}

function weatherReducer(state: WeatherState, action: WeatherAction): WeatherState {
  switch (action.type) {
    case 'SET_LOCATION':
      return { ...state, location: action.payload };
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS': {
      const timeline = buildTimeline(action.payload);
      const currentTile = timeline.find(t => t.id === 'current');
      return {
        ...state,
        weatherData: action.payload,
        isLoading: false,
        error: null,
        timeline,
        selectedDay: currentTile || null,
      };
    }
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload, weatherData: null, timeline: [], selectedDay: null };
    case 'SELECT_DAY':
      return { ...state, selectedDay: action.payload };
    default:
      return state;
  }
}

interface WeatherContextType {
  state: WeatherState;
  searchLocation: (location: string) => Promise<void>;
  selectDay: (tile: WeatherTileData) => void;
}

const WeatherContext = createContext<WeatherContextType | null>(null);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(weatherReducer, initialState);

  const searchLocation = useCallback(async (location: string) => {
    if (!location.trim()) return;
    dispatch({ type: 'SET_LOCATION', payload: location });
    dispatch({ type: 'FETCH_START' });
    try {
      const data = await fetchWeatherData(location);
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'FETCH_ERROR', payload: err instanceof Error ? err.message : 'Failed to fetch weather data' });
    }
  }, []);

  const selectDay = useCallback((tile: WeatherTileData) => {
    dispatch({ type: 'SELECT_DAY', payload: tile });
  }, []);

  const value = useMemo(() => ({ state, searchLocation, selectDay }), [state, searchLocation, selectDay]);

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}