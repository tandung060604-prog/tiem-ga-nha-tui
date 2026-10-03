import { audio } from '../core/audio';

/**
 * TYPEWRITER ENGINE CHO TIỆM GÀ NHÀ TUI (VISUAL NOVEL MINI & DIALOGUES)
 * Hiệu ứng hiển thị chữ từ từ (text crawl) kèm âm thanh gõ 'tít tít' procedural Web Audio ZzFX.
 * Hỗ trợ:
 * - Bấm vào khung thoại hoặc nút '⏩ Hiện Hết' để skip ngay lập tức
 * - Tự động phát âm thanh tít tít với vi mô biến thiên tần số
 * - Hỗ trợ chuỗi dòng thoại (sequence) tuần tự mượt mà
 */

export interface TypewriterOptions {
  speedMs?: number;           // Tốc độ gõ chữ (mặc định: 22ms)
  soundInterval?: number;     // Tần suất phát tiếng tít tít (mặc định: 2 ký tự/lần)
  onChar?: (char: string, index: number) => void;
  onComplete?: () => void;
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
    const speed = this.options.speedMs ?? 22;
    const interval = this.options.soundInterval ?? 2;
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

        // Âm thanh tít tít retro vui tai
        if (i % interval === 0 && char.trim().length > 0) {
          audio.playTextBlip(i);
        }

        if (this.options.onChar) {
          this.options.onChar(char, i);
        }

        i++;
        this.timer = setTimeout(tick, speed);
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
    if (options.onAllDone) options.onAllDone();
  };

  // Thiết lập handler click để skip
  if (options.containerEl) {
    options.containerEl.onclick = (e) => {
      // Nếu không bấm vào button lựa chọn thì skip text
      const target = e.target as HTMLElement;
      if (!target.closest('button')) {
        skipAll();
      }
    };
  }

  // Chạy tuần tự từng dòng
  (async () => {
    for (let idx = 0; idx < lines.length; idx++) {
      if (isAborted) break;
      const item = lines[idx];
      if (!item) continue;
      const parentRow = item.textEl.closest<HTMLElement>('.vn-dialogue-row, .storylet-dialogue-row');
      if (parentRow) parentRow.style.display = 'flex';

      // Tự động cuộn xuống dưới cùng
      if (options.containerEl) {
        options.containerEl.scrollTop = options.containerEl.scrollHeight;
      }

      currentPlayer = new TypewriterPlayer(item.textEl, item.fullText, {
        speedMs: 20,
        soundInterval: 2,
      });

      await currentPlayer.start();
      if (isAborted) break;

      // Độ trễ ngắn giữa các câu thoại (~250ms)
      await new Promise(r => setTimeout(r, 220));
    }

    if (!isAborted && options.onAllDone) {
      options.onAllDone();
    }
  })();

  return { skipAll };
}
