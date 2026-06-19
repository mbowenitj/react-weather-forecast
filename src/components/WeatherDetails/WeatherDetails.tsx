import { useState, useEffect, useMemo } from "react";
import type { WeatherData, WeatherTileData } from "../../types/weather";
import {
  formatDate,
  formatPrecip,
  formatPressure,
  formatTemperature,
  formatVisibility,
  formatWindSpeed,
} from "../../utils/formatters";
import {
  FiDroplet,
  FiWind,
  FiCloudRain,
  FiSun,
  FiCloud,
  FiEye,
} from "react-icons/fi";
import { BsThermometerHalf, BsSpeedometer2 } from "react-icons/bs";
import { WeatherIcon } from "../WeatherIcon/WeatherIcon";

interface WeatherDetailsProps {
  weatherData: WeatherData;
  selectedDay: WeatherTileData;
}

function useLiveClock(utcOffset: string) {
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    function computeLocalTime() {
      const now = new Date();
      const offsetHours = parseFloat(utcOffset);
      const localMs = now.getTime() + offsetHours * 3600 * 1000;
      const localDate = new Date(localMs);
      const h = String(localDate.getUTCHours()).padStart(2, "0");
      const m = String(localDate.getUTCMinutes()).padStart(2, "0");
      return `${h}:${m}`;
    }

    setTimeStr(computeLocalTime());
    const interval = setInterval(() => setTimeStr(computeLocalTime()), 30_000);
    return () => clearInterval(interval);
  }, [utcOffset]);

  return timeStr;
}

export function WeatherDetails({
  weatherData,
  selectedDay,
}: WeatherDetailsProps) {
  const isCurrentDay = selectedDay.id === "current";
  const liveTime = useLiveClock(weatherData.location.utc_offset);

  const detail = useMemo(() => {
    let result = {
      temperature: selectedDay.temperature,
      feelslike: 0,
      humidity: 0,
      windSpeed: 0,
      windDir: "",
      pressure: 0,
      precip: 0,
      visibility: 0,
      uvIndex: 0,
      cloudcover: 0,
      description: selectedDay.weatherDescription,
      weatherCode: selectedDay.weatherCode,
    };

    if (selectedDay.isHistorical) {
      const hist = weatherData.historical.find(
        (h) => h.date === selectedDay.date,
      );
      if (hist) {
        result = {
          ...result,
          feelslike: hist.feelslike,
          humidity: hist.humidity,
          windSpeed: hist.wind_speed,
          windDir: hist.wind_dir,
          pressure: hist.pressure,
          precip: hist.precip,
          visibility: hist.visibility,
          uvIndex: hist.uv_index,
          cloudcover: hist.cloudcover,
        };
      }
    } else if (isCurrentDay) {
      result = {
        ...result,
        feelslike: weatherData.current.feelslike,
        humidity: weatherData.current.humidity,
        windSpeed: weatherData.current.wind_speed,
        windDir: weatherData.current.wind_dir,
        pressure: weatherData.current.pressure,
        precip: weatherData.current.precip,
        visibility: weatherData.current.visibility,
        uvIndex: weatherData.current.uv_index,
        cloudcover: weatherData.current.cloudcover,
      };
    } else {
      const fcst = weatherData.forecast.find(
        (f) => f.date === selectedDay.date,
      );
      if (fcst) {
        result = {
          ...result,
          feelslike: fcst.feelslike,
          humidity: fcst.humidity,
          windSpeed: fcst.wind_speed,
          windDir: fcst.wind_dir,
          pressure: fcst.pressure,
          precip: fcst.precip,
          visibility: fcst.visibility,
          uvIndex: fcst.uv_index,
          cloudcover: fcst.cloudcover,
        };
      }
    }
    return result;
  }, [weatherData, selectedDay, isCurrentDay]);

  const detailItems = useMemo(
    () => [
      {
        label: "Humidity",
        value: `${detail.humidity}%`,
        icon: <FiDroplet className="text-blue-400" />,
      },
      {
        label: "Wind",
        value: formatWindSpeed(detail.windSpeed),
        icon: <FiWind className="text-teal-400" />,
      },
      {
        label: "Pressure",
        value: formatPressure(detail.pressure),
        icon: <BsSpeedometer2 className="text-purple-400" />,
      },
      {
        label: "Precipitation",
        value: formatPrecip(detail.precip),
        icon: <FiCloudRain className="text-indigo-400" />,
      },
      {
        label: "UV Index",
        value: `${detail.uvIndex}`,
        icon: <FiSun className="text-orange-400" />,
      },
      {
        label: "Cloud Cover",
        value: `${detail.cloudcover}%`,
        icon: <FiCloud className="text-gray-400" />,
      },
      {
        label: "Visibility",
        value: formatVisibility(detail.visibility),
        icon: <FiEye className="text-green-400" />,
      },
    ],
    [detail],
  );

  return (
    <div className="w-full max-w-lg mx-auto animate-fadeIn">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {weatherData.location.name}{weatherData.location.country !== 'Unknown' ? `, ${weatherData.location.country}` : ''}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {liveTime} &middot; {weatherData.location.timezone_id}
        </p>
      </div>

      <div className="text-center mb-8">
        <p className="text-lg font-medium text-gray-600">
          {selectedDay.label} &middot; {formatDate(selectedDay.date)}
        </p>
      </div>

      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-sm border border-white/50 mb-6">
        <div className="flex items-center justify-center gap-4">
          <span className="text-6xl">
            {selectedDay.weatherIcon ? (
              <img src={selectedDay.weatherIcon} alt="" className="w-24 h-24 object-contain" />
            ) : (
              <WeatherIcon code={detail.weatherCode} />
            )}
          </span>
          <div>
            <p className="text-6xl font-bold text-gray-800">
              {formatTemperature(detail.temperature)}
            </p>
            <p className="text-gray-500 mt-1">{detail.description}</p>
          </div>
        </div>
        <p className="text-center text-gray-500 mt-3 flex items-center justify-center gap-1">
          <BsThermometerHalf className="text-red-400" />
          Feels like {formatTemperature(detail.feelslike)}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {detailItems.map((item) => (
          <div
            key={item.label}
            className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-white/40"
          >
            <span className="text-xl inline-flex justify-center">
              {item.icon}
            </span>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
              {item.label}
            </p>
            <p className="text-sm font-semibold text-gray-700 mt-0.5">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
