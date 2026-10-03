import { GameState } from '../../types/game';
import { canEnterEndlessMode, getEndlessRecord, getWaveConfig } from '../../core/endlessMode';
import { escapeHtml } from '../escapeHtml';

/**
 * Render Modal Giới Thiệu & Bắt Đầu Ca Đêm Bất Tận (Endless Rush Hour)
 */
export function renderEndlessModeModal(state: GameState): string {
  const record = getEndlessRecord(state);
  const check = canEnterEndlessMode(state);
  const nextWaveSample = getWaveConfig(record.highestWave || 1);

  return `
    <div id="modal-endless-mode" class="modal-backdrop" style="display: flex; align-items: center; justify-content: center; z-index: 1060; padding: 10px;">
      <div class="modal-box retro-card" style="width: 100%; max-width: 440px; max-height: 90vh; display: flex; flex-direction: column; background: #0f172a; border: 3px solid #f43f5e; border-radius: 16px; box-shadow: 0 0 25px rgba(244, 63, 94, 0.4); color: #fff; overflow: hidden;">
        
        <!-- Header Arcade Neon -->
        <div style="background: linear-gradient(135deg, #881337, #4c0519); padding: 14px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f43f5e;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.8rem; animation: pulse 1.5s infinite;">🌙</span>
            <div>
              <div style="font-size: 0.68rem; font-weight: 800; color: #fbcfe8; letter-spacing: 1px; text-transform: uppercase;">
                KHUNG GIỜ KHUYA 21:00 — 06:00 SÁNG
              </div>
              <div style="font-size: 1.05rem; font-weight: 900; color: #fff; font-family: 'Tiny5', 'Baloo 2', monospace; text-shadow: 0 0 8px #f43f5e;">
                CA ĐÊM HẺM 1102
              </div>
            </div>
          </div>
          <button id="btn-close-endless-mode" style="background: #4c0519; border: 1.5px solid #f43f5e; border-radius: 50%; width: 28px; height: 28px; color: #fbcfe8; font-weight: 900; cursor: pointer;">
            ✕
          </button>
        </div>

        <!-- Nội dung chính -->
        <div style="flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 12px;">
          
          <!-- Bảng Vàng Kỷ Lục -->
          <div style="background: rgba(30, 41, 59, 0.8); border: 1.5px solid #334155; border-radius: 12px; padding: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div style="background: rgba(15, 23, 42, 0.6); border-radius: 8px; padding: 8px; text-align: center;">
              <div style="font-size: 0.65rem; color: #94a3b8; font-weight: 700; text-transform: uppercase;">KỶ LỤC ĐIỂM</div>
              <div style="font-size: 1.25rem; font-weight: 900; color: #facc15; margin-top: 2px; font-family: 'Silkscreen', 'VT323', monospace;">
                ${record.highScore.toLocaleString('vi-VN')}
              </div>
            </div>
            <div style="background: rgba(15, 23, 42, 0.6); border-radius: 8px; padding: 8px; text-align: center;">
              <div style="font-size: 0.65rem; color: #94a3b8; font-weight: 700; text-transform: uppercase;">LÀN SÓNG CAO NHẤT</div>
              <div style="font-size: 1.25rem; font-weight: 900; color: #38bdf8; margin-top: 2px; font-family: 'Silkscreen', 'VT323', monospace;">
                WAVE ${record.highestWave}
              </div>
            </div>
          </div>

          <!-- Tác dụng & Điểm khác biệt so với ngày thường (Jev MCP Choice chill_night) -->
          <div style="background: rgba(244, 63, 94, 0.08); border: 1.5px solid rgba(244, 63, 94, 0.4); border-radius: 10px; padding: 10px 12px; display: flex; flex-direction: column; gap: 6px;">
            <div style="font-size: 0.72rem; font-weight: 800; color: #fda4af; display: flex; align-items: center; gap: 6px;">
              <span>🌙</span>
              <span>ĐẶC ĐIỂM CA ĐÊM (21:00 — 06:00 SÁNG):</span>
            </div>
            <div style="font-size: 0.68rem; color: #f8fafc; line-height: 1.45;">
              • <b>Khung giờ khuya</b>: Từ <b>21h tối đến 6h sáng</b>, mở bán khi ca ngày (10h-21h) đóng cửa.
            </div>
            <div style="font-size: 0.68rem; color: #f8fafc; line-height: 1.45;">
              • <b>Khách Cú Đêm đặc thù</b>: Game thủ cày rank, Tài xế xe ôm đêm, Lao công dọn phố, Nhóm bạn ăn khuya.
            </div>
            <div style="font-size: 0.68rem; color: #f8fafc; line-height: 1.45;">
              • <b>Khách kiên nhẫn hơn +30%</b>: Ăn đêm thong thả, không hối thúc dí đơn, nhịp độ êm dịu hơn ban ngày.
            </div>
            <div style="font-size: 0.68rem; color: #f8fafc; line-height: 1.45;">
              • <b>Combo đêm & Tiền bo khủng +25%</b>: Khách gọi combo gà kèm bia/nước ngọt và sẵn sàng tip hậu hĩnh.
            </div>
            <div style="font-size: 0.68rem; color: #4ade80; line-height: 1.45; font-weight: 700;">
              • <b>100% doanh thu & tiền bo</b> chuyển thẳng vào quỹ quán, giúp tích lũy tiền mặt bằng và trang trải chi phí nhanh hơn!
            </div>
          </div>

          <!-- Thông tin Wave mẫu -->
          <div style="background: rgba(30, 41, 59, 0.5); border-radius: 8px; padding: 8px 10px; display: flex; justify-content: space-between; align-items: center; font-size: 0.7rem;">
            <span style="color: #94a3b8;">Độ khó Wave ${nextWaveSample.wave}:</span>
            <span style="color: #38bdf8; font-weight: 800;">${nextWaveSample.customerCount} Khách · Tốc độ ${Math.round((1 - nextWaveSample.patienceMultiplier) * 100)}% nhanh hơn</span>
          </div>

          <!-- Nút Bắt Đầu -->
          <div style="margin-top: 4px;">
            ${check.canEnter ? `
              <button id="btn-start-endless-run" style="width: 100%; padding: 12px; font-size: 0.9rem; font-weight: 900; background: linear-gradient(135deg, #f43f5e, #be123c); color: #fff; border: 2px solid #fb7185; border-radius: 10px; cursor: pointer; box-shadow: 0 0 15px rgba(244, 63, 94, 0.5); font-family: 'Silkscreen', 'VT323', monospace; letter-spacing: 0.5px;">
                🔥 BƯỚC VÀO CA ĐÊM BẤT TẬN
              </button>
            ` : `
              <div style="text-align: center; padding: 10px; background: rgba(30, 41, 59, 0.8); border: 1px dashed #64748b; border-radius: 10px; font-size: 0.72rem; color: #94a3b8; font-weight: 700;">
                🔒 ${escapeHtml(check.reason || 'Chưa đủ điều kiện')}
              </div>
            `}
          </div>

        </div>

      </div>
    </div>
  `;
}
