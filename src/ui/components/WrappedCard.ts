import { WrappedData } from '../../core/wrapped';
import { ASSETS, foodImage } from '../../content/assets';

// Vẽ thẻ "Gà Wrapped" 1080×1350 lên canvas theo mẫu của Gemini (docs/gemini/ga-wrapped-specs.md),
// rồi chia sẻ ảnh qua Web Share API (iOS/Android) hoặc tải về (máy tính).

const W = 1080;
const H = 1350;

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  // ctx.roundRect chỉ có từ Safari 16 → tự vẽ để chạy trên iOS 14–15
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function loadImage(src: string | null | undefined): Promise<HTMLImageElement | null> {
  if (!src) return Promise.resolve(null);
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null); // thiếu ảnh vẫn vẽ được thẻ
    img.src = src;
  });
}

// Ngắt dòng theo độ rộng; tối đa `maxLines` dòng (dòng cuối thêm "…")
function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = test;
  }
  if (line) lines.push(line);
  const shown = lines.slice(0, maxLines);
  if (lines.length > maxLines) shown[maxLines - 1] = `${shown[maxLines - 1]!.replace(/\s+\S*$/, '')}…`;
  shown.forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight));
}

const money = (v: number) => `${Math.round(v).toLocaleString('vi-VN')}đ`;

