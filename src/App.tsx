import { WeatherLayout } from './components/WeatherLayout/WeatherLayout';
import { WeatherProvider } from './context/WeatherContext';

function App() {
  return (
    <WeatherProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 animate-fadeIn">
        <WeatherLayout />
      </div>
    </WeatherProvider>
  );
}

export default App;