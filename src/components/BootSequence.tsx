import React, { useState, useEffect } from 'react';

interface BootSequenceProps {
  onComplete: () => void;
}

const BIOS_LINES = [
  'AMIBIOS (C) 1995 American Megatrends Inc.',
  'BIOS Date 01/15/95 14:22:51 Ver: 1.02',
  'CPU: Intel 486DX2-66',
  'Speed: 66 MHz',
  'Memory Test: 640K OK',
  '',
  'Detecting Primary Master ... [HDD 540MB]',
  'Detecting Primary Slave  ... [None]',
  'Detecting Secondary Master ... [CD-ROM DRIVE]',
  '',
  'Initializing USB Controllers .. Done.',
  'Loading VGA Drivers ............ Done.',
  'Mounting Virtual File System ... Done.',
  '',
  'Starting RETRO OS v1.0...',
];

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [showCursor, setShowCursor] = useState(false);
  const [phase, setPhase] = useState<'bios' | 'cursor' | 'fade'>('bios');

  // BIOS phase - line by line animation (50ms delay)
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
    }, 50);

    return () => clearInterval(interval);
  }, [phase]);

  // Cursor phase - 2 seconds then fade
  useEffect(() => {
    if (phase !== 'cursor') return;

    const timeout = setTimeout(() => {
      setPhase('fade');
      setTimeout(onComplete, 500);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [phase, onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[99999] flex items-start justify-start p-8 transition-opacity duration-500 ${
        phase === 'fade' ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ backgroundColor: '#000000' }}
    >
      <div 
        className="text-sm leading-relaxed"
        style={{ 
          fontFamily: "'Courier New', Courier, monospace",
          color: '#33FF33',
        }}
      >
        {visibleLines.map((line, index) => (
          <div key={index} className="whitespace-pre">
            {line || '\u00A0'}
          </div>
        ))}
        {showCursor && (
          <span 
            className="inline-block w-2 h-4 animate-pulse ml-1"
            style={{ backgroundColor: '#33FF33' }}
          />
        )}
      </div>
    </div>
  );
}
