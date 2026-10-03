import { audio } from './audio';

export type BacBaVoiceCue = 'intro' | 'praise' | 'warning' | 'advice' | 'chuckle';

export type BacBaVoiceContext =
  | 'instruction'
  | 'tip_general'
  | 'tip_oil'
  | 'tip_streak'
  | 'tip_patience'
  | 'tip_stock'
  | 'manual'
  | 'story';

const BASE = import.meta.env?.BASE_URL ?? '/';
const voiceUrl = (path: string) => `${BASE}${path.replace(/^\//, '')}`;

interface VoiceCueConfig {
  file: string;
  fallbackF0: number;
  duration: number;
  pitchSlide: number;
}

const VOICE_CUE_CONFIGS: Record<BacBaVoiceCue, VoiceCueConfig> = {
  intro: {
    file: voiceUrl('assets/audio/bacba/bacba_intro.wav'),
    fallbackF0: 125,
    duration: 0.75,
    pitchSlide: -15
  },
  praise: {
    file: voiceUrl('assets/audio/bacba/bacba_khen.wav'),
    fallbackF0: 118,
    duration: 0.85,
    pitchSlide: 10
  },
  warning: {
    file: voiceUrl('assets/audio/bacba/bacba_canhbao.wav'),
    fallbackF0: 130,
    duration: 0.7,
    pitchSlide: 35
  },
  advice: {
    file: voiceUrl('assets/audio/bacba/bacba_loikhuyen.wav'),
    fallbackF0: 120,
    duration: 0.9,
    pitchSlide: -8
  },
  chuckle: {
    file: voiceUrl('assets/audio/bacba/bacba_chuckle.wav'),
    fallbackF0: 112,
    duration: 0.8,
    pitchSlide: 5
  }
};

/**
 * BacBaVoiceEngine
 * Động cơ âm thanh giọng nói chuyên biệt cho nhân vật Bác Ba Nam Bộ.
 * - Ưu tiên nạp và phát Audio file thực tế (thu âm / AI clone chất lượng cao) trong public/assets/audio/bacba/.
 * - Tự động fallback sang Procedural Formant Vocal Synthesizer (tần số F0 ~115-130Hz ấm trầm, F1/F2 tạo âm thanh nguyên âm người già).
 * - Tích hợp Typewriter Vocal Babble phong cách Animal Crossing / Celeste khi hội thoại chạy chữ.
 * - Tuyệt đối KHÔNG sử dụng Google Translate robot TTS.
 */
export class BacBaVoiceEngine {
  private audioBuffers: Map<BacBaVoiceCue, AudioBuffer> = new Map();
  private lastSpokenTime: number = 0;
  private lastBabbleTime: number = 0;
  private isPreloading: boolean = false;
  private enabled: boolean = true;

