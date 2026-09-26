import React from 'react';
import type { AppDefinition } from '../types';

// Основные приложения (не игры)
export const appRegistry: AppDefinition[] = [
  {
    id: 'terminal',
    title: 'Terminal',
    icon: '💻',
    defaultSize: { w: 600, h: 400 },
    component: React.lazy(() => import('../apps/Terminal')),
  },
  {
    id: 'notepad',
    title: 'Notepad',
    icon: '📝',
    defaultSize: { w: 550, h: 450 },
    component: React.lazy(() => import('../apps/Notepad')),
  },
  {
    id: 'paint',
    title: 'Paint',
    icon: '🎨',
    defaultSize: { w: 700, h: 550 },
    component: React.lazy(() => import('../apps/PaintApp')),
  },
  {
    id: 'browser',
    title: 'Browser',
    icon: '🌐',
    defaultSize: { w: 650, h: 500 },
    component: React.lazy(() => import('../apps/Browser')),
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: '⚙️',
    defaultSize: { w: 400, h: 450 },
    component: React.lazy(() => import('../apps/Settings')),
  },
  {
    id: 'about',
    title: 'About',
    icon: 'ℹ️',
    defaultSize: { w: 450, h: 500 },
    component: React.lazy(() => import('../apps/About')),
  },
  // Игры (отдельная категория)
  {
    id: 'minesweeper',
    title: 'Minesweeper',
    icon: '💣',
    defaultSize: { w: 400, h: 500 },
    component: React.lazy(() => import('../apps/Minesweeper')),
  },
  {
    id: 'snake',
    title: 'Snake',
    icon: '🐍',
    defaultSize: { w: 450, h: 520 },
    component: React.lazy(() => import('../apps/SnakeGame')),
  },
  {
    id: 'tetris',
    title: 'Tetris',
    icon: '🎮',
    defaultSize: { w: 550, h: 650 },
    component: React.lazy(() => import('../apps/TetrisGame')),
  },
  {
    id: 'dino',
    title: 'Dino Runner',
    icon: '🦖',
    defaultSize: { w: 850, h: 450 },
    component: React.lazy(() => import('../apps/DinoRunGame')),
  },
  // Games Folder (открывает папку с играми)
  {
    id: 'games-folder',
    title: 'Games',
    icon: '🎮',
    defaultSize: { w: 600, h: 450 },
    component: React.lazy(() => import('../apps/GamesFolder')),
  },
  // Music Player
  {
    id: 'music-player',
    title: 'Music Player',
    icon: '🎵',
    defaultSize: { w: 450, h: 550 },
    component: React.lazy(() => import('../apps/MusicPlayer')),
  },
  // Calculator
  {
    id: 'calculator',
    title: 'Calculator',
    icon: '🧮',
    defaultSize: { w: 300, h: 400 },
    component: React.lazy(() => import('../apps/Calculator')),
  },
];

// Приложения для рабочего стола (максимум 6)
export const desktopApps = appRegistry.filter(app => 
  ['terminal', 'notepad', 'paint', 'browser'].includes(app.id)
);

// Игры
export const gamesApps = appRegistry.filter(app => 
  ['minesweeper', 'snake', 'tetris', 'dino'].includes(app.id)
);

// Утилиты
export const utilityApps = appRegistry.filter(app => 
  ['settings', 'about'].includes(app.id)
);

export function getAppById(id: string): AppDefinition | undefined {
  return appRegistry.find(app => app.id === id);
}
