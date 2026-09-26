import React, { useRef, useCallback, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWindowStore } from '../store/windowStore';
import { getAppById } from '../apps/registry';
import { useAudio } from '../hooks/useAudio';
import type { WindowState } from '../types';

interface WindowProps {
  windowState: WindowState;
}

export default function Window({ windowState }: WindowProps) {
  const { id, title, appId, zIndex, position, size, isMinimized, isMaximized } = windowState;
  const focusWindow = useWindowStore(s => s.focusWindow);
  const closeWindow = useWindowStore(s => s.closeWindow);
  const minimizeWindow = useWindowStore(s => s.minimizeWindow);
  const maximizeWindow = useWindowStore(s => s.maximizeWindow);
  const restoreWindow = useWindowStore(s => s.restoreWindow);
  const moveWindow = useWindowStore(s => s.moveWindow);
  const resizeWindow = useWindowStore(s => s.resizeWindow);
  const { playSound } = useAudio();

  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; origW: number; origH: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const app = getAppById(appId);
  const AppComponent = app?.component;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMaximized) return;
    e.preventDefault();
    focusWindow(id);
    playSound('click');
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: position.x,
      origY: position.y,
    };
    setIsDragging(true);
  }, [id, position, isMaximized, focusWindow, playSound]);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    if (isMaximized) return;
    e.preventDefault();
    e.stopPropagation();
    focusWindow(id);
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origW: size.w,
      origH: size.h,
    };
  }, [id, size, isMaximized, focusWindow]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragRef.current) {
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;
        moveWindow(id, dragRef.current.origX + dx, dragRef.current.origY + dy);
      }
      if (resizeRef.current) {
        const dx = e.clientX - resizeRef.current.startX;
        const dy = e.clientY - resizeRef.current.startY;
        resizeWindow(id, resizeRef.current.origW + dx, resizeRef.current.origH + dy);
      }
    };

    const handleMouseUp = () => {
      dragRef.current = null;
      resizeRef.current = null;
      setIsDragging(false);
    };

    if (isDragging || resizeRef.current) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, id, moveWindow, resizeWindow]);

  const handleClose = () => {
    playSound('close');
    closeWindow(id);
  };

  const handleMinimize = () => {
    playSound('click');
    minimizeWindow(id);
  };

  const handleMaximize = () => {
    playSound('click');
    if (isMaximized) {
      restoreWindow(id);
    } else {
      maximizeWindow(id);
    }
  };

  if (isMinimized) return null;

  const windowStyle = isMaximized
    ? { top: 0, left: 0, width: '100%', height: 'calc(100% - 40px)', zIndex }
    : { top: position.y, left: position.x, width: size.w, height: size.h, zIndex };

  // Обработчик для всего окна — выводит на передний план при ЛЮБОМ клике
  const handleWindowMouseDown = useCallback((e: React.MouseEvent) => {
    // Не перехватываем клики на кнопках управления окном
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    
    // Выводим окно на передний план
    focusWindow(id);
  }, [id, focusWindow]);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="absolute flex flex-col shadow-2xl border-2 border-gray-600 overflow-hidden"
      style={windowStyle}
      onMouseDown={handleWindowMouseDown}
      role="dialog"
      aria-label={title}
    >
      {/* Title bar */}
      <div
        className={`flex items-center h-7 px-2 select-none shrink-0 ${
          isMaximized ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
        }`}
        style={{
          background: 'linear-gradient(180deg, #0a246a 0%, #3a6ea5 50%, #0a246a 100%)',
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleMaximize}
      >
        <span className="text-white text-xs font-bold truncate flex-1 drop-shadow-sm">
          {app?.icon} {title}
        </span>
        <div className="flex items-center gap-0.5 ml-2">
          <button
            onClick={handleMinimize}
            className="w-5 h-5 bg-gray-200 border border-gray-400 flex items-center justify-center text-xs hover:bg-gray-300 active:bg-gray-400"
            aria-label="Minimize window"
            style={{ boxShadow: 'inset 1px 1px 0 #fff, inset -1px -1px 0 #808080' }}
          >
            <span className="text-black text-[10px] leading-none">_</span>
          </button>
          <button
            onClick={handleMaximize}
            className="w-5 h-5 bg-gray-200 border border-gray-400 flex items-center justify-center text-xs hover:bg-gray-300 active:bg-gray-400"
            aria-label={isMaximized ? "Restore window" : "Maximize window"}
            style={{ boxShadow: 'inset 1px 1px 0 #fff, inset -1px -1px 0 #808080' }}
          >
            <span className="text-black text-[10px] leading-none">{isMaximized ? '❐' : '□'}</span>
          </button>
          <button
            onClick={handleClose}
            className="w-5 h-5 bg-gray-200 border border-gray-400 flex items-center justify-center text-xs hover:bg-red-500 hover:text-white active:bg-red-700"
            aria-label="Close window"
            style={{ boxShadow: 'inset 1px 1px 0 #fff, inset -1px -1px 0 #808080' }}
          >
            <span className="text-black text-[10px] leading-none">✕</span>
          </button>
        </div>
      </div>

      {/* Window content */}
      <div className="flex-1 overflow-hidden bg-gray-100 relative">
        <React.Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <div className="text-sm text-gray-500 animate-pulse">Loading...</div>
          </div>
        }>
          {AppComponent && <AppComponent />}
        </React.Suspense>
      </div>

      {/* Resize handle */}
      {!isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={handleResizeStart}
          aria-hidden="true"
          style={{
            background: 'linear-gradient(135deg, transparent 50%, #808080 50%, #808080 60%, transparent 60%, transparent 70%, #808080 70%, #808080 80%, transparent 80%)',
          }}
        />
      )}
    </motion.div>
  );
}