  constructor() {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('tiemgaran_bacba_voice_enabled');
        if (saved !== null) {
          this.enabled = saved === 'true';
        }
      }
    } catch (_e) {}
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('tiemgaran_bacba_voice_enabled', val ? 'true' : 'false');
      }
    } catch (_e) {}
  }

  public toggle(): boolean {
    const next = !this.enabled;
    this.setEnabled(next);
    return next;
  }

  public isEnabled(): boolean {
    return this.enabled && !audio.getMuted();
  }

  /**
   * Nạp trước các file âm thanh Bác Ba vào Web AudioBuffer
   */
  public async preload(): Promise<void> {
    if (this.isPreloading || typeof window === 'undefined') return;
    this.isPreloading = true;
    const ctx = audio.context();
    if (!ctx) return;

    for (const [cue, config] of Object.entries(VOICE_CUE_CONFIGS) as [BacBaVoiceCue, VoiceCueConfig][]) {
      if (this.audioBuffers.has(cue)) continue;
      try {
        const resp = await fetch(config.file);
        if (resp.ok) {
          const arrayBuf = await resp.arrayBuffer();
          const decoded = await ctx.decodeAudioData(arrayBuf);
          this.audioBuffers.set(cue, decoded);
        }
      } catch (_e) {
        // Nếu fetch lỗi (vd offline hoặc môi trường test), hệ thống tự động fallback formant synth
      }
    }
  }

  /**
   * Phát câu thoại biểu cảm mở đầu tương ứng với ngữ cảnh
   */
  public playCue(cue: BacBaVoiceCue, force = false): void {
    if (!this.isEnabled()) return;
    const now = Date.now();
    // Throttle để tránh dồn dập các câu nói đè lên nhau (tối thiểu 1.2s trừ khi force)
    if (!force && now - this.lastSpokenTime < 1200) return;
    this.lastSpokenTime = now;

    const ctx = audio.context();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      void ctx.resume().catch(() => {});
    }

    // 1. Nếu đã nạp buffer file âm thanh thực tế -> Phát ngay
    const buffer = this.audioBuffers.get(cue);
    if (buffer) {
      try {
        const source = ctx.createBufferSource();
        source.buffer = buffer;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.85 * audio.getSfxVolume(), ctx.currentTime);

        source.connect(gain);
        gain.connect(audio.dest());
        source.start(0);
        return;
      } catch (_e) {
        // Fallback procedural
      }
    }

    // 2. Fallback: Procedural Formant Uncle Voice Synthesis
    this.playProceduralUncleVoice(cue);
  }

  /**
   * Bộ tổng hợp giọng người già Nam Bộ bằng Web Audio Formant Filters
   * Mô phỏng thanh âm trầm khàn, ấm áp đặc trưng của Bác Ba
   */
  public playProceduralUncleVoice(cue: BacBaVoiceCue): void {
    const ctx = audio.context();
    if (!ctx) return;

    const config = VOICE_CUE_CONFIGS[cue];
    const now = ctx.currentTime;
    const duration = config.duration;

    // 1. Dao động thanh quản (Glottal Osc - Sawtooth có hài âm phong phú)
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';

    const startFreq = config.fallbackF0;
    const endFreq = config.fallbackF0 + config.pitchSlide;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(60, endFreq), now + duration * 0.85);

    // 2. Bộ lọc Formant 1 (Vòm họng trầm, F1 ~ 380Hz)
    const filter1 = ctx.createBiquadFilter();
    filter1.type = 'bandpass';
    filter1.frequency.setValueAtTime(380, now);
    filter1.Q.setValueAtTime(4.0, now);

    // 3. Bộ lọc Formant 2 (Khoang miệng nguyên âm ấm, F2 ~ 1150Hz)
    const filter2 = ctx.createBiquadFilter();
    filter2.type = 'bandpass';
    filter2.frequency.setValueAtTime(1150, now);
    filter2.Q.setValueAtTime(3.5, now);

    // 4. Low-pass filter cắt bớt tiếng chói, tạo độ đục ấm của tuổi 62
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(2600, now);

    // 5. Envelope biên độ (Attack nhanh, ngân ấm, decay êm)
    const gain = ctx.createGain();
    const peakVol = 0.45 * audio.getSfxVolume();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(peakVol, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(peakVol * 0.7, now + duration * 0.6);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // Kết nối mạch lọc
    osc.connect(filter1);
    osc.connect(filter2);
    filter1.connect(lowpass);
    filter2.connect(lowpass);
    lowpass.connect(gain);
    gain.connect(audio.dest());

    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  /**
   * Typewriter Vocal Babble: Tiếng lầm bầm ấm áp khi chữ đang gõ ra (Animal Crossing / Celeste style)
   * Tần số thay đổi ngẫu nhiên nhẹ theo ngữ điệu già dặn (110 - 130Hz)
   */
  public playTypewriterBabble(): void {
    if (!this.isEnabled()) return;
    const now = Date.now();
    // Giới hạn tần suất babble tối thiểu 90ms để không bị rít âm
    if (now - this.lastBabbleTime < 90) return;
    this.lastBabbleTime = now;

    const ctx = audio.context();
    if (!ctx) return;

    const t = ctx.currentTime;
    const dur = 0.07;
    const f0 = 112 + Math.random() * 18; // Dao động 112 - 130Hz

    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(f0, t);

    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(450, t);
    bp.Q.setValueAtTime(3.0, t);

    const gain = ctx.createGain();
    const vol = 0.16 * audio.getSfxVolume();
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    osc.connect(bp);
    bp.connect(gain);
    gain.connect(audio.dest());

    osc.start(t);
    osc.stop(t + dur + 0.01);
  }

  /**
   * Tự động phân tích ngữ cảnh để Bác Ba cất giọng phù hợp nhất
   */
  public speak(context: BacBaVoiceContext, _text?: string): void {
    if (!this.isEnabled()) return;

    switch (context) {
      case 'instruction':
      case 'manual':
        // Hướng dẫn mở bán, lật cẩm nang -> Giọng dặn dò hoặc chào con
        this.playCue(Math.random() > 0.5 ? 'intro' : 'advice');
        break;

      case 'tip_oil':
      case 'tip_patience':
        // Cảnh báo khẩn cấp: dầu đen, khách sắp quạu -> "Mèn ơi! Coi chừng kìa!"
        this.playCue('warning', true);
        break;

      case 'tip_streak':
        // Khen ngợi chuỗi Perfect -> "Khà khà! Được đó nghen!"
        this.playCue('praise');
        break;

      case 'tip_stock':
      case 'tip_general':
        // Tiếp tế hoặc lời khuyên cái tâm làm nghề -> "Nghe bác dặn nè!"
        this.playCue('advice');
        break;

      case 'story':
        // Chuyện đêm -> Tiếng cười khà khà hoặc dặn dò
        this.playCue(Math.random() > 0.5 ? 'chuckle' : 'advice');
        break;

      default:
        this.playCue('intro');
        break;
    }
  }
}

export const bacBaVoice = new BacBaVoiceEngine();
