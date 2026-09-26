import React, { useEffect, useRef } from 'react';

interface BSODProps {
  isActive: boolean;
  onReboot: () => void;
}

export default function BSOD({ isActive, onReboot }: BSODProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  // Генерация звука ошибки жёсткого диска
  useEffect(() => {
    if (!isActive) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      // Создаём прерывистый звук (stutter/buzz)
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(80, audioContext.currentTime);
      
      // Модуляция для эффекта "сломанного" звука
      const lfo = audioContext.createOscillator();
      const lfoGain = audioContext.createGain();
      lfo.frequency.value = 15; // 15Hz для прерывистости
      lfoGain.gain.value = 40;
      lfo.connect(lfoGain);
      lfoGain.connect(oscillator.frequency);
      
      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      lfo.start();
      
      oscillatorRef.current = oscillator;

      // Остановка через 4.5 секунды (перед перезагрузкой)
      setTimeout(() => {
        oscillator.stop();
        lfo.stop();
        audioContext.close();
      }, 4500);
    } catch (e) {
      console.warn('Audio not supported');
    }

    // Заморозка UI - отключаем все события
    const freezeUI = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    document.addEventListener('click', freezeUI, true);
    document.addEventListener('keydown', freezeUI, true);
    document.addEventListener('mousemove', freezeUI, true);

    // Автоперезагрузка через 5 секунд
    const rebootTimeout = setTimeout(() => {
      window.location.reload();
    }, 5000);

    return () => {
      clearTimeout(rebootTimeout);
      document.removeEventListener('click', freezeUI, true);
      document.removeEventListener('keydown', freezeUI, true);
      document.removeEventListener('mousemove', freezeUI, true);
      
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch (e) {}
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center"
      style={{ 
        backgroundColor: '#0000AA',
        cursor: 'none',
      }}
    >
      <div className="text-white font-mono text-center p-8 max-w-3xl" style={{ fontFamily: 'Courier New, monospace' }}>
        <div className="bg-white text-blue-900 inline-block px-4 py-2 mb-6 font-bold text-lg">
          Retro OS
        </div>
        
        <p className="text-base mb-6 text-left">
          A problem has been detected and Retro OS has been shut down to prevent damage to your computer.
        </p>
        
        <p className="text-sm mb-4 text-left font-bold">
          DRIVER_IRQL_NOT_LESS_OR_EQUAL
        </p>
        
        <p className="text-sm mb-8 text-left">
          If this is the first time you've seen this Stop error screen, restart your computer. If this screen appears again, follow these steps:
        </p>
        
        <p className="text-xs mb-8 text-left leading-relaxed">
          Check to make sure any new hardware or software is properly installed.<br/>
          If this is a new installation, ask your hardware or software manufacturer<br/>
          for any Retro OS updates you might need.
        </p>
        
        <p className="text-sm mb-4 text-left">
          Technical information:
        </p>
        
        <p className="text-xs mb-8 text-left">
          *** STOP: 0x000000D1 (0x0000000C, 0x00000002, 0x00000000, 0xF86B5A89)
        </p>
        
        <p className="text-sm text-left">
          Beginning dump of physical memory...<br/>
          Physical memory dump complete.<br/>
          Contact your system administrator or technical support group for further assistance.
        </p>
      </div>
    </div>
  );
}
