import { ASSETS } from '../../content/assets';

export function renderKitchenGuideModal(): string {
  return `
    <div class="kitchen-guide-modal" style="text-align: left; display: flex; flex-direction: column; gap: 12px; max-height: 80vh; overflow-y: auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--pixel-wood-dark, #5a3516); padding-bottom: 8px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 1.4rem;">📖</span>
          <div>
            <h3 style="margin: 0; font-size: 1.15rem; font-weight: 900; color: var(--pixel-wood-dark, #5a3516);">SỔ TAY BẾP TRƯỞNG</h3>
            <div style="font-size: 0.72rem; color: #78350f;">Bí kíp chiên gà vàng giòn 5 sao chuẩn Hẻm 1102</div>
          </div>
        </div>
        <button id="btn-close-kitchen-guide" style="border: 0; background: none; font-size: 1.3rem; cursor: pointer; padding: 4px 8px; color: #5a3516; font-weight: 800;">✕</button>
      </div>

      <!-- Section 1: Kỹ Thuật Chiên Vàng Giòn -->
      <div style="background: #fffbeb; border: 1.5px solid #f59e0b; border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 6px;">
        <div style="font-weight: 800; font-size: 0.88rem; color: #92400e; display: flex; align-items: center; gap: 6px;">
          <img src="${ASSETS.icons.chickenCrispy}" style="width: 22px; height: 22px;" alt="" />
          <span>1. CĂN NHIỆT VÀNG GIÒN (⭐ PERFECT)</span>
        </div>
        <div style="font-size: 0.75rem; color: #78350f; line-height: 1.4;">
          Thả gà vào chảo sôi 180°C. Quan sát thanh đo nhịp tim chiên gà:
          <ul style="margin: 4px 0 2px 18px; padding: 0;">
            <li><b>Xanh Lá (Giữa)</b>: Vớt đúng lúc đạt ⭐ <b>Vàng Giòn Hoàn Hảo</b> (+tip, +chuỗi combo).</li>
            <li><b>Vàng (Cận kề)</b>: Vừa chín tới (khách hài lòng bình thường).</li>
            <li><b>Đỏ (Quá lửa)</b>: Cháy khét (-50% giá tiền, khách phàn nàn trừ sao!).</li>
          </ul>
        </div>
      </div>

      <!-- Section 2: Ướp Sốt & Món Phụ -->
      <div style="background: #fdf2f8; border: 1.5px solid #ec4899; border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 6px;">
        <div style="font-weight: 800; font-size: 0.88rem; color: #9d174d; display: flex; align-items: center; gap: 6px;">
          <img src="${ASSETS.icons.chickenSpicy}" style="width: 22px; height: 22px;" alt="" />
          <span>2. ƯỚP SỐT ĐẬM ĐÀ & NƯỚC GIẢI KHÁT</span>
        </div>
        <div style="font-size: 0.75rem; color: #831843; line-height: 1.4;">
          Khách gọi cánh cay hoặc bơ tỏi: Hãy bấm nút <b>🌶️ Sốt Cay</b> hoặc <b>🧄 Bơ Tỏi</b> trước khi chiên.
          Đừng quên rót kèm <b>🥤 Nước ngọt có ga mát lạnh</b> để giải ngấy dầu, giúp tăng điểm sao Vệ sinh & Hương vị!
        </div>
      </div>

      <!-- Section 3: Bí Kíp Can Dầu -->
      <div style="background: #f0fdf4; border: 1.5px solid #22c55e; border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 6px;">
        <div style="font-weight: 800; font-size: 0.88rem; color: #166534; display: flex; align-items: center; gap: 6px;">
          <img src="${ASSETS.icons.oilCan}" style="width: 22px; height: 22px;" alt="" />
          <span>3. BẢO VỆ CHẢO DẦU & TRỢ GIÁ BÁC BA</span>
        </div>
        <div style="font-size: 0.75rem; color: #14532d; line-height: 1.4;">
          Dầu sau khi chiên nhiều mẻ sẽ chuyển từ <b>Vàng óng ➜ Nâu sẫm ➜ Đen khét</b>.
          Chiên bằng dầu đen sẽ làm cháy khét món ăn và bị công an kiểm tra xử phạt.<br/>
          💡 <b>Đặc quyền tân thủ:</b> Trong Ngày 1 đến Ngày 3, Bác Ba tặng <b>1 can dầu sạch miễn phí 100% (0đ)</b> khi dầu bị bẩn!
        </div>
      </div>

      <button id="btn-close-kitchen-guide-bottom" class="pixel-btn is-primary" style="width: 100%; min-height: 44px; font-weight: 800; font-size: 0.88rem; margin-top: 4px;">
        👨‍🍳 ĐÃ HIỂU, TIẾP TỤC CHIÊN GÀ!
      </button>
    </div>
  `;
}
