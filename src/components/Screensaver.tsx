import React, { useEffect, useState, useRef } from 'react';

interface FlyingWindow {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  title: string;
  color: string;
}

export default function Screensaver() {
  const [windows, setWindows] = useState<FlyingWindow[]>([]);
  const animationRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Создаём начальные окна
    const titles = ['My Computer', 'Notepad', 'Terminal', 'Paint', 'Browser', 'Settings'];
    const colors = ['#000080', '#800000', '#008000', '#808000', '#008080', '#800080'];
    
    const initialWindows: FlyingWindow[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * (window.innerWidth - 200),
      y: Math.random() * (window.innerHeight - 150),
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      width: 180 + Math.random() * 80,
      height: 120 + Math.random() * 60,
      title: titles[i % titles.length],
      color: colors[i % colors.length],
    }));

    setWindows(initialWindows);

    // Анимация
    const animate = () => {
      setWindows(prevWindows => 
        prevWindows.map(win => {
          let newX = win.x + win.vx;
          let newY = win.y + win.vy;
          let newVx = win.vx;
          let newVy = win.vy;

          // Отскок от границ
          if (newX <= 0 || newX + win.width >= window.innerWidth) {
            newVx = -newVx;
            newX = Math.max(0, Math.min(newX, window.innerWidth - win.width));
          }
          if (newY <= 0 || newY + win.height >= window.innerHeight) {
            newVy = -newVy;
            newY = Math.max(0, Math.min(newY, window.innerHeight - win.height));
          }

          return {
            ...win,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
          };
        })
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99998] bg-black overflow-hidden cursor-none"
      role="dialog"
      aria-label="Screensaver active"
    >
      {/* Летающие окна */}
      {windows.map(win => (
        <div
          key={win.id}
          className="absolute border-2 border-gray-600 shadow-lg"
          style={{
            left: win.x,
            top: win.y,
            width: win.width,
            height: win.height,
            transform: 'translateZ(0)', // GPU acceleration
          }}
        >
          {/* Title bar */}
          <div
            className="h-6 flex items-center px-2"
            style={{
              background: `linear-gradient(180deg, ${win.color} 0%, ${win.color}cc 100%)`,
            }}
          >
            <span className="text-white text-xs font-bold truncate">
              {win.title}
            </span>
          </div>
          
          {/* Content area */}
          <div className="h-[calc(100%-24px)] bg-gray-200 p-2">
            <div className="w-full h-full bg-white border border-gray-400" />
          </div>
        </div>
      ))}

      {/* Текст подсказки */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm opacity-50">
        Move mouse or press any key to exit
      </div>
    </div>
  );
}
