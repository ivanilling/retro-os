import React, { useState, useEffect } from 'react';

interface ClippyProps {
  windowId?: string;
}

const tips = [
  "Looks like you're coding a portfolio. Need help?",
  "Have you tried the Snake game?",
  "Did you know you can drag windows by their title bar?",
  "Try typing 'help' in the Terminal!",
  "Press P to pause games.",
  "Right-click the desktop for more options!",
  "You can resize windows by dragging the corner.",
  "The Games folder has 4 classic games!",
];

export default function Clippy({ windowId }: ClippyProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTip, setCurrentTip] = useState(tips[0]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [idleTime, setIdleTime] = useState(0);

  // Отслеживание бездействия
  useEffect(() => {
    const handleActivity = () => setIdleTime(0);
    
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    const interval = setInterval(() => {
      setIdleTime(prev => prev + 1);
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      clearInterval(interval);
    };
  }, []);

  // Появление после 30 секунд бездействия или случайно
  useEffect(() => {
    if (idleTime === 30 && !isVisible) {
      showRandomTip();
      setIsVisible(true);
    }

    // Случайное появление каждые 2-5 минут
    const randomInterval = Math.random() * 180000 + 120000; // 2-5 минут
    const timeout = setTimeout(() => {
      if (!isVisible) {
        showRandomTip();
        setIsVisible(true);
      }
    }, randomInterval);

    return () => clearTimeout(timeout);
  }, [idleTime, isVisible]);

  const showRandomTip = () => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    setCurrentTip(tips[randomIndex]);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-12 right-4 z-[9997] flex flex-col items-end">
      {!isMinimized && (
        <>
          {/* Speech Bubble */}
          <div 
            className="bg-white border-2 border-black p-3 mb-2 max-w-xs relative"
            style={{ boxShadow: '2px 2px 0 #000' }}
          >
            <p className="text-sm text-black">{currentTip}</p>
            
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold hover:bg-red-600"
              aria-label="Close Clippy"
            >
              ×
            </button>

            {/* Arrow pointing to Clippy */}
            <div className="absolute bottom-[-10px] right-8 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-black"></div>
            <div className="absolute bottom-[-7px] right-9 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white"></div>
          </div>
        </>
      )}

      {/* Clippy Character (SVG) */}
      <div 
        className={`cursor-pointer ${isMinimized ? 'opacity-50 hover:opacity-100' : ''}`}
        onClick={handleMinimize}
      >
        <svg width="80" height="100" viewBox="0 0 80 100" className="drop-shadow-lg">
          {/* Body */}
          <ellipse cx="40" cy="60" rx="25" ry="35" fill="#c0c0c0" stroke="#000" strokeWidth="2"/>
          
          {/* Eyes */}
          <circle cx="32" cy="50" r="8" fill="#fff" stroke="#000" strokeWidth="2"/>
          <circle cx="48" cy="50" r="8" fill="#fff" stroke="#000" strokeWidth="2"/>
          <circle cx="34" cy="52" r="4" fill="#000"/>
          <circle cx="50" cy="52" r="4" fill="#000"/>
          
          {/* Eyebrows */}
          <path d="M 25 42 Q 32 38 39 42" stroke="#000" strokeWidth="2" fill="none"/>
          <path d="M 41 42 Q 48 38 55 42" stroke="#000" strokeWidth="2" fill="none"/>
          
          {/* Mouth */}
          <path d="M 30 65 Q 40 70 50 65" stroke="#000" strokeWidth="2" fill="none"/>
          
          {/* Paperclip top */}
          <path d="M 40 25 L 40 15 Q 40 10 45 10 L 55 10 Q 60 10 60 15 L 60 35" 
                stroke="#808080" strokeWidth="3" fill="none"/>
          
          {/* Paperclip bottom */}
          <path d="M 40 85 L 40 95 Q 40 100 35 100 L 25 100 Q 20 100 20 95 L 20 75" 
                stroke="#808080" strokeWidth="3" fill="none"/>
          
          {/* Shine */}
          <ellipse cx="35" cy="45" rx="3" ry="5" fill="#fff" opacity="0.5"/>
        </svg>
      </div>
    </div>
  );
}
