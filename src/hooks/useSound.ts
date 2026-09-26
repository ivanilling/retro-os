import { useCallback, useEffect, useRef } from 'react';

type SoundType = 'click' | 'open' | 'close' | 'error' | 'startup' | 'minimize' | 'maximize';

interface SoundConfig {
  frequency: number;
  duration: number;
  type: OscillatorType;
  volume: number;
}

const soundConfigs: Record<SoundType, SoundConfig> = {
  click: { frequency: 800, duration: 0.05, type: 'square', volume: 0.1 },
  open: { frequency: 600, duration: 0.15, type: 'sine', volume: 0.08 },
  close: { frequency: 400, duration: 0.1, type: 'sine', volume: 0.06 },
  error: { frequency: 200, duration: 0.2, type: 'sawtooth', volume: 0.05 },
  startup: { frequency: 1000, duration: 0.3, type: 'sine', volume: 0.04 },
  minimize: { frequency: 500, duration: 0.08, type: 'triangle', volume: 0.07 },
  maximize: { frequency: 700, duration: 0.1, type: 'triangle', volume: 0.07 },
};

export function useSound() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const isMutedRef = useRef(false);

  // Инициализация AudioContext при первом взаимодействии
  const initAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      try {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.warn('Web Audio API not supported');
      }
    }
    return audioCtxRef.current;
  }, []);

  // Воспроизведение звука
  const playSound = useCallback((type: SoundType) => {
    if (isMutedRef.current) return;

    const ctx = initAudioContext();
    if (!ctx) return;

    const config = soundConfigs[type];
    if (!config) return;

    try {
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
      // Silent fail
    }
  }, [initAudioContext]);

  // Установка состояния mute
  const setMuted = useCallback((muted: boolean) => {
    isMutedRef.current = muted;
  }, []);

  // Инициализация при монтировании
  useEffect(() => {
    // Попытка инициализировать при первом клике пользователя
    const handleFirstInteraction = () => {
      initAudioContext();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [initAudioContext]);

  return { playSound, setMuted };
}
