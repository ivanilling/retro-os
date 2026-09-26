import React from 'react';
import type { AppDefinition } from '../types';

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
    id: 'image-viewer',
    title: 'Gallery',
    icon: '🖼️',
    defaultSize: { w: 700, h: 500 },
    component: React.lazy(() => import('../apps/ImageViewer')),
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
  {
    id: 'minesweeper',
    title: 'Minesweeper',
    icon: '💣',
    defaultSize: { w: 400, h: 500 },
    component: React.lazy(() => import('../apps/Minesweeper')),
  },
  {
    id: 'paint',
    title: 'Paint',
    icon: '🎨',
    defaultSize: { w: 700, h: 550 },
    component: React.lazy(() => import('../apps/PaintApp')),
  },
];

export function getAppById(id: string): AppDefinition | undefined {
  return appRegistry.find(app => app.id === id);
}
