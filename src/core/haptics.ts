// Haptics Engine for Mobile Web (Vibration API)
// Cung cấp phản hồi xúc giác đồng bộ với âm thanh và hiệu ứng thị giác (Visual Juice)

export const Haptics = {
  // Chạm nút / khay / vòi nước: 1 nhịp nhẹ 10ms chắc tay
  tap: (): void => {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try { navigator.vibrate(10); } catch { /* ignore on security or restricted mode */ }
    }
  },

  // Vớt mẻ gà Vàng Giòn (Perfect): Rung 1 nhịp giòn tan sắc nét 18ms
  perfect: (): void => {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try { navigator.vibrate(18); } catch { /* ignore */ }
    }
  },

  // Giao đơn thành công, tiền về ví: Rung kép 2 nhịp vui vẻ
  serveSuccess: (): void => {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try { navigator.vibrate([18, 40, 22]); } catch { /* ignore */ }
    }
  },

  // Gà bị cháy khét hoặc khách bỏ đi: Rung trầm kép cảnh báo
  warning: (): void => {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try { navigator.vibrate([60, 40, 60]); } catch { /* ignore */ }
    }
  }
};
