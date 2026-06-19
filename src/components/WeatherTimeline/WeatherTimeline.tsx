import { useRef, useEffect } from 'react';
import type { WeatherTileData } from '../../types/weather';
import { WeatherTile } from '../WeatherTile/WeatherTile';

interface WeatherTimelineProps {
  timeline: WeatherTileData[];
  selectedId: string | null;
  onSelect: (tile: WeatherTileData) => void;
}

export function WeatherTimeline({ timeline, selectedId, onSelect }: WeatherTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const selectedEl = container.querySelector('[aria-pressed="true"]') as HTMLElement | null;
    if (selectedEl) {
      const scrollLeft = selectedEl.offsetLeft - container.clientWidth / 2 + selectedEl.clientWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [selectedId]);

  if (timeline.length === 0) return null;

  return (
    <div
      ref={scrollRef}
      className="w-full overflow-x-auto pb-2 scrollbar-thin scroll-smooth"
    >
      <div className="flex gap-3 min-w-max px-4 md:px-0 md:justify-center">
        {timeline.map(tile => (
          <WeatherTile
            key={tile.id}
            tile={tile}
            isSelected={selectedId === tile.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
