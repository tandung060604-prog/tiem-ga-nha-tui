import { GameState, NightRadioBroadcast } from '../../types/game';
import { escapeHtml } from '../escapeHtml';

/**
 * Modal Đài Phát Thanh Đêm Sài Gòn — Hẻm 1102 (FM 99.9 MHz)
 * Thiết kế giao diện máy đài Cassette Retro thập niên 90 với màn hình LCD xanh lá cây,
 * nút bấm cơ học, cần ăng-ten, bản tin đời sống & cơ chế RADIO BUFF tiếp sức ca bán ngày mai.
 */
export function renderNightRadioModal(
  state: GameState,
  broadcast: NightRadioBroadcast
): string {
  const isBuffClaimed = state.lastRadioBroadcastDay === state.day && state.activeRadioBuff != null;
  const buff = broadcast.buff;

  const buffSectionHtml = buff ? `
    <div style="background: linear-gradient(135deg, rgba(234, 179, 8, 0.15), rgba(202, 138, 4, 0.25)); border: 1.5px solid #eab308; border-radius: 8px; padding: 10px 12px; margin-top: 6px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <span style="font-size: 0.72rem; font-weight: 800; color: #fef08a; text-transform: uppercase; letter-spacing: 0.5px;">
          📻 HIỆU LỰC BUFF NGÀY MAI (NGÀY ${state.day + 1})
        </span>
        ${isBuffClaimed ? `
          <span style="font-size: 0.65rem; background: #22c55e; color: #fff; padding: 1px 6px; border-radius: 4px; font-weight: 800;">
            ĐÃ KÍCH HOẠT ✓
          </span>
        ` : `
          <span style="font-size: 0.65rem; background: #eab308; color: #451a03; padding: 1px 6px; border-radius: 4px; font-weight: 800;">
            CHỜ TIẾP NHẬN
          </span>
        `}
      </div>
      <div style="font-size: 0.85rem; font-weight: 800; color: #fef9c3; margin-bottom: 2px;">
        ${escapeHtml(buff.title)}
      </div>
      <div style="font-size: 0.74rem; color: #fef08a; line-height: 1.4;">
        ${escapeHtml(buff.description)}
      </div>
      ${buff.bonusMoney ? `
        <div style="margin-top: 4px; font-size: 0.72rem; color: #86efac; font-weight: 700;">
          💰 Tặng ngay ví tiền: +${buff.bonusMoney.toLocaleString('vi-VN')}đ
        </div>
      ` : ''}
    </div>
  ` : '';

  return `
    <div id="modal-night-radio" class="modal-backdrop" style="display: flex; align-items: center; justify-content: center; z-index: 1070; padding: 12px; background: rgba(10, 15, 29, 0.85); backdrop-filter: blur(4px);">
      <div class="modal-box retro-card" style="width: 100%; max-width: 430px; background: #2b1d0c; border: 4px solid #854d0e; border-radius: 16px; box-shadow: 0 16px 40px rgba(0,0,0,0.8), inset 0 2px 4px rgba(255,255,255,0.15); overflow: hidden; display: flex; flex-direction: column;">
        
        <!-- Đỉnh Đài Cassette: Cần Ăng-ten & Đèn Báo Sóng -->
        <div style="background: linear-gradient(180deg, #451a03, #2b1d0c); padding: 8px 14px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1c1106;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.2rem;">📻</span>
            <div>
              <div style="font-size: 0.72rem; font-weight: 800; color: #fde047; letter-spacing: 0.5px;">
                ${escapeHtml(broadcast.channelName)}
              </div>
              <div style="font-size: 0.62rem; color: #a8a29e;">
                BĂNG CASSETTE SÀI GÒN THẬP NIÊN 90
              </div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="display: inline-block; width: 9px; height: 9px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 10px #22c55e; animation: pulse 1.5s infinite;"></span>
            <span style="font-size: 0.68rem; color: #86efac; font-weight: 800;">ON AIR</span>
          </div>
        </div>

        <!-- Thân Đài: Màn Hình LCD Retro Xanh Lá Cây -->
        <div style="padding: 12px 14px; display: flex; flex-direction: column; gap: 10px;">
          
          <div style="background: #052e16; border: 2.5px solid #15803d; border-radius: 10px; padding: 12px; box-shadow: inset 0 2px 8px rgba(0,0,0,0.8); font-family: monospace;">
            
            <!-- Tần số & Thời tiết -->
            <div style="display: flex; justify-content: space-between; font-size: 0.68rem; color: #4ade80; border-bottom: 1px dashed #166534; padding-bottom: 6px; margin-bottom: 6px;">
              <span>FM 99.9 MHz • NGÀY ${state.day}</span>
              <span>🌙 ${escapeHtml(broadcast.weatherCondition)}</span>
            </div>

            <!-- Băng nhạc đang phát -->
            ${broadcast.musicTrackName ? `
              <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px; font-size: 0.7rem; color: #86efac; background: rgba(22, 101, 52, 0.4); padding: 3px 8px; border-radius: 4px;">
                <span>📼</span>
                <span style="font-style: italic; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  Đang phát: <b>${escapeHtml(broadcast.musicTrackName)}</b>
                </span>
              </div>
            ` : ''}

            <!-- Tiêu đề bản tin -->
            <div style="font-size: 0.88rem; font-weight: 900; color: #86efac; text-shadow: 0 0 6px rgba(74, 222, 128, 0.4); margin-bottom: 8px; line-height: 1.35;">
              ▶ ${escapeHtml(broadcast.headline)}
            </div>

            <!-- Nội dung phát thanh -->
            <div style="font-size: 0.78rem; line-height: 1.45; color: #dcfce7; text-align: justify;">
              "${escapeHtml(broadcast.audioTranscript)}"
            </div>

            <!-- Lời đồn hè phố & Dự báo ngày mai -->
            <div style="margin-top: 8px; background: rgba(22, 101, 52, 0.5); border-radius: 6px; padding: 6px 8px; font-size: 0.7rem; color: #bbf7d0; display: flex; flex-direction: column; gap: 3px;">
              <div>💬 <b>Tin rỉ tai xóm:</b> ${escapeHtml(broadcast.streetRumor)}</div>
              ${broadcast.forecastTomorrow ? `
                <div style="color: #fef08a;">☀️ <b>Dự báo ngày mai:</b> ${escapeHtml(broadcast.forecastTomorrow)}</div>
              ` : ''}
            </div>

            <!-- Khối Buff Ngày Mai -->
            ${buffSectionHtml}

          </div>

          <!-- Dải loa đài vải nỉ & Nút kích hoạt Buff -->
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${!isBuffClaimed && buff ? `
              <button id="btn-claim-radio-buff" class="retro-clickable" style="width: 100%; min-height: 44px; padding: 10px; font-size: 0.84rem; font-weight: 800; border-radius: 8px; background: linear-gradient(135deg, #eab308, #ca8a04); color: #451a03; border: 2px solid #fef08a; cursor: pointer; box-shadow: 0 4px 12px rgba(234, 179, 8, 0.4); display: flex; align-items: center; justify-content: center; gap: 8px; transition: transform 0.1s ease;">
                <span>📻</span> BẬT ĐÀI & TIẾP NHẬN BUFF NGÀY MAI ✨
              </button>
            ` : `
              <div style="background: rgba(34, 197, 94, 0.15); border: 1.5px solid #22c55e; border-radius: 8px; padding: 8px 12px; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 0.76rem; color: #86efac; font-weight: 800;">
                <span>✅</span> Đã tiếp nhận Buff cho ca bán Ngày ${state.day + 1}!
              </div>
            `}
          </div>

        </div>

        <!-- Footer: Nút tắt đài nghỉ ngơi -->
        <div style="background: #1c1106; padding: 10px 14px; border-top: 2px solid #140b04; display: flex; justify-content: flex-end;">
          <button id="btn-close-night-radio" class="btn-primary" style="width: 100%; min-height: 44px; padding: 10px; font-size: 0.84rem; font-weight: 800; border-radius: 8px; background: linear-gradient(135deg, #78350f, #451a03); color: #fef08a; border: 1.5px solid #b45309; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.4);">
            Tắt Đài & Đi Ngủ Thôi 🌙
          </button>
        </div>

      </div>
    </div>
  `;
}
