import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WeatherTile } from '../components/WeatherTile/WeatherTile';
import type { WeatherTileData } from '../types/weather';

describe('WeatherTile', () => {
  const mockTile: WeatherTileData = {
    id: 'test-1',
    label: 'Today',
    date: '2026-06-19',
    temperature: 20,
    weatherCode: 116,
    weatherIcon: '',
    weatherDescription: 'Partly cloudy',
    isHistorical: false,
  };

  it('renders temperature and weather description', () => {
    render(<WeatherTile tile={mockTile} isSelected={false} onSelect={() => {}} />);
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('Partly cloudy')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const onSelect = vi.fn();
    render(<WeatherTile tile={mockTile} isSelected={false} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalledWith(mockTile);
  });

  it('shows Past label for historical days', () => {
    const historicalTile = { ...mockTile, isHistorical: true };
    render(<WeatherTile tile={historicalTile} isSelected={false} onSelect={() => {}} />);
    expect(screen.getByText('Past')).toBeInTheDocument();
  });

  it('applies selected styling', () => {
    const { container } = render(
      <WeatherTile tile={mockTile} isSelected={true} onSelect={() => {}} />
    );
    const button = container.querySelector('button');
    expect(button?.className).toContain('bg-blue-500');
  });
});