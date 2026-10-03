import { ASSETS } from '../../content/assets';
import { bacBaVoice } from '../../core/bacBaVoice';

export function renderBacBaManualModal(): string {
  return `
    <div id="bacba-manual-overlay" class="modal-overlay bacba-manual-overlay" role="dialog" aria-modal="true" aria-labelledby="bacba-manual-title">
      <div class="modal-card bacba-manual-card stardew-box">
        <!-- Header cổ điển -->
        <div class="bacba-manual-header">
          <div class="header-left">
            <img src="${ASSETS.bacba.front}" class="bacba-header-avatar" alt="Bác Ba" />
            <div>
              <h2 id="bacba-manual-title" class="bacba-title">CẨM NANG BÁC BA TRUYỀN NGHỀ</h2>
              <div class="bacba-subtitle">Bí quyết đứng bếp & làm giàu Hẻm 1102 (Miền Tây Nam Bộ)</div>
            </div>
          </div>
          <button id="btn-close-bacba-manual" class="btn-modal-close" aria-label="Đóng">✕</button>
        </div>

        <!-- Nội dung cẩm nang cuộn mượt -->
        <div class="bacba-manual-content">
          <!-- Lời ngỏ Bác Ba -->
          <div class="bacba-intro-speech">
            <span class="quote-mark">“</span>
            Mèn đét ơi! Lập nghiệp tiệm gà hổng có khó, cái khó là phải giữ cái tâm vàng giòn với bà con chòm xóm! 
            Bác Ba đứng bếp Chợ Lớn mấy chục năm nay, gom hết kinh nghiệm ruột gan vô đây cho con nè, đọc kỹ đặng buôn may bán đắt nghen!
            <span class="quote-mark">”</span>
          </div>

          <!-- Các mục hướng dẫn -->
          <div class="guide-grid">
            <!-- Mục 1: Bếp Chiên -->
            <div class="guide-card">
              <div class="guide-card-title">
                <img src="${ASSETS.icons.bell}" class="guide-icon" alt="" />
                <span>1. Canh Lửa Vàng Giòn (Chảo Gang)</span>
              </div>
              <p class="guide-card-text">
                Chạm nút <b>+ Gà</b> để thả vào chảo. Nhìn kỹ cây kim đo:
              </p>
              <ul class="guide-list">
                <li><span class="tag-raw">Vùng Sống:</span> Đừng có hấp tấp vớt lên, khách ăn đau bụng là bắt đền đó!</li>
                <li><span class="tag-perfect">Vàng Giòn (PERFECT):</span> Chạm liền vô chảo để nhấc! Giòn rụm thơm lừng, ăn vô là mê mẩn + tiền tip chuỗi!</li>
                <li><span class="tag-burnt">Vùng Cháy:</span> Để lâu quá là khét lẹt đắng nghét, khách chỉ trả nửa giá thôi đó con!</li>
              </ul>
            </div>

            <!-- Mục 2: Dầu Ăn & Vệ Sinh -->
            <div class="guide-card">
              <div class="guide-card-title">
                <img src="${ASSETS.icons.oilCan}" class="guide-icon" alt="" />
                <span>2. Giữ Dầu Vàng Óng — Coi Chừng Công An!</span>
              </div>
              <p class="guide-card-text">
                Dầu chiên chừng 5 mẻ là ngả màu nâu, tới 10 mẻ là đen sì bốc khói khét lẹt. 
                Thấy đèn đỏ nhấp nháy, nhớ bấm <b>Thay dầu 150k</b> liền nghen! 
                Chiên dầu đen là khách chấm 1 sao tẩy chay, công an khu vực ghé phạt tiền, lần thứ ba là bị bắt đi tù đó đa!
              </p>
            </div>

            <!-- Mục 3: Pha Chế & Món Kèm -->
            <div class="guide-card">
              <div class="guide-card-title">
                <img src="${ASSETS.icons.sauce}" class="guide-icon" alt="" />
                <span>3. Sốt Bí Truyền & Rót Nước Tự Động</span>
              </div>
              <p class="guide-card-text">
                Khách gọi gà sốt thì chạm khay <b>Sốt Cay Yangnyeom</b> hoặc <b>Sốt Bơ Tỏi</b> trước khi chiên. 
                Nước ngọt thì khỏi chiên: máy rót tự động bấm cái là chảy vô ly liền. Nhớ kèm thêm khay <b>Củ Cải Muối</b> cho khách đỡ ngấy nghen con!
              </p>
            </div>

            <!-- Mục 4: Tiếp Tế Khẩn Cấp -->
            <div class="guide-card">
              <div class="guide-card-title">
                <img src="${ASSETS.icons.scooter}" class="guide-icon" alt="" />
                <span>4. Hết Hàng Giữa Ca? Đừng Lo!</span>
              </div>
              <p class="guide-card-text">
                Đang bán mà lỡ hết thịt gà tươi, con cứ bấm nút <b>🛵 Tiếp tế +5</b> ngay trên khay sơ chế. 
                Bác Ba với Cô Chôm chạy xe máy qua chở liền 5 miếng gà tươi tiếp tế cấp tốc, hổng bao giờ để con bị kẹt ca bán đâu!
              </p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bacba-manual-footer">
          <button id="btn-bacba-understood" class="btn-hero-pixel btn-full">
            <span>DẠ CON HIỂU RỒI, CẢM ƠN BÁC BA!</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

export function openBacBaManualModal(): void {
  bacBaVoice.speak('manual');
  document.getElementById('bacba-manual-overlay')?.remove();
  document.body.insertAdjacentHTML('beforeend', renderBacBaManualModal());
  const overlay = document.getElementById('bacba-manual-overlay');
  if (!overlay) return;

  const close = () => overlay.remove();
  document.getElementById('btn-close-bacba-manual')?.addEventListener('click', close);
  document.getElementById('btn-bacba-understood')?.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
}
