import { GameState, ThiefEncounter } from '../../types/game';
import { checkSecurityStaff } from '../../core/thiefSystem';
import { escapeHtml } from '../escapeHtml';

/**
 * Render giao diện Minigame Bắt Trộm Căn Nhịp (Timing Reflex)
 */
export function renderThiefMinigameModal(state: GameState, encounter: ThiefEncounter): string {
  const security = checkSecurityStaff(state);
  const greenWidth = security.greenZoneWidthPercent;
  const greenLeft = Math.round((100 - greenWidth) / 2);

  return `
    <div id="modal-thief-minigame" class="modal-backdrop" style="display: flex; align-items: center; justify-content: center; z-index: 1060; padding: 10px;">
      <div class="modal-box retro-card" style="width: 100%; max-width: 420px; background: #fff8f0; border: 3.5px solid #dc2626; border-radius: 12px; box-shadow: 0 10px 35px rgba(220, 38, 38, 0.45); overflow: hidden; display: flex; flex-direction: column;">
        
        <!-- Header Cảnh Báo Khẩn Cấp -->
        <div style="background: linear-gradient(135deg, #b91c1c, #7f1d1d); color: #fff; padding: 12px 14px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #991b1b;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.6rem; animation: pulse 1s infinite;">🚨</span>
            <div>
              <div style="font-size: 0.95rem; font-weight: 900; color: #fef08a; letter-spacing: 0.5px;">
                BẮT QUẢ TANG KẺ ĐẠO CHÍCH!
              </div>
              <div style="font-size: 0.68rem; color: #fecaca;">
                Phát hiện kẻ gian trà trộn đóng giả khách hàng
              </div>
            </div>
          </div>
          <div style="background: #991b1b; border: 1.5px solid #ef4444; border-radius: 6px; padding: 4px 8px; font-size: 0.8rem; font-weight: 800; color: #fef08a;">
            ⏳ <span id="thief-timer-sec">${encounter.timeRemaining}</span>s
          </div>
        </div>

        <!-- Nội dung tình huống -->
        <div style="padding: 12px; display: flex; flex-direction: column; gap: 10px;">
          
          <!-- Thẻ đối tượng tình nghi -->
          <div style="background: #fee2e2; border: 1.5px solid #f87171; border-radius: 8px; padding: 8px 10px; display: flex; align-items: center; gap: 10px;">
            <img src="${encounter.disguiseAvatar}" alt="Kẻ tình nghi" style="width: 52px; height: 52px; border-radius: 50%; border: 2px solid #b91c1c; object-fit: contain; background: #fff;" />
            <div style="flex: 1; min-width: 0;">
              <div style="font-size: 0.85rem; font-weight: 800; color: #991b1b;">
                ${escapeHtml(encounter.disguiseName)}
              </div>
              <div style="font-size: 0.7rem; color: #7f1d1d; margin-top: 2px;">
                📍 Đang me tại <b>Bàn Số ${encounter.targetTable}</b>
              </div>
              <div style="font-size: 0.68rem; color: #b91c1c; font-weight: 700; margin-top: 2px;">
                🎯 Nhắm tới: <b>${escapeHtml(encounter.targetItem)}</b> của ${escapeHtml(encounter.targetCustomerName)}
              </div>
            </div>
          </div>

          <!-- Bong bóng dấu hiệu khả nghi -->
          <div style="background: #fff; border: 1.5px dashed #dc2626; border-radius: 8px; padding: 8px 10px; font-size: 0.72rem; color: #7f1d1d; font-style: italic; line-height: 1.4;">
            "${escapeHtml(encounter.tellTaleClue)}"
          </div>

          <!-- Khu vực Bảo Vệ có đất diễn -->
          ${security.hasSecurity ? `
            <div style="background: #ecfdf5; border: 1.5px solid #10b981; border-radius: 8px; padding: 8px 10px; display: flex; align-items: center; justify-content: space-between; gap: 8px;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 1.3rem;">${security.guardAvatar}</span>
                <div>
                  <div style="font-size: 0.75rem; font-weight: 800; color: #065f46;">
                    ${escapeHtml(security.guardName)} (Bảo Vệ Đang Trực)
                  </div>
                  <div style="font-size: 0.65rem; color: #047857;">
                    Đã khóa góc thoát! Vùng bắt mở rộng 300%!
                  </div>
                </div>
              </div>
              <button id="btn-guard-instant-bust" class="btn-sm" style="padding: 6px 10px; font-size: 0.72rem; font-weight: 900; background: linear-gradient(135deg, #10b981, #059669); color: #fff; border: 1px solid #047857; border-radius: 6px; cursor: pointer; white-space: nowrap; box-shadow: 0 2px 6px rgba(16,185,129,0.3);">
                👮 KHỐNG CHẾ!
              </button>
            </div>
          ` : `
            <div style="background: #fffbeb; border: 1.5px dashed #f59e0b; border-radius: 8px; padding: 6px 8px; font-size: 0.68rem; color: #92400e; display: flex; align-items: center; gap: 6px;">
              <span>⚠️</span>
              <span>Quán chưa thuê Bảo Vệ! Bạn phải tự tay căn nhịp thật chuẩn để tóm tay kẻ gian!</span>
            </div>
          `}

          <!-- THANH MINIGAME CĂN NHỊP (TIMING BAR) -->
          <div style="background: #1e293b; border-radius: 8px; padding: 12px 10px; display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.68rem; color: #94a3b8; font-weight: 700;">
              <span>CĂN KIM VÀO VÙNG XANH:</span>
              <span style="color: #4ade80;">BẮT QUẢ TANG</span>
            </div>

            <!-- Vùng chạy con trỏ -->
            <div id="thief-meter-track" style="position: relative; width: 100%; height: 26px; background: #334155; border-radius: 13px; overflow: hidden; border: 2px solid #475569;">
              <!-- Vùng xanh lá Target Zone -->
              <div id="thief-target-zone" style="position: absolute; left: ${greenLeft}%; width: ${greenWidth}%; height: 100%; background: linear-gradient(180deg, #4ade80, #16a34a); border-left: 2px solid #86efac; border-right: 2px solid #86efac; display: flex; align-items: center; justify-content: center; font-size: 0.62rem; font-weight: 900; color: #052e16; text-shadow: 0 1px 0 rgba(255,255,255,0.4); letter-spacing: 0.5px;">
                BẮT TẠI TRẬN
              </div>

              <!-- Con trỏ chạy qua lại (Needle) -->
              <div id="thief-needle" style="position: absolute; left: 0%; top: 0; width: 8px; height: 100%; background: #fbbf24; border-radius: 4px; box-shadow: 0 0 8px #f59e0b; border: 1.5px solid #fff; transition: left 0.03s linear;"></div>
            </div>
          </div>

          <!-- NÚT BẮT TAY TRỘM -->
          <button id="btn-thief-strike" class="btn-big-open" style="width: 100%; padding: 12px; font-size: 0.95rem; font-weight: 900; background: linear-gradient(135deg, #ef4444, #dc2626); color: #fff; border: 2px solid #991b1b; border-radius: 8px; box-shadow: 0 4px 0 #7f1d1d; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <span style="font-size: 1.3rem;">✋</span>
            <span>CHỤP CỔ TAY KẺ GIAN NGAY!</span>
          </button>

          <div style="font-size: 0.65rem; color: #991b1b; text-align: center; font-weight: 600;">
            Nếu trượt: Tên trộm cuỗm mất đồ, quán đền bù -${encounter.lossAmount.toLocaleString('vi-VN')}đ và nhận review 1 sao!
          </div>

        </div>

      </div>
    </div>
  `;
}

