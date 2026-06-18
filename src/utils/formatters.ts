export function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°C`;
}

export function formatWindSpeed(speed: number): string {
  return `${speed} km/h`;
}

export function formatPressure(pressure: number): string {
  return `${pressure} hPa`;
}

export function formatVisibility(vis: number): string {
  return `${vis} km`;
}

export function formatPrecip(precip: number): string {
  return `${precip} mm`;
}

export function formatDayLabel(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  if (dateStr === todayStr) return 'Today';
  if (dateStr === yesterdayStr) return 'Yesterday';
  if (dateStr === tomorrowStr) return 'Tomorrow';

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()];
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export function getWeatherEmoji(code: number): string {
  if (code === 113) return '☀️';
  if (code === 116) return '⛅';
  if (code === 119 || code === 122) return '☁️';
  if (code === 143 || code === 248 || code === 260) return '🌫️';
  if ([176, 263, 266, 293, 296, 299, 302, 305, 308, 353, 356, 359].includes(code)) return '🌧️';
  if ([182, 185, 311, 314, 317, 320, 362, 365].includes(code)) return '🌨️';
  if ([200, 386, 389, 392, 395].includes(code)) return '⛈️';
  if ([227, 230, 323, 326, 329, 332, 335, 338, 350, 368, 371, 374, 377].includes(code)) return '❄️';
  return '🌤️';
}