export interface WeatherCondition {
  text: string;
  icon: string;
  code: number;
}

export interface CurrentWeather {
  observation_time: string;
  temperature: number;
  weather_code: number;
  weather_icons: string[];
  weather_descriptions: string[];
  wind_speed: number;
  wind_degree: number;
  wind_dir: string;
  pressure: number;
  precip: number;
  humidity: number;
  cloudcover: number;
  feelslike: number;
  uv_index: number;
  visibility: number;
  is_day: string;
}

export interface HistoricalWeather {
  date: string;
  date_epoch: number;
  temperature: number;
  weather_code: number;
  weather_icons: string[];
  weather_descriptions: string[];
  wind_speed: number;
  wind_degree: number;
  wind_dir: string;
  pressure: number;
  precip: number;
  humidity: number;
  cloudcover: number;
  feelslike: number;
  uv_index: number;
  visibility: number;
}

export interface ForecastWeather {
  date: string;
  date_epoch: number;
  temperature: number;
  weather_code: number;
  weather_icons: string[];
  weather_descriptions: string[];
  wind_speed: number;
  wind_degree: number;
  wind_dir: string;
  pressure: number;
  precip: number;
  humidity: number;
  cloudcover: number;
  feelslike: number;
  uv_index: number;
  visibility: number;
}

export interface WeatherData {
  location: {
    name: string;
    country: string;
    region: string;
    lat: string;
    lon: string;
    timezone_id: string;
    localtime: string;
    localtime_epoch: number;
    utc_offset: string;
  };
  current: CurrentWeather;
  historical: HistoricalWeather[];
  forecast: ForecastWeather[];
}

export interface WeatherTileData {
  id: string;
  label: string;
  date: string;
  temperature: number;
  weatherCode: number;
  weatherIcon: string;
  weatherDescription: string;
  isHistorical: boolean;
}

export interface WeatherState {
  location: string;
  weatherData: WeatherData | null;
  selectedDay: WeatherTileData | null;
  isLoading: boolean;
  error: string | null;
  timeline: WeatherTileData[];
}

export type WeatherAction =
  | { type: 'SET_LOCATION'; payload: string }
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: WeatherData }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SELECT_DAY'; payload: WeatherTileData };