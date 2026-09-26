import React, { useState, useEffect, useRef } from 'react';
import { useWindowStore } from '../store/windowStore';
import { desktopApps, gamesApps, utilityApps } from '../apps/registry';
import { useAudio } from '../hooks/useAudio';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  action: 'app' | 'folder' | 'settings' | 'about' | 'separator' | 'shutdown';
  appId?: string;
  title?: string;
  defaultSize?: { w: number; h: number };
}

const menuItems: MenuItem[] = [
  // Основные приложения
  ...desktopApps.map(app => ({
    id: app.id,
    label: app.title,
    icon: app.icon,
    action: 'app' as const,
    appId: app.id,
    title: app.title,
    defaultSize: app.defaultSize,
  })),
  { id: 'sep1', label: '', icon: '', action: 'separator' },
  // Папка Games
  {
    id: 'games-folder',
    label: 'Games',
    icon: '🎮',
    action: 'folder' as const,
    appId: 'games-folder',
    title: 'Games',
    defaultSize: { w: 600, h: 450 },
  },
  // Отдельные игры (для быстрого доступа)
  ...gamesApps.map(app => ({
    id: app.id,
    label: app.title,
    icon: app.icon,
    action: 'app' as const,
    appId: app.id,
    title: app.title,
    defaultSize: app.defaultSize,
  })),
  { id: 'sep2', label: '', icon: '', action: 'separator' },
  // Утилиты
  ...utilityApps.map(app => ({
    id: app.id,
    label: app.title,
    icon: app.icon,
    action: (app.id === 'settings' ? 'settings' : 'about') as 'settings' | 'about',
    appId: app.id,
    title: app.title,
    defaultSize: app.defaultSize,
  })),
  { id: 'sep3', label: '', icon: '', action: 'separator' },
  { id: 'shutdown', label: 'Shut Down...', icon: '⏻', action: 'shutdown' },
];

const actionableItems = menuItems.filter(item => item.action !== 'separator');

export default function StartMenu() {
  const startMenuOpen = useWindowStore(s => s.startMenuOpen);
  const closeStartMenu = useWindowStore(s => s.closeStartMenu);
  const openWindow = useWindowStore(s => s.openWindow);
  const { playSound } = useAudio();
  const [focusIndex, setFocusIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (startMenuOpen && menuRef.current) {
      menuRef.current.focus();
      setFocusIndex(0);
    }
  }, [startMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        const target = e.target as HTMLElement;
        if (!target.closest('[data-start-button]')) {
          closeStartMenu();
        }
      }
    };
    if (startMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [startMenuOpen, closeStartMenu]);

  const handleItemClick = (item: MenuItem) => {
    if (item.action === 'separator' || item.action === 'shutdown') return;
    playSound('open');
    if (item.appId && item.title && item.defaultSize) {
      openWindow(item.appId, item.title, item.appId, item.defaultSize);
    }
    closeStartMenu();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusIndex(prev => Math.min(prev + 1, actionableItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = actionableItems[focusIndex];
      if (item) handleItemClick(item);
    } else if (e.key === 'Escape') {
      closeStartMenu();
    }
  };

  if (!startMenuOpen) return null;

  let actionableIdx = -1;

  return (
    <div
      ref={menuRef}
      className="absolute bottom-10 left-0 w-64 bg-gray-200 border-2 border-gray-400 shadow-xl z-[9999] overflow-hidden"
      style={{ boxShadow: 'inset 1px 1px 0 #fff, inset -1px -1px 0 #808080, 4px 4px 8px rgba(0,0,0,0.3)' }}
      role="menu"
      aria-label="Start Menu"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
    >
      {/* Side banner */}
      <div className="flex">
        <div
          className="w-8 flex items-end justify-center pb-2 shrink-0"
          style={{
            background: 'linear-gradient(180deg, #0a246a 0%, #3a6ea5 100%)',
            minHeight: '400px',
          }}
        >
          <span
            className="text-white text-[10px] font-bold"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            RETRO OS
          </span>
        </div>

        {/* Menu items */}
        <div className="flex-1 py-1 max-h-96 overflow-y-auto">
          {menuItems.map((item) => {
            if (item.action === 'separator') {
              return <div key={item.id} className="border-t border-gray-400 my-1 mx-2" style={{ boxShadow: '0 1px 0 #fff' }} />;
            }

            actionableIdx++;
            const currentActionableIdx = actionableIdx;
            const isFocused = currentActionableIdx === focusIndex;

            return (
              <button
                key={item.id}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors ${
                  isFocused ? 'bg-blue-600 text-white' : 'hover:bg-blue-600 hover:text-white'
                }`}
                onClick={() => handleItemClick(item)}
                onMouseEnter={() => setFocusIndex(currentActionableIdx)}
                role="menuitem"
                aria-label={item.label}
              >
                <span className="text-xl w-7 text-center">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
