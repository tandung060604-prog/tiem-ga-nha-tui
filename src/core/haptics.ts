// Haptics Engine for Mobile Web (Vibration API)
// Cung cấp phản hồi xúc giác đồng bộ với âm thanh và hiệu ứng thị giác (Visual Juice)

export const Haptics = {
  // Chạm nút / khay / vòi nước: 1 nhịp nhẹ 10ms chắc tay
  tap: (): void => {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try { navigator.vibrate(10); } catch { /* ignore on security or restricted mode */ }
    }
  },

  // Vi rung sột soạt khi chà cọ khăn lau bàn: 1 nhịp siêu nhẹ 6ms
  tick: (): void => {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try { navigator.vibrate(6); } catch { /* ignore */ }
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
  },

  // Nhận tiền tip hoặc thu hồi vốn nguyên liệu: Rung kép nhẹ nhõm
  coin: (): void => {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try { navigator.vibrate([12, 30, 16]); } catch { /* ignore */ }
    }
  },

  // Rót nước sủi bọt: Rung nhấp nháy 3 nhịp nhẹ mô phỏng dòng chảy bọt ga
  pourDrink: (): void => {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try { navigator.vibrate([8, 15, 8]); } catch { /* ignore */ }
    }
  },

  // Dọn bàn ăn hiên quán: Rung 2 nhịp ấm áp
  cleanTable: (): void => {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try { navigator.vibrate([14, 25, 14]); } catch { /* ignore */ }
    }
  },

  // Chuỗi combo Perfect x2, x3, x5: Rung 3 nhịp tăng dần
  combo: (): void => {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try { navigator.vibrate([15, 25, 20, 25, 30]); } catch { /* ignore */ }
    }
  },

  // Tóm quả tang kẻ gian đóng giả khách: Rung giật mạnh sắc bén
  thiefBusted: (): void => {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try { navigator.vibrate([40, 30, 80]); } catch { /* ignore */ }
    }
  }
};
