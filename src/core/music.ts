// Nhạc nền game (BGM MP3 chất lượng cao) kết hợp giọng nhân vật và đọc truyện.
// Hỗ trợ 2 bài nhạc:
// - Title & Chuẩn bị: Daily Beetle (Acoustic Ukulele ấm cúng, thư giãn)
// - Bán hàng: Carefree (Nhịp điệu huýt sáo vui tươi, rộn ràng)
import { audio } from './audio';
import { ASSETS } from '../content/assets';

const MUSIC_PREF_KEY = 'tiem_ga_music_on';

export type Mode = 'title' | 'prep' | 'selling' | 'dramatic_incident';

// Vòng hợp âm C – Am – F – G dự phòng (Web Audio synth khi offline/fallback)
const CHORDS: readonly (readonly number[])[] = [
  [261.63, 329.63, 392.0],  // C
  [220.0, 261.63, 329.63],  // Am
  [174.61, 220.0, 261.63],  // F
  [196.0, 246.94, 293.66]   // G
];
const BASS = [130.81, 110.0, 87.31, 98.0];
const MELODY: readonly (number | 0)[] = [
  523.25, 0, 659.25, 587.33, 523.25, 0, 440.0, 0,
  440.0, 523.25, 0, 587.33, 659.25, 0, 587.33, 0,
  698.46, 0, 659.25, 587.33, 523.25, 0, 440.0, 523.25,
  587.33, 0, 659.25, 0, 587.33, 523.25, 0, 0
];

// Vòng hợp âm kịch tính Dm – Bb – Gm – A cho các phân cảnh gay cấn, đòi nợ, giang hồ
const DRAMATIC_CHORDS: readonly (readonly number[])[] = [
  [146.83, 174.61, 220.0],  // Dm
  [116.54, 146.83, 174.61], // Bb
  [98.0, 116.54, 146.83],   // Gm
  [110.0, 138.59, 164.81]   // A
];
const DRAMATIC_BASS = [73.42, 58.27, 49.0, 55.0];

class MusicBox {
  private master: GainNode | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private nextTime = 0;
  private step = 0;
  private mode: Mode = 'title';
  private enabled = readPref();

  // HTML5 Audio elements cho bản nhạc MP3
  private titleAudio: HTMLAudioElement | null = null;
  private sellingAudio: HTMLAudioElement | null = null;
  private activeAudio: HTMLAudioElement | null = null;
  private fadeTimer: ReturnType<typeof setInterval> | null = null;

  isEnabled() { return this.enabled; }

  private getAudioElements() {
    if (typeof Audio === 'undefined') return { title: null, selling: null };
    if (!this.titleAudio) {
      try {
        this.titleAudio = new Audio(ASSETS.audio.bgmTitle);
        this.titleAudio.loop = true;
        this.titleAudio.preload = 'auto';

        this.sellingAudio = new Audio(ASSETS.audio.bgmSelling);
        this.sellingAudio.loop = true;
        this.sellingAudio.preload = 'auto';
      } catch {
        // Fallback Web Audio
      }
    }
    return { title: this.titleAudio, selling: this.sellingAudio };
  }

  // Gọi trong một thao tác chạm (bắt buộc trên iOS Safari / Chrome autoplay policy)
  unlock() {
    const ctx = audio.context();
    if (ctx && ctx.state === 'suspended') void ctx.resume();
    const { title } = this.getAudioElements();
    if (title && title.paused && this.enabled && (this.mode === 'title' || this.mode === 'prep')) {
      title.play().catch(() => {});
    }
  }

  setEnabled(on: boolean) {
    this.enabled = on;
    try { localStorage.setItem(MUSIC_PREF_KEY, on ? '1' : '0'); } catch { /* chế độ riêng tư */ }
    if (on) this.start(this.mode); else this.stop();
  }

  setMode(mode: Mode) {
    if (this.mode === mode) return;
    this.mode = mode;
    if (this.enabled && (this.activeAudio || this.timer)) {
      this.start(mode);
    }
  }