export async function drawWrapped(data: WrappedData): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // Font của game phải tải xong trước khi vẽ, nếu không canvas dùng font hệ thống
  try {
    await Promise.all([
      document.fonts.load('800 64px "Baloo 2"'),
      document.fonts.load('600 24px "Be Vietnam Pro"')
    ]);
  } catch { /* không có Font Loading API: vẫn vẽ */ }
  const [logo, food, mascot] = await Promise.all([
    loadImage(ASSETS.ui.changChickenLogo),
    loadImage(data.topDish ? foodImage(data.topDish.id, 'perfect') : null),
    loadImage(ASSETS.gabong.front)
  ]);

  // Nền + khung
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#fdf6ec');
  bg.addColorStop(0.5, '#faecd7');
  bg.addColorStop(1, '#f5dfc0');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#e0c29a';
  ctx.lineWidth = 16;
  roundRect(ctx, 16, 16, W - 32, H - 32, 36);
  ctx.stroke();

  // Mái hiên sọc đỏ - trắng
  for (let x = 24, i = 0; x < W - 24; x += 45, i++) {
    ctx.fillStyle = i % 2 ? '#ffffff' : '#e63946';
    ctx.fillRect(x, 24, Math.min(45, W - 24 - x), 30);
  }

  // Header: logo, tên quán, huy hiệu chương
  if (logo) ctx.drawImage(logo, 50, 66, 90, 90);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#2b1d1f';
  ctx.font = 'bold 44px "Baloo 2", sans-serif';
  ctx.fillText(data.shopName, 160, 112, 420); // maxWidth: tên dài thì canvas tự nén, không đè huy hiệu
  ctx.fillStyle = '#8c6248';
  ctx.font = '600 24px "Be Vietnam Pro", sans-serif';
  ctx.fillText(`Tuần ${data.week} · Ngày ${data.fromDay}–${data.toDay} · Hẻm 1102`, 160, 148);
  // Huy hiệu chương: rộng theo chữ, canh phải; chữ dài quá thì thu nhỏ font (tên chương dài nhất ~20 ký tự)
  const badge = `CHƯƠNG ${data.chapter} · ${data.chapterTitle}`;
  let badgeFont = 22;
  ctx.font = `bold ${badgeFont}px "Be Vietnam Pro", sans-serif`;
  while (ctx.measureText(badge).width > 400 && badgeFont > 14) ctx.font = `bold ${--badgeFont}px "Be Vietnam Pro", sans-serif`;
  const badgeW = ctx.measureText(badge).width + 44;
  ctx.fillStyle = '#e63946';
  roundRect(ctx, 1040 - badgeW, 86, badgeW, 50, 25);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(badge, 1040 - badgeW / 2, 119);

  // Tiêu đề + danh hiệu
  ctx.fillStyle = '#c2410c';
  ctx.font = 'bold 24px "Be Vietnam Pro", sans-serif';
  ctx.fillText('✨ BÁO CÁO TỔNG KẾT TUẦN ✨', W / 2, 218);
  ctx.fillStyle = '#e63946';
  ctx.font = '900 64px "Baloo 2", sans-serif';
  ctx.fillText('GÀ WRAPPED CỦA BẠN', W / 2, 288);
  const honor = ctx.createLinearGradient(90, 0, 990, 0);
  honor.addColorStop(0, '#fffcf5');
  honor.addColorStop(1, '#ffedd5');
  ctx.fillStyle = honor;
  roundRect(ctx, 90, 315, 900, 80, 22);
  ctx.fill();
  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = '#9a3412';
  ctx.font = 'bold 32px "Baloo 2", sans-serif';
  ctx.fillText(`🏆 ${data.title}`, W / 2, 352);
  ctx.fillStyle = '#b45309';
  ctx.font = '600 20px "Be Vietnam Pro", sans-serif';
  ctx.fillText(data.titleDesc, W / 2, 382);

  // 4 thẻ chỉ số
  const stat = (x: number, y: number, label: string, value: string, color: string, note: string) => {
    ctx.fillStyle = '#ffffff';
    roundRect(ctx, x, y, 460, 160, 24);
    ctx.fill();
    ctx.strokeStyle = '#e8d2b7';
    ctx.lineWidth = 3.5;
    ctx.stroke();
    ctx.textAlign = 'left';
    ctx.fillStyle = '#8c6248';
    ctx.font = '600 24px "Be Vietnam Pro", sans-serif';
    ctx.fillText(label, x + 28, y + 44);
    ctx.fillStyle = color;
    ctx.font = 'bold 50px "Baloo 2", sans-serif';
    ctx.fillText(value, x + 28, y + 104);
    ctx.fillStyle = '#a8795d';
    ctx.font = '500 20px "Be Vietnam Pro", sans-serif';
    ctx.fillText(note, x + 28, y + 140);
  };
  stat(60, 420, '💰 DOANH THU TUẦN', money(data.revenue), '#d97706', `Lãi ${money(data.profit)}`);
  stat(560, 420, '🍗 MẺ GÀ ĐÃ CHIÊN', `${data.fried} mẻ`, '#dc2626', `Tỉ lệ Perfect ${data.perfectPct}%`);
  stat(60, 600, '👥 KHÁCH ĐÃ PHỤC VỤ', `${data.served} khách`, '#15803d', `Đánh giá ${data.stars.toFixed(1)} / 5 ⭐`);
  stat(560, 600, '🔥 CHUỖI PERFECT DÀI NHẤT', `x${data.bestStreak}`, '#d97706', data.bestStreak >= 5 ? 'Đôi tay vàng Chợ Lớn 👨‍🍳' : 'Tuần sau phá kỷ lục nha!');

  // Món ruột + review
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, 60, 790, 960, 190, 26);
  ctx.fill();
  ctx.strokeStyle = '#f4a261';
  ctx.lineWidth = 3.5;
  ctx.stroke();
  if (food) ctx.drawImage(food, 85, 817, 135, 135);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#e63946';
  ctx.font = 'bold 20px "Be Vietnam Pro", sans-serif';
  ctx.fillText("⭐ MÓN 'RUỘT' CỦA TUẦN", 245, 830);
  ctx.fillStyle = '#2b1d1f';
  ctx.font = 'bold 34px "Baloo 2", sans-serif';
  ctx.fillText(data.topDish ? `${data.topDish.name} (${data.topDish.count} phần)` : 'Gà Giòn Nhà Tui', 245, 874);
  ctx.fillStyle = '#633e25';
  ctx.font = 'italic 22px "Be Vietnam Pro", sans-serif';
  if (data.quote) wrapText(ctx, `"${data.quote.text}" — ${data.quote.author}`, 245, 912, 740, 30, 2);

  // Gà Bông + lời nhắn + con dấu
  if (mascot) ctx.drawImage(mascot, 70, 1005, 110, 110);
  ctx.fillStyle = '#734c34';
  ctx.font = 'bold 22px "Be Vietnam Pro", sans-serif';
  wrapText(ctx, 'Cảm ơn bạn đã thức khuya dậy sớm chiên gà cùng tiệm! Hẻm 1102 ấm áp lên nhiều là nhờ bạn đó!', 200, 1045, 640, 32, 3);
  ctx.save();
  ctx.translate(955, 1065);
  ctx.rotate((-8 * Math.PI) / 180);
  ctx.strokeStyle = '#c0392b';
  ctx.lineWidth = 4;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.arc(0, 0, 60, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#c0392b';
  ctx.textAlign = 'center';
  ctx.font = 'bold 15px "Be Vietnam Pro", sans-serif';
  ['CHỨNG NHẬN', 'TIỆM GÀ', 'CHUẨN VỊ', '★★★★★'].forEach((t, i) => ctx.fillText(t, 0, -24 + i * 19));
  ctx.restore();

  // Chân trang
  ctx.fillStyle = '#2b1d1f';
  roundRect(ctx, 16, 1180, W - 32, 154, 28);
  ctx.fill();
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffd166';
  ctx.font = 'bold 28px "Baloo 2", sans-serif';
  ctx.fillText('🐣 Tiệm Gà Nhà Tui · Game quản lý tiệm gà Sài Gòn', 50, 1245);
  ctx.fillStyle = '#d6c5b6';
  ctx.font = '500 20px "Be Vietnam Pro", sans-serif';
  ctx.fillText('Chơi ngay trên web, không cần cài đặt', 50, 1285);
  return canvas;
}

export type ShareOutcome = 'shared' | 'downloaded' | 'cancelled';

// Web Share có ảnh (iOS 15+, Android) → bảng chia sẻ của máy (Threads, Instagram, Zalo…); không có → tải ảnh về
export async function shareWrapped(canvas: HTMLCanvasElement, data: WrappedData): Promise<ShareOutcome> {
  const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
  if (!blob) return 'cancelled';
  return shareImage(blob, `ga-wrapped-tuan-${data.week}.png`, 'Gà Wrapped',
    `Tuần ${data.week} của ${data.shopName}: ${data.served} khách, ${data.perfectPct}% gà Perfect 🍗 #TiemGaNhaTui`);
}

// Chia sẻ MỘT lần: có bảng chia sẻ ảnh thì dùng, không có mới tải về (trước đây làm cả hai cùng lúc,
// và thu hồi link ngay sau click → iOS tải hỏng)
export async function shareImage(blob: Blob, filename: string, title: string, text: string): Promise<ShareOutcome> {
  const file = new File([blob], filename, { type: 'image/png' });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text, title });
      return 'shared';
    } catch {
      return 'cancelled'; // người chơi đóng bảng chia sẻ
    }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  return 'downloaded';
}
