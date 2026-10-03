import { audio } from '../core/audio';

/**
 * TYPEWRITER ENGINE CHO TIỆM GÀ NHÀ TUI (VISUAL NOVEL MINI & DIALOGUES)
 * Hiệu ứng hiển thị chữ từ từ (text crawl) phong cách Coffee Talk x Stardew Valley:
 * - Tốc độ gõ chữ thư thả, có nhịp thở tự nhiên theo dấu chấm, dấu phẩy
 * - Bấm vào khung thoại hoặc nút '⏩ Hiện Hết' để skip ngay lập tức
 * - Tự động phát âm thanh tít tít vi mô Web Audio ZzFX
 * - Hỗ trợ con trỏ nhấp nháy 🔻 (Blinking Next Indicator) khi hoàn tất
 */

export interface TypewriterOptions {
  speedMs?: number;           // Tốc độ gõ chữ cơ bản (mặc định: 36ms)
  soundInterval?: number;     // Tần suất phát tiếng tít tít (mặc định: 2 ký tự/lần)
  punctuationPause?: boolean; // Tự động ngắt nghỉ ở dấu câu (mặc định: true)
  showCursor?: boolean;       // Hiện con trỏ nhấp nháy khi gõ xong dòng
  onChar?: (char: string, index: number) => void;
  onComplete?: () => void;
}

function getCharDelay(char: string, nextChar?: string, baseSpeed = 36): number {
  if (char === ',' || char === ';' || char === ':') {
    return baseSpeed + 140; // Ngắt nghỉ nhẹ ở dấu phẩy
  }
  if (char === '.' || char === '!' || char === '?' || char === '—') {
    if (char === '.' && nextChar === '.') return baseSpeed + 60; // Chuỗi ba chấm
    return baseSpeed + 320; // Nghỉ rõ rệt ở cuối câu để người chơi kịp cảm thụ
  }
  if (char === '\n') {
    return baseSpeed + 220;
  }
  return baseSpeed;
}

export class TypewriterPlayer {
  private isCancelled = false;
  private isSkipped = false;
  private timer: any = null;
  private resolvePromise: (() => void) | null = null;

  constructor(
    private targetEl: HTMLElement,
    private fullText: string,
    private options: TypewriterOptions = {}
  ) {}

  public start(): Promise<void> {
    const baseSpeed = this.options.speedMs ?? 36;
    const interval = this.options.soundInterval ?? 2;
    const punctuationPause = this.options.punctuationPause ?? true;
    this.targetEl.textContent = '';

    return new Promise((resolve) => {
      this.resolvePromise = resolve;
      let i = 0;
      const tick = () => {
        if (this.isCancelled) {
          if (this.resolvePromise) {
            this.resolvePromise();
            this.resolvePromise = null;
          }
          return;
        }

        if (this.isSkipped || i >= this.fullText.length) {
          this.targetEl.textContent = this.fullText;
          if (this.options.onComplete) this.options.onComplete();
          if (this.resolvePromise) {
            this.resolvePromise();
            this.resolvePromise = null;
          }
          return;
        }

        const char = this.fullText[i];
        if (!char) {
          if (this.options.onComplete) this.options.onComplete();
          if (this.resolvePromise) {
            this.resolvePromise();
            this.resolvePromise = null;
          }
          return;
        }
        this.targetEl.textContent += char;

        // Âm thanh tít tít retro êm tai
        if (i % interval === 0 && char.trim().length > 0 && !',.!?:—'.includes(char)) {
          audio.playTextBlip(i);
        }

        if (this.options.onChar) {
          this.options.onChar(char, i);
        }

        const nextChar = this.fullText[i + 1];
        const delay = punctuationPause ? getCharDelay(char, nextChar, baseSpeed) : baseSpeed;

        i++;
        this.timer = setTimeout(tick, delay);
      };

      tick();
    });
  }

  public skip(): void {
    this.isSkipped = true;
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.targetEl.textContent = this.fullText;
    if (this.options.onComplete) {
      this.options.onComplete();
    }
    if (this.resolvePromise) {
      this.resolvePromise();
      this.resolvePromise = null;
    }
  }

  public cancel(): void {
    this.isCancelled = true;
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.resolvePromise) {
      this.resolvePromise();
      this.resolvePromise = null;
    }
  }
}

/**
 * Chạy hiệu ứng typewriter tuần tự cho danh sách phần tử hội thoại
 */
export async function playDialogueSequence(
  lines: { textEl: HTMLElement; fullText: string }[],
  options: {
    containerEl?: HTMLElement;
    speedMs?: number;
    onAllDone?: () => void;
  } = {}
): Promise<{ skipAll: () => void }> {
  let isAborted = false;
  let currentPlayer: TypewriterPlayer | null = null;

  const skipAll = () => {
    isAborted = true;
    if (currentPlayer) currentPlayer.skip();
    lines.forEach(line => {
      line.textEl.textContent = line.fullText;
      const parentRow = line.textEl.closest<HTMLElement>('.vn-dialogue-row, .storylet-dialogue-row');
      if (parentRow) parentRow.style.display = 'flex';
    });
    // Gỡ bỏ con trỏ nhấp nháy tạm
    if (typeof document !== 'undefined') {
      document.querySelectorAll('.vn-cursor-indicator').forEach(el => el.remove());
    }
    if (options.onAllDone) options.onAllDone();
  };

  // Thiết lập handler click vào khung để skip nhanh toàn bộ
  if (options.containerEl) {
    options.containerEl.onclick = (e) => {
      const target = e.target as HTMLElement;
      if (!target.closest('button')) {
        skipAll();
      }
    };
  }

  // Chạy tuần tự từng dòng
  (async () => {
    const baseSpeed = options.speedMs ?? 36;
    for (let idx = 0; idx < lines.length; idx++) {
      if (isAborted) break;
      const item = lines[idx];
      if (!item) continue;
      const parentRow = item.textEl.closest<HTMLElement>('.vn-dialogue-row, .storylet-dialogue-row');
      if (parentRow) parentRow.style.display = 'flex';

      // Xóa cursor cũ nếu có
      if (typeof document !== 'undefined') {
        document.querySelectorAll('.vn-cursor-indicator').forEach(el => el.remove());
      }

      // Tự động cuộn xuống dưới cùng để người chơi theo dõi dòng mới
      if (options.containerEl) {
        options.containerEl.scrollTop = options.containerEl.scrollHeight;
      }

      currentPlayer = new TypewriterPlayer(item.textEl, item.fullText, {
        speedMs: baseSpeed,
        soundInterval: 2,
        punctuationPause: true
      });

      await currentPlayer.start();
      if (isAborted) break;

      // Độ trễ ngắn giữa các câu thoại (~300ms) để câu chữ lắng đọng
      await new Promise(r => setTimeout(r, 280));
    }

    // Dọn sạch cursor tạm
    if (typeof document !== 'undefined') {
      document.querySelectorAll('.vn-cursor-indicator').forEach(el => el.remove());
    }

    if (!isAborted && options.onAllDone) {
      options.onAllDone();
    }
  })();

  return { skipAll };
}
