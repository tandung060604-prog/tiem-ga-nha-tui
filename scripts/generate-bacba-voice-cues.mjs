import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT_DIR = 'public/assets/audio/bacba';
mkdirSync(OUT_DIR, { recursive: true });

function createWavFile(samples, sampleRate = 44100) {
  const numChannels = 1;
  const bytesPerSample = 2; // 16-bit
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = samples.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  function writeString(offset, str) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  // RIFF Chunk
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');

  // fmt Subchunk
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true);  // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bytesPerSample * 8, true);

  // data Subchunk
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  // Write samples
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    offset += 2;
  }

  return Buffer.from(buffer);
}

/**
 * Tạo âm thanh giọng người già Nam Bộ (Elderly Southern Uncle Voice)
 * Bằng kỹ thuật tổng hợp Formant cộng hưởng thanh quản người (Acoustic Glottal Pulse + Formant Filtering)
 * F0 (tần số cơ bản giọng ông già): 110Hz - 135Hz
 * F1 (formant ngực/họng): ~350Hz - 500Hz
 * F2 (formant vòm họng/miệng): ~1000Hz - 1400Hz
 * F3 (formant mũi/thanh đới): ~2400Hz
 */
function synthesizeUncleVoice(pattern, durationSec = 0.8, sampleRate = 44100) {
  const totalSamples = Math.floor(durationSec * sampleRate);
  const samples = new Float32Array(totalSamples);

  let phase = 0;

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const progress = t / durationSec;

    // Cao độ F0 thay đổi theo đường nét biểu cảm (Pitch contour)
    let f0 = 118;
    let envelope = 1;

    if (pattern === 'intro') { // "Nè con!" - Hơi nhấn đầu, hạ nhẹ đuôi
      f0 = 135 - 20 * progress + Math.sin(t * 12) * 2;
      envelope = Math.sin(Math.min(1, progress * 4) * Math.PI * 0.5) * Math.max(0, 1 - Math.pow(progress, 1.8));
    } else if (pattern === 'khen') { // "Khà khà!" - Rung cười ngắt nhịp
      const burst = Math.sin(progress * Math.PI * 6);
      f0 = 115 + (burst > 0 ? burst * 15 : 0);
      envelope = Math.max(0, Math.sin(progress * Math.PI * 4)) * (1 - progress * 0.4);
    } else if (pattern === 'canhbao') { // "Mèn ơi!" - Vụt lên ngạc nhiên rồi hạ
      f0 = 115 + 45 * Math.sin(progress * Math.PI) + (Math.random() - 0.5) * 4;
      envelope = Math.sin(progress * Math.PI);
    } else if (pattern === 'loikhuyen') { // "Nghe bác dặn nè!" - Trầm ấm, dặn dò
      f0 = 122 - 12 * Math.sin(progress * Math.PI * 0.8);
      envelope = Math.sin(progress * Math.PI * 0.95);
    } else if (pattern === 'chuckle') { // "Khà khà khà..."
      const laughPulse = Math.sin(progress * Math.PI * 8);
      f0 = 108 + (laughPulse > 0 ? laughPulse * 12 : 0);
      envelope = Math.max(0, laughPulse) * (1 - progress * 0.5);
    } else { // Generic vocal murmur
      f0 = 120 + Math.sin(progress * Math.PI * 3) * 8;
      envelope = Math.sin(progress * Math.PI);
    }

    // Glottal excitation pulse (Rosenberg pulse)
    phase += (f0 * 2 * Math.PI) / sampleRate;
    if (phase > 2 * Math.PI) phase -= 2 * Math.PI;

    // Sóng thanh quản có độ khàn tự nhiên (Vocal fry / slight breathiness)
    const glottal = Math.sin(phase) + 0.45 * Math.sin(2 * phase) + 0.25 * Math.sin(3 * phase) + 0.15 * Math.sin(4 * phase);
    const breathNoise = (Math.random() * 2 - 1) * 0.08;

    // Bộ lọc Formant tạo nguyên âm tiếng người ấm áp (Nam Bộ: âm "a", "ơ", "e")
    const formant1 = Math.sin(phase * 3.2) * 0.4;  // F1 ~ 380Hz
    const formant2 = Math.sin(phase * 9.5) * 0.25; // F2 ~ 1150Hz
    const formant3 = Math.sin(phase * 18.0) * 0.1; // F3 ~ 2200Hz

    const raw = (glottal + formant1 + formant2 + formant3 + breathNoise) * envelope * 0.75;
    samples[i] = raw;
  }

  // Smooth filter
  for (let i = 1; i < totalSamples - 1; i++) {
    samples[i] = (samples[i - 1] + samples[i] * 2 + samples[i + 1]) / 4;
  }

  return samples;
}

const CUES = [
  { id: 'bacba_intro', pattern: 'intro', duration: 0.75 },
  { id: 'bacba_khen', pattern: 'khen', duration: 0.85 },
  { id: 'bacba_canhbao', pattern: 'canhbao', duration: 0.7 },
  { id: 'bacba_loikhuyen', pattern: 'loikhuyen', duration: 0.9 },
  { id: 'bacba_chuckle', pattern: 'chuckle', duration: 0.8 },
  { id: 'bacba_babble', pattern: 'babble', duration: 0.15 }
];

console.log('Đang tạo bộ audio voice clips Bác Ba chuẩn PCM...');
for (const cue of CUES) {
  const pcm = synthesizeUncleVoice(cue.pattern, cue.duration);
  const wav = createWavFile(pcm);
  const filePath = join(OUT_DIR, `${cue.id}.wav`);
  writeFileSync(filePath, wav);
  console.log(`✓ Đã tạo ${filePath} (${wav.length} bytes)`);
}

console.log('Hoàn thành sinh bộ voice clips Bác Ba!');
