import { FiSun, FiCloud, FiCloudRain, FiCloudLightning, FiCloudSnow, FiCloudOff } from 'react-icons/fi';

interface WeatherIconProps {
  code: number;
  className?: string;
}

export function WeatherIcon({ code, className = '' }: WeatherIconProps) {
  let icon: React.ReactNode;

  if (code === 113) icon = <FiSun />;
  else if (code === 116) icon = <FiCloud />;
  else if (code === 119 || code === 122) icon = <FiCloud />;
  else if (code === 143 || code === 248 || code === 260) icon = <FiCloudOff />;
  else if ([176, 263, 266, 293, 296, 299, 302, 305, 308, 353, 356, 359].includes(code)) icon = <FiCloudRain />;
  else if ([182, 185, 311, 314, 317, 320, 362, 365].includes(code)) icon = <FiCloudSnow />;
  else if ([200, 386, 389, 392, 395].includes(code)) icon = <FiCloudLightning />;
  else if ([227, 230, 323, 326, 329, 332, 335, 338, 350, 368, 371, 374, 377].includes(code)) icon = <FiCloudSnow />;
  else icon = <FiSun />;

  return <span className={className}>{icon}</span>;
}