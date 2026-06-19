import { useEffect } from 'react';
import { FiCloudRain } from 'react-icons/fi';
import { Header } from '../Header/Header';
import { useWeather } from '../../context/WeatherContext';
import { WeatherDetails } from '../WeatherDetails/WeatherDetails';
import { WeatherTimeline } from '../WeatherTimeline/WeatherTimeline';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';

function EmptyState() {
  return (
    <div className="text-center py-20 text-gray-400 animate-fadeIn">
      <FiCloudRain className="h-14 w-14 mx-auto mb-4" />
      <p className="text-lg">Enter a city name to see the weather</p>
    </div>
  );
}

const DEFAULT_LOCATION = 'Cape Town, South Africa';

export function WeatherLayout() {
  const { state, searchLocation, selectDay } = useWeather();

  useEffect(() => {
    if (!state.weatherData && !state.isLoading && !state.error) {
      searchLocation(DEFAULT_LOCATION);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Header onSearch={searchLocation} isLoading={state.isLoading} />

        {state.error && <ErrorMessage message={state.error} />}
        {state.isLoading && <LoadingSpinner />}

        {state.weatherData && state.selectedDay && !state.isLoading && (
          <div className="space-y-6 animate-fadeIn">
            <WeatherTimeline
              timeline={state.timeline}
              selectedId={state.selectedDay.id}
              onSelect={selectDay}
            />
            <WeatherDetails
              weatherData={state.weatherData}
              selectedDay={state.selectedDay}
            />
          </div>
        )}

        {!state.weatherData && !state.isLoading && !state.error && <EmptyState />}
      </div>
    </div>
  );
}