  start(mode: Mode = this.mode) {
    this.mode = mode;
    if (!this.enabled || audio.getMuted()) return;

    if (mode === 'dramatic_incident') {
      // Tạm hạ âm lượng bài nhạc MP3 xuống mức rất nhỏ và khởi động synth kịch tính
      if (this.activeAudio) {
        this.activeAudio.volume = 0.04;
      }
      this.startSynth();
      return;
    }

    const { title, selling } = this.getAudioElements();
    const targetAudio = (mode === 'selling') ? selling : title;

    if (targetAudio) {
      this.crossFadeTo(targetAudio, 0.45);
      return;
    }

    // Fallback Web Audio Synth nếu không hỗ trợ Audio element
    this.startSynth();
  }

  private crossFadeTo(targetAudio: HTMLAudioElement, targetVol: number = 0.45) {
    if (this.fadeTimer) clearInterval(this.fadeTimer);
    this.fadeTimer = null;
    this.stopSynth();

    const prevAudio = this.activeAudio;
    if (prevAudio === targetAudio && !targetAudio.paused) return;

    targetAudio.volume = 0.05;
    const playPromise = targetAudio.play();
    if (playPromise) {
      playPromise.then(() => {
        let currentVol = 0.05;
        this.fadeTimer = setInterval(() => {
          currentVol += 0.05;
          if (targetAudio) targetAudio.volume = Math.min(targetVol, currentVol);
          if (prevAudio && prevAudio !== targetAudio) {
            prevAudio.volume = Math.max(0, prevAudio.volume - 0.08);
          }
          if (currentVol >= targetVol) {
            if (this.fadeTimer) clearInterval(this.fadeTimer);
            this.fadeTimer = null;
            if (prevAudio && prevAudio !== targetAudio) prevAudio.pause();
          }
        }, 60);
      }).catch(() => {
        // Trình duyệt chặn autoplay khi chưa chạm: fallback synth
        this.startSynth();
      });
    }

    this.activeAudio = targetAudio;
  }

  stop() {
    if (this.fadeTimer) clearInterval(this.fadeTimer);
    this.fadeTimer = null;
    if (this.activeAudio) {
      this.activeAudio.pause();
      this.activeAudio = null;
    }
    const { title, selling } = this.getAudioElements();
    if (title) title.pause();
    if (selling) selling.pause();
    this.stopSynth();
  }

  private startSynth() {
    if (this.timer) return;
    const ctx = audio.context();
    if (!ctx) return;
    this.master = ctx.createGain();
    this.master.gain.value = 0.0001;
    this.master.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 1.0);
    this.master.connect(ctx.destination);
    this.nextTime = ctx.currentTime + 0.1;
    this.step = 0;
    this.timer = setInterval(() => this.schedule(ctx), 50);
  }

  private stopSynth() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    const ctx = audio.context();
    if (this.master && ctx) {
      const m = this.master;
      m.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.2);
      setTimeout(() => m.disconnect(), 600);
    }
    this.master = null;
  }

  private schedule(ctx: AudioContext) {
    if (!this.master) return;

    if (this.mode === 'dramatic_incident') {
      const bpm = 68;
      const eighth = 60 / bpm / 2;
      while (this.nextTime < ctx.currentTime + 0.2) {
        const bar = Math.floor(this.step / 8) % DRAMATIC_CHORDS.length;
        const beat = this.step % 8;
        const t = this.nextTime;
        if (beat === 0) {
          for (const f of DRAMATIC_CHORDS[bar] ?? []) this.tone(ctx, f, t, eighth * 6, 'sawtooth', 0.038, 0.2);
        }
        if (beat === 0 || beat === 3 || beat === 6) {
          this.tone(ctx, DRAMATIC_BASS[bar] ?? 73.42, t, eighth * 2, 'sine', 0.16, 0.03);
        }
        this.nextTime += eighth;
        this.step++;
      }
      return;
    }

    const bpm = this.mode === 'selling' ? 112 : 84;
    const eighth = 60 / bpm / 2;
    while (this.nextTime < ctx.currentTime + 0.2) {
      const bar = Math.floor(this.step / 8) % CHORDS.length;
      const beat = this.step % 8;
      const t = this.nextTime;
      if (beat === 0) {
        for (const f of CHORDS[bar] ?? []) this.tone(ctx, f, t, eighth * 8, 'triangle', 0.035, 0.25);
      }
      if (beat === 0 || beat === 4) this.tone(ctx, BASS[bar] ?? 130.81, t, eighth * 3, 'sine', 0.12, 0.02);
      const note = MELODY[this.step % MELODY.length] ?? 0;
      if (note) this.tone(ctx, note, t, eighth * 0.9, 'square', 0.018, 0.01);
      if (this.mode === 'selling' && beat % 2 === 1) this.hat(ctx, t);
      this.nextTime += eighth;
      this.step++;
    }
  }

  private tone(ctx: AudioContext, freq: number, t: number, dur: number, type: OscillatorType, vol: number, attack: number) {
    if (!this.master) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(this.master);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  private hat(ctx: AudioContext, t: number) {
    if (!this.master) return;
    const len = Math.floor(ctx.sampleRate * 0.03);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource();
    const hp = ctx.createBiquadFilter();
    const g = ctx.createGain();
    src.buffer = buf;
    hp.type = 'highpass';
    hp.frequency.value = 7000;
    g.gain.value = 0.05;
    src.connect(hp).connect(g).connect(this.master);
    src.start(t);
  }
}

