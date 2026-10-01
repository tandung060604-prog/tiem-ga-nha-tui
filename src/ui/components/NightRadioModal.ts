import { GameState, NightRadioBroadcast } from '../../types/game';
import { escapeHtml } from '../escapeHtml';

/**
 * Modal Đài Phát Thanh Đêm Sài Gòn — Hẻm 1102 (FM 99.9 MHz)
 * Thiết kế giao diện máy đài Cassette Retro thập niên 90 với màn hình LCD xanh lá cây,
 * nút bấm cơ học, cần ăng-ten và bản tin đời sống Sài Gòn sau mỗi ngày bán mệt nhoài.
 */
export function renderNightRadioModal(
  _state: GameState,
  broadcast: NightRadioBroadcast
): string {
  return `
    <div id="modal-night-radio" class="modal-backdrop" style="display: flex; align-items: center; justify-content: center; z-index: 1070; padding: 12px; background: rgba(10, 15, 29, 0.85); backdrop-filter: blur(4px);">
      <div class="modal-box retro-card" style="width: 100%; max-width: 420px; background: #2b1d0c; border: 4px solid #854d0e; border-radius: 16px; box-shadow: 0 16px 40px rgba(0,0,0,0.8), inset 0 2px 4px rgba(255,255,255,0.15); overflow: hidden; display: flex; flex-direction: column;">
        
        <!-- Đỉnh Đài Cassette: Cần Ăng-ten & Đèn Báo Sóng -->
        <div style="background: linear-gradient(180deg, #451a03, #2b1d0c); padding: 8px 14px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1c1106;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.1rem;">📻</span>
            <div style="font-size: 0.72rem; font-weight: 800; color: #fde047; letter-spacing: 0.5px;">
              ${escapeHtml(broadcast.channelName)}
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 8px #22c55e; animation: pulse 1.5s infinite;"></span>
            <span style="font-size: 0.65rem; color: #86efac; font-weight: 700;">ON AIR</span>
          </div>
        </div>

        <!-- Thân Đài: Màn Hình LCD Retro Xanh Lá Cây -->
        <div style="padding: 14px; display: flex; flex-direction: column; gap: 12px;">
          
          <div style="background: #052e16; border: 2.5px solid #15803d; border-radius: 10px; padding: 12px; box-shadow: inset 0 2px 8px rgba(0,0,0,0.8); font-family: monospace;">
            
            <!-- Tần số & Thời tiết -->
            <div style="display: flex; justify-content: space-between; font-size: 0.68rem; color: #4ade80; border-bottom: 1px dashed #166534; padding-bottom: 6px; margin-bottom: 6px;">
              <span>FM 99.9 MHz • CHƯƠNG ${broadcast.chapter}</span>
              <span>🌙 ${escapeHtml(broadcast.weatherCondition)}</span>
            </div>

            <!-- Tiêu đề bản tin -->
            <div style="font-size: 0.88rem; font-weight: 900; color: #86efac; text-shadow: 0 0 6px rgba(74, 222, 128, 0.4); margin-bottom: 8px; line-height: 1.3;">
              ▶ ${escapeHtml(broadcast.headline)}
            </div>

            <!-- Nội dung phát thanh -->
            <div style="font-size: 0.78rem; line-height: 1.45; color: #dcfce7;">
              "${escapeHtml(broadcast.audioTranscript)}"
            </div>

            <!-- Lời đồn hè phố -->
            <div style="margin-top: 10px; background: rgba(22, 101, 52, 0.4); border-radius: 6px; padding: 6px 8px; font-size: 0.7rem; color: #bbf7d0; font-style: italic;">
              💬 <b>Tin rỉ tai xóm hẻm:</b> ${escapeHtml(broadcast.streetRumor)}
            </div>

          </div>

          <!-- Dải loa đài vải nỉ & Nút bấm cơ học -->
          <div style="display: flex; justify-content: space-between; align-items: center; background: #1c1106; border-radius: 8px; padding: 8px 12px; border: 1px solid #451a03;">
            <div style="display: flex; gap: 4px; align-items: center;">
              <span style="font-size: 0.7rem; color: #ca8a04; font-weight: 800;">ÂM SẮC CASSETTE</span>
              <span style="font-size: 0.65rem; color: #78716c;">(Băng Cổ Điển)</span>
            </div>
            <div style="display: flex; gap: 6px;">
              <span style="font-size: 0.9rem;">📼</span>
              <span style="font-size: 0.9rem;">🔊</span>
            </div>
          </div>

        </div>

        <!-- Footer: Nút tắt đài nghỉ ngơi -->
        <div style="background: #1c1106; padding: 10px 14px; border-top: 2px solid #140b04; display: flex; justify-content: flex-end;">
          <button id="btn-close-night-radio" class="btn-primary" style="width: 100%; padding: 10px; font-size: 0.85rem; font-weight: 800; border-radius: 8px; background: linear-gradient(135deg, #b45309, #78350f); color: #fef08a; border: 1.5px solid #eab308; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.4);">
            Tắt Đài & Đi Ngủ Thôi 🌙
          </button>
        </div>

      </div>
    </div>
  `;
}
