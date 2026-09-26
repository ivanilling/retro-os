import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useWindowStore } from '../store/windowStore';
import { useAudio } from '../hooks/useAudio';
import AppIcon from './icons/AppIcon';

interface DesktopIconProps {
  icon: string;
  label: string;
  appId: string;
  isSelected: boolean;
  defaultX: number;
  defaultY: number;
  onDoubleClick: () => void;
}

export default function DesktopIcon({ icon, label, appId, isSelected, defaultX, defaultY, onDoubleClick }: DesktopIconProps) {
  const iconPositions = useWindowStore(s => s.iconPositions);
  const setIconPositions = useWindowStore(s => s.setIconPositions);
  const setSelectedIcon = useWindowStore(s => s.setSelectedIcon);
  const { playSound } = useAudio();
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  const savedPosition = iconPositions.find(p => p.id === appId);
  const posX = savedPosition?.x ?? defaultX;
  const posY = savedPosition?.y ?? defaultY;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setSelectedIcon(appId);
    
    dragRef.current = { startX: e.clientX, startY: e.clientY, origX: posX, origY: posY };
    setIsDragging(true);
  }, [appId, posX, posY, setSelectedIcon]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedIcon(appId);
    playSound('click');
  }, [appId, setSelectedIcon, playSound]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    playSound('open');
    onDoubleClick();
  }, [onDoubleClick, playSound]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      playSound('open');
      onDoubleClick();
    }
  }, [onDoubleClick, playSound]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragRef.current) {
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;
        const newX = Math.max(0, dragRef.current.origX + dx);
        const newY = Math.max(0, dragRef.current.origY + dy);

        const newPositions = iconPositions.filter(p => p.id !== appId);
        newPositions.push({ id: appId, x: newX, y: newY });
        setIconPositions(newPositions);
      }
    };

    const handleMouseUp = () => {
      dragRef.current = null;
      setIsDragging(false);
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
  }, [isDragging, appId, iconPositions, setIconPositions]);

  return (
    <button
      type="button"
      className={`absolute flex flex-col items-center w-20 p-1 cursor-pointer group ${
        isSelected ? 'bg-blue-800/30' : ''
      } ${isDragging ? 'opacity-80' : ''}`}
      style={{ 
        left: posX, 
        top: posY,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      role="button"
      aria-label={`Open ${label}`}
      aria-pressed={isSelected}
      tabIndex={0}
    >
      <div 
        className="w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform pointer-events-none"
        aria-hidden="true"
      >
        <AppIcon name={icon} size={32} />
      </div>
      <span 
        className={`text-xs text-center mt-1 px-1 rounded pointer-events-none ${
          isSelected ? 'bg-blue-600 text-white' : 'text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]'
        }`}
        aria-hidden="true"
      >
        {label}
      </span>
    </button>
  );
}
