// Nhạc nền, "giọng" nhân vật và đọc truyện — tự sinh bằng Web Audio / Web Speech, không cần file âm thanh.
// iOS: AudioContext chỉ được bật trong một thao tác chạm → gọi unlock() từ màn tiêu đề.
import { audio } from './audio';

const MUSIC_PREF_KEY = 'tiem_ga_music_on';

type Mode = 'prep' | 'selling';

// Vòng hợp âm C – Am – F – G (mỗi hợp âm 1 ô nhịp), tần số Hz
const CHORDS: readonly (readonly number[])[] = [
  [261.63, 329.63, 392.0],  // C
  [220.0, 261.63, 329.63],  // Am
  [174.61, 220.0, 261.63],  // F
  [196.0, 246.94, 293.66]   // G
];
const BASS = [130.81, 110.0, 87.31, 98.0];
// Giai điệu ngũ cung (C D E G A) quãng cao, lặp lại theo mẫu cố định cho dễ nhớ
const MELODY: readonly (number | 0)[] = [
  523.25, 0, 659.25, 587.33, 523.25, 0, 440.0, 0,
  440.0, 523.25, 0, 587.33, 659.25, 0, 587.33, 0,
  698.46, 0, 659.25, 587.33, 523.25, 0, 440.0, 523.25,
  587.33, 0, 659.25, 0, 587.33, 523.25, 0, 0
];

class MusicBox {
  private master: GainNode | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private nextTime = 0;
  private step = 0;
  private mode: Mode = 'prep';
  private enabled = readPref();

  isEnabled() { return this.enabled; }

  // Gọi trong một thao tác chạm (bắt buộc trên iOS Safari)
  unlock() {
    const ctx = audio.context();
    if (ctx && ctx.state === 'suspended') void ctx.resume();
  }

  setEnabled(on: boolean) {
    this.enabled = on;
    try { localStorage.setItem(MUSIC_PREF_KEY, on ? '1' : '0'); } catch { /* chế độ riêng tư: bỏ qua */ }
    if (on) this.start(this.mode); else this.stop();
  }

  setMode(mode: Mode) {
    this.mode = mode;
  }

  start(mode: Mode = this.mode) {
    this.mode = mode;
    if (!this.enabled || this.timer || audio.getMuted()) return;
    const ctx = audio.context();
    if (!ctx) return;
    this.master = ctx.createGain();
    this.master.gain.value = 0.0001;
    this.master.gain.exponentialRampToValueAtTime(0.55, ctx.currentTime + 1.2); // vào nhạc êm
    this.master.connect(ctx.destination);
    this.nextTime = ctx.currentTime + 0.1;
    this.step = 0;
    // Lịch phát trước 0,2s, kiểm tra mỗi 50ms: nhịp đều dù tab bận vẽ
    this.timer = setInterval(() => this.schedule(ctx), 50);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    const ctx = audio.context();
    if (this.master && ctx) {
      const m = this.master;
      m.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.2);
      setTimeout(() => m.disconnect(), 800);
    }
    this.master = null;
  }

  private schedule(ctx: AudioContext) {
    if (!this.master) return;
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
