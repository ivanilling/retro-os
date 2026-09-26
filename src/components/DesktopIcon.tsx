import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useWindowStore } from '../store/windowStore';
import { useAudio } from '../hooks/useAudio';

interface DesktopIconProps {
  id: string;
  label: string;
  icon: string;
  defaultX: number;
  defaultY: number;
  onDoubleClick: () => void;
}

export default function DesktopIcon({ id, label, icon, defaultX, defaultY, onDoubleClick }: DesktopIconProps) {
  const iconPositions = useWindowStore(s => s.iconPositions);
  const setIconPositions = useWindowStore(s => s.setIconPositions);
  const { playSound } = useAudio();
  const [isDragging, setIsDragging] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  const savedPosition = iconPositions.find(p => p.id === id);
  const posX = savedPosition?.x ?? defaultX;
  const posY = savedPosition?.y ?? defaultY;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsSelected(true);
    dragRef.current = { startX: e.clientX, startY: e.clientY, origX: posX, origY: posY };
    setIsDragging(true);
  }, [posX, posY]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragRef.current) {
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;
        const newX = Math.max(0, dragRef.current.origX + dx);
        const newY = Math.max(0, dragRef.current.origY + dy);

        const newPositions = iconPositions.filter(p => p.id !== id);
        newPositions.push({ id, x: newX, y: newY });
        setIconPositions(newPositions);
      }
    };

    const handleMouseUp = () => {
      dragRef.current = null;
      setIsDragging(false);
      // Save to localStorage
      try {
        const positions = useWindowStore.getState().iconPositions;
        localStorage.setItem('retro-os-icon-positions', JSON.stringify(positions));
      } catch (e) { /* ignore */ }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, id, iconPositions, setIconPositions]);

  return (
    <div
      className={`absolute flex flex-col items-center w-20 p-1 cursor-pointer select-none group ${
        isSelected ? 'bg-blue-800/30' : ''
      } ${isDragging ? 'opacity-80' : ''}`}
      style={{ left: posX, top: posY }}
      onMouseDown={handleMouseDown}
      onDoubleClick={() => {
        playSound('open');
        onDoubleClick();
      }}
      onClick={() => setIsSelected(true)}
      role="button"
      aria-label={`Open ${label}`}
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          playSound('open');
          onDoubleClick();
        }
      }}
    >
      <span className="text-3xl drop-shadow-md group-hover:scale-110 transition-transform">{icon}</span>
      <span className={`text-xs text-center mt-1 px-1 rounded ${
        isSelected ? 'bg-blue-600 text-white' : 'text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]'
      }`}>
        {label}
      </span>
    </div>
  );
}
