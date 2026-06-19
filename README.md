# React Weather Forecast

A responsive weather forecast application built with React, TypeScript, and Vite. Displays current conditions, 3-day historical data, and 3-day forecast for any city.

## Features

- **Current Weather** - Temperature, feels-like, humidity, wind, pressure, UV index, and more
- **Timeline** - 7-day view with 3 past days, today, and 3 future days
- **Live Clock** - Real-time clock synchronized to the selected location's timezone
- **Search** - Search any city worldwide
- **Fallback Data** - Works without an API key using generated mock data
- **Caching** - Weather data is cached locally for 24 hours
- **Unit Tests** - Comprehensive test coverage with Vitest (13 tests)

## Setup

### Prerequisites

- Node.js 18+ 
- npm

### Installation

```bash
git clone <repository-url>
cd react-weather-forecast
npm install
```

### Optional: API Key

The app works without an API key using generated fallback data. For live weather data, add a WeatherStack API key:

```bash
echo "VITE_WEATHERSTACK_API_KEY=your_api_key_here" > .env
```

**Or manually:** Create a file named `.env` in the project root with this content:
```
VITE_WEATHERSTACK_API_KEY=your_api_key_here
```

Get a free API key at [weatherstack.com](https://weatherstack.com).

### Run

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Run Tests

```bash
npm test
```

This runs the unit test suite with Vitest. Tests are located in `src/_test_/`.

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ErrorMessage/       # Error display component
│   ├── Header/             # App header with title and search bar
│   ├── LoadingSpinner/     # Loading state component
│   ├── SearchBar/          # City search input
│   ├── WeatherDetails/     # Detailed weather info panel
│   ├── WeatherLayout/      # Main layout orchestrator
│   ├── WeatherTile/        # Individual day tile in timeline
│   └── WeatherTimeline/    # Scrollable day selector
├── context/
│   └── WeatherContext.tsx   # Global state management
├── services/
│   └── api/weather.ts      # WeatherStack API client
├── types/
│   └── weather.ts          # TypeScript interfaces
└── utils/
    ├── cache.ts            # localStorage caching with versioning
    ├── formatters.ts       # Date, temperature, and helper formatters
    ├── random.ts           # Seeded random number generator
    └── weatherFallback.ts  # Mock data generator for offline use
```

## Design Decisions

### State Management
Used React Context + `useReducer` instead of a library like Redux or Zustand. The weather app has a single, predictable state shape with well-defined actions, making a reducer pattern ideal without external dependencies.

### Weather Icons
Weather conditions are displayed using emoji characters via `getWeatherEmoji()` rather than image URLs. This eliminates broken image requests (some CDN-hosted icons return 404s), reduces network requests, and works offline. The emoji mapping is based on WeatherStack's weather codes.

### Date Handling
Dates are stored and compared as `YYYY-MM-DD` strings using `toLocaleDateString('en-CA')`. This avoids timezone pitfalls: `toISOString()` converts to UTC which can shift dates by a day in some timezones (e.g., South Africa at 8 PM local becomes the next day in UTC). All dates are created in local time with `new Date(year, month - 1, day)`.

### Fallback Data
The WeatherStack free tier only provides current weather — historical and forecast endpoints require Standard and Professional plans respectively. The app generates realistic mock data using a seeded random number generator (`generateFallbackDays`), ensuring consistent results per location while still working offline or without an API key.

The `fetchHistoricalWeather` and `fetchForecastWeather` functions have been **commented out** in `src/services/api/weather.ts` with `TODO` notes. They demonstrate how the real API would be called on a paid plan. To enable them, uncomment the code and ensure your WeatherStack subscription includes the required endpoints.

### Caching
Weather data is cached in `localStorage` with a 24-hour TTL and version number. Cache version increments force invalidation when the data schema changes, preventing stale data from persisting after updates.

### Component Structure
Components are organized in individual directories for colocation. Presentational components (`WeatherTile`, `SearchBar`) are separated from stateful/layout components (`WeatherLayout`, `WeatherDetails`), making them reusable and easier to test.

## Trade-offs

- **Emoji icons vs. SVGs/images**: Emojis are simpler and work everywhere, but lack the visual polish of custom weather SVGs. A future enhancement could replace emojis with a custom icon set.
- **Context vs. Redux**: Context is simpler for this app's size but may cause unnecessary re-renders if not carefully memoized. A library like Zustand would scale better for larger apps.
- **localStorage caching vs. service worker**: localStorage is simple to implement but blocks the main thread and has a 5MB limit. A service worker would allow caching API responses more granularly and work fully offline.
- **Fallback data vs. error state**: Generating mock data provides a seamless UX when the API is unavailable, but the data is not real. An alternative would be to show clear error states and degrade gracefully.
- **Single API (WeatherStack) vs. multiple providers**: Relying on one free-tier API means limited historical/forecast data. Multiple providers would increase reliability but add complexity and cost.