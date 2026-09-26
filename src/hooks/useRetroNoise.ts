import { useRef, useEffect, useCallback } from 'react';

export interface RetroNoiseControls {
  start: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
  isPlaying: boolean;
}

/**
 * Хук для генерации процедурного ретро-шума (vinyl crackle + pink noise)
 * Использует Web Audio API для создания атмосферного шума
 */
export function useRetroNoise(): RetroNoiseControls {
  const audioContextRef = useRef<AudioContext | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const crackleIntervalRef = useRef<number | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef(false);

  // Инициализация AudioContext
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Генерация pink noise buffer
  const createPinkNoiseBuffer = useCallback((context: AudioContext, duration: number = 2): AudioBuffer => {
    const sampleRate = context.sampleRate;
    const length = sampleRate * duration;
    const buffer = context.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    // Pink noise algorithm (Voss-McCartney)
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    return buffer;
  }, []);

  // Генерация vinyl crackle
  const createCrackle = useCallback((context: AudioContext, gainNode: GainNode) => {
    const duration = 0.01 + Math.random() * 0.03; // 10-40ms
    const sampleRate = context.sampleRate;
    const length = Math.floor(sampleRate * duration);
    const buffer = context.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    // Random crackle bursts
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / length);
    }

    const source = context.createBufferSource();
    source.buffer = buffer;
    
    // Lowpass filter для мягкости
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2000;
    
    source.connect(filter);
    filter.connect(gainNode);
    source.start();
  }, []);

  // Запуск шума
  const start = useCallback(() => {
    if (isPlayingRef.current) return;

    const context = initAudioContext();
    
    // Создаём gain node
    gainNodeRef.current = context.createGain();
    gainNodeRef.current.gain.value = 0.1; // 10% volume
    gainNodeRef.current.connect(context.destination);

    // Pink noise
    const noiseBuffer = createPinkNoiseBuffer(context);
    noiseSourceRef.current = context.createBufferSource();
    noiseSourceRef.current.buffer = noiseBuffer;
    noiseSourceRef.current.loop = true;
    
    // Lowpass filter для cut harsh highs
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    
    noiseSourceRef.current.connect(filter);
    filter.connect(gainNodeRef.current);
    noiseSourceRef.current.start();

    // Vinyl crackles (случайные интервалы)
    const scheduleCrackle = () => {
      if (!isPlayingRef.current || !gainNodeRef.current) return;
      
      createCrackle(context, gainNodeRef.current);
      
      // Случайный интервал 100-2000ms
      const nextInterval = 100 + Math.random() * 1900;
      crackleIntervalRef.current = window.setTimeout(scheduleCrackle, nextInterval);
    };

    scheduleCrackle();
    isPlayingRef.current = true;
  }, [initAudioContext, createPinkNoiseBuffer, createCrackle]);

  // Остановка шума
  const stop = useCallback(() => {
    if (!isPlayingRef.current) return;

    if (noiseSourceRef.current) {
      noiseSourceRef.current.stop();
      noiseSourceRef.current.disconnect();
      noiseSourceRef.current = null;
    }

    if (crackleIntervalRef.current) {
      clearTimeout(crackleIntervalRef.current);
      crackleIntervalRef.current = null;
    }

    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
      gainNodeRef.current = null;
    }

    isPlayingRef.current = false;
  }, []);

  // Установка громкости
  const setVolume = useCallback((volume: number) => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume / 100;
    }
  }, []);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      stop();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stop]);

  return {
    start,
    stop,
    setVolume,
    isPlaying: isPlayingRef.current,
  };
}
