import { GameState } from '../../types/game';
import { getOrCreatePetPatio, PATIO_UPGRADE_COSTS } from '../../core/petPatioSystem';
import { escapeHtml } from '../escapeHtml';

/**
 * Render Modal Góc Thú Cưng Hiên Quán (Pet Patio Modal)
 */
export function renderPetPatioModal(state: GameState): string {
  const patio = getOrCreatePetPatio(state);
  const nextLevel = patio.patioLevel + 1;
  const nextUpgrade = PATIO_UPGRADE_COSTS[nextLevel];

  const patioTitles: Record<number, string> = {
    1: 'Góc Nệm Cói Hiên Quán (Cấp 1)',
    2: 'Chòi Gỗ Mái Ngói Vintage (Cấp 2)',
    3: 'Biệt Thự Thú Cưng Hẻm 1102 (Cấp 3 - Cực Phẩm)',
  };

  const petsHtml = patio.pets.map(pet => {
    const isDog = pet.type === 'dog';
    const petActionBtnText = pet.pettedToday
      ? '❤️ Đã Cưng Nựng Hôm Nay'
      : isDog
      ? '✋ Xoa Đầu & Gãi Tai 🐕'
      : '🐾 Gãi Cằm & Nựng Má 🐈';

    return `
      <div style="background: #ffffff; border: 2px solid ${isDog ? '#f59e0b' : '#ec4899'}; border-radius: 12px; padding: 12px; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 3px 8px rgba(0,0,0,0.06);">
        
        <div style="display: flex; gap: 10px; align-items: center;">
          <div style="position: relative; width: 56px; height: 56px; flex-shrink: 0;">
            <img src="${pet.avatar}" alt="${escapeHtml(pet.name)}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 2px solid ${isDog ? '#b45309' : '#be185d'}; background: #fffbeb;" />
            <span style="position: absolute; bottom: -2px; right: -2px; font-size: 1.1rem; background: #fff; border-radius: 50%; padding: 1px;">
              ${isDog ? '🐕' : '🐈'}
            </span>
          </div>
          
          <div style="flex: 1; min-width: 0;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.9rem; font-weight: 900; color: #451a03;">${escapeHtml(pet.name)}</span>
              <span style="font-size: 0.7rem; font-weight: 800; color: #d97706; background: #fef3c7; padding: 2px 6px; border-radius: 6px;">
                💖 ${pet.happiness}% Hạnh Phúc
              </span>
            </div>

            <!-- Thanh đo hạnh phúc -->
            <div style="width: 100%; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden; margin-top: 4px;">
              <div style="width: ${pet.happiness}%; height: 100%; background: linear-gradient(90deg, #f59e0b, #ec4899); border-radius: 4px; transition: width 0.3s ease;"></div>
            </div>

            <div style="font-size: 0.68rem; color: #6b7280; font-style: italic; margin-top: 4px; line-height: 1.3;">
              ${escapeHtml(pet.statusText)}
            </div>
          </div>
        </div>

        <!-- Năng lực nội tại của thú cưng -->
        <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 6px; padding: 6px 8px; font-size: 0.7rem; color: #166534; font-weight: 700; display: flex; align-items: center; gap: 6px;">
          <span>🛡️ Năng Lực:</span>
          <span>${escapeHtml(pet.perkDescription)}</span>
        </div>

        <!-- Nút Tương Tác Xoa Đầu / Petting -->
        <button class="btn-pet-action ${pet.pettedToday ? 'disabled' : ''}" data-pet-id="${pet.id}" ${pet.pettedToday ? 'disabled' : ''} style="width: 100%; padding: 8px; font-size: 0.82rem; font-weight: 800; border-radius: 8px; border: 1.5px solid ${isDog ? '#b45309' : '#be185d'}; background: ${pet.pettedToday ? '#e5e7eb' : isDog ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #ec4899, #db2777)'}; color: ${pet.pettedToday ? '#9ca3af' : '#fff'}; cursor: ${pet.pettedToday ? 'not-allowed' : 'pointer'}; box-shadow: ${pet.pettedToday ? 'none' : '0 3px 0 rgba(0,0,0,0.2)'};">
          ${petActionBtnText}
        </button>

      </div>
    `;
  }).join('');

  return `
    <div id="modal-pet-patio" class="modal-backdrop" style="display: flex; align-items: center; justify-content: center; z-index: 1060; padding: 10px;">
      <div class="modal-box retro-card" style="width: 100%; max-width: 440px; max-height: 90vh; display: flex; flex-direction: column; background: #fffdf5; border: 3px solid #78350f; border-radius: 14px; box-shadow: 0 12px 35px rgba(0,0,0,0.45); overflow: hidden;">
        
        <!-- Header Modal -->
        <div style="background: linear-gradient(135deg, #b45309, #78350f); color: #fff; padding: 12px 14px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #451a03;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.6rem;">🏡</span>
            <div>
              <div style="font-size: 0.95rem; font-weight: 900; color: #fef08a;">
                GÓC THÚ CƯNG HIÊN QUÁN
              </div>
              <div style="font-size: 0.68rem; color: #fde68a;">
                ${escapeHtml(patioTitles[patio.patioLevel] ?? 'Góc Hiên')}
              </div>
            </div>
          </div>
          <button id="btn-close-pet-patio" class="btn-close" style="background: #78350f; border: 1.5px solid #fef08a; border-radius: 50%; width: 28px; height: 28px; color: #fff; font-weight: 900; cursor: pointer;">
            ✕
          </button>
        </div>

        <!-- Thân Modal -->
        <div style="flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 10px;">
          
          <div style="font-size: 0.72rem; color: #78350f; font-style: italic; text-align: center;">
            🐾 Chăm sóc Cậu Vàng & Bé Mướp mỗi ngày để tăng Tình Thân Hẻm và kích hoạt năng lực canh trộm, diệt chuột!
          </div>

          <!-- Danh sách thú cưng -->
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${petsHtml}
          </div>

          <!-- Khu vực Nâng Cấp Hiên Nhà -->
          <div style="background: #fef3c7; border: 1.5px dashed #d97706; border-radius: 10px; padding: 10px; margin-top: 4px; display: flex; flex-direction: column; gap: 6px;">
            <div style="font-size: 0.78rem; font-weight: 800; color: #78350f;">
              🔨 NÂNG CẤP KHÔNG GIAN HIÊN QUÁN:
            </div>
            
            ${nextUpgrade ? `
              <div style="font-size: 0.72rem; color: #92400e;">
                Cấp tiếp theo: <b>${escapeHtml(nextUpgrade.title)}</b><br/>
                <span style="color: #047857; font-weight: 700;">✨ ${escapeHtml(nextUpgrade.perk)}</span>
              </div>
              <button id="btn-upgrade-pet-patio" class="btn-sm" style="padding: 8px 12px; font-size: 0.8rem; font-weight: 900; background: linear-gradient(135deg, #10b981, #059669); color: #fff; border: 1.5px solid #047857; border-radius: 8px; cursor: pointer; box-shadow: 0 3px 0 #047857;">
                Nâng Cấp (-${nextUpgrade.cost.toLocaleString('vi-VN')}đ)
              </button>
            ` : `
              <div style="font-size: 0.72rem; color: #047857; font-weight: 800;">
                🎉 Đã nâng cấp tối đa! Biệt Thự Thú Cưng Hẻm 1102 đã trở thành điểm đến thu hút nhất xóm!
              </div>
            `}
          </div>

        </div>

      </div>
    </div>
  `;
}
