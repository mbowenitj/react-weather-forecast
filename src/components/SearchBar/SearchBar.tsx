import { useState, type FormEvent, type ChangeEvent } from 'react';
import { FiX } from 'react-icons/fi';

interface SearchBarProps {
  onSearch: (location: string) => void;
  isLoading: boolean;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [input, setInput] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (input.trim()) onSearch(input.trim());
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  function handleClear() {
    setInput('');
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md">
      <div className="relative flex-1">
        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="Enter city"
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white/90 backdrop-blur-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                     text-gray-800 placeholder-gray-400 transition-all duration-200"
          disabled={isLoading}
          aria-label="Search location"
        />
        {input && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <FiX className="h-4 w-4" />
          </button>
        )}
      </div>
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300
                   text-white font-medium rounded-lg transition-all duration-200
                   focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
                   disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading
          </span>
        ) : (
          'Search'
        )}
      </button>
    </form>
  );
}