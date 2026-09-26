import { useCallback, useRef } from 'react';
import { useSettingsStore } from '../store/settingsStore';

type SoundType = 'click' | 'open' | 'close' | 'error' | 'startup';

const soundConfigs: Record<SoundType, { frequency: number; duration: number; type: OscillatorType; volume: number }> = {
  click: { frequency: 800, duration: 0.05, type: 'square', volume: 0.1 },
  open: { frequency: 600, duration: 0.15, type: 'sine', volume: 0.08 },
  close: { frequency: 400, duration: 0.1, type: 'sine', volume: 0.06 },
  error: { frequency: 200, duration: 0.2, type: 'sawtooth', volume: 0.05 },
  startup: { frequency: 1000, duration: 0.3, type: 'sine', volume: 0.04 },
};

export function useAudio() {
  const soundEnabled = useSettingsStore(s => s.soundEnabled);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtxRef.current;
  }, []);

  const playSound = useCallback((type: SoundType) => {
    if (!soundEnabled) return;

    try {
      const ctx = getAudioContext();
      const config = soundConfigs[type];
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = config.type;
      oscillator.frequency.setValueAtTime(config.frequency, ctx.currentTime);
      gainNode.gain.setValueAtTime(config.volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + config.duration);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + config.duration);
    } catch (e) {
      // Silently fail if audio not available
    }
  }, [soundEnabled, getAudioContext]);

  return { playSound };
}
