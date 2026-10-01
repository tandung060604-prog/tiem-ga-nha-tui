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
    <div class="weather-atmosphere-strip ${weather.bgAtmosphereClass}" style="background: ${bgColor}; border: 1.5px solid ${borderColor}; border-radius: 8px; padding: 6px 10px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; gap: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 1.3rem;">${weather.icon}</span>
        <div>
          <div style="font-size: 0.75rem; font-weight: 900; color: ${textColor};">
            ${escapeHtml(weather.badgeText)}
          </div>
          <div style="font-size: 0.65rem; color: ${textColor}; font-style: italic; opacity: 0.9;">
            "${escapeHtml(weather.flavorQuote)}"
          </div>
        </div>
      </div>
      <div style="font-size: 0.65rem; font-weight: 800; background: rgba(255,255,255,0.7); border: 1px solid ${borderColor}; border-radius: 4px; padding: 2px 6px; white-space: nowrap; color: ${textColor};">
        SÀI GÒN 🇻🇳
      </div>
    </div>
  `;
}
