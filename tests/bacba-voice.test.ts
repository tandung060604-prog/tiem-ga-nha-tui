import { describe, it, expect, beforeEach, vi } from 'vitest';
import { bacBaVoice, BacBaVoiceContext, BacBaVoiceCue } from '../src/core/bacBaVoice';
import { audio } from '../src/core/audio';

// Mock localStorage for node environment
const store: Record<string, string> = {};
const mockLocalStorage = {
  getItem: (key: string) => store[key] || null,
  setItem: (key: string, value: string) => {
    store[key] = value.toString();
  },
  removeItem: (key: string) => {
    delete store[key];
  },
  clear: () => {
    for (const k in store) delete store[k];
  }
};
(globalThis as any).localStorage = mockLocalStorage;

describe('BacBaVoiceEngine Unit Tests', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    bacBaVoice.setEnabled(true);
    vi.restoreAllMocks();
  });

  it('correctly toggles and persists voice enabled state in localStorage', () => {
    expect(bacBaVoice.isEnabled()).toBe(true);

    const newState = bacBaVoice.toggle();
    expect(newState).toBe(false);
    expect(bacBaVoice.isEnabled()).toBe(false);
    expect(mockLocalStorage.getItem('tiemgaran_bacba_voice_enabled')).toBe('false');

    bacBaVoice.setEnabled(true);
    expect(bacBaVoice.isEnabled()).toBe(true);
    expect(mockLocalStorage.getItem('tiemgaran_bacba_voice_enabled')).toBe('true');
  });

  it('respects audio master mute setting', () => {
    bacBaVoice.setEnabled(true);
    expect(bacBaVoice.isEnabled()).toBe(true);

    const muteSpy = vi.spyOn(audio, 'getMuted').mockReturnValue(true);
    expect(bacBaVoice.isEnabled()).toBe(false);

    muteSpy.mockRestore();
  });

  it('routes various BacBaVoiceContext to appropriate voice cues', () => {
    const playCueSpy = vi.spyOn(bacBaVoice, 'playCue').mockImplementation(() => {});

    // Tip Oil & Patience trigger warning cue with force=true
    bacBaVoice.speak('tip_oil');
    expect(playCueSpy).toHaveBeenLastCalledWith('warning', true);

    bacBaVoice.speak('tip_patience');
    expect(playCueSpy).toHaveBeenLastCalledWith('warning', true);

    // Tip Streak triggers praise
    bacBaVoice.speak('tip_streak');
    expect(playCueSpy).toHaveBeenLastCalledWith('praise');

    // Tip Stock & General trigger advice
    bacBaVoice.speak('tip_stock');
    expect(playCueSpy).toHaveBeenLastCalledWith('advice');

    bacBaVoice.speak('tip_general');
    expect(playCueSpy).toHaveBeenLastCalledWith('advice');

    // Instruction triggers either intro or advice
    bacBaVoice.speak('instruction');
    const lastCue = playCueSpy.mock.calls[playCueSpy.mock.calls.length - 1][0];
    expect(['intro', 'advice']).toContain(lastCue);

    // Story triggers either chuckle or advice
    bacBaVoice.speak('story');
    const storyCue = playCueSpy.mock.calls[playCueSpy.mock.calls.length - 1][0];
    expect(['chuckle', 'advice']).toContain(storyCue);

    playCueSpy.mockRestore();
  });

  it('suppresses cues when voice is disabled', () => {
    bacBaVoice.setEnabled(false);
    const playCueSpy = vi.spyOn(bacBaVoice, 'playCue');

    bacBaVoice.speak('tip_streak');
    expect(playCueSpy).not.toHaveBeenCalled();

    playCueSpy.mockRestore();
  });

  it('gracefully handles playCue and playTypewriterBabble when audio context is unavailable', () => {
    // In headless Node/Vitest, audio.context() returns null or mocked
    expect(() => {
      bacBaVoice.playCue('intro', true);
      bacBaVoice.playTypewriterBabble();
    }).not.toThrow();
  });
});
