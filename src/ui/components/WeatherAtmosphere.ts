import { SaigonWeather } from '../../types/game';
import { escapeHtml } from '../escapeHtml';

/**
 * Render Huy hiệu thời tiết Sài Gòn trên bảng phấn Chalkboard
 */
export function renderWeatherChalkboardBadge(weather: SaigonWeather): string {
  return `
    <span class="weather-badge" style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 6px; font-weight: 800; font-size: 0.72rem; background: #fff8eb; color: #78350f; border: 1px solid #d97706; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <span style="font-size: 0.85rem;">${weather.icon}</span>
      <span>${escapeHtml(weather.name)}</span>
    </span>
  `;
}

/**
 * Render Banner Bầu Không Khí Thời Tiết Sài Gòn (Weather Atmosphere Strip)
 */
export function renderWeatherAtmosphereStrip(weather: SaigonWeather): string {
  let bgColor = 'linear-gradient(135deg, #fef3c7, #fde68a)';
  let borderColor = '#f59e0b';
  let textColor = '#78350f';

  if (weather.id === 'sudden_rain' || weather.id === 'thunderstorm') {
    bgColor = 'linear-gradient(135deg, #e0f2fe, #bae6fd)';
    borderColor = '#0284c7';
    textColor = '#0369a1';
  } else if (weather.id === 'golden_sunset') {
    bgColor = 'linear-gradient(135deg, #ffedd5, #fed7aa)';
    borderColor = '#ea580c';
    textColor = '#9a3412';
  } else if (weather.id === 'cool_breeze') {
    bgColor = 'linear-gradient(135deg, #ecfdf5, #d1fae5)';
    borderColor = '#10b981';
    textColor = '#065f46';
  }

  return `
    <div class="weather-atmosphere-strip ${weather.bgAtmosphereClass}" style="background: ${bgColor}; border: 1.5px solid ${borderColor}; border-radius: 6px; padding: 2px 8px; margin: 2px 0 4px; display: flex; align-items: center; justify-content: space-between; gap: 6px; height: 26px; box-sizing: border-box;">
      <div style="display: flex; align-items: center; gap: 6px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
        <span style="font-size: 0.95rem;">${weather.icon}</span>
        <span style="font-size: 0.7rem; font-weight: 800; color: ${textColor}; overflow: hidden; text-overflow: ellipsis;">
          ${escapeHtml(weather.badgeText)}
        </span>
      </div>
      <div style="font-size: 0.58rem; font-weight: 800; background: rgba(255,255,255,0.75); border: 1px solid ${borderColor}; border-radius: 4px; padding: 1px 5px; white-space: nowrap; color: ${textColor}; flex-shrink: 0;">
        SÀI GÒN
      </div>
    </div>
  `;
}
