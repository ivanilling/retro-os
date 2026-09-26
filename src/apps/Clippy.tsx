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
    const randomInterval = Math.random() * 180000 + 120000;
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

      {/* Clippy Character - Proper Paperclip Shape */}
      <div 
        className={`cursor-pointer ${isMinimized ? 'opacity-50 hover:opacity-100' : ''}`}
        onClick={handleMinimize}
      >
        <svg width="60" height="80" viewBox="0 0 60 80" className="drop-shadow-lg">
          {/* Main wire body - outer loop */}
          <path 
            d="M 30 10 
               L 30 5 
               Q 30 0 35 0 
               L 50 0 
               Q 55 0 55 5 
               L 55 60 
               Q 55 65 50 65 
               L 10 65 
               Q 5 65 5 60 
               L 5 20 
               Q 5 15 10 15 
               L 20 15 
               Q 25 15 25 20 
               L 25 55 
               Q 25 60 30 60 
               L 45 60 
               Q 50 60 50 55 
               L 50 10 
               Q 50 5 45 5 
               L 35 5 
               Q 30 5 30 10 Z"
            fill="none"
            stroke="#808080"
            strokeWidth="3"
          />
          
          {/* Inner wire loop */}
          <path 
            d="M 30 15 
               L 30 12 
               Q 30 10 32 10 
               L 42 10 
               Q 45 10 45 12 
               L 45 50 
               Q 45 52 42 52 
               L 18 52 
               Q 15 52 15 50 
               L 15 25 
               Q 15 22 18 22 
               L 22 22 
               Q 25 22 25 25 
               L 25 45 
               Q 25 48 28 48 
               L 38 48 
               Q 40 48 40 45 
               L 40 18 
               Q 40 15 38 15 
               L 32 15 
               Q 30 15 30 18 Z"
            fill="none"
            stroke="#a0a0a0"
            strokeWidth="2"
          />

          {/* Eyes on the wire loops */}
          {/* Left eye - on outer loop */}
          <circle cx="15" cy="35" r="5" fill="#fff" stroke="#000" strokeWidth="1"/>
          <circle cx="16" cy="36" r="2.5" fill="#000"/>
          
          {/* Right eye - on outer loop */}
          <circle cx="45" cy="35" r="5" fill="#fff" stroke="#000" strokeWidth="1"/>
          <circle cx="46" cy="36" r="2.5" fill="#000"/>
          
          {/* Animated eyebrows */}
          <path d="M 10 28 Q 15 25 20 28" stroke="#000" strokeWidth="2" fill="none">
            <animate attributeName="d" 
                     values="M 10 28 Q 15 25 20 28;M 10 30 Q 15 27 20 30;M 10 28 Q 15 25 20 28" 
                     dur="3s" 
                     repeatCount="indefinite"/>
          </path>
          <path d="M 40 28 Q 45 25 50 28" stroke="#000" strokeWidth="2" fill="none">
            <animate attributeName="d" 
                     values="M 40 28 Q 45 25 50 28;M 40 30 Q 45 27 50 30;M 40 28 Q 45 25 50 28" 
                     dur="3s" 
                     repeatCount="indefinite"/>
          </path>
          
          {/* Mouth - small smile */}
          <path d="M 25 42 Q 30 45 35 42" stroke="#000" strokeWidth="1.5" fill="none"/>
          
          {/* Shine effect */}
          <ellipse cx="20" cy="30" rx="2" ry="3" fill="#fff" opacity="0.6"/>
        </svg>
      </div>
    </div>
  );
}
