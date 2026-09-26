import React, { useState, useEffect } from 'react';

interface BootSequenceProps {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [phase, setPhase] = useState<'bios' | 'loading' | 'desktop'>('bios');
  const [biosLines, setBiosLines] = useState<string[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // BIOS фаза
  useEffect(() => {
    if (phase !== 'bios') return;

    const biosText = [
      'RetroOS BIOS v1.0',
      'Copyright (C) 2024 Retro Systems Inc.',
      '',
      'Checking RAM... 512MB OK',
      'Detecting CPU... Virtual Core @ 3.5GHz',
      'Initializing display adapter... VGA Compatible',
      'Loading kernel modules...',
      '  - window-manager.ko',
      '  - desktop-environment.ko',
      '  - audio-driver.ko',
      'Mounting filesystems...',
      'Starting services...',
      '',
      'System ready.',
    ];

    let lineIndex = 0;
    const interval = setInterval(() => {
      if (lineIndex < biosText.length) {
        setBiosLines(prev => [...prev, biosText[lineIndex]]);
        lineIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => setPhase('loading'), 500);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [phase]);

  // Loading фаза
  useEffect(() => {
    if (phase !== 'loading') return;

    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setPhase('desktop');
            onComplete();
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [phase, onComplete]);

  if (phase === 'desktop') {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[99999] bg-black flex items-center justify-center">
      {phase === 'bios' && (
        <div className="w-full max-w-2xl p-8 font-mono text-sm text-green-400">
          {biosLines.map((line, index) => (
            <div key={index} className="whitespace-pre">
              {line || '\u00A0'}
            </div>
          ))}
          <span className="inline-block w-2 h-4 bg-green-400 animate-pulse ml-1" />
        </div>
      )}

      {phase === 'loading' && (
        <div className="text-center">
          {/* Логотип */}
          <div className="text-6xl mb-8 animate-pulse">🖥️</div>
          
          {/* Название ОС */}
          <h1 className="text-3xl font-bold text-white mb-4">
            RetroOS
          </h1>
          
          {/* Прогресс бар */}
          <div className="w-80 h-6 bg-gray-800 border-2 border-gray-600 mx-auto mb-4">
            <div
              className="h-full bg-blue-600 transition-all duration-100"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          
          {/* Текст загрузки */}
          <p className="text-gray-400 text-sm">
            {loadingProgress < 30 && 'Loading system files...'}
            {loadingProgress >= 30 && loadingProgress < 60 && 'Initializing desktop...'}
            {loadingProgress >= 60 && loadingProgress < 90 && 'Starting applications...'}
            {loadingProgress >= 90 && 'Almost ready...'}
          </p>
          
          {/* Процент */}
          <p className="text-green-400 font-mono mt-2">
            {loadingProgress}%
          </p>
        </div>
      )}
    </div>
  );
}
