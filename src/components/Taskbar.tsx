import React, { useState, useEffect } from 'react';
import { useWindowStore } from '../store/windowStore';
import { useSettingsStore } from '../store/settingsStore';
import { useSound } from '../hooks/useSound';
import StartMenu from './StartMenu';
import AppIcon from './icons/AppIcon';

export default function Taskbar() {
  const windows = useWindowStore(s => s.windows);
  const focusWindow = useWindowStore(s => s.focusWindow);
  const minimizeWindow = useWindowStore(s => s.minimizeWindow);
  const toggleStartMenu = useWindowStore(s => s.toggleStartMenu);
  const startMenuOpen = useWindowStore(s => s.startMenuOpen);
  const soundEnabled = useSettingsStore(s => s.soundEnabled);
  const toggleSound = useSettingsStore(s => s.toggleSound);
  const { playSound, setMuted } = useSound();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setMuted(!soundEnabled);
  }, [soundEnabled, setMuted]);

  const handleTaskClick = (id: string, isMinimized: boolean) => {
    playSound('click');
    if (isMinimized) {
      focusWindow(id);
    } else {
      minimizeWindow(id);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 h-10 flex items-center px-1 z-[9998]"
        style={{
          background: 'linear-gradient(180deg, #c8c8c8 0%, #b0b0b0 10%, #d4d4d4 50%, #c0c0c0 90%, #a0a0a0 100%)',
          borderTop: '2px solid #e0e0e0',
        }}
        aria-label="Taskbar"
        role="navigation"
      >
        {/* Start Button */}
        <button
          data-start-button
          onClick={() => {
            playSound('click');
            toggleStartMenu();
          }}
          className={`flex items-center gap-1.5 px-3 py-1 font-bold text-sm border-2 h-8 mr-2 ${
            startMenuOpen
              ? 'border-gray-600 bg-gray-300'
              : 'hover:bg-gray-200'
          }`}
          style={{
            boxShadow: startMenuOpen
              ? 'inset 1px 1px 0 #808080, inset -1px -1px 0 #fff'
              : 'inset 1px 1px 0 #fff, inset -1px -1px 0 #808080',
          }}
          aria-label="Start menu"
          aria-expanded={startMenuOpen}
          aria-haspopup="menu"
        >
          <span className="text-base">🪟</span>
          <span>Start</span>
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-400 mr-2" style={{ boxShadow: '1px 0 0 #fff' }} />

        {/* Open windows tabs */}
        <div className="flex-1 flex items-center gap-1 overflow-x-auto">
          {windows.map(win => (
            <button
              key={win.id}
              onClick={() => handleTaskClick(win.id, win.isMinimized)}
              className={`flex items-center gap-1.5 px-2 py-1 text-xs border h-7 max-w-40 truncate ${
                !win.isMinimized
                  ? 'border-gray-600 bg-gray-300 font-medium'
                  : 'border-gray-400 bg-gray-100'
              }`}
              style={{
                boxShadow: !win.isMinimized
                  ? 'inset 1px 1px 0 #808080, inset -1px -1px 0 #fff'
                  : 'inset 1px 1px 0 #fff, inset -1px -1px 0 #808080',
              }}
              aria-label={`${win.title} - ${win.isMinimized ? 'minimized' : 'active'}`}
              aria-pressed={!win.isMinimized}
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <AppIcon name={win.appId} size={16} />
              </span>
              <span className="truncate">{win.title}</span>
            </button>
          ))}
        </div>

        {/* System Tray */}
        <div className="flex items-center gap-2 px-2 h-7 border-2 ml-2"
          style={{ boxShadow: 'inset 1px 1px 0 #808080, inset -1px -1px 0 #fff' }}
        >
          {/* Sound toggle */}
          <button
            onClick={() => {
              toggleSound();
              if (soundEnabled) {
                playSound('click');
              }
            }}
            className="text-sm hover:bg-gray-300 p-0.5 rounded"
            aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
            title={soundEnabled ? 'Sound On' : 'Sound Off'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>

          {/* Clock */}
          <div className="text-xs font-mono px-1" aria-label={`Current time: ${formatTime(time)}`}>
            {formatTime(time)}
          </div>
        </div>
      </nav>

      {/* Start Menu */}
      <StartMenu />
    </>
  );
}
