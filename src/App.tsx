import { WeatherLayout } from './components/WeatherLayout/WeatherLayout';
import { WeatherProvider } from './context/WeatherContext';

function App() {
  return (
    <WeatherProvider>
      <WeatherLayout />
    </WeatherProvider>
  );
}

export default App;