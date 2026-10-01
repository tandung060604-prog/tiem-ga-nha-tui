import { GameState } from '../types/game';
import { getInviteUrl, getQrCodeUrl } from './leaderboard';

export interface PosterOptions {
  state: GameState;
  roomId: string;
  inviteUrl?: string;
  qrCodeUrl?: string;
}

/**
 * Tạo tấm Poster mời bạn bè chuẩn tỉ lệ Story 9:16 (540x960) phong cách Retro Pixel Stardew Valley
 * để người chơi dễ dàng chia sẻ lên Zalo, Facebook Story, Threads hoặc tin nhắn nhóm.
 */
export async function generateLobbyPosterCanvas(options: PosterOptions): Promise<HTMLCanvasElement> {
  const { state, roomId } = options;
  const inviteUrl = options.inviteUrl || getInviteUrl(roomId);
  const qrCodeUrl = options.qrCodeUrl || getQrCodeUrl(inviteUrl);

  const width = 540;
  const height = 960;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Không thể khởi tạo Canvas 2D Context');

  // 1. NỀN GỖ VINTAGE STARDEW VALLEY
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#2d1408');
  bgGrad.addColorStop(0.5, '#451a03');
  bgGrad.addColorStop(1, '#1f0d05');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. KHUNG VIỀN NGHỆ THUẬT GỖ & VÀNG KIM
  ctx.strokeStyle = '#d4a373';
  ctx.lineWidth = 8;
  ctx.strokeRect(16, 16, width - 32, height - 32);

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.strokeRect(24, 24, width - 48, height - 48);

  // Họa tiết góc pixel
  const cornerSize = 16;
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(16, 16, cornerSize, cornerSize);
  ctx.fillRect(width - 16 - cornerSize, 16, cornerSize, cornerSize);
  ctx.fillRect(16, height - 16 - cornerSize, cornerSize, cornerSize);
  ctx.fillRect(width - 16 - cornerSize, height - 16 - cornerSize, cornerSize, cornerSize);

  // 3. TOP BANNER & MASCOT
  ctx.fillStyle = '#fef3c7';
  ctx.font = 'bold 15px "Courier New", monospace, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🍗 TIỆM GÀ NHÀ TUI • HẺM 1102 SÀI GÒN 🍗', width / 2, 60);

  // Huy hiệu Đua Top 4 Người
  ctx.fillStyle = '#b45309';
  roundRect(ctx, width / 2 - 170, 78, 340, 32, 8);
  ctx.fill();
  ctx.strokeStyle = '#fef3c7';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#fffbeb';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('🏆 ĐUA TOP LOBBY 4 NGƯỜI CHƠI THẬT 🏆', width / 2, 99);

  // 4. TIÊU ĐỀ TÊN TIỆM GÀ CỦA CHỦ PHÒNG
  const shopName = state.shopName || 'Tiệm Gà Nhà Tui';
  ctx.fillStyle = '#fbbf24';
  ctx.font = '900 28px sans-serif';
  ctx.fillText(shopName.toUpperCase(), width / 2, 155);

  ctx.fillStyle = '#fde68a';
  ctx.font = 'italic 13px sans-serif';
  ctx.fillText('Thử Thách Kinh Doanh & Đua Top Doanh Số Thời Gian Thực', width / 2, 180);

  // 5. KHUNG TRUNG TÂM CHỨA MÃ QR (CARD CHÍNH)
  const cardX = 45;
  const cardY = 205;
  const cardW = width - 90;
  const cardH = 430;

  // Đổ bóng thẻ
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  roundRect(ctx, cardX + 4, cardY + 6, cardW, cardH, 16);
  ctx.fill();

  // Nền thẻ kem vintage
  ctx.fillStyle = '#faeed1';
  roundRect(ctx, cardX, cardY, cardW, cardH, 16);
  ctx.fill();
  ctx.strokeStyle = '#7c4f32';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Badge Mã Phòng
  ctx.fillStyle = '#5a3018';
  roundRect(ctx, width / 2 - 130, cardY + 20, 260, 36, 18);
  ctx.fill();

  ctx.fillStyle = '#fef3c7';
  ctx.font = 'bold 14px monospace, sans-serif';
  ctx.fillText(`MÃ PHÒNG: ${roomId.toUpperCase()}`, width / 2, cardY + 43);

  // Vẽ hình ảnh QR Code vào giữa thẻ
  const qrSize = 230;
  const qrX = width / 2 - qrSize / 2;
  const qrY = cardY + 75;

  // Nền trắng cho QR
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 12);
  ctx.fill();
  ctx.strokeStyle = '#d4a373';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Tải và vẽ ảnh QR Code
  try {
    const qrImg = await loadImage(qrCodeUrl);
    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
  } catch {
    // Fallback nếu offline hoặc lỗi mạng: vẽ placeholder QR pixel art
    ctx.fillStyle = '#5a3018';
    ctx.fillRect(qrX + 10, qrY + 10, qrSize - 20, qrSize - 20);
    ctx.fillStyle = '#faeed1';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('MÃ PHÒNG: ' + roomId, width / 2, qrY + qrSize / 2);
  }

  // Dòng kêu gọi quét mã
  ctx.fillStyle = '#451a03';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText('📸 QUÉT MÃ ĐỂ VÀO PHÒNG NGAY!', width / 2, cardY + 348);

  ctx.fillStyle = '#78350f';
  ctx.font = '12px sans-serif';
  ctx.fillText('Mở Camera điện thoại hoặc Zalo quét mã QR', width / 2, cardY + 372);
  ctx.fillText('Trực tiếp tranh tài xếp hạng cùng chủ tiệm', width / 2, cardY + 392);

  // 6. THẺ THÔNG TIN CHỦ PHÒNG (STATUS STRIP)
  const statY = 655;
  ctx.fillStyle = '#3c1d0f';
  roundRect(ctx, cardX, statY, cardW, 145, 12);
  ctx.fill();
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Tiêu đề thống kê
  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('⭐ THÀNH TÍCH CHỦ TIỆM HIỆN TẠI ⭐', width / 2, statY + 28);

  // 3 Cột thống kê
  const colW = cardW / 3;
  const colY = statY + 60;

  // Cột 1: Cấp độ / Ngày
  ctx.fillStyle = '#fef3c7';
  ctx.font = '12px sans-serif';
  ctx.fillText('TIẾN ĐỘ', cardX + colW * 0.5, colY);
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText(`Ch. ${state.currentChapter || 1} • Ng. ${state.day || 1}`, cardX + colW * 0.5, colY + 24);

  // Cột 2: Tài sản
  ctx.fillStyle = '#fef3c7';
  ctx.font = '12px sans-serif';
  ctx.fillText('TỔNG TÀI SẢN', cardX + colW * 1.5, colY);
  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 16px sans-serif';
  const moneyStr = (state.money || 0).toLocaleString('vi-VN') + 'đ';
  ctx.fillText(moneyStr, cardX + colW * 1.5, colY + 24);

  // Cột 3: Đánh giá
  ctx.fillStyle = '#fef3c7';
  ctx.font = '12px sans-serif';
  ctx.fillText('DANH TIẾNG', cardX + colW * 2.5, colY);
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 16px sans-serif';
  const stars = (state.ratings?.overall || 4.5).toFixed(1);
  ctx.fillText(`${stars} ★★★★★`, cardX + colW * 2.5, colY + 24);

  // Lời nhắn gửi
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'italic 11px sans-serif';
  ctx.fillText('"Gà chiên giòn rụm • Nước sốt bí truyền đậm tình Hẻm 1102"', width / 2, statY + 125);

  // 7. FOOTER HƯỚNG DẪN
  ctx.fillStyle = '#d4a373';
  ctx.font = '12px sans-serif';
  ctx.fillText('🌐 Chơi trực tiếp trên mọi trình duyệt điện thoại', width / 2, height - 90);
  ctx.fillText('Không cần cài đặt ứng dụng • Tự động lưu tiến trình', width / 2, height - 70);

  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('🍗 TIỆM GÀ NHÀ TUI • SÀI GÒN FOOD TYCOON 🍗', width / 2, height - 42);

  return canvas;
}

/**
 * Tải trực tiếp poster phòng 9:16 về thiết bị của người chơi
 */
export async function downloadLobbyPoster(options: PosterOptions): Promise<void> {
  const canvas = await generateLobbyPosterCanvas(options);
  const dataUrl = canvas.toDataURL('image/png');

  const link = document.createElement('a');
  link.download = `tiem-ga-nha-tui-phong-${options.roomId.toLowerCase()}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Helper: Tải ảnh qua Image Object
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image from ${url}`));
    img.src = url;
  });
}

// Helper: Bo góc Canvas
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
