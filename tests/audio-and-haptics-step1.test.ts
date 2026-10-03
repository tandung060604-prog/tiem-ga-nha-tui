import { describe, it, expect, vi } from 'vitest';
import { zzfxGenerate, audio } from '../src/core/audio';
import { Haptics } from '../src/core/haptics';

describe('Step 1: ZzFX Procedural Audio & Advanced Haptics Integration Tests', () => {
  describe('ZzFX Micro-Synthesizer Core Algorithm', () => {
    it('generates non-empty valid audio samples normalized between -1 and 1', () => {
      const samples = zzfxGenerate(0.3, 0.05, 1200, 0.01, 0.08, 0.2, 1);
      expect(samples.length).toBeGreaterThan(0);

      // Mọi sample phải là số thực hợp lệ trong khoảng [-1, 1] và không có NaN
      for (const sample of samples) {
        expect(Number.isNaN(sample)).toBe(false);
        expect(sample).toBeGreaterThanOrEqual(-1);
        expect(sample).toBeLessThanOrEqual(1);
      }
    });

    it('handles different waveform shapes (sine, triangle, sawtooth, square, noise)', () => {
      for (let shape = 0; shape <= 4; shape++) {
        const samples = zzfxGenerate(0.2, 0, 440, 0.01, 0.02, 0.05, shape);
        expect(samples.length).toBeGreaterThan(0);
        expect(Number.isNaN(samples[0])).toBe(false);
      }
    });

    it('correctly calculates total length based on ADSR envelope and sampleRate', () => {
      const sampleRate = 44100;
      const attack = 0.05;
      const decay = 0.05;
      const sustain = 0.1;
      const release = 0.1;
      const delay = 0.02;

      const samples = zzfxGenerate(0.5, 0, 300, attack, sustain, release, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, delay, 1, decay, 0, sampleRate);
      const expectedLength = Math.floor((attack + decay + sustain + release + delay) * sampleRate);
      expect(samples.length).toBe(expectedLength);
    });
  });

  describe('AudioManager ZzFX Presets Playback Safety in Headless/Test Mode', () => {
    it('executes all 7 ZzFX presets without throwing errors when audio context is null or mocked', () => {
      expect(() => audio.playCoinChing()).not.toThrow();
      expect(() => audio.playPourFizz()).not.toThrow();
      expect(() => audio.playCrispyDrop()).not.toThrow();
      expect(() => audio.playServingBell()).not.toThrow();
      expect(() => audio.playWoodClean()).not.toThrow();
      expect(() => audio.playThiefBusted()).not.toThrow();
      expect(() => audio.playComboFanfare()).not.toThrow();
    });

    it('respects isMuted state without errors', () => {
      const originalMute = audio.getMuted();
      audio.setMuted(true);
      expect(() => audio.playCoinChing()).not.toThrow();
      expect(() => audio.playPourFizz()).not.toThrow();
      audio.setMuted(originalMute);
    });
  });

  describe('Enhanced Mobile Haptics Engine', () => {
    it('safely invokes all haptic methods even without navigator.vibrate support', () => {
      expect(() => Haptics.tap()).not.toThrow();
      expect(() => Haptics.perfect()).not.toThrow();
      expect(() => Haptics.serveSuccess()).not.toThrow();
      expect(() => Haptics.warning()).not.toThrow();
      expect(() => Haptics.coin()).not.toThrow();
      expect(() => Haptics.pourDrink()).not.toThrow();
      expect(() => Haptics.cleanTable()).not.toThrow();
      expect(() => Haptics.combo()).not.toThrow();
      expect(() => Haptics.thiefBusted()).not.toThrow();
    });

    it('triggers navigator.vibrate with correct pattern when API is present', () => {
      const mockVibrate = vi.fn();
      const originalNavigator = globalThis.navigator;

      // Mock navigator.vibrate
      Object.defineProperty(globalThis, 'navigator', {
        value: { vibrate: mockVibrate },
        configurable: true,
        writable: true
      });

      Haptics.coin();
      expect(mockVibrate).toHaveBeenCalledWith([12, 30, 16]);

      Haptics.pourDrink();
      expect(mockVibrate).toHaveBeenCalledWith([8, 15, 8]);

      Haptics.cleanTable();
      expect(mockVibrate).toHaveBeenCalledWith([14, 25, 14]);

      Haptics.combo();
      expect(mockVibrate).toHaveBeenCalledWith([15, 25, 20, 25, 30]);

      Haptics.thiefBusted();
      expect(mockVibrate).toHaveBeenCalledWith([40, 30, 80]);

      // Restore
      Object.defineProperty(globalThis, 'navigator', {
        value: originalNavigator,
        configurable: true,
        writable: true
      });
    });
  });
});
