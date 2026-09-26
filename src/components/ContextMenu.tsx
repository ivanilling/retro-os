import React, { useEffect, useRef } from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onRefresh: () => void;
  onChangeWallpaper: () => void;
  onProperties: () => void;
  onNewFolder: () => void;
}

export default function ContextMenu({
  x,
  y,
  onClose,
  onRefresh,
  onChangeWallpaper,
  onProperties,
  onNewFolder,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Закрытие при клике вне меню
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Закрытие при нажатии Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Корректировка позиции, если меню выходит за границы
  const adjustedX = Math.min(x, window.innerWidth - 200);
  const adjustedY = Math.min(y, window.innerHeight - 200);

  return (
    <div
      ref={menuRef}
      className="fixed bg-gray-200 border-2 border-gray-400 shadow-lg z-[9998] py-1 min-w-[180px]"
      style={{
        left: adjustedX,
        top: adjustedY,
        boxShadow: 'inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080, 2px 2px 4px rgba(0,0,0,0.3)',
      }}
      role="menu"
      aria-label="Desktop context menu"
    >
      <button
        onClick={() => {
          onRefresh();
          onClose();
        }}
        className="w-full text-left px-4 py-1.5 text-sm hover:bg-blue-600 hover:text-white flex items-center gap-2"
        role="menuitem"
      >
        <span>🔄</span>
        <span>Refresh</span>
      </button>

      <div className="border-t border-gray-400 my-1" />

      <button
        onClick={() => {
          onChangeWallpaper();
          onClose();
        }}
        className="w-full text-left px-4 py-1.5 text-sm hover:bg-blue-600 hover:text-white flex items-center gap-2"
        role="menuitem"
      >
        <span>🖼️</span>
        <span>Change Wallpaper</span>
      </button>

      <button
        onClick={() => {
          onNewFolder();
          onClose();
        }}
        className="w-full text-left px-4 py-1.5 text-sm hover:bg-blue-600 hover:text-white flex items-center gap-2"
        role="menuitem"
      >
        <span>📁</span>
        <span>New Folder</span>
      </button>

      <div className="border-t border-gray-400 my-1" />

      <button
        onClick={() => {
          onProperties();
          onClose();
        }}
        className="w-full text-left px-4 py-1.5 text-sm hover:bg-blue-600 hover:text-white flex items-center gap-2"
        role="menuitem"
      >
        <span>⚙️</span>
        <span>Properties</span>
      </button>
    </div>
  );
}
