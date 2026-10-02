import { GameState } from '../../types/game';
import { GachaRollResult, hireGachaCandidate } from '../../core/staffGacha';
import { audio } from '../../core/audio';
import confetti from 'canvas-confetti';
import { staffImage } from '../../content/assets';

export function openGachaResultModal(
  result: GachaRollResult,
  _state: GameState,
  onUpdateState: (fn: (draft: GameState) => void) => void,
  showToast: (msg: string) => void,
  onComplete: () => void
) {
  // Gỡ bỏ modal cũ nếu có
  const existingModal = document.getElementById('gacha-result-overlay');
  if (existingModal) existingModal.remove();

  const overlay = document.createElement('div');
  overlay.id = 'gacha-result-overlay';
  overlay.className = 'gacha-result-overlay';

  const roleNameMap: Record<string, string> = {
    cook: 'Bếp Chiên',
    waiter: 'Phục Vụ',
    cashier: 'Thu Ngân',
    delivery: 'Giao Hàng',
    manager: 'Quản Lý',
    security: 'Bảo Vệ Giữ Xe'
  };

  const portalClass = result.hasSsr ? 'has-ssr' : (result.hasSr ? 'has-sr' : '');

  // Render danh sách các thẻ bài dạng 3D Flip
  const cardsHtml = result.candidates.map((cand, idx) => {
    const starsHtml = '★'.repeat(cand.stars || 1) + '☆'.repeat(5 - (cand.stars || 1));
    const roleName = roleNameMap[cand.role] || cand.role;
    const modelSrc = staffImage(cand);
    const fallbackSrc = staffImage({ role: cand.role, rarity: cand.rarity });

    return `
      <div class="gacha-card-wrapper" data-index="${idx}">
        <div class="gacha-card-inner" id="gacha-card-inner-${idx}">
          <!-- MẶT LƯNG (ÚP) -->
          <div class="gacha-card-back rarity-glow-${cand.rarity}">
            <div class="card-back-icon">📯</div>
            <div class="card-back-title">HỒ SƠ ỨNG VIÊN #${idx + 1}</div>
            <div class="card-back-hint">👉 Chạm để lật thẻ</div>
          </div>

          <!-- MẶT TRƯỚC (NGỬA) -->
          <div class="gacha-card-front gacha-card rarity-${cand.rarity}" data-cand-index="${idx}">
            <div class="gacha-card-top">
              <div class="gacha-card-avatar-box">
                <img class="gacha-card-avatar-img" src="${modelSrc}" alt="${cand.name}" onerror="this.onerror=null;this.src='${fallbackSrc}';"/>
              </div>
              <div class="gacha-card-info">
                <div class="gacha-card-badge-row">
                  <span class="gacha-rarity-pill">${cand.rarity === 'SSR' ? '👑 HUYỀN THOẠI SSR' : cand.rarity} · ${cand.stars}★</span>
                  <span class="gacha-role-tag">${roleName}</span>
                </div>
                <div class="gacha-card-name">
                  ${cand.name}
                  <span class="gacha-card-stars">${starsHtml}</span>
                </div>
                <div class="gacha-card-title">"${cand.title || 'Nhân viên triển vọng'}"</div>
              </div>
            </div>

            <div class="gacha-card-stats-grid">
              <div class="gacha-stat-item">⚡ Tốc độ: <b>${cand.speed}</b></div>
              <div class="gacha-stat-item">🎯 Tay nghề: <b>${cand.skill}</b></div>
              <div class="gacha-stat-item gacha-stat-bad">💤 Độ lười: <b>${cand.laziness}%</b></div>
              <div class="gacha-stat-item gacha-stat-bad">⚠️ Tỷ lệ sai: <b>${cand.errorRate}%</b></div>
              <div class="gacha-stat-item gacha-stat-good" style="grid-column: span 2;">
                💰 Lương đề xuất: <b>${cand.hourlyWage.toLocaleString('vi-VN')}đ/giờ</b> (ca 8h: ${(cand.hourlyWage * 8).toLocaleString('vi-VN')}đ)
              </div>
            </div>

            ${cand.passiveName ? `
              <div class="gacha-card-passive">
                ✨ <b>${cand.passiveName}:</b> ${cand.passiveDesc}
              </div>
            ` : ''}

            <div class="gacha-card-quote">
              💬 "${cand.quote || 'Em sẵn sàng cống hiến hết mình cho tiệm!'}"
            </div>

            <button class="btn-gacha-pick" data-index="${idx}">
              🤝 Ký Hợp Đồng Kèm Thẻ Này
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  overlay.innerHTML = `
    <div class="gacha-result-header">
      <div class="gacha-portal-box ${portalClass}">
        <div class="gacha-portal-vortex">
          ${result.hasSsr ? '👑' : (result.hasSr ? '🌟' : '📯')}
        </div>
      </div>

      <div class="gacha-result-title">
        ${result.hasSsr ? '✨ HOÀNG KIM HUYỀN THOẠI! ✨' : (result.hasSr ? '🌟 CAO THỦ ỨNG TUYỂN! 🌟' : '📯 KẾT QUẢ CHIÊU MỘ NHÂN SỰ')}
      </div>
      <div class="gacha-result-desc">
        Đã nhận được <b>${result.candidates.length} hồ sơ</b> ứng viên. Chạm từng thẻ bài để mở hoặc bấm nút bên dưới!
      </div>
    </div>

    <button id="btn-gacha-reveal-all" class="btn-gacha-reveal-all">
      ✨ LẬT MỞ TẤT CẢ HỒ SƠ ✨
    </button>

    <div class="gacha-cards-container">
      ${cardsHtml}
    </div>

    <button id="btn-gacha-dismiss" class="btn-gacha-dismiss">
      ❌ Bỏ Qua, Không Ký Hợp Đồng Với Ai
    </button>
  `;

  document.body.appendChild(overlay);

  // Hiệu ứng âm thanh khi mở thẻ
  const triggerCardFx = (candIndex: number) => {
    const cand = result.candidates[candIndex];
    if (!cand) return;
    if (cand.rarity === 'SSR') {
      audio.playGoldChime();
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#facc15', '#fbbf24', '#f59e0b', '#ffffff']
      });
      try { navigator.vibrate?.([80, 50, 120]); } catch {}
    } else if (cand.rarity === 'SR') {
      audio.playHarvestPlop();
      confetti({
        particleCount: 45,
        spread: 50,
        origin: { y: 0.5 },
        colors: ['#c084fc', '#a855f7', '#9333ea', '#ffffff']
      });
      try { navigator.vibrate?.([60, 40, 80]); } catch {}
    } else {
      audio.playPop();
    }
  };

  // Lật từng thẻ khi bấm vào thẻ bài
  overlay.querySelectorAll('.gacha-card-wrapper').forEach(wrapper => {
    wrapper.addEventListener('click', (e) => {
      // Nếu click vào nút pick hoặc dismiss thì không lật
      if ((e.target as HTMLElement).closest('.btn-gacha-pick')) return;

      const idx = parseInt(wrapper.getAttribute('data-index') || '0', 10);
      const inner = wrapper.querySelector('.gacha-card-inner');
      if (inner && !inner.classList.contains('is-flipped')) {
        inner.classList.add('is-flipped');
        triggerCardFx(idx);
      }
    });
  });

  // Lật toàn bộ thẻ với delay tuần tự
  const revealAllBtn = overlay.querySelector('#btn-gacha-reveal-all');
  if (revealAllBtn) {
    revealAllBtn.addEventListener('click', () => {
      revealAllBtn.setAttribute('disabled', 'true');
      (revealAllBtn as HTMLElement).style.display = 'none';

      const wrappers = overlay.querySelectorAll('.gacha-card-wrapper');
      wrappers.forEach((wrapper, i) => {
        setTimeout(() => {
          const inner = wrapper.querySelector('.gacha-card-inner');
          if (inner && !inner.classList.contains('is-flipped')) {
            inner.classList.add('is-flipped');
            triggerCardFx(i);
          }
        }, i * 150);
      });
    });
  }

  // Xử lý chọn 1 ứng viên ký hợp đồng
  overlay.querySelectorAll('.btn-gacha-pick').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-index') || '0', 10);
      const chosen = result.candidates[idx];
      if (!chosen) return;

      onUpdateState(draft => {
        const hireRes = hireGachaCandidate(draft, chosen);
        if (!hireRes.success) {
          showToast(hireRes.error || 'Lỗi khi ký hợp đồng!');
        } else {
          audio.playPerfect();
          showToast(`🎉 Đã ký hợp đồng với ${chosen.name} [${chosen.rarity} · ${chosen.stars}★]!`);
        }
      });

      overlay.remove();
      onComplete();
    });
  });

  // Xử lý bỏ qua
  const dismissBtn = overlay.querySelector('#btn-gacha-dismiss');
  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      audio.playPop();
      overlay.remove();
      showToast('Đã giữ nguyên danh sách nhân sự hiện tại.');
      onComplete();
    });
  }
}