/**
 * Render popup khi bắt thành công (Lột mặt nạ lộ diện chân dung thật)
 */
export function renderThiefCaughtModal(_state: GameState, encounter: ThiefEncounter, rewardMoney: number): string {
  return `
    <div id="modal-thief-result" class="modal-backdrop" style="display: flex; align-items: center; justify-content: center; z-index: 1070; padding: 10px;">
      <div class="modal-box retro-card" style="width: 100%; max-width: 400px; background: #fffdf5; border: 3.5px solid #16a34a; border-radius: 12px; box-shadow: 0 10px 35px rgba(22, 163, 74, 0.4); overflow: hidden; display: flex; flex-direction: column;">
        
        <div style="background: linear-gradient(135deg, #16a34a, #15803d); color: #fff; padding: 12px 14px; text-align: center; border-bottom: 2px solid #14532d;">
          <div style="font-size: 1.1rem; font-weight: 900; color: #fef08a;">
            🎉 BẮT SỐNG TÊN TRỘM! LỘT MẶT NẠ!
          </div>
          <div style="font-size: 0.7rem; color: #dcfce7; margin-top: 2px;">
            Bảo vệ trọn vẹn tài sản của khách hàng Hẻm 1102
          </div>
        </div>

        <div style="padding: 14px; display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center;">
          
          <!-- Ảnh Chân Dung Thật Bị Còng Tay -->
          <div style="position: relative; width: 110px; height: 110px; border-radius: 50%; padding: 4px; background: linear-gradient(135deg, #f59e0b, #b45309); box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
            <img src="${encounter.trueAvatar}" alt="${encounter.trueName}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; background: #fff;" />
            <div style="position: absolute; bottom: 0; right: 0; background: #dc2626; color: #fff; font-size: 1.1rem; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border: 2px solid #fff;">
              🔒
            </div>
          </div>

          <div>
            <div style="font-size: 0.72rem; color: #b45309; font-weight: 800; text-transform: uppercase;">CHÂN TƯỚNG KẺ ĐẠO CHÍCH:</div>
            <div style="font-size: 1rem; font-weight: 900; color: #451a03; margin-top: 2px;">${escapeHtml(encounter.trueName)}</div>
          </div>

          <!-- Lời van xin của trộm -->
          <div style="background: #fef2f2; border: 1.5px dashed #ef4444; border-radius: 8px; padding: 8px 12px; font-size: 0.75rem; color: #991b1b; font-style: italic; line-height: 1.45;">
            "Dạ em lạy các anh các chú tha cho em! Em mê mùi gà chiên của quán quá mà kẹt tiền ăn mì gói cả tuần... Em hứa từ nay xin chân rửa chén chứ không dám ăn cắp nữa đâu ạ hu hu 😭!"
          </div>

          <!-- Lời cảm ơn của khách & Phần thưởng -->
          <div style="width: 100%; background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 8px; padding: 8px 10px; text-align: left; font-size: 0.72rem; color: #166534; display: flex; flex-direction: column; gap: 4px;">
            <div>💖 <b>${escapeHtml(encounter.targetCustomerName)}:</b> "Cảm ơn quán đã kịp thời tóm gọn kẻ gian bảo vệ ${escapeHtml(encounter.targetItem)} cho em!"</div>
            <div style="color: #047857; font-weight: 800;">🎁 Thưởng nóng tiệm gà: +${rewardMoney.toLocaleString('vi-VN')}đ</div>
            <div style="color: #0284c7; font-weight: 700;">✨ Chòm xóm Hẻm 1102 tin yêu và thán phục nghĩa hiệp!</div>
            <div style="color: #eab308; font-weight: 700;">⭐⭐⭐⭐⭐ Đánh giá 5 sao khen ngợi uy tín!</div>
          </div>

          <!-- Nút bàn giao công an -->
          <button id="btn-thief-finish-success" class="btn-big-open" style="width: 100%; padding: 10px; font-size: 0.88rem; font-weight: 800; background: linear-gradient(135deg, #16a34a, #15803d); color: #fff; border: 1.5px solid #14532d; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 0 #14532d;">
            🚔 BÀN GIAO CÔNG AN & TIẾP TỤC BÁN GÀ
          </button>

        </div>

      </div>
    </div>
  `;
}