function readPref(): boolean {
  try { return localStorage.getItem(MUSIC_PREF_KEY) !== '0'; } catch { return true; }
}

export const music = new MusicBox();

// ---------------------------------------------------------------------------
// "Giọng" nhân vật: chuỗi âm líu lo theo nhịp chữ (kiểu Animal Crossing)
// ---------------------------------------------------------------------------

export type Voice = 'bunny' | 'bacba' | 'guest' | 'owner';
const VOICE_PITCH: Record<Voice, number> = { bunny: 780, bacba: 190, guest: 420, owner: 330 };

export function babble(text: string, voice: Voice = 'guest', maxSyllables = 14) {
  if (audio.getMuted()) return;
  const ctx = audio.context();
  if (!ctx) return;
  const syllables = text.replace(/[^\p{L}\s]/gu, ' ').split(/\s+/).filter(Boolean).slice(0, maxSyllables);
  const base = VOICE_PITCH[voice];
  let t = ctx.currentTime + 0.02;
  for (const syl of syllables) {
    // Cao độ theo nguyên âm đầu của âm tiết → cùng câu luôn "nói" giống nhau
    const code = syl.normalize('NFD').charCodeAt(0);
    const freq = base * (1 + ((code % 7) - 3) * 0.06);
    const osc = ctx.createOscillator();
    const lp = ctx.createBiquadFilter();
    const g = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.85, t + 0.07);
    lp.type = 'lowpass';
    lp.frequency.value = base * 3;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.07, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.075);
    osc.connect(lp).connect(g).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.09);
    t += 0.085;
  }
}

// ---------------------------------------------------------------------------
// Đọc truyện bằng giọng tiếng Việt của máy (iPhone có sẵn giọng "Linh")
// ---------------------------------------------------------------------------

function vietnameseVoice(): SpeechSynthesisVoice | undefined {
  if (typeof speechSynthesis === 'undefined') return undefined;
  return speechSynthesis.getVoices().find(v => v.lang.toLowerCase().startsWith('vi'));
}

export function canNarrate(): boolean {
  return typeof speechSynthesis !== 'undefined';
}

export function narrate(text: string) {
  if (!canNarrate()) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/\s+/g, ' ').trim());
  u.lang = 'vi-VN';
  const voice = vietnameseVoice();
  if (voice) u.voice = voice;
  u.rate = 1.0;
  speechSynthesis.speak(u);
}

export function stopNarration() {
  if (canNarrate()) speechSynthesis.cancel();
}
