// Sound Engine using procedural Web Audio API (No external sound file loading required)

class AudioManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private sizzleNode: AudioNode | null = null;
  private sizzleGain: GainNode | null = null;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private muteListeners: Array<(muted: boolean) => void> = [];

  public onMuteChange(listener: (muted: boolean) => void) {
    this.muteListeners.push(listener);
  }

  // AudioContext dùng chung (nhạc nền, giọng nhân vật). null khi không có Web Audio (vd. Node test).
  public context(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    this.initContext();
    return this.ctx;
  }

  private unsupported = false;

  // Không có Web Audio (trình duyệt nhúng, máy cũ, chế độ hạn chế): game vẫn chạy, chỉ im lặng
  private initContext() {
    if (!this.ctx && !this.unsupported) {
      const AudioCtx = window.AudioContext
        || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      try {
        if (!AudioCtx) throw new Error('no Web Audio');
        this.ctx = new AudioCtx();
      } catch {
        this.unsupported = true;
        return;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    this.muteListeners.forEach(l => l(muted));
    if (muted && this.sizzleGain) {
      this.sizzleGain.gain.setValueAtTime(0, this.ctx?.currentTime || 0);
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return !this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Button Click / Tap sound
  public playPop() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(750, now + 0.06);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Cash Register / Coin Ching sound
  public playCash() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(987.77, now); // B5
    osc1.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    osc2.frequency.setValueAtTime(1975.53, now); // B6
    osc2.frequency.setValueAtTime(2637.02, now + 0.08); // E7

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.4);
    osc2.stop(now + 0.4);
  }

  // Golden Crisp "Perfect!" Bell
  public playPerfect() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [1046.50, 1318.51, 1567.98, 2093.00]; // C6, E6, G6, C7 arpeggio
    
    freqs.forEach((f, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + idx * 0.04;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, startTime);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  }

  // Burnt / Warning Buzzer
  public playBurnt() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.setValueAtTime(120, now + 0.12);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  // Continuous Sizzling Oil Sound
  public startSizzle() {
    if (this.isMuted || this.sizzleNode) return;
    this.initContext();
    if (!this.ctx) return;

    // Generate White Noise Buffer
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Filter to simulate frying crackle
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800;
    filter.Q.value = 1.2;

    this.sizzleGain = this.ctx.createGain();
    this.sizzleGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(this.sizzleGain);
    this.sizzleGain.connect(this.ctx.destination);

    noise.start();
    this.sizzleNode = noise;
  }

  public stopSizzle() {
    if (this.sizzleNode) {
      try {
        (this.sizzleNode as AudioScheduledSourceNode).stop();
      } catch {
        // Ignore if already stopped
      }
      this.sizzleNode = null;
      this.sizzleGain = null;
    }
  }
}

export const audio = new AudioManager();