/**
 * Render popup khi trộm cuỗm đồ trốn thoát (Bồi thường & Phạt sao)
 */
export function renderThiefEscapedModal(_state: GameState, encounter: ThiefEncounter): string {
  return `
    <div id="modal-thief-result" class="modal-backdrop" style="display: flex; align-items: center; justify-content: center; z-index: 1070; padding: 10px;">
      <div class="modal-box retro-card" style="width: 100%; max-width: 400px; background: #fffdf5; border: 3.5px solid #dc2626; border-radius: 12px; box-shadow: 0 10px 35px rgba(220, 38, 38, 0.4); overflow: hidden; display: flex; flex-direction: column;">
        
        <div style="background: linear-gradient(135deg, #dc2626, #991b1b); color: #fff; padding: 12px 14px; text-align: center; border-bottom: 2px solid #7f1d1d;">
          <div style="font-size: 1.1rem; font-weight: 900; color: #fef08a;">
            💨 TÊN TRỘM ĐÃ TẨU THOÁT!
          </div>
          <div style="font-size: 0.7rem; color: #fecaca; margin-top: 2px;">
            Khách hàng bị cuỗm mất tài sản trong lúc ăn gà
          </div>
        </div>

        <div style="padding: 14px; display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center;">
          
          <div style="font-size: 3rem;">🏃💨</div>

          <div style="font-size: 0.88rem; font-weight: 800; color: #991b1b;">
            Tên trộm đã thó mất ${escapeHtml(encounter.targetItem)} rồi phóng vọt ra ngõ hẻm mất dạng!
          </div>

          <div style="background: #fef2f2; border: 1.5px dashed #ef4444; border-radius: 8px; padding: 8px 12px; font-size: 0.75rem; color: #991b1b; text-align: left; line-height: 1.45;">
            😡 <b>${escapeHtml(encounter.targetCustomerName)} gào khóc phẫn nộ:</b><br/>
            "Tiệm ăn buôn bán kiểu gì mà không có bảo vệ trông coi đồ cho khách?! Tôi mất sạch tiền rồi, quán phải chịu trách nhiệm đền bù!"
          </div>

          <div style="width: 100%; background: #fee2e2; border: 1.5px solid #f87171; border-radius: 8px; padding: 8px 10px; text-align: left; font-size: 0.72rem; color: #991b1b; display: flex; flex-direction: column; gap: 4px;">
            <div>💸 <b>Tiệm phải đền bù thiệt hại:</b> -${encounter.lossAmount.toLocaleString('vi-VN')}đ</div>
            <div>💔 <b>Chòm xóm chê trách, tình cảm xóm hẻm rạn nứt</b></div>
            <div>⭐ <b>Nhận 1 sao đánh giá cay đắng về an ninh</b> (-0.2★ điểm tiệm)</div>
          </div>

          <button id="btn-thief-finish-failure" class="btn-big-open" style="width: 100%; padding: 10px; font-size: 0.88rem; font-weight: 800; background: linear-gradient(135deg, #ef4444, #dc2626); color: #fff; border: 1.5px solid #991b1b; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 0 #7f1d1d;">
            💸 BỒI THƯỜNG & RÚT KINH NGHIỆM
          </button>

        </div>

      </div>
    </div>
  `;
}
