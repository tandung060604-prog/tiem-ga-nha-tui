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

  private sfxVolume: number = 0.8;
  private sfxGainNode: GainNode | null = null;

  public getSfxVolume(): number {
    return this.sfxVolume;
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    if (this.ctx && this.sfxGainNode) {
      this.sfxGainNode.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
    }
  }

  public dest(): AudioNode {
    if (!this.ctx) return {} as AudioNode;
    if (!this.sfxGainNode) {
      this.sfxGainNode = this.ctx.createGain();
      this.sfxGainNode.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
      this.sfxGainNode.connect(this.ctx.destination);
    }
    return this.sfxGainNode;
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
    gain.connect(this.dest());

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
    gain.connect(this.dest());

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
      gain.connect(this.dest());

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
    gain.connect(this.dest());

    osc.start(now);
    osc.stop(now + 0.25);
  }

  // Customer Arrival Melodic Doorbell Chime (C6 -> G5 ding-dong)
  public playDoorChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [
      { freq: 1046.50, start: 0, dur: 0.35 },    // C6 "Ding"
      { freq: 783.99,  start: 0.16, dur: 0.45 }   // G5 "Dong"
    ];

    notes.forEach(n => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + n.start;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.freq, startTime);

      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + n.dur);

      osc.connect(gain);
      gain.connect(this.dest());

      osc.start(startTime);
      osc.stop(startTime + n.dur);
    });
  }

  // Metal Tongs Click (Kẹp gắp kim loại cạch cạch)
  public playTongsClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [0, 0.045].forEach(offset => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + offset;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2400, startTime);
      osc.frequency.exponentialRampToValueAtTime(800, startTime + 0.035);

      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.035);

      osc.connect(gain);
      gain.connect(this.dest());

      osc.start(startTime);
      osc.stop(startTime + 0.035);
    });
  }

  // Punchy short sizzle burst when raw food hits hot 180°C oil
  public playSizzleBurst() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const dur = 0.35;
    const bufSize = Math.floor(this.ctx.sampleRate * dur);
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufSize * 0.4));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2200, now);
    filter.Q.setValueAtTime(1.5, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.dest());

    noise.start(now);
    noise.stop(now + dur);
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
    this.sizzleGain.connect(this.dest());

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

  // Âm thanh kịch tính bất ngờ (Dramatic Sting / Suspense Chord) khi sự cố căng thẳng xuất hiện
  public playDramaticSting() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Hợp âm Dm trầm căng thẳng (D3, F3, A3, D4) với sóng sawtooth rùng rợn
    const chord = [146.83, 174.61, 220.00, 293.66];
    chord.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(180, now + 0.9);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.dest());

      osc.start(now);
      osc.stop(now + 0.9);
    });

    // Thêm tiếng sub-bass dội (low thud)
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(75, now);
    subOsc.frequency.exponentialRampToValueAtTime(35, now + 0.5);
    subGain.gain.setValueAtTime(0.35, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    subOsc.connect(subGain).connect(this.dest());
    subOsc.start(now);
    subOsc.stop(now + 0.5);
  }

  // Âm thanh hỗn loạn đám đông hoảng sợ bỏ chạy (bàn ghế đổ, xôn xao)
  public playChaosScare() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // 1. Tiếng bàn ghế va đập (heavy crash noise)
    const bufSize = Math.floor(this.ctx.sampleRate * 0.45);
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.08));
    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;
    const nFilter = this.ctx.createBiquadFilter();
    nFilter.type = 'lowpass';
    nFilter.frequency.value = 450;
    const nGain = this.ctx.createGain();
    nGain.gain.setValueAtTime(0.35, now);
    nGain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
    noise.connect(nFilter).connect(nGain).connect(this.dest());
    noise.start(now);

    // 2. Tiếng ré hoảng sợ (pitch sweep xuống nhanh)
    [380, 520, 310].forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + i * 0.06;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, t + 0.35);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.connect(gain).connect(this.dest());
      osc.start(t);
      osc.stop(t + 0.35);
    });
  }

  // Âm thanh hoạt hình dí dỏm cho sự kiện hài hước
  public playComedyBoing() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(780, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.3);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.connect(gain).connect(this.dest());
    osc.start(now);
    osc.stop(now + 0.3);
  }

  // Âm thanh ngọt ngào lãng mạn cho sự kiện tình cảm
  public playRomanceChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5 - E5 - G5 - C6
    notes.forEach((f, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.07;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      osc.connect(gain).connect(this.dest());
      osc.start(t);
      osc.stop(t + 0.45);
    });
  }

  // Âm thanh thả gia vị vào nồi sốt (tiếng bụp ngọt ngào + giọt nước sôi sủi)
  public playSpiceDrop(stepIndex: number = 0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const baseFreq = 440 + stepIndex * 80; // Cao dần theo mỗi bước đúng

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq * 1.5, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.08);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain).connect(this.dest());
    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Âm thanh hoàn thành Nồi Sốt Bí Truyền Hoàng Kim (hợp âm khải hoàn rực rỡ)
  public playSecretSauceSuccess() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Hợp âm F Major sáng rực rỡ: F4, A4, C5, F5
    const notes = [349.23, 440.00, 523.25, 698.46];
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + idx * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

      osc.connect(gain).connect(this.dest());
      osc.start(startTime);
      osc.stop(startTime + 0.6);
    });
  }

  // Âm thanh khi chọn sai gia vị (nốt trầm tiếc nuối nhẹ nhàng)
  public playSecretSauceFail() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain).connect(this.dest());
    osc.start(now);
    osc.stop(now + 0.25);
  }

  // Âm thanh vớt cặn bột chiên (tiếng vợt lưới kim loại cạo sột soạt + giọt dầu sôi xèo)
  public playCrumbCollect(index: number = 0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Tần số kim loại vợt lưới cao dần
    const baseFreq = 750 + (index % 8) * 60;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.4, now + 0.05);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(baseFreq, now);
    filter.Q.setValueAtTime(3.5, now);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(filter).connect(gain).connect(this.dest());
    osc.start(now);
    osc.stop(now + 0.08);
  }

  // Âm thanh lọc dầu hoàn thành (tiếng suối trong lành / giọt ngọc bích vang lên)
  public playOilFilterSuccess() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Rải hợp âm G Major thanh khiết: G4, B4, D5, G5
    const notes = [392.00, 493.88, 587.33, 783.99];
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + idx * 0.07;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.02, startTime + 0.5);

      gain.gain.setValueAtTime(0.22, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

      osc.connect(gain).connect(this.dest());
      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });
  }

  // Âm thanh gõ chữ Typewriter phong cách Stardew Valley (nhảy từng ký tự hội thoại)
  public playDialogueBlip(pitchOffset: number = 0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Biến thiên tần số nhẹ để giọng nói nhân vật nghe sống động
    const baseFreq = 480 + (pitchOffset % 5) * 35;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.65, now + 0.035);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(gain);
    gain.connect(this.dest());

    osc.start(now);
    osc.stop(now + 0.035);
  }

  // Âm thanh gõ gỗ mộc mạc (Wooden UI Click)
  public playWoodClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.05);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.dest());

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Âm thanh chuông vàng Stardew Valley (Hoàn thành nhiệm vụ / thu hoạch lớn)
  public playGoldChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [1046.50, 1318.51, 1567.98, 2093.00]; // C6, E6, G6, C7
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.055;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);

      osc.connect(gain);
      gain.connect(this.dest());

      osc.start(t);
      osc.stop(t + 0.38);
    });
  }

  // Âm thanh mở cuộn thư / bảng thông báo nhiệm vụ Parchment Scroll
  public playScrollOpen() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const bufSize = Math.floor(this.ctx.sampleRate * 0.15);
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.04));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    filter.Q.value = 2.0;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    noise.connect(filter).connect(gain).connect(this.dest());
    noise.start(now);
  }

  // Âm thanh vớt món ăn / nhấc gà chín vào khay (Plop âm ấm)
  public playHarvestPlop() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.07);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.07);

    osc.connect(gain);
    gain.connect(this.dest());

    osc.start(now);
    osc.stop(now + 0.07);
  }

  // Âm thanh xịt tương cà / tương ớt (tiếng phụt nước sốt vui nhộn)
  public playSquirt() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.08);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.dest());

    osc.start(now);
    osc.stop(now + 0.08);
  }
}

export const audio = new AudioManager();
