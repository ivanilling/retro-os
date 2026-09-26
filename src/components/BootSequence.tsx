import React, { useState, useEffect } from 'react';

interface BootSequenceProps {
  onComplete: () => void;
}

const BIOS_LINES = [
  'AMIBIOS (C) 1995 American Megatrends Inc.',
  'BIOS Date 01/15/95 14:22:51 Ver: 1.02',
  '',
  'CPU: Intel 486DX2-66',
  'Memory Test: 640K OK',
  '',
  'Detecting Primary Master ... [HDD 540MB]',
  'Detecting Primary Slave  ... [None]',
  '',
  'Loading RETRO OS v1.0...',
];

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [showCursor, setShowCursor] = useState(false);
  const [phase, setPhase] = useState<'bios' | 'cursor' | 'fade'>('bios');

  // BIOS phase - line by line animation
  useEffect(() => {
    if (phase !== 'bios') return;

    let lineIndex = 0;
    const interval = setInterval(() => {
      if (lineIndex < BIOS_LINES.length) {
        setVisibleLines(prev => [...prev, BIOS_LINES[lineIndex]]);
        lineIndex++;
      } else {
        clearInterval(interval);
        setShowCursor(true);
        setPhase('cursor');
      }
    }, 200);

    return () => clearInterval(interval);
  }, [phase]);

  // Cursor phase - 3 seconds then fade
  useEffect(() => {
    if (phase !== 'cursor') return;

    const timeout = setTimeout(() => {
      setPhase('fade');
      setTimeout(onComplete, 500);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [phase, onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[99999] flex items-start justify-start p-8 transition-opacity duration-500 ${
        phase === 'fade' ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ backgroundColor: '#000' }}
    >
      <div className="font-mono text-white text-sm leading-relaxed">
        {visibleLines.map((line, index) => (
          <div key={index} className="whitespace-pre">
            {line || '\u00A0'}
          </div>
        ))}
        {showCursor && (
          <span className="inline-block w-2 h-4 bg-white animate-pulse ml-1" />
        )}
      </div>
    </div>
  );
}
