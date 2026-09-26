import { CustomerReview, GameState, DayLedger } from '../../types/game';

export class ShareCardEngine {
  public static async generateReviewCardBlob(
    review: CustomerReview,
    state: GameState,
    ledger: DayLedger
  ): Promise<Blob | null> {
    const canvas = document.getElementById('share-canvas') as HTMLCanvasElement;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const width = 1080;
    const height = 1350;
    canvas.width = width;
    canvas.height = height;

    // 1. Background with warm cream gradient
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#fdf3e4');
    bgGradient.addColorStop(1, '#f8e6ce');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Decorative inner border
    ctx.strokeStyle = '#ead7bd';
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    // 2. Striped Awning at top
    const stripeWidth = 60;
    const awningHeight = 70;
    for (let x = 37; x < width - 37; x += stripeWidth) {
      ctx.fillStyle = ((x / stripeWidth) % 2 === 0) ? '#e63946' : '#ffffff';
      ctx.fillRect(x, 37, stripeWidth, awningHeight);
    }

    // 3. Header Shop Name & Mascot
    ctx.fillStyle = '#3d2c2e';
    ctx.font = 'bold 54px "Baloo 2", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`🍗 ${state.shopName}`, width / 2, 190);

    ctx.font = '600 32px "Be Vietnam Pro", sans-serif';
    ctx.fillStyle = '#8a6452';
    ctx.fillText(`Tổng kết Ngày ${state.day} · Chương ${state.currentChapter}`, width / 2, 245);

    // 4. Highlight Review Box
    const boxX = 80;
    const boxY = 300;
    const boxW = width - 160;
    const boxH = 500;

    // Box shadow
    ctx.fillStyle = 'rgba(61, 44, 46, 0.08)';
    ctx.beginPath();
    ctx.roundRect(boxX + 6, boxY + 8, boxW, boxH, 28);
    ctx.fill();

    // Box background
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, 28);
    ctx.fill();

    ctx.strokeStyle = '#f4a261';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Badge: "REVIEW VIRAL CỦA NGÀY"
    ctx.fillStyle = '#e63946';
    ctx.beginPath();
    ctx.roundRect(boxX + 40, boxY - 24, 380, 48, 24);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px "Baloo 2", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🔥 REVIEW THREADS CỦA NGÀY', boxX + 230, boxY + 9);

    // Review Author Info
    ctx.textAlign = 'left';
    ctx.font = '60px sans-serif';
    ctx.fillText(review.avatar, boxX + 40, boxY + 110);

    ctx.fillStyle = '#3d2c2e';
    ctx.font = 'bold 38px "Baloo 2", sans-serif';
    ctx.fillText(review.authorName, boxX + 130, boxY + 95);

    // Star Rating
    ctx.fillStyle = '#ffd166';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText('★'.repeat(review.stars) + '☆'.repeat(5 - review.stars), boxX + 130, boxY + 145);

    // Review Comment Quote
    ctx.fillStyle = '#4a2c1d';
    ctx.font = 'italic bold 36px "Be Vietnam Pro", sans-serif';
    
    // Wrap text into multiple lines
    this.wrapText(ctx, `"${review.comment}"`, boxX + 40, boxY + 230, boxW - 80, 52);

    // 5. Daily Achievements Grid
    const statY = 850;
    const statW = (width - 160 - 40) / 3;

    this.drawStatCard(ctx, boxX, statY, statW, 160, '💰 Doanh Thu', `+${(ledger.grossRevenue / 1000).toLocaleString('vi-VN')}k`);
    this.drawStatCard(ctx, boxX + statW + 20, statY, statW, 160, '🍗 Phục Vụ', `${ledger.customersServed} khách`);
    this.drawStatCard(ctx, boxX + (statW + 20) * 2, statY, statW, 160, '⭐ Đánh Giá', `${state.ratings.overall.toFixed(1)} / 5.0`);

    // 6. Mascot Gà Bông & Watermark Footer
    ctx.textAlign = 'center';
    ctx.fillStyle = '#e63946';
    ctx.font = 'bold 36px "Baloo 2", sans-serif';
    ctx.fillText('🐣 Tiệm Gà Nhà Tui · Chơi Ngay Trên Trình Duyệt', width / 2, 1120);

    ctx.font = '500 26px "Be Vietnam Pro", sans-serif';
    ctx.fillStyle = '#8a6452';
    ctx.fillText('Chia sẻ từ Threads · Không cần cài đặt · Chơi là nghiền!', width / 2, 1170);

    return new Promise(resolve => {
      canvas.toBlob(blob => {
        resolve(blob);
      }, 'image/png');
    });
  }

  private static drawStatCard(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    title: string,
    val: string
  ) {
    ctx.fillStyle = '#fffaf2';
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 18);
    ctx.fill();

    ctx.strokeStyle = '#ead7bd';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#8a6452';
    ctx.font = '600 24px "Be Vietnam Pro", sans-serif';
    ctx.fillText(title, x + w / 2, y + 55);

    ctx.fillStyle = '#3d2c2e';
    ctx.font = 'bold 36px "Baloo 2", sans-serif';
    ctx.fillText(val, x + w / 2, y + 115);
  }

  private static wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  }
}
