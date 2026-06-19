import { memo } from 'react';
import { FiCircle } from 'react-icons/fi';
import type { WeatherTileData } from '../../types/weather';

interface WeatherTileProps {
  tile: WeatherTileData;
  isSelected: boolean;
  onSelect: (tile: WeatherTileData) => void;
}

export const WeatherTile = memo(function WeatherTile({ tile, isSelected, onSelect }: WeatherTileProps) {
  return (
    <button
      onClick={() => onSelect(tile)}
      className={`flex flex-col items-center gap-1 p-3 rounded-xl min-w-[90px] transition-all duration-200 cursor-pointer
        ${isSelected
          ? 'bg-blue-500 text-white shadow-lg shadow-blue-200 scale-105'
          : 'bg-white/80 hover:bg-white hover:shadow-md text-gray-700'
        }
        ${tile.isHistorical ? 'opacity-80' : ''}
      `}
      aria-label={`Select ${tile.label}`}
      aria-pressed={isSelected}
    >
      <span className={`text-xs font-medium uppercase tracking-wide ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
        {tile.label}
      </span>
      {tile.isHistorical && (
        <span className={`text-[10px] uppercase tracking-wider ${isSelected ? 'text-blue-200' : 'text-gray-400'}`}>
          Past
        </span>
      )}
      <span className="text-2xl my-1">{tile.weatherIcon}</span>
      <span className="text-lg font-bold">{Math.round(tile.temperature)}<FiCircle className="inline-block w-1.5 h-1.5" /></span>
      <span className={`text-xs text-center leading-tight line-clamp-2 ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
        {tile.weatherDescription}
      </span>
    </button>
  );
});