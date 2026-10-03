import { audio } from './audio';

/**
 * Bộ Máy Phát Thanh Viên Đêm Sài Gòn (FM 99.9 MHz Radio Announcer)
 * - Tự động phát âm thanh tín hiệu 'bíp bíp' rà đài hoài niệm trước khi đọc
 * - Tận dụng giọng đọc tiếng Việt chuẩn (Vietnamese Neural / Natural TTS) tích hợp trên thiết bị
 * - Chỉnh nhịp đọc êm đềm, chậm rãi (rate: 0.92, pitch: 1.0) phù hợp không khí tĩnh mịch đêm khuya
 * - Hoàn toàn không dùng Google Dịch TTS bên ngoài để tránh nghẽn mạng và giọng máy móc thô cứng
 */
export class RadioVoiceAnnouncer {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking = false;
  private statusListeners: Array<(speaking: boolean) => void> = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public addStatusListener(fn: (speaking: boolean) => void): () => void {
    this.statusListeners.push(fn);
    return () => {
      this.statusListeners = this.statusListeners.filter(l => l !== fn);
    };
  }

  private notify(speaking: boolean) {
    this.isSpeaking = speaking;
    this.statusListeners.forEach(l => l(speaking));
  }

  public getSpeakingState(): boolean {
    return this.isSpeaking;
  }

  public getCurrentUtterance(): SpeechSynthesisUtterance | null {
    return this.currentUtterance;
  }

  /**
   * Tìm giọng tiếng Việt tự nhiên nhất có sẵn trong hệ thống
   */
  public getVietnameseVoice(): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return null;

    // 1. Ưu tiên giọng tiếng Việt có tên Natural / Neural / HoaiMy / Nam / An / Linh
    const viVoices = voices.filter(v => v.lang.toLowerCase().startsWith('vi') || v.lang.includes('VIE'));
    if (viVoices.length > 0) {
      const naturalVoice = viVoices.find(v => 
        v.name.includes('Natural') || 
        v.name.includes('Neural') || 
        v.name.includes('HoaiMy') || 
        v.name.includes('Nam') ||
        v.name.includes('Linh')
      );
      return naturalVoice || viVoices[0] || null;
    }

    return null;
  }

  /**
   * Phát thanh toàn bộ bản tin đêm:
   * 1. Phát tiếng bíp bíp tín hiệu đài FM 99.9
   * 2. Phát thanh viên cất giọng đọc diễn cảm
   */
  public broadcastTonight(
    headline: string,
    transcript: string,
    rumor?: string,
    onFinished?: () => void
  ) {
    this.stop();

    // Chuẩn bị văn bản phát thanh tự nhiên, ngắt nghỉ đúng điệu đài đêm
    const fullSpeechText = `Đài phát thanh đêm Sài Gòn, tần số chín mươi chín phẩy chín mê ga héc. ${headline}. ${transcript}. ${rumor ? `Tin rỉ tai xóm hẻm: ${rumor}.` : ''} Chúc bà con một đêm ngon giấc.`;

    // 1. Phát tín hiệu bíp bíp rà sóng đài
    audio.playRadioBeepBeep(() => {
      if (!this.synth) {
        // Fallback âm thanh jingle nếu thiết bị không hỗ trợ SpeechSynthesis
        audio.playRadioJingle();
        if (onFinished) setTimeout(onFinished, 2000);
        return;
      }

      try {
        const utterance = new SpeechSynthesisUtterance(fullSpeechText);
        utterance.lang = 'vi-VN';
        utterance.rate = 0.92; // Tốc độ thong thả ấm áp
        utterance.pitch = 1.0;
        utterance.volume = audio.getMuted() ? 0 : 0.9;

        const viVoice = this.getVietnameseVoice();
        if (viVoice) {
          utterance.voice = viVoice;
        }

        utterance.onstart = () => {
          this.notify(true);
        };

        utterance.onend = () => {
          this.notify(false);
          this.currentUtterance = null;
          if (onFinished) onFinished();
        };

        utterance.onerror = () => {
          this.notify(false);
          this.currentUtterance = null;
          if (onFinished) onFinished();
        };

        this.currentUtterance = utterance;
        this.synth.speak(utterance);
      } catch {
        this.notify(false);
        audio.playRadioJingle();
        if (onFinished) onFinished();
      }
    });
  }

  public stop() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {}
    }
    this.currentUtterance = null;
    this.notify(false);
  }
}

export const radioAnnouncer = new RadioVoiceAnnouncer();
