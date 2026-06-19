import { FiSun } from 'react-icons/fi';
import { SearchBar } from '../SearchBar/SearchBar';

interface HeaderProps {
  onSearch: (location: string) => void;
  isLoading: boolean;
}
export function Header({ onSearch, isLoading }: HeaderProps) {
  return (
    <header className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4 animate-bounceIn">
        <FiSun className="h-10 w-10 text-yellow-500 animate-float" />
        <h1 className="text-3xl font-bold text-gray-800 animate-slideInDown">Weather Forecast</h1>
      </div>
      <p className="text-gray-500 mb-6 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
        Check current conditions, forecasts, and historical data
      </p>
      <div className="flex justify-center animate-scaleIn" style={{ animationDelay: '0.2s' }}>
        <SearchBar onSearch={onSearch} isLoading={isLoading} />
      </div>
    </header>
  );
}